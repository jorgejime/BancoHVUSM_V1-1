import React from 'react';
import { NavLink } from 'react-router-dom';
import { isAdmin } from '../auth';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center px-4 py-2 mt-2 text-sm font-medium transition-colors duration-200 transform hover:bg-blue-700 hover:text-gray-200 rounded-md ${
        isActive ? 'bg-blue-700 text-gray-200' : 'text-gray-400'
      }`
    }
  >
    {icon}
    <span className="mx-4">{label}</span>
  </NavLink>
);

const userNavItems = [
    { to: "/my-profile", icon: <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />, label: "Mi Perfil" },
    { to: "/personal-data", icon: <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0L15 8m-5-2v5.5a2.5 2.5 0 005 0V6m-5 2h5" />, label: "Datos Personales" },
    { to: "/dashboard/professional-experience", icon: <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, label: "Experiencia Profesional" },
    { to: "/academic-education", icon: <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />, label: "Formación Académica" },
    { to: "/languages", icon: <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 9a9 9 0 00-9 9" />, label: "Idiomas" },
    { to: "/tool-management", icon: <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />, label: "Manejo de Herramientas" },
    { to: "/references", icon: <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />, label: "Referencias" },
    { to: "/settings", icon: <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />, label: "Configuración" },
];

const adminNavItems = [
    { to: "/admin/dashboard", icon: <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />, label: "Admin Dashboard" },
    { to: "/admin/users", icon: <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />, label: "Candidatos" },
];

const Sidebar = (): React.ReactNode => {
  const navItems = isAdmin() ? adminNavItems : userNavItems;
  const title = isAdmin() ? "Portal de Administrador" : "Banco de Hojas de Vida USM";
  
  return (
    <div className="flex flex-col w-64 bg-blue-800 text-white">
      <div className="flex items-center justify-center h-20 border-b border-blue-700 px-2">
        <h1 className="text-lg font-bold text-white text-center">{title}</h1>
      </div>
      <nav className="flex-1 px-2 py-4">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">{item.icon}</svg>}
            label={item.label}
          />
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
