import React, { useState, useEffect, useCallback } from 'react';
import type { Reference } from '../types';
import * as db from '../database';

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

interface ReferenceFormProps {
    reference: Reference | null;
    onSave: (record: Omit<Reference, 'id'>) => Promise<void>;
    onCancel: () => void;
}

const ReferenceForm: React.FC<ReferenceFormProps> = ({ reference, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Reference, 'id'>>({
        name: '', relationship: '', company: '', email: '', phone: ''
    });

    useEffect(() => {
        if (reference) {
            setFormData({ ...reference });
        } else {
            setFormData({ name: '', relationship: '', company: '', email: '', phone: '' });
        }
    }, [reference]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{reference ? 'Editar Referencia' : 'Agregar Referencia'}</h3>
            <form onSubmit={handleSubmit}>
                 <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
                    <p className="font-bold">Consentimiento Importante</p>
                    <p className="text-sm">Asegúrese de haber obtenido el consentimiento de sus referencias antes de proporcionar su información de contacto.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Relación o Cargo</label>
                        <input type="text" name="relationship" value={formData.relationship} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Ej: Ex-Jefe, Colega, Profesor" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Empresa o Institución</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email de Contacto</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Teléfono de Contacto</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                    </div>
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


const ReferenceCard: React.FC<{ reference: Reference; onEdit: (id: string) => void; onDelete: (id: string) => void; }> = ({ reference, onEdit, onDelete }) => {
    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-bold text-gray-800">{reference.name}</h4>
                    <p className="text-md text-blue-600 font-semibold">{reference.relationship}</p>
                    <p className="text-sm text-gray-500 mt-1">{reference.company}</p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => onEdit(reference.id)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"><PencilIcon /></button>
                    <button onClick={() => onDelete(reference.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"><TrashIcon /></button>
                </div>
            </div>
            <div className="mt-3 border-t pt-3">
                 <p className="text-sm text-gray-600"><strong>Email:</strong> {reference.email}</p>
                 {reference.phone && <p className="text-sm text-gray-600 mt-1"><strong>Teléfono:</strong> {reference.phone}</p>}
            </div>
        </div>
    );
};

const ReferencesPage = (): React.ReactNode => {
    const [references, setReferences] = useState<Reference[]>([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingReference, setEditingReference] = useState<Reference | null>(null);
    
    const loadReferences = useCallback(async () => {
        const data = await db.getReferences();
        setReferences(data);
    }, []);

    useEffect(() => {
        loadReferences();
    }, [loadReferences]);

    const handleAddNew = useCallback(() => {
        setEditingReference(null);
        setIsFormVisible(true);
    }, []);

    const handleEdit = useCallback((id: string) => {
        const referenceToEdit = references.find(r => r.id === id);
        if (referenceToEdit) {
            setEditingReference(referenceToEdit);
            setIsFormVisible(true);
        }
    }, [references]);

    const handleDelete = useCallback(async (id: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar esta referencia?')) {
            await db.deleteReference(id);
            await loadReferences();
        }
    }, [loadReferences]);

    const handleSave = useCallback(async (referenceData: Omit<Reference, 'id'>) => {
        if (editingReference) {
            await db.updateReference({ ...editingReference, ...referenceData });
        } else {
            await db.addReference(referenceData);
        }
        await loadReferences();
        setIsFormVisible(false);
        setEditingReference(null);
    }, [editingReference, loadReferences]);

    const handleCancel = useCallback(() => {
        setIsFormVisible(false);
        setEditingReference(null);
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">REFERENCIAS</h2>
                {!isFormVisible && (
                    <button onClick={handleAddNew} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <PlusIcon />
                        Agregar Referencia
                    </button>
                )}
            </div>
            
            {isFormVisible && <ReferenceForm reference={editingReference} onSave={handleSave} onCancel={handleCancel} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {references.map(r => (
                    <ReferenceCard key={r.id} reference={r} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
            </div>

            {references.length === 0 && !isFormVisible && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">Aún no has agregado ninguna referencia.</p>
                    <p className="text-sm text-gray-400 mt-1">Haz clic en "Agregar Referencia" para comenzar.</p>
                </div>
            )}
        </div>
    );
};

export default ReferencesPage;
