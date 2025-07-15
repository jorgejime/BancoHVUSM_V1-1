import React from 'react';
import { getUserName, logout } from '../auth';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

const Header = (): React.ReactNode => {

    const handleLogout = () => {
        logout();
    };

    return (
        <header className="bg-white shadow-md z-10">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <a href="/#/my-profile">
                    <img src="https://usm.edu.co/assets/Publico/images/Logo.png" alt="Banco de Hojas de Vidas USM Logo" className="h-12" />
                </a>
                <div className="flex items-center space-x-4">
                    <button className="text-gray-500 hover:text-blue-600 focus:outline-none">
                        <BellIcon />
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <UserIcon />
                        </div>
                        <span className="text-gray-800 hidden md:block font-medium">{getUserName()}</span>
                    </div>
                    <button onClick={handleLogout} className="flex items-center text-sm text-gray-600 hover:text-red-600 focus:outline-none">
                       <LogoutIcon />
                       <span className="hidden md:block">Log Out</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;