import React from 'react';
import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initAuth, onAuthStateChange } from './auth';
import ProfessionalExperiencePage from './pages/ProfessionalExperience';
import Login from './pages/Login';
import Register from './pages/Register';
import MyProfile from './pages/MyProfile';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import { isAuthenticated, isAdmin } from './auth';
import PersonalData from './pages/PersonalData';
import AcademicEducation from './pages/AcademicEducation';
import Languages from './pages/Languages';
import ToolManagement from './pages/ToolManagement';
import References from './pages/References';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserListPage from './pages/admin/UserListPage';
import UserProfileView from './pages/admin/UserProfileView';

function App(): React.ReactNode {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  useEffect(() => {
    // Inicializar autenticación al cargar la app
    const initialize = async () => {
      try {
        await initAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error inicializando la aplicación:', error);
        setInitError('Error de conexión con la base de datos');
        // Aún así permitir que la app se inicialice para mostrar login
        setIsInitialized(true);
      }
    };
    
    initialize();
    
    // Listener para cambios de autenticación
    const { data: authListener } = onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
    });
    
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);
  
  // Si hay error de inicialización, mostrar mensaje de error
  if (initError && !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error de Conexión</h2>
          <p className="text-gray-600 mb-4">{initError}</p>
          <p className="text-sm text-gray-500 mb-4">
            Verifica que tu proyecto de Supabase esté correctamente configurado y que las migraciones de base de datos se hayan ejecutado.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }
  
  return (
    <HashRouter>
      {initError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Advertencia: {initError}. Algunas funciones pueden no estar disponibles.
              </p>
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="users/:userId" element={<UserProfileView />} />
        </Route>

        {/* User Routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Navigate to="/my-profile" replace />} />
          <Route path="my-profile" element={<MyProfile />} />
          <Route path="personal-data" element={<PersonalData />} />
          <Route path="dashboard/professional-experience" element={<ProfessionalExperiencePage />} />
          <Route path="academic-education" element={<AcademicEducation />} />
          <Route path="languages" element={<Languages />} />
          <Route path="tool-management" element={<ToolManagement />} />
          <Route path="references" element={<References />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={
          isAuthenticated() 
            ? <Navigate to={isAdmin() ? "/admin/dashboard" : "/my-profile"} />
            : <Navigate to="/login" />
        } />
      </Routes>
    </HashRouter>
  );
}

export default App;