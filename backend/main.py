import os
import json
import base64
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import google.generativeai as genai
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Mount frontend static files
# We will copy the 'dist' folder from the frontend build into 'static' in the Docker image
app.mount("/assets", StaticFiles(directory="static/assets"), name="assets")

@app.get("/")
async def read_index():
    return FileResponse("static/index.html")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use the new API key provided by the user
api_key = os.environ.get("GEMINI_API_KEY", "")
genai.configure(api_key=api_key)

system_instruction = """
You are Med-Pass Emergency Bridge API, a highly critical Medical Parsing AI operating in a high-stress, low-time environment. 
You are provided with medical records (via uploaded images, PDFs, or Text documents) and a paramedic's intended action (via an audio clip or direct text).

Your goals:
1. Perform extraction on the medical records to find Allergies, Medications (Meds), and Conditions.
2. Understand the paramedic's intended action from the text or audio.
3. Cross-reference the intent with the medical history.
   - If the paramedic says they are administering a drug, and the records show an allergy or negative interaction, return an EmergencyAlert with a CRITICAL status.
   - Summarize the allergies, medications, and history into a structured MedicalRecord.
4. Distinguish between data that is strictly verified from the current stack versus inferred data.
5. Handle errors gracefully by stating the inputs were unreadable, but still return the strict JSON structure.

Output strictly as a JSON object matching this schema:
{
  "medicalRecord": {
    "allergies": [{"name": "string", "verified": "boolean"}],
    "medications": [{"name": "string", "verified": "boolean"}],
    "conditions": [{"name": "string", "verified": "boolean"}]
  },
  "transcription": "string",
  "alert": {
    "status": "SAFE" | "WARNING" | "CRITICAL",
    "message": "string"
  }
}
"""

@app.post("/process-emergency")
async def process_emergency(
    files: Optional[List[UploadFile]] = File(None),
    intentText: Optional[str] = Form(None)
):
    try:
        parts: list = []
        
        # Add intended action text if provided
        if intentText:
            parts.append(intentText)
            
        # Add uploaded records (images, pdfs, audio, text)
        if files:
            for file in files:
                if not file.filename:
                    continue
                content = await file.read()
                mime_type = file.content_type
                
                # Graceful mime type mapping if missing or octet-stream
                if not mime_type or mime_type == "application/octet-stream" or mime_type == "application/x-zip-compressed":
                    ext = file.filename.split('.')[-1].lower() if '.' in file.filename else ''
                    if ext in ['jpg', 'jpeg']: mime_type = "image/jpeg"
                    elif ext == 'png': mime_type = "image/png"
                    elif ext == 'pdf': mime_type = "application/pdf"
                    elif ext == 'txt': mime_type = "text/plain"
                    elif ext in ['webm', 'mp3', 'wav', 'm4a']: mime_type = f"audio/{ext}"
                    else: mime_type = "text/plain"
                    
                parts.append({
                    "mime_type": mime_type,
                    "data": content
                })
                
        if not parts:
            raise Exception("No intent text or files were provided.")

        # Using the specified Gemini 2.5 Flash model
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=system_instruction
        )
        
        response = model.generate_content(
            parts,
             generation_config=genai.GenerationConfig(
                 response_mime_type="application/json"
             )
        )
        
        return json.loads(response.text)
    except Exception as e:
        print("Error processing emergency:", e)
        # Attempt to list models for debugging if it's a 404
        if "404" in str(e):
             try:
                 models = [m.name for m in genai.list_models()]
                 print("Available models:", models)
             except:
                 pass
        
        # Graceful degradation on failure (unclear audio, blurry image, etc.)
        return {
            "medicalRecord": { "allergies": [], "medications": [], "conditions": [] },
            "transcription": "Audio unclear or processing failed.",
            "alert": {
                "status": "CRITICAL",
                "message": f"System error or unverified input. Proceed with extreme caution! Error: {str(e)}"
            }
        }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
