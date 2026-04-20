export const en = {
  nav: {
    dashboard: 'Dashboard',
    residents: 'Residents',
    caregivers: 'Caregivers',
    medications: 'Medications',
    vitals: 'Vital Signs',
    appointments: 'Appointments',
    symptoms: 'Symptoms',
    healthRecords: 'Health Records',
    activities: 'Activities',
    safety: 'Safety',
    family: 'Family Sharing',
    signOut: 'Sign out',
    language: 'Language',
  },
  skip: 'Skip to main content',
  brand: 'CareConnect 24/7',
}

export type NavKey = keyof typeof en.nav

export type Messages = typeof en
