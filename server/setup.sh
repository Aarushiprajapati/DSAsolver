#!/bin/bash

echo "========================================"
echo "DSASolver - Backend Setup Script"
echo "========================================"
echo ""

echo "Step 1: Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "[ERROR] PostgreSQL not found!"
    echo "Please install PostgreSQL from: https://www.postgresql.org/download/"
    exit 1
fi
echo "[OK] PostgreSQL is installed"
echo ""

echo "Step 2: Creating database..."
echo "Please enter your PostgreSQL password when prompted."
psql -U postgres -c "CREATE DATABASE dsasolver;" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "[OK] Database 'dsasolver' created"
else
    echo "[INFO] Database might already exist, continuing..."
fi
echo ""

echo "Step 3: Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install dependencies"
    exit 1
fi
echo "[OK] Dependencies installed"
echo ""

echo "Step 4: Initializing database tables..."
npm run init-db
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to initialize database"
    exit 1
fi
echo "[OK] Database tables created"
echo ""

echo "Step 5: Seeding sample data..."
npm run seed
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to seed data"
    exit 1
fi
echo "[OK] Sample data added"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the backend server, run:"
echo "  npm run dev"
echo ""
echo "The server will be available at:"
echo "  http://localhost:3001"
echo ""
