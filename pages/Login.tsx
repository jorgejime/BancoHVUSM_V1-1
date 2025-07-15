import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, isAdmin } from '../auth';

const Login = (): React.ReactNode => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (await login(email, password)) {
            if (isAdmin()) {
                navigate('/admin/dashboard');
            } else {
                navigate('/my-profile');
            }
        } else {
            setError('Credenciales inválidas. Por favor, intente de nuevo.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <img src="https://usm.edu.co/assets/Publico/images/Logo.png" alt="USM Logo" className="mx-auto h-16 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800">Iniciar Sesión</h1>
                    <p className="mt-2 text-gray-600">Bienvenido al Banco de Hojas de Vidas USM.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
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
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Ingresar
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
