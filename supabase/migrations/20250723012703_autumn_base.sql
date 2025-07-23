/*
  # Creación del esquema completo de la base de datos

  1. Nuevas Tablas
    - `profiles` - Perfiles de usuario vinculados a auth.users
    - `personal_data` - Datos personales de los usuarios
    - `professional_experiences` - Experiencias profesionales
    - `academic_records` - Formación académica
    - `languages` - Idiomas que habla el usuario
    - `tools` - Herramientas y habilidades técnicas
    - `references` - Referencias profesionales
    - `user_settings` - Configuraciones y preferencias del usuario

  2. Seguridad
    - Habilitar RLS en todas las tablas
    - Políticas para usuarios (solo acceso a sus propios datos)
    - Políticas para administradores (acceso a todos los datos)
    - Trigger para actualizar updated_at automáticamente

  3. Índices
    - Índices en claves foráneas para optimizar consultas
    - Índices en campos de búsqueda comunes

  4. Funciones
    - Función para verificar si el usuario es admin
    - Función para actualizar updated_at automáticamente
*/

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear función para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Tabla de perfiles (vinculada a auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de datos personales
CREATE TABLE IF NOT EXISTS personal_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabla de experiencias profesionales
CREATE TABLE IF NOT EXISTS professional_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    country TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de formación académica
CREATE TABLE IF NOT EXISTS academic_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    in_progress BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de idiomas
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Básico', 'Intermedio', 'Avanzado', 'Nativo')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de herramientas y habilidades
CREATE TABLE IF NOT EXISTS tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Otros',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de referencias
CREATE TABLE IF NOT EXISTS references (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de configuraciones del usuario
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    notifications_new_opportunities BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_personal_data_user_id ON personal_data(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_experiences_user_id ON professional_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_professional_experiences_is_current ON professional_experiences(is_current);
CREATE INDEX IF NOT EXISTS idx_academic_records_user_id ON academic_records(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_records_in_progress ON academic_records(in_progress);
CREATE INDEX IF NOT EXISTS idx_languages_user_id ON languages(user_id);
CREATE INDEX IF NOT EXISTS idx_tools_user_id ON tools(user_id);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_references_user_id ON references(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Habilitar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE references ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla profiles
-- Los usuarios pueden ver y actualizar su propio perfil
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Los administradores pueden ver todos los perfiles
CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Políticas para personal_data
CREATE POLICY "Users can manage own personal data"
    ON personal_data FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all personal data"
    ON personal_data FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Políticas para professional_experiences
CREATE POLICY "Users can manage own professional experiences"
    ON professional_experiences FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all professional experiences"
    ON professional_experiences FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Políticas para academic_records
CREATE POLICY "Users can manage own academic records"
    ON academic_records FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all academic records"
    ON academic_records FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Políticas para languages
CREATE POLICY "Users can manage own languages"
    ON languages FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all languages"
    ON languages FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Políticas para tools
CREATE POLICY "Users can manage own tools"
    ON tools FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tools"
    ON tools FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Políticas para references
CREATE POLICY "Users can manage own references"
    ON references FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all references"
    ON references FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Políticas para user_settings
CREATE POLICY "Users can manage own settings"
    ON user_settings FOR ALL
    TO authenticated
    USING (auth.uid() = user_id);

-- Crear triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_data_updated_at
    BEFORE UPDATE ON personal_data
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_experiences_updated_at
    BEFORE UPDATE ON professional_experiences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_records_updated_at
    BEFORE UPDATE ON academic_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_languages_updated_at
    BEFORE UPDATE ON languages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_references_updated_at
    BEFORE UPDATE ON references
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
    BEFORE UPDATE ON user_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        CASE 
            WHEN NEW.email = 'admin@usm.edu.co' THEN 'admin'
            ELSE 'user'
        END
    );
    
    -- Crear datos personales vacíos
    INSERT INTO public.personal_data (user_id, full_name, email)
    VALUES (NEW.id, '', NEW.email);
    
    -- Crear configuraciones por defecto
    INSERT INTO public.user_settings (user_id, notifications_new_opportunities)
    VALUES (NEW.id, TRUE);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();