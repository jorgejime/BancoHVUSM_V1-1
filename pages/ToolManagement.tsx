import React, { useState, useEffect, useCallback } from 'react';
import type { Tool } from '../types';
import * as db from '../database';

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

const ToolManagementPage = (): React.ReactNode => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [newTool, setNewTool] = useState('');
    const [category, setCategory] = useState('Software');

    const loadTools = useCallback(async () => {
        const data = await db.getTools();
        setTools(data);
    }, []);

    useEffect(() => {
        loadTools();
    }, [loadTools]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTool.trim()) return;
        await db.addTool({ name: newTool, category });
        setNewTool('');
        await loadTools();
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta herramienta?')) {
            await db.deleteTool(id);
            await loadTools();
        }
    };

    const groupedTools = tools.reduce((acc, tool) => {
        (acc[tool.category] = acc[tool.category] || []).push(tool);
        return acc;
    }, {} as Record<string, Tool[]>);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">MANEJO DE HERRAMIENTAS</h2>
            
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Agregar Herramienta o Habilidad</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Herramienta/Habilidad</label>
                        <input 
                            type="text" 
                            value={newTool}
                            onChange={(e) => setNewTool(e.target.value)}
                            placeholder="Ej: React, Photoshop, Scrum"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">Categoría</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option>Software</option>
                            <option>Tecnologías</option>
                            <option>Metodologías</option>
                            <option>Habilidades Blandas</option>
                             <option>Otros</option>
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mis Herramientas</h3>
                {tools.length > 0 ? (
                    <div className="space-y-6">
                        {Object.keys(groupedTools).sort().map(cat => (
                            <div key={cat}>
                                <h4 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">{cat}</h4>
                                <ul className="flex flex-wrap gap-2">
                                    {groupedTools[cat].map(tool => (
                                        <li key={tool.id} className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                            {tool.name}
                                            <button onClick={() => handleDelete(tool.id)} className="ml-2 text-blue-500 hover:text-blue-800">
                                                &#x2715;
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">No has agregado ninguna herramienta o habilidad.</p>
                )}
            </div>
        </div>
    );
};

export default ToolManagementPage;
