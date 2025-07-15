import type { PersonalData, ProfessionalExperience, AcademicRecord, Language, Tool, Reference, UserSettings } from './types';
import { getCurrentUserId } from './auth';

// --- DATABASE STRUCTURE ---

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

interface UserProfile {
    personalData: PersonalData;
    professionalExperiences: ProfessionalExperience[];
    academicRecords: AcademicRecord[];
    languages: Language[];
    tools: Tool[];
    references: Reference[];
    settings: UserSettings;
}

interface Database {
    users: User[];
    profiles: Record<string, UserProfile>;
}

const DB_KEY = 'usm_cv_bank_DB';

const getEmptyProfile = (): UserProfile => ({
    personalData: { fullName: '', email: '', phone: '', address: '', city: '', country: '', summary: '' },
    professionalExperiences: [],
    academicRecords: [],
    languages: [],
    tools: [],
    references: [],
    settings: { notifications: { newOpportunities: true } },
});


// --- LOW-LEVEL DB HELPERS ---

const readDb = async (): Promise<Database> => {
    try {
        const rawDb = localStorage.getItem(DB_KEY);
        if (rawDb) {
            return JSON.parse(rawDb);
        }
    } catch (error) {
        console.error("Error reading database:", error);
    }
    // If DB doesn't exist or is corrupt, initialize it
    const initialDb: Database = {
        users: [{
            id: 'admin_user_001',
            name: 'Administrador',
            email: 'admin@usm.edu.co',
            role: 'admin',
            createdAt: new Date().toISOString()
        }],
        profiles: {
            'admin_user_001': getEmptyProfile()
        }
    };
    await writeDb(initialDb);
    return initialDb;
};

const writeDb = async (db: Database): Promise<void> => {
    try {
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (error) {
        console.error("Error writing to database:", error);
    }
};

const getUserProfile = async (userId: string): Promise<UserProfile> => {
    const db = await readDb();
    return db.profiles[userId] || getEmptyProfile();
};


// --- USER MANAGEMENT (some functions used by auth.ts) ---

export const findUserByEmail = async (email: string): Promise<User | undefined> => {
    const db = await readDb();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const createUser = async (name: string, email: string): Promise<User> => {
    const db = await readDb();
    const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    db.users.push(newUser);
    db.profiles[newUser.id] = getEmptyProfile();
    await writeDb(db);
    return newUser;
};


// --- PROFILE DATA ACCESS (for logged-in user) ---

const modifyCurrentUserProfile = async (updateFn: (profile: UserProfile) => void) => {
    const userId = getCurrentUserId();
    if (!userId) {
        console.error("No user logged in, cannot modify profile.");
        return;
    }
    const db = await readDb();
    const profile = db.profiles[userId] || getEmptyProfile();
    updateFn(profile);
    db.profiles[userId] = profile;
    await writeDb(db);
};

// --- Personal Data ---
export const getPersonalData = async () => (await getUserProfile(getCurrentUserId()!)).personalData;
export const savePersonalData = async (data: PersonalData) => await modifyCurrentUserProfile(p => { p.personalData = data; });

// --- Professional Experience ---
export const getProfessionalExperiences = async () => (await getUserProfile(getCurrentUserId()!)).professionalExperiences;
export const addProfessionalExperience = async (experience: Omit<ProfessionalExperience, 'id'>) => {
    await modifyCurrentUserProfile(p => {
        p.professionalExperiences.unshift({ ...experience, id: Date.now().toString() });
    });
};
export const updateProfessionalExperience = async (updatedExperience: ProfessionalExperience) => {
    await modifyCurrentUserProfile(p => {
        p.professionalExperiences = p.professionalExperiences.map(exp => exp.id === updatedExperience.id ? updatedExperience : exp);
    });
};
export const deleteProfessionalExperience = async (id: string) => {
    await modifyCurrentUserProfile(p => {
        p.professionalExperiences = p.professionalExperiences.filter(exp => exp.id !== id);
    });
};

// --- Academic Records ---
export const getAcademicRecords = async () => (await getUserProfile(getCurrentUserId()!)).academicRecords;
export const addAcademicRecord = async (record: Omit<AcademicRecord, 'id'>) => {
    await modifyCurrentUserProfile(p => {
        p.academicRecords.unshift({ ...record, id: Date.now().toString() });
    });
};
export const updateAcademicRecord = async (updatedRecord: AcademicRecord) => {
    await modifyCurrentUserProfile(p => {
        p.academicRecords = p.academicRecords.map(rec => rec.id === updatedRecord.id ? updatedRecord : rec);
    });
};
export const deleteAcademicRecord = async (id: string) => {
    await modifyCurrentUserProfile(p => {
        p.academicRecords = p.academicRecords.filter(rec => rec.id !== id);
    });
};

// --- Languages ---
export const getLanguages = async () => (await getUserProfile(getCurrentUserId()!)).languages;
export const addLanguage = async (language: Omit<Language, 'id'>) => {
    await modifyCurrentUserProfile(p => { p.languages.push({ ...language, id: Date.now().toString() }); });
};
export const deleteLanguage = async (id: string) => {
    await modifyCurrentUserProfile(p => { p.languages = p.languages.filter(lang => lang.id !== id); });
};

// --- Tools ---
export const getTools = async () => (await getUserProfile(getCurrentUserId()!)).tools;
export const addTool = async (tool: Omit<Tool, 'id'>) => {
    await modifyCurrentUserProfile(p => { p.tools.push({ ...tool, id: Date.now().toString() }); });
};
export const deleteTool = async (id: string) => {
    await modifyCurrentUserProfile(p => { p.tools = p.tools.filter(t => t.id !== id); });
};

// --- References ---
export const getReferences = async () => (await getUserProfile(getCurrentUserId()!)).references;
export const addReference = async (reference: Omit<Reference, 'id'>) => {
    await modifyCurrentUserProfile(p => {
        p.references.unshift({ ...reference, id: Date.now().toString() });
    });
};
export const updateReference = async (updatedReference: Reference) => {
    await modifyCurrentUserProfile(p => {
        p.references = p.references.map(r => r.id === updatedReference.id ? updatedReference : r);
    });
};
export const deleteReference = async (id: string) => {
    await modifyCurrentUserProfile(p => {
        p.references = p.references.filter(r => r.id !== id);
    });
};

// --- Settings ---
export const getSettings = async () => (await getUserProfile(getCurrentUserId()!)).settings;
export const saveSettings = async (settings: UserSettings) => await modifyCurrentUserProfile(p => { p.settings = settings; });


// --- ADMIN FUNCTIONS ---

export const adminGetAllUsersWithProfiles = async (): Promise<{ user: User, profile: UserProfile }[]> => {
    const db = await readDb();
    return db.users
        .filter(u => u.role === 'user')
        .map(user => ({
            user,
            profile: db.profiles[user.id] || getEmptyProfile()
        }));
};

export const adminGetUserProfile = async (userId: string): Promise<{ user: User, profile: UserProfile } | null> => {
    const db = await readDb();
    const user = db.users.find(u => u.id === userId);
    if (!user) return null;
    return {
        user,
        profile: db.profiles[userId] || getEmptyProfile()
    };
};
