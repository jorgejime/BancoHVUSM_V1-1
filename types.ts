
export interface ProfessionalExperience {
  id: string;
  company: string;
  role: string;
  country: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string;
}

export interface PersonalData {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    summary: string;
}

export interface AcademicRecord {
    id: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string | null;
    inProgress: boolean;
    description: string;
}

export interface Language {
    id: string;
    name: string;
    level: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
}

export interface Tool {
    id: string;
    name: string;
    category: string;
}

export interface Reference {
    id: string;
    name: string;
    relationship: string;
    company: string;
    email: string;
    phone: string;
}

export interface UserSettings {
    // For now, settings are minimal. This can be expanded.
    notifications: {
        newOpportunities: boolean;
    };
}
