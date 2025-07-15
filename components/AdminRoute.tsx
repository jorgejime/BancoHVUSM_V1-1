import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../auth';
import Layout from './Layout';

const AdminRoute = (): React.ReactNode => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin()) {
        // If a regular user tries to access an admin route, send them to their profile
        return <Navigate to="/my-profile" replace />;
    }

    // If authenticated and is an admin, render the Layout which contains the Outlet for nested admin routes.
    return <Layout />;
};

export default AdminRoute;
