export interface MedicalItem {
  name: string;
  verified: boolean;
}

export interface MedicalRecord {
  allergies: MedicalItem[];
  medications: MedicalItem[];
  conditions: MedicalItem[];
}

export interface EmergencyAlert {
  status: "SAFE" | "WARNING" | "CRITICAL";
  message: string;
}

export interface GeminiResponse {
  medicalRecord: MedicalRecord;
  transcription: string;
  alert: EmergencyAlert;
}
