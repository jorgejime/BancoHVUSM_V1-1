import React, { useState, useEffect } from 'react';
import * as db from '../../database';
import { Tool } from '../../types';

interface DashboardStats {
    totalCandidates: number;
    experienceDistribution: Record<string, number>;
    topSkills: { name: string; count: number }[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const BarChart: React.FC<{ data: Record<string, number>, title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...Object.values(data), 1);
    const sortedData = Object.entries(data).sort(([, a], [, b]) => b - a);
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            <div className="space-y-4">
                {sortedData.map(([label, value]) => (
                    <div key={label} className="flex items-center">
                        <span className="w-28 text-sm text-gray-600">{label}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-6">
                            <div
                                className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2 text-white text-sm font-bold"
                                style={{ width: `${(value / maxValue) * 100}%` }}
                            >
                               {value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AdminDashboard = (): React.ReactNode => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const usersWithProfiles = await db.adminGetAllUsersWithProfiles();

            // Total candidates
            const totalCandidates = usersWithProfiles.length;

            // Experience distribution
            const experienceDistribution = {
                'Sin experiencia': 0,
                '0-2 años': 0,
                '3-5 años': 0,
                '6-10 años': 0,
                '10+ años': 0,
            };
            
            usersWithProfiles.forEach(({ profile }) => {
                 if (profile.professionalExperiences.length === 0) {
                    experienceDistribution['Sin experiencia']++;
                    return;
                }
                const totalExpYears = profile.professionalExperiences.reduce((total, exp) => {
                    const start = new Date(exp.startDate);
                    const end = exp.endDate ? new Date(exp.endDate) : new Date();
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
                    return total + diffYears;
                }, 0);

                if (totalExpYears <= 2) experienceDistribution['0-2 años']++;
                else if (totalExpYears <= 5) experienceDistribution['3-5 años']++;
                else if (totalExpYears <= 10) experienceDistribution['6-10 años']++;
                else experienceDistribution['10+ años']++;
            });

            // Top skills
            const allSkills = usersWithProfiles.flatMap(u => u.profile.tools);
            const skillCounts = allSkills.reduce((acc, skill) => {
                acc[skill.name] = (acc[skill.name] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const topSkills = Object.entries(skillCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            setStats({ totalCandidates, experienceDistribution, topSkills });
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading || !stats) {
        return <div className="text-center p-10">Cargando dashboard...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">ADMIN DASHBOARD</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <StatCard 
                    title="Total de Candidatos" 
                    value={stats.totalCandidates}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                />
                 <StatCard 
                    title="Top Habilidad" 
                    value={stats.topSkills[0]?.name || 'N/A'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l4 4m0 0l-4 4m4-4H3" /></svg>}
                />
                 <StatCard 
                    title="Experiencia Promedio" 
                    value="3-5 años" // Placeholder, calculation can be complex
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <BarChart data={stats.experienceDistribution} title="Distribución de Años de Experiencia" />
                 <div className="bg-white p-6 rounded-lg shadow-md">
                     <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 5 Habilidades / Herramientas</h3>
                     <ul className="space-y-3">
                         {stats.topSkills.map((skill) => (
                             <li key={skill.name} className="flex justify-between items-center">
                                 <span className="text-gray-700">{skill.name}</span>
                                 <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{skill.count}</span>
                             </li>
                         ))}
                         {stats.topSkills.length === 0 && <p className="text-gray-500">No hay datos de habilidades.</p>}
                     </ul>
                 </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
