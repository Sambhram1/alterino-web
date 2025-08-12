@echo off
REM Alterino Platform Setup Script for Windows

echo 🚀 Setting up Alterino Platform with Supabase...

REM Check if .env.local exists
if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    (
        echo # Supabase Configuration
        echo # Replace these with your actual Supabase project credentials
        echo NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
    ) > .env.local
    echo ⚠️  Please update .env.local with your actual Supabase credentials
) else (
    echo ✅ .env.local already exists
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Check if node_modules exists
if exist "node_modules" (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your Supabase credentials
echo 2. Run the SQL script in scripts/01-setup-tables.sql in your Supabase dashboard
echo 3. Run 'npm run dev' to start the development server
echo.
echo 📖 For detailed setup instructions, see SUPABASE_SETUP.md
pause
