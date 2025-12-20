export interface Resident {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  roomNumber: string
  phoneNumber?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  medicalConditions?: string[]
  allergies?: string[]
  medications?: Medication[]
  createdAt: string
  updatedAt: string
}

export interface Caregiver {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: 'nurse' | 'aide' | 'therapist' | 'administrator' | 'other'
  certifications?: string[]
  shift?: 'day' | 'night' | 'flexible'
  assignedResidents?: string[]
  createdAt: string
  updatedAt: string
}

export interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  time: string[]
  residentId: string
  startDate: string
  endDate?: string
  notes?: string
}

export interface Schedule {
  id: string
  residentId: string
  caregiverId?: string
  type: 'medication' | 'appointment' | 'therapy' | 'meal' | 'activity' | 'other'
  title: string
  description?: string
  date: string
  time: string
  duration?: number // in minutes
  status: 'pending' | 'completed' | 'cancelled'
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly'
    endDate?: string
  }
  createdAt: string
  updatedAt: string
}

export interface HealthRecord {
  id: string
  residentId: string
  type: 'vital' | 'medication' | 'incident' | 'assessment' | 'other'
  date: string
  time: string
  recordedBy: string
  data: {
    // For vital signs
    bloodPressure?: { systolic: number; diastolic: number }
    heartRate?: number
    temperature?: number
    weight?: number
    // For incidents
    incidentType?: string
    description?: string
    severity?: 'low' | 'medium' | 'high'
    // For assessments
    notes?: string
    [key: string]: any
  }
  createdAt: string
}

export interface Activity {
  id: string
  name: string
  description?: string
  type: 'social' | 'physical' | 'cognitive' | 'recreational' | 'other'
  date: string
  time: string
  duration: number
  participants: string[]
  location?: string
  notes?: string
  createdAt: string
}

export interface FamilyMember {
  id: string
  residentId: string
  name: string
  relationship: string
  email: string
  phoneNumber?: string
  accessLevel: 'full' | 'limited'
  canViewHealthRecords: boolean
  canViewSchedules: boolean
  canViewActivities: boolean
  createdAt: string
}

export interface SafetyIncident {
  id: string
  residentId?: string
  type: 'fall' | 'medication_error' | 'injury' | 'other'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  date: string
  time: string
  reportedBy: string
  location?: string
  actionTaken?: string
  followUpRequired: boolean
  status: 'open' | 'investigating' | 'resolved'
  createdAt: string
}

