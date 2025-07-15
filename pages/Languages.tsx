import React, { useState, useEffect, useCallback } from 'react';
import type { Language } from '../types';
import * as db from '../database';

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const LanguagesPage = (): React.ReactNode => {
    const [languages, setLanguages] = useState<Language[]>([]);
    const [newLanguage, setNewLanguage] = useState('');
    const [level, setLevel] = useState<'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo'>('Intermedio');

    const loadLanguages = useCallback(async () => {
        const data = await db.getLanguages();
        setLanguages(data);
    }, []);

    useEffect(() => {
        loadLanguages();
    }, [loadLanguages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLanguage.trim()) return;
        await db.addLanguage({ name: newLanguage, level });
        setNewLanguage('');
        setLevel('Intermedio');
        await loadLanguages();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este idioma?')) {
            await db.deleteLanguage(id);
            await loadLanguages();
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">IDIOMAS</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Agregar Idioma</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Idioma</label>
                        <input 
                            type="text" 
                            value={newLanguage}
                            onChange={(e) => setNewLanguage(e.target.value)}
                            placeholder="Ej: Inglés"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Nivel</label>
                        <select
                            value={level}
                            onChange={(e) => setLevel(e.target.value as any)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option>Básico</option>
                            <option>Intermedio</option>
                            <option>Avanzado</option>
                            <option>Nativo</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Agregar
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Idiomas</h3>
                {languages.length > 0 ? (
                    <ul className="space-y-3">
                        {languages.map(lang => (
                            <li key={lang.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <span className="font-medium text-gray-800">{lang.name}</span>
                                    <span className="ml-3 text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{lang.level}</span>
                                </div>
                                <button onClick={() => handleDelete(lang.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                    <TrashIcon />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">No has agregado ningún idioma.</p>
                )}
            </div>
        </div>
    );
};

export default LanguagesPage;
