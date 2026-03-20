# Stage 1: Build the Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /web
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Backend and bundle everything
FROM python:3.11-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy frontend build from Stage 1 into the 'static' folder for FastAPI to serve
COPY --from=frontend-builder /web/dist ./static

# Expose port and start
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
