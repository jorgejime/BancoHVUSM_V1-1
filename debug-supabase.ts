// Archivo temporal para debuggear la conexión con Supabase
import { supabase } from './supabase';

// Función para verificar la conexión y tablas
export const debugSupabaseConnection = async () => {
  console.log('🔍 Verificando conexión con Supabase...');
  
  try {
    // 1. Verificar conexión básica
    const { data: healthCheck, error: healthError } = await supabase
      .from('profiles')
      .select('count', { count: 'exact', head: true });
    
    if (healthError) {
      console.error('❌ Error de conexión:', healthError);
      return false;
    }
    
    console.log('✅ Conexión exitosa con Supabase');
    
    // 2. Verificar tablas existentes
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables'); // Esta función RPC necesita ser creada
    
    if (tablesError) {
      console.warn('⚠️ No se pudieron obtener las tablas:', tablesError);
    } else {
      console.log('📋 Tablas encontradas:', tables);
    }
    
    // 3. Verificar autenticación
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('🔐 Sesión actual:', session ? 'Autenticado' : 'No autenticado');
    
    return true;
  } catch (error) {
    console.error('💥 Error inesperado:', error);
    return false;
  }
};

// Función para verificar variables de entorno
export const checkEnvironmentVariables = () => {
  console.log('🔧 Verificando variables de entorno...');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Configurada' : '❌ Faltante');
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables de entorno faltantes. Verifica tu archivo .env');
    return false;
  }
  
  // Verificar formato de URL
  try {
    new URL(supabaseUrl);
    console.log('✅ URL de Supabase válida');
  } catch {
    console.error('❌ URL de Supabase inválida');
    return false;
  }
  
  return true;
};

// Ejecutar verificaciones al importar
if (typeof window !== 'undefined') {
  checkEnvironmentVariables();
  debugSupabaseConnection();
}