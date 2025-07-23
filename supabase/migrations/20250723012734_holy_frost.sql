/*
  # Crear usuario administrador inicial

  1. Configuración
    - Crear cuenta de usuario admin con email admin@usm.edu.co
    - Asignar rol de administrador
    - Configurar datos iniciales

  2. Seguridad
    - El usuario admin tendrá acceso completo a través de las políticas RLS existentes
    - Se crea con una contraseña temporal que debe ser cambiada

  Nota: Este script debe ejecutarse después de haber configurado Supabase Auth
  y haber aplicado la migración anterior.
*/

-- Insertar usuario admin en profiles (si no existe)
-- Nota: El usuario debe ser creado primero en Supabase Auth Dashboard
-- o a través de la función de registro antes de ejecutar esto

-- Esta función se puede usar para crear el perfil de admin si el usuario ya existe en auth.users
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Intentar encontrar el usuario admin en auth.users
    SELECT id INTO admin_user_id 
    FROM auth.users 
    WHERE email = 'admin@usm.edu.co' 
    LIMIT 1;
    
    -- Si existe el usuario pero no tiene perfil, crearlo
    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.profiles (id, name, email, role)
        VALUES (admin_user_id, 'Administrador USM', 'admin@usm.edu.co', 'admin')
        ON CONFLICT (id) DO UPDATE SET
            name = 'Administrador USM',
            role = 'admin',
            updated_at = NOW();
        
        -- Asegurar que tiene datos personales
        INSERT INTO public.personal_data (user_id, full_name, email)
        VALUES (admin_user_id, 'Administrador USM', 'admin@usm.edu.co')
        ON CONFLICT (user_id) DO UPDATE SET
            full_name = 'Administrador USM',
            updated_at = NOW();
        
        -- Asegurar que tiene configuraciones
        INSERT INTO public.user_settings (user_id, notifications_new_opportunities)
        VALUES (admin_user_id, TRUE)
        ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Perfil de administrador actualizado correctamente';
    ELSE
        RAISE NOTICE 'Usuario admin@usm.edu.co no encontrado en auth.users. Debe ser creado primero a través de Supabase Auth.';
    END IF;
END $$;