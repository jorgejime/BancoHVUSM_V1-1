import { supabase } from './supabase';
import type { PersonalData, ProfessionalExperience, AcademicRecord, Language, Tool, Reference, UserSettings } from './types';
import { getCurrentUserId } from './auth';

// --- MAPEO DE DATOS ---

// Función para mapear datos de la DB a la interfaz local
const mapPersonalDataFromDB = (data: any): PersonalData => ({
    fullName: data.full_name || '',
    email: data.email || '',
    phone: data.phone || '',
    address: data.address || '',
    city: data.city || '',
    country: data.country || '',
    summary: data.summary || ''
});

const mapPersonalDataToDB = (data: PersonalData) => ({
    full_name: data.fullName,
    email: data.email,
    phone: data.phone,
    address: data.address,
    city: data.city,
    country: data.country,
    summary: data.summary
});

const mapProfessionalExperienceFromDB = (data: any): ProfessionalExperience => ({
    id: data.id,
    company: data.company,
    role: data.role,
    country: data.country,
    startDate: data.start_date,
    endDate: data.end_date,
    isCurrent: data.is_current,
    description: data.description
});

const mapProfessionalExperienceToDB = (data: Omit<ProfessionalExperience, 'id'>) => ({
    company: data.company,
    role: data.role,
    country: data.country,
    start_date: data.startDate,
    end_date: data.endDate,
    is_current: data.isCurrent,
    description: data.description
});

const mapAcademicRecordFromDB = (data: any): AcademicRecord => ({
    id: data.id,
    institution: data.institution,
    degree: data.degree,
    fieldOfStudy: data.field_of_study,
    startDate: data.start_date,
    endDate: data.end_date,
    inProgress: data.in_progress,
    description: data.description || ''
});

const mapAcademicRecordToDB = (data: Omit<AcademicRecord, 'id'>) => ({
    institution: data.institution,
    degree: data.degree,
    field_of_study: data.fieldOfStudy,
    start_date: data.startDate,
    end_date: data.endDate,
    in_progress: data.inProgress,
    description: data.description
});

// --- DATOS PERSONALES ---
export const getPersonalData = async (): Promise<PersonalData> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('personal_data')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error al obtener datos personales:', error);
        throw error;
    }

    return data ? mapPersonalDataFromDB(data) : {
        fullName: '', email: '', phone: '', address: '', city: '', country: '', summary: ''
    };
};

export const savePersonalData = async (data: PersonalData): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const dbData = { ...mapPersonalDataToDB(data), user_id: userId };

    const { error } = await supabase
        .from('personal_data')
        .upsert(dbData);

    if (error) {
        console.error('Error al guardar datos personales:', error);
        throw error;
    }
};

// --- EXPERIENCIA PROFESIONAL ---
export const getProfessionalExperiences = async (): Promise<ProfessionalExperience[]> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('professional_experiences')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error al obtener experiencias profesionales:', error);
        throw error;
    }

    return data ? data.map(mapProfessionalExperienceFromDB) : [];
};

export const addProfessionalExperience = async (experience: Omit<ProfessionalExperience, 'id'>): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const dbData = { ...mapProfessionalExperienceToDB(experience), user_id: userId };

    const { error } = await supabase
        .from('professional_experiences')
        .insert(dbData);

    if (error) {
        console.error('Error al agregar experiencia profesional:', error);
        throw error;
    }
};

export const updateProfessionalExperience = async (updatedExperience: ProfessionalExperience): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const dbData = mapProfessionalExperienceToDB(updatedExperience);

    const { error } = await supabase
        .from('professional_experiences')
        .update(dbData)
        .eq('id', updatedExperience.id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al actualizar experiencia profesional:', error);
        throw error;
    }
};

export const deleteProfessionalExperience = async (id: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('professional_experiences')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al eliminar experiencia profesional:', error);
        throw error;
    }
};

// --- FORMACIÓN ACADÉMICA ---
export const getAcademicRecords = async (): Promise<AcademicRecord[]> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('academic_records')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error al obtener registros académicos:', error);
        throw error;
    }

    return data ? data.map(mapAcademicRecordFromDB) : [];
};

export const addAcademicRecord = async (record: Omit<AcademicRecord, 'id'>): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const dbData = { ...mapAcademicRecordToDB(record), user_id: userId };

    const { error } = await supabase
        .from('academic_records')
        .insert(dbData);

    if (error) {
        console.error('Error al agregar registro académico:', error);
        throw error;
    }
};

export const updateAcademicRecord = async (updatedRecord: AcademicRecord): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const dbData = mapAcademicRecordToDB(updatedRecord);

    const { error } = await supabase
        .from('academic_records')
        .update(dbData)
        .eq('id', updatedRecord.id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al actualizar registro académico:', error);
        throw error;
    }
};

export const deleteAcademicRecord = async (id: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('academic_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al eliminar registro académico:', error);
        throw error;
    }
};

// --- IDIOMAS ---
export const getLanguages = async (): Promise<Language[]> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', userId)
        .order('name');

    if (error) {
        console.error('Error al obtener idiomas:', error);
        throw error;
    }

    return data || [];
};

export const addLanguage = async (language: Omit<Language, 'id'>): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('languages')
        .insert({ ...language, user_id: userId });

    if (error) {
        console.error('Error al agregar idioma:', error);
        throw error;
    }
};

export const deleteLanguage = async (id: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('languages')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al eliminar idioma:', error);
        throw error;
    }
};

// --- HERRAMIENTAS ---
export const getTools = async (): Promise<Tool[]> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('tools')
        .select('*')
        .eq('user_id', userId)
        .order('category, name');

    if (error) {
        console.error('Error al obtener herramientas:', error);
        throw error;
    }

    return data || [];
};

export const addTool = async (tool: Omit<Tool, 'id'>): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('tools')
        .insert({ ...tool, user_id: userId });

    if (error) {
        console.error('Error al agregar herramienta:', error);
        throw error;
    }
};

export const deleteTool = async (id: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al eliminar herramienta:', error);
        throw error;
    }
};

// --- REFERENCIAS ---
export const getReferences = async (): Promise<Reference[]> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('references')
        .select('*')
        .eq('user_id', userId)
        .order('name');

    if (error) {
        console.error('Error al obtener referencias:', error);
        throw error;
    }

    return data || [];
};

export const addReference = async (reference: Omit<Reference, 'id'>): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('references')
        .insert({ ...reference, user_id: userId });

    if (error) {
        console.error('Error al agregar referencia:', error);
        throw error;
    }
};

export const updateReference = async (updatedReference: Reference): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { name, relationship, company, email, phone } = updatedReference;

    const { error } = await supabase
        .from('references')
        .update({ name, relationship, company, email, phone })
        .eq('id', updatedReference.id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al actualizar referencia:', error);
        throw error;
    }
};

export const deleteReference = async (id: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('references')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

    if (error) {
        console.error('Error al eliminar referencia:', error);
        throw error;
    }
};

// --- CONFIGURACIONES ---
export const getSettings = async (): Promise<UserSettings> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error al obtener configuraciones:', error);
        throw error;
    }

    return data ? {
        notifications: {
            newOpportunities: data.notifications_new_opportunities
        }
    } : {
        notifications: {
            newOpportunities: true
        }
    };
};

export const saveSettings = async (settings: UserSettings): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) {
        throw new Error('Usuario no autenticado');
    }

    const { error } = await supabase
        .from('user_settings')
        .upsert({
            user_id: userId,
            notifications_new_opportunities: settings.notifications.newOpportunities
        });

    if (error) {
        console.error('Error al guardar configuraciones:', error);
        throw error;
    }
};

// --- FUNCIONES PARA ADMINISTRADORES ---

interface AdminUser {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

interface AdminUserProfile {
    personalData: PersonalData;
    professionalExperiences: ProfessionalExperience[];
    academicRecords: AcademicRecord[];
    languages: Language[];
    tools: Tool[];
    references: Reference[];
    settings: UserSettings;
}

export const adminGetAllUsersWithProfiles = async (): Promise<{ user: AdminUser, profile: AdminUserProfile }[]> => {
    // Obtener todos los usuarios con rol 'user'
    const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user');

    if (usersError) {
        console.error('Error al obtener usuarios:', usersError);
        throw usersError;
    }

    const result: { user: AdminUser, profile: AdminUserProfile }[] = [];

    for (const user of users || []) {
        // Obtener datos personales
        const { data: personalData } = await supabase
            .from('personal_data')
            .select('*')
            .eq('user_id', user.id)
            .single();

        // Obtener experiencias profesionales
        const { data: experiences } = await supabase
            .from('professional_experiences')
            .select('*')
            .eq('user_id', user.id);

        // Obtener formación académica
        const { data: academics } = await supabase
            .from('academic_records')
            .select('*')
            .eq('user_id', user.id);

        // Obtener idiomas
        const { data: languages } = await supabase
            .from('languages')
            .select('*')
            .eq('user_id', user.id);

        // Obtener herramientas
        const { data: tools } = await supabase
            .from('tools')
            .select('*')
            .eq('user_id', user.id);

        // Obtener referencias
        const { data: references } = await supabase
            .from('references')
            .select('*')
            .eq('user_id', user.id);

        // Obtener configuraciones
        const { data: settings } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single();

        result.push({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.created_at
            },
            profile: {
                personalData: personalData ? mapPersonalDataFromDB(personalData) : {
                    fullName: '', email: '', phone: '', address: '', city: '', country: '', summary: ''
                },
                professionalExperiences: experiences ? experiences.map(mapProfessionalExperienceFromDB) : [],
                academicRecords: academics ? academics.map(mapAcademicRecordFromDB) : [],
                languages: languages || [],
                tools: tools || [],
                references: references || [],
                settings: settings ? {
                    notifications: { newOpportunities: settings.notifications_new_opportunities }
                } : { notifications: { newOpportunities: true } }
            }
        });
    }

    return result;
};

export const adminGetUserProfile = async (userId: string): Promise<{ user: AdminUser, profile: AdminUserProfile } | null> => {
    // Obtener usuario
    const { data: user, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (userError) {
        console.error('Error al obtener usuario:', userError);
        return null;
    }

    // Obtener datos personales
    const { data: personalData } = await supabase
        .from('personal_data')
        .select('*')
        .eq('user_id', userId)
        .single();

    // Obtener experiencias profesionales
    const { data: experiences } = await supabase
        .from('professional_experiences')
        .select('*')
        .eq('user_id', userId);

    // Obtener formación académica
    const { data: academics } = await supabase
        .from('academic_records')
        .select('*')
        .eq('user_id', userId);

    // Obtener idiomas
    const { data: languages } = await supabase
        .from('languages')
        .select('*')
        .eq('user_id', userId);

    // Obtener herramientas
    const { data: tools } = await supabase
        .from('tools')
        .select('*')
        .eq('user_id', userId);

    // Obtener referencias
    const { data: references } = await supabase
        .from('references')
        .select('*')
        .eq('user_id', userId);

    // Obtener configuraciones
    const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.created_at
        },
        profile: {
            personalData: personalData ? mapPersonalDataFromDB(personalData) : {
                fullName: '', email: '', phone: '', address: '', city: '', country: '', summary: ''
            },
            professionalExperiences: experiences ? experiences.map(mapProfessionalExperienceFromDB) : [],
            academicRecords: academics ? academics.map(mapAcademicRecordFromDB) : [],
            languages: languages || [],
            tools: tools || [],
            references: references || [],
            settings: settings ? {
                notifications: { newOpportunities: settings.notifications_new_opportunities }
            } : { notifications: { newOpportunities: true } }
        }
    };
};

// Funciones deprecated para compatibilidad hacia atrás
export const findUserByEmail = async (email: string): Promise<any> => {
    console.warn('findUserByEmail is deprecated and will be removed');
    return null;
};

export const createUser = async (name: string, email: string): Promise<any> => {
    console.warn('createUser is deprecated - use register from auth.ts instead');
    return null;
};