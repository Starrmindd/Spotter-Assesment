@echo off
echo 🚛 ELD Trip Planner Setup
echo =========================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python 3 is required but not installed.
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is required but not installed.
    exit /b 1
)

echo ✅ Prerequisites found
echo.

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo 📥 Installing Python dependencies...
pip install -r requirements.txt

REM Install frontend dependencies
echo 📥 Installing frontend dependencies...
cd frontend
call npm install

REM Build frontend
echo 🏗️  Building frontend...
call npm run build

REM Return to root
cd ..

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update .env with your configuration
)

REM Run migrations
echo 🗄️  Running database migrations...
python manage.py migrate

REM Collect static files
echo 📁 Collecting static files...
python manage.py collectstatic --noinput

echo.
echo ✅ Setup complete!
echo.
echo To start the development server:
echo   venv\Scripts\activate
echo   python manage.py runserver
echo.
echo Then open http://localhost:8000 in your browser
echo.
echo For frontend development with hot reload:
echo   cd frontend
echo   npm run dev
echo   Open http://localhost:5173

pause
