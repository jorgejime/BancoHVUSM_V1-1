# Banco de Hojas de Vidas USM - Supabase

Sistema de gestión de hojas de vida para la Universidad de Santa Marta (USM) con backend completo en Supabase.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure Supabase:
   - Create a new project in [Supabase Console](https://supabase.com)
   - Copy `.env.example` to `.env`
   - Update the Supabase URL and anon key in `.env`
   - Apply database migrations (see Database Setup below)
3. Run the app:
   `npm run dev`

## Supabase Configuration

### 1. Create Supabase Project
1. Go to [Supabase Console](https://supabase.com)
2. Create a new project
3. Wait for the project to be ready

### 2. Database Setup
1. Go to the SQL Editor in your Supabase project
2. Execute the migration files in order:
   - First: `supabase/migrations/001_create_database_schema.sql`
   - Second: `supabase/migrations/002_create_admin_user.sql`
3. Create the admin user:
   - Go to Authentication > Users
   - Click "Add user"
   - Email: `admin@usm.edu.co`
   - Password: Choose a secure password
   - Confirm user creation

### 3. Environment Variables
1. Copy `.env.example` to `.env`
2. Go to Project Settings > API in your Supabase project
3. Copy the Project URL and paste it as `VITE_SUPABASE_URL`
4. Copy the anon public key and paste it as `VITE_SUPABASE_ANON_KEY`

### 4. Authentication Configuration
1. In Supabase, go to Authentication > Settings
2. Enable "Enable email confirmations" (optional)
3. Configure email templates if needed
4. Set up allowed redirect URLs for your domain

## Database Schema

The application uses the following main tables:
- **profiles** - User profiles linked to Supabase Auth
- **personal_data** - Personal information
- **professional_experiences** - Work experience records
- **academic_records** - Educational background
- **languages** - Language skills
- **tools** - Technical skills and tools
- **references** - Professional references
- **user_settings** - User preferences

## Features

- Supabase Authentication with email/password
- Email/Password authentication
- PostgreSQL database with Row Level Security (RLS)
- Role-based access control (admin/user)
- Complete CRUD operations for CV data
- Admin dashboard with user management
- Data analytics and reporting
- Responsive design with Tailwind CSS
- Real-time data synchronization
- Secure data handling with RLS policies

## User Roles

### Regular Users (`role: 'user'`)
- Can manage their own profile data
- Access to all personal sections (experience, education, etc.)
- Cannot see other users' data

### Administrators (`role: 'admin'`)
- Full access to all user data (read-only)
- Admin dashboard with statistics
- User management capabilities
- Can view detailed candidate profiles

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Role-based policies**: Different permissions for users and admins
- **Input validation**: Data validation at database level
- **Secure authentication**: Built on Supabase Auth
- **Audit trails**: Automatic created_at and updated_at timestamps

## Development Notes

- The app uses Supabase client-side SDK
- All database operations go through RLS policies
- Admin functions have separate policies for data access
- The database schema includes indexes for optimal performance
- Automatic profile creation when users register