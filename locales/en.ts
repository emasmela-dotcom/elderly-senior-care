export const en = {
  nav: {
    dashboard: 'Home',
    residents: 'Residents',
    caregivers: 'My Helpers',
    medications: 'Medications',
    vitals: 'Vital Signs',
    appointments: 'Appointments',
    symptoms: 'Symptoms',
    healthRecords: 'Health Records',
    activities: 'Activities',
    safety: 'Safety',
    family: 'My People',
    myHealth: 'My Health',
    myPeople: 'My People',
    schedule: 'Schedule',
    signOut: 'Sign out',
    signIn: 'Sign in',
    language: 'Language',
  },
  skip: 'Skip to main content',
  brand: 'CareConnect 24/7',
}

export type NavKey = keyof typeof en.nav

export type Messages = typeof en
