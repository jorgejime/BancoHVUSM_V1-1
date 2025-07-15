import React, { useState, useEffect, useCallback } from 'react';
import type { ProfessionalExperience } from '../types';
import * as db from '../database';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

// Form component defined within the same file for co-location of logic
interface ExperienceFormProps {
    experience: ProfessionalExperience | null;
    onSave: (experience: Omit<ProfessionalExperience, 'id'>) => Promise<void>;
    onCancel: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<ProfessionalExperience, 'id'>>({
        company: '', role: '', country: '', startDate: '', endDate: null, isCurrent: false, description: ''
    });

    useEffect(() => {
        if (experience) {
            setFormData({ ...experience });
        } else {
            setFormData({ company: '', role: '', country: '', startDate: '', endDate: null, isCurrent: false, description: '' });
        }
    }, [experience]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
             const checked = e.target.checked;
             setFormData(prev => ({ ...prev, isCurrent: checked, endDate: checked ? null : prev.endDate }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{experience ? 'Editar Experiencia' : 'Agregar Experiencia'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Empresa</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Cargo</label>
                        <input type="text" name="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">País</label>
                        <input type="text" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className={formData.isCurrent ? 'opacity-50' : ''}>
                        <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                        <input type="date" name="endDate" value={formData.endDate || ''} onChange={handleChange} disabled={formData.isCurrent} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div className="flex items-center mt-6">
                        <input id="isCurrent" name="isCurrent" type="checkbox" checked={formData.isCurrent} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-900">¿Es su trabajo actual?</label>
                    </div>
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Descripción de funciones</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                 <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
                    <p className="font-bold">Información Importante</p>
                    <p className="text-sm">Por favor, ingrese información veraz y verificable. Se le podrán solicitar soportes que acrediten su experiencia.</p>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};


const ExperienceCard: React.FC<{ experience: ProfessionalExperience; onEdit: (id: string) => void; onDelete: (id: string) => void; }> = ({ experience, onEdit, onDelete }) => {
    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Presente';
        return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
    };

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-bold text-gray-800">{experience.role}</h4>
                    <p className="text-md text-blue-600 font-semibold">{experience.company}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {formatDate(experience.startDate)} - {experience.isCurrent ? 'Presente' : formatDate(experience.endDate)}
                        <span className="mx-2">·</span>
                        {experience.country}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(experience.id)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><PencilIcon /></button>
                    <button onClick={() => onDelete(experience.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"><TrashIcon /></button>
                </div>
            </div>
            <p className="mt-3 text-gray-600 text-sm">{experience.description}</p>
            <div className="mt-4">
                <button disabled className="text-sm bg-gray-200 text-gray-500 px-3 py-1 rounded-md cursor-not-allowed flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    Subir Soporte (Próximamente)
                </button>
            </div>
        </div>
    );
};

const ProfessionalExperiencePage = (): React.ReactNode => {
    const [experiences, setExperiences] = useState<ProfessionalExperience[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingExperience, setEditingExperience] = useState<ProfessionalExperience | null>(null);
    
    const loadExperiences = useCallback(async () => {
        const data = await db.getProfessionalExperiences();
        setExperiences(data);
    }, []);

    useEffect(() => {
        loadExperiences();
    }, [loadExperiences]);

    const handleAddNew = useCallback(() => {
        setEditingExperience(null);
        setIsFormVisible(true);
    }, []);

    const handleEdit = useCallback((id: string) => {
        const experienceToEdit = experiences.find(exp => exp.id === id);
        if (experienceToEdit) {
            setEditingExperience(experienceToEdit);
            setIsFormVisible(true);
        }
    }, [experiences]);

    const handleDelete = useCallback(async (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta experiencia?')) {
            await db.deleteProfessionalExperience(id);
            await loadExperiences();
        }
    }, [loadExperiences]);

    const handleSave = useCallback(async (experienceData: Omit<ProfessionalExperience, 'id'>) => {
        if (editingExperience) {
            await db.updateProfessionalExperience({ ...editingExperience, ...experienceData });
        } else {
            await db.addProfessionalExperience(experienceData);
        }
        await loadExperiences();
        setIsFormVisible(false);
        setEditingExperience(null);
    }, [editingExperience, loadExperiences]);

    const handleCancel = useCallback(() => {
        setIsFormVisible(false);
        setEditingExperience(null);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">EXPERIENCIA PROFESIONAL</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <PlusIcon />
                        Agregar Experiencia
                    </button>
                )}
            </div>
            
            {isFormVisible && <ExperienceForm experience={editingExperience} onSave={handleSave} onCancel={handleCancel} />}

            <div className="space-y-6">
                {experiences.map(exp => (
                    <ExperienceCard key={exp.id} experience={exp} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
                {experiences.length === 0 && !isFormVisible && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-gray-500">Aún no has agregado ninguna experiencia profesional.</p>
                        <p className="text-sm text-gray-400 mt-1">Haz clic en "Agregar Experiencia" para comenzar.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfessionalExperiencePage;
