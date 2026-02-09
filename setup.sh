#!/bin/bash

echo "🚛 ELD Trip Planner Setup"
echo "========================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "✅ Prerequisites found"
echo ""

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🏗️  Building frontend..."
npm run build

# Return to root
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Run migrations
echo "🗄️  Running database migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
python manage.py collectstatic --noinput

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development server:"
echo "  source venv/bin/activate"
echo "  python manage.py runserver"
echo ""
echo "Then open http://localhost:8000 in your browser"
echo ""
echo "For frontend development with hot reload:"
echo "  cd frontend"
echo "  npm run dev"
echo "  Open http://localhost:5173"
