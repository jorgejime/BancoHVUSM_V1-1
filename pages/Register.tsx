import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, isAdmin } from '../auth';

const Register = (): React.ReactNode => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        if (await register(name, email, password)) {
            if (isAdmin()) {
                navigate('/admin/dashboard');
            } else {
                navigate('/my-profile');
            }
        } else {
            setError('No se pudo completar el registro. Intente de nuevo.');
        }
        setLoading(false);
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Crear Cuenta</h1>
                    <p className="mt-2 text-gray-600">Únete al Banco de Hojas de Vidas USM y crea tu perfil profesional.</p>
                </div>
                


                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            disabled={loading}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            disabled={loading}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>
                
                <p className="text-sm text-center text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Ingresar
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;