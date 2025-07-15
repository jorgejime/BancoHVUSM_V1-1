import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
  return (
    <HashRouter>
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
