import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as db from '../../database';
import type { PersonalData, ProfessionalExperience, AcademicRecord, Language, Tool, Reference } from '../../types';

interface ProfileViewData {
    user: { name: string; email: string };
    profile: {
        personalData: PersonalData;
        professionalExperiences: ProfessionalExperience[];
        academicRecords: AcademicRecord[];
        languages: Language[];
        tools: Tool[];
        references: Reference[];
    }
}

const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Presente';
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">{title}</h3>
        {children}
    </div>
);

const UserProfileView = (): React.ReactNode => {
    const { userId } = useParams<{ userId: string }>();
    const [data, setData] = useState<ProfileViewData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }
        const fetchProfile = async () => {
            setLoading(true);
            const fullProfile = await db.adminGetUserProfile(userId);
            if (fullProfile) {
                setData({
                    user: { name: fullProfile.user.name, email: fullProfile.user.email },
                    profile: fullProfile.profile
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [userId]);
    
    if (loading) {
        return <div className="text-center p-10">Cargando perfil del candidato...</div>;
    }

    if (!data) {
        return (
            <div className="text-center p-10">
                <p className="text-red-500">No se pudo encontrar el perfil del candidato.</p>
                <Link to="/admin/users" className="text-blue-600 hover:underline mt-4 inline-block">Volver a la lista</Link>
            </div>
        );
    }
    
    const { user, profile } = data;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-gray-800">Perfil de {user.name}</h2>
                 <Link to="/admin/users" className="text-blue-600 hover:underline">&larr; Volver a la lista de candidatos</Link>
            </div>

            <Section title="Datos Personales">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Teléfono:</strong> {profile.personalData.phone || 'N/A'}</p>
                    <p><strong>Ubicación:</strong> {`${profile.personalData.city || ''}, ${profile.personalData.country || ''}`}</p>
                    <p><strong>Dirección:</strong> {profile.personalData.address || 'N/A'}</p>
                </div>
                 {profile.personalData.summary && (
                     <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold text-md text-gray-700">Resumen Profesional</h4>
                        <p className="text-sm text-gray-600 mt-1">{profile.personalData.summary}</p>
                    </div>
                 )}
            </Section>

            <Section title="Experiencia Profesional">
                <div className="space-y-4">
                    {profile.professionalExperiences.map(exp => (
                        <div key={exp.id} className="border-b last:border-b-0 pb-3">
                            <h4 className="font-bold text-md text-gray-800">{exp.role}</h4>
                            <p className="text-blue-600 font-semibold">{exp.company}</p>
                            <p className="text-xs text-gray-500">{formatDate(exp.startDate)} - {exp.isCurrent ? 'Presente' : formatDate(exp.endDate)} | {exp.country}</p>
                            <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                        </div>
                    ))}
                    {profile.professionalExperiences.length === 0 && <p className="text-gray-500 text-sm">Sin experiencia profesional registrada.</p>}
                </div>
            </Section>

            <Section title="Formación Académica">
                 <div className="space-y-4">
                    {profile.academicRecords.map(rec => (
                        <div key={rec.id} className="border-b last:border-b-0 pb-3">
                            <h4 className="font-bold text-md text-gray-800">{rec.degree}</h4>
                            <p className="text-blue-600 font-semibold">{rec.institution}</p>
                            <p className="text-xs text-gray-500">{formatDate(rec.startDate)} - {rec.inProgress ? 'En curso' : formatDate(rec.endDate)}</p>
                            <p className="text-sm text-gray-600 mt-1">{rec.fieldOfStudy}</p>
                             {rec.description && <p className="text-sm text-gray-500 mt-2 italic">"{rec.description}"</p>}
                        </div>
                    ))}
                    {profile.academicRecords.length === 0 && <p className="text-gray-500 text-sm">Sin formación académica registrada.</p>}
                </div>
            </Section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Section title="Idiomas">
                    <ul className="space-y-2">
                        {profile.languages.map(lang => (
                            <li key={lang.id} className="flex justify-between items-center text-sm">
                                <span>{lang.name}</span>
                                <span className="font-semibold text-gray-600 bg-gray-100 px-2 py-1 rounded">{lang.level}</span>
                            </li>
                        ))}
                         {profile.languages.length === 0 && <p className="text-gray-500 text-sm">Sin idiomas registrados.</p>}
                    </ul>
                </Section>
                <Section title="Herramientas y Habilidades">
                    <div className="flex flex-wrap gap-2">
                        {profile.tools.map(tool => (
                             <span key={tool.id} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{tool.name}</span>
                        ))}
                         {profile.tools.length === 0 && <p className="text-gray-500 text-sm">Sin herramientas registradas.</p>}
                    </div>
                </Section>
            </div>
             
        </div>
    );
};

export default UserProfileView;
