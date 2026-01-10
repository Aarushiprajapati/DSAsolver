@echo off
echo ========================================
echo DSASolver - Backend Setup Script
echo ========================================
echo.

echo Step 1: Checking PostgreSQL...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] PostgreSQL not found!
    echo Please install PostgreSQL from: https://www.postgresql.org/download/
    pause
    exit /b 1
)
echo [OK] PostgreSQL is installed
echo.

echo Step 2: Creating database...
echo Please enter your PostgreSQL password when prompted.
psql -U postgres -c "CREATE DATABASE dsasolver;" 2>nul
if %errorlevel% equ 0 (
    echo [OK] Database 'dsasolver' created
) else (
    echo [INFO] Database might already exist, continuing...
)
echo.

echo Step 3: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [OK] Dependencies installed
echo.

echo Step 4: Initializing database tables...
call npm run init-db
if %errorlevel% neq 0 (
    echo [ERROR] Failed to initialize database
    pause
    exit /b 1
)
echo [OK] Database tables created
echo.

echo Step 5: Seeding sample data...
call npm run seed
if %errorlevel% neq 0 (
    echo [ERROR] Failed to seed data
    pause
    exit /b 1
)
echo [OK] Sample data added
echo.

echo ========================================
echo Setup Complete! 
echo ========================================
echo.
echo To start the backend server, run:
echo   npm run dev
echo.
echo The server will be available at:
echo   http://localhost:3001
echo.
pause
