import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import * as db from '../../database';
import type { ProfessionalExperience, Tool } from '../../types';

interface Candidate {
    id: string;
    name: string;
    email: string;
    summary: string;
    experienceYears: number;
    skills: Tool[];
}

const UserListPage = (): React.ReactNode => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expFilter, setExpFilter] = useState('all');

    useEffect(() => {
        const fetchCandidates = async () => {
            setLoading(true);
            const usersWithProfiles = await db.adminGetAllUsersWithProfiles();
            
            const candidateData: Candidate[] = usersWithProfiles.map(({ user, profile }) => {
                const totalExpYears = profile.professionalExperiences.reduce((total, exp) => {
                    const start = new Date(exp.startDate);
                    const end = exp.endDate ? new Date(exp.endDate) : new Date();
                    const diffTime = Math.abs(end.getTime() - start.getTime());
                    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
                    return total + diffYears;
                }, 0);

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    summary: profile.personalData.summary.substring(0, 100) + '...',
                    experienceYears: Math.floor(totalExpYears),
                    skills: profile.tools
                };
            });

            setCandidates(candidateData);
            setLoading(false);
        };

        fetchCandidates();
    }, []);

    const filteredCandidates = useMemo(() => {
        return candidates
            .filter(c => { // Search filter
                const lowerSearch = searchTerm.toLowerCase();
                return (
                    c.name.toLowerCase().includes(lowerSearch) ||
                    c.email.toLowerCase().includes(lowerSearch) ||
                    c.skills.some(s => s.name.toLowerCase().includes(lowerSearch))
                );
            })
            .filter(c => { // Experience filter
                if (expFilter === 'all') return true;
                const [min, max] = expFilter.split('-').map(Number);
                if(isNaN(max)) return c.experienceYears >= min;
                return c.experienceYears >= min && c.experienceYears <= max;
            });
    }, [candidates, searchTerm, expFilter]);


    if (loading) {
        return <div className="text-center p-10">Cargando lista de candidatos...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Candidatos Registrados</h2>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                    <label htmlFor="search" className="sr-only">Buscar</label>
                    <input 
                        id="search"
                        type="text"
                        placeholder="Buscar por nombre, email, habilidad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                     <label htmlFor="experience" className="sr-only">Filtrar por Experiencia</label>
                     <select
                        id="experience"
                        value={expFilter}
                        onChange={(e) => setExpFilter(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                     >
                         <option value="all">Toda la Experiencia</option>
                         <option value="0-0">Sin Experiencia</option>
                         <option value="0-2">0-2 años</option>
                         <option value="3-5">3-5 años</option>
                         <option value="6-10">6-10 años</option>
                         <option value="11-">10+ años</option>
                     </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experiencia</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Habilidades</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ver Perfil</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCandidates.map(candidate => (
                            <tr key={candidate.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                                    <div className="text-sm text-gray-500">{candidate.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {candidate.experienceYears} {candidate.experienceYears === 1 ? 'año' : 'años'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-1">
                                        {candidate.skills.slice(0, 3).map(skill => (
                                            <span key={skill.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{skill.name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/admin/users/${candidate.id}`} className="text-blue-600 hover:text-blue-900">
                                        Ver Perfil
                                    </Link>
                                </td>
                            </tr>
                        ))}
                         {filteredCandidates.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-500">
                                    No se encontraron candidatos que coincidan con los criterios.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserListPage;
