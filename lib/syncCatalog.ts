export type SyncCategory = 'appointments' | 'medications' | 'vitals' | 'health_records'

export type SyncMethod = 'connect' | 'upload'

export type SyncCatalogItem = {
  id: string
  name: string
  bringsIn: string
  category: SyncCategory
  method: SyncMethod
  methodLabel: string
  hubAnchor: string
}

export const SYNC_CATEGORY_LABELS: Record<SyncCategory, string> = {
  appointments: 'Appointments & schedule',
  medications: 'Medications',
  vitals: 'Vitals',
  health_records: 'Health records',
}

export const SYNC_CATALOG: SyncCatalogItem[] = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    bringsIn: 'Doctor visits and appointments',
    category: 'appointments',
    method: 'connect',
    methodLabel: 'Connect',
    hubAnchor: 'appointments',
  },
  {
    id: 'apple-calendar',
    name: 'Apple Calendar',
    bringsIn: 'Calendar events and visits',
    category: 'appointments',
    method: 'upload',
    methodLabel: 'Upload file',
    hubAnchor: 'appointments',
  },
  {
    id: 'email-appointments',
    name: 'Appointment emails',
    bringsIn: 'Visits from email confirmations',
    category: 'appointments',
    method: 'upload',
    methodLabel: 'Upload file',
    hubAnchor: 'appointments',
  },
  {
    id: 'pharmacy-csv',
    name: 'Pharmacy list (CVS, Walgreens, etc.)',
    bringsIn: 'Prescriptions and dosages',
    category: 'medications',
    method: 'upload',
    methodLabel: 'Upload CSV',
    hubAnchor: 'medications',
  },
  {
    id: 'apple-health',
    name: 'Apple Health',
    bringsIn: 'Heart rate, blood pressure, weight, glucose',
    category: 'vitals',
    method: 'upload',
    methodLabel: 'Upload export',
    hubAnchor: 'vitals',
  },
  {
    id: 'google-fit',
    name: 'Google Fit',
    bringsIn: 'Heart rate, blood pressure, weight, glucose',
    category: 'vitals',
    method: 'connect',
    methodLabel: 'Connect',
    hubAnchor: 'vitals',
  },
  {
    id: 'epic-mychart',
    name: 'Epic MyChart',
    bringsIn: 'Medications, appointments, and health records from your patient portal',
    category: 'health_records',
    method: 'connect',
    methodLabel: 'Connect',
    hubAnchor: 'mychart',
  },
]
