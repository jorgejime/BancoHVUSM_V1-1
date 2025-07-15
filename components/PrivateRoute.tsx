import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../auth';
import Layout from './Layout';

const PrivateRoute = (): React.ReactNode => {
    // If authenticated, render the Layout which contains the Outlet for nested routes.
    // Otherwise, redirect to the login page.
    return isAuthenticated() ? <Layout /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
