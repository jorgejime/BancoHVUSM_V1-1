import React, { useState, useEffect, useCallback } from 'react';
import type { UserSettings } from '../types';
import * as db from '../database';
import { logout, changePassword } from '../auth';

const SettingsPage = (): React.ReactNode => {
    const [settings, setSettings] = useState<UserSettings>({ notifications: { newOpportunities: true } });
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [passMessage, setPassMessage] = useState({ type: '', text: '' });

    const loadSettings = useCallback(async () => {
        const data = await db.getSettings();
        setSettings(data);
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const handleToggleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        const newSettings = { ...settings, notifications: { ...settings.notifications, [name]: checked } };
        setSettings(newSettings);
        await db.saveSettings(newSettings);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPassMessage({ type: '', text: '' });
        if (passwordData.new !== passwordData.confirm) {
            setPassMessage({ type: 'error', text: 'La nueva contraseña y la confirmación no coinciden.' });
            return;
        }
        if (passwordData.new.length < 6) {
            setPassMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
            return;
        }
        
        // Actualizar contraseña con Supabase
        changePassword(passwordData.new).then((success) => {
            if (success) {
                setPassMessage({ type: 'success', text: '¡Contraseña actualizada con éxito!' });
                setPasswordData({ current: '', new: '', confirm: '' });
                setTimeout(() => setPassMessage({ type: '', text: '' }), 4000);
            } else {
                setPassMessage({ type: 'error', text: 'Error al actualizar la contraseña. Inténtelo de nuevo.' });
            }
        });
    };
    
    const handleDeleteAccount = () => {
        if(window.confirm('¿ESTÁ ABSOLUTAMENTE SEGURO?\nEsta acción es irreversible y eliminará todos sus datos de forma permanente.')) {
            if(window.confirm('CONFIRMACIÓN FINAL:\n¿Realmente desea eliminar su cuenta y todos sus datos?')) {
                logout(); // Logout clears all data via auth.ts
            }
        }
    };


    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">CONFIGURACIÓN</h2>

            {/* Notifications Settings */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Notificaciones</h3>
                <div className="flex items-center justify-between">
                    <p className="text-gray-600">Recibir notificaciones por email sobre nuevas oportunidades laborales.</p>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            name="newOpportunities"
                            checked={settings.notifications.newOpportunities}
                            onChange={handleToggleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            {/* Change Password */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                     {passMessage.text && (
                        <p className={`text-sm ${passMessage.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                            {passMessage.text}
                        </p>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                        <input type="password" name="current" value={passwordData.current} onChange={handlePasswordChange} className="mt-1 block w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                        <input type="password" name="new" value={passwordData.new} onChange={handlePasswordChange} className="mt-1 block w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                        <input type="password" name="confirm" value={passwordData.confirm} onChange={handlePasswordChange} className="mt-1 block w-full md:w-1/2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Actualizar Contraseña
                        </button>
                    </div>
                </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-red-800 mb-2">Zona de Peligro</h3>
                <p className="text-red-700 mb-4">Esta acción no se puede deshacer. Esto eliminará permanentemente su cuenta y todos los datos asociados.</p>
                <button onClick={handleDeleteAccount} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Eliminar Mi Cuenta
                </button>
            </div>

        </div>
    );
};

export default SettingsPage;
