import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getUserName } from '../auth';
import * as db from '../database'; // Import the database service

const profileSections = [
    { to: "/personal-data", icon: <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0L15 8m-5-2v5.5a2.5 2.5 0 005 0V6m-5 2h5" />, label: "Datos Personales" },
    { to: "/dashboard/professional-experience", icon: <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, label: "Experiencia Profesional" },
    { to: "/academic-education", icon: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />, label: "Formación Académica" },
    { to: "/languages", icon: <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 9a9 9 0 00-9 9" />, label: "Idiomas" },
    { to: "/tool-management", icon: <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />, label: "Manejo de Herramientas" },
    { to: "/references", icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />, label: "Referencias" },
];

const ProfileCard: React.FC<{ to: string, icon: React.ReactNode, label: string }> = ({ to, icon, label }) => (
    <Link to={to} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center">
        <div className="text-blue-500 mb-4">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{icon}</svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
        <p className="text-sm text-gray-500 mt-1">Gestionar sección</p>
    </Link>
);


const MyProfile = (): React.ReactNode => {
    const userName = getUserName();
    const [completionPercentage, setCompletionPercentage] = useState(0);

    useEffect(() => {
        const calculateProgress = async () => {
            let completedCount = 0;
            const totalSections = profileSections.length;

            const personalData = await db.getPersonalData();
            if (personalData.fullName && personalData.email) completedCount++;
            
            const experiences = await db.getProfessionalExperiences();
            if (experiences.length > 0) completedCount++;

            const academics = await db.getAcademicRecords();
            if (academics.length > 0) completedCount++;

            const languages = await db.getLanguages();
            if (languages.length > 0) completedCount++;

            const tools = await db.getTools();
            if (tools.length > 0) completedCount++;

            const references = await db.getReferences();
            if (references.length > 0) completedCount++;

            setCompletionPercentage(Math.round((completedCount / totalSections) * 100));
        };

        calculateProgress();
    }, []);


    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Bienvenido, {userName}</h2>
                <p className="text-gray-600 mt-1">Este es tu centro de perfil. Completa todas las secciones para tener un perfil atractivo para los reclutadores.</p>
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Progreso del Perfil</span>
                        <span className="text-sm font-medium text-blue-600">{completionPercentage}% Completo</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileSections.map(section => (
                    <ProfileCard key={section.to} to={section.to} icon={section.icon} label={section.label} />
                ))}
            </div>
        </div>
    );
};

export default MyProfile;