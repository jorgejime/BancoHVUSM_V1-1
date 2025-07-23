import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para las tablas de la base de datos
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: 'admin' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: 'admin' | 'user';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: 'admin' | 'user';
          updated_at?: string;
        };
      };
      personal_data: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          summary?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          email?: string;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          summary?: string | null;
          updated_at?: string;
        };
      };
      professional_experiences: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          role: string;
          country: string;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          role: string;
          country: string;
          start_date: string;
          end_date?: string | null;
          is_current?: boolean;
          description: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          company?: string;
          role?: string;
          country?: string;
          start_date?: string;
          end_date?: string | null;
          is_current?: boolean;
          description?: string;
          updated_at?: string;
        };
      };
      academic_records: {
        Row: {
          id: string;
          user_id: string;
          institution: string;
          degree: string;
          field_of_study: string;
          start_date: string;
          end_date: string | null;
          in_progress: boolean;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution: string;
          degree: string;
          field_of_study: string;
          start_date: string;
          end_date?: string | null;
          in_progress?: boolean;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          institution?: string;
          degree?: string;
          field_of_study?: string;
          start_date?: string;
          end_date?: string | null;
          in_progress?: boolean;
          description?: string | null;
          updated_at?: string;
        };
      };
      languages: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          level: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          level: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          level?: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo';
          updated_at?: string;
        };
      };
      tools: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          category?: string;
          updated_at?: string;
        };
      };
      references: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          relationship: string;
          company: string;
          email: string;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          relationship: string;
          company: string;
          email: string;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          relationship?: string;
          company?: string;
          email?: string;
          phone?: string | null;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          notifications_new_opportunities: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notifications_new_opportunities?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          notifications_new_opportunities?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}