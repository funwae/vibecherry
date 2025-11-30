#!/bin/bash

# 🍒 VibeCher - Automated Setup Script
# This script helps you get started quickly

set -e

echo "🍒 Welcome to VibeCher Setup!"
echo "=============================="
echo ""

# Check Node.js version
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. You have: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "✅ .env.local created from template"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your API keys:"
    echo "   - Supabase URL and keys"
    echo "   - DeepSeek API key"
    echo "   - Redis URL (optional for screenshots)"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check if Redis is installed (optional)
if command -v redis-cli &> /dev/null; then
    echo "✅ Redis detected (for screenshots)"
else
    echo "⚠️  Redis not found (optional, needed for screenshot generation)"
    echo "   Install with: brew install redis (macOS) or apt-get install redis-server (Linux)"
fi
echo ""

# Summary
echo "=============================="
echo "🎉 Setup Complete!"
echo "=============================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure environment variables:"
echo "   Edit .env.local with your API keys"
echo ""
echo "2. Set up Supabase database:"
echo "   - Create a Supabase project"
echo "   - Run DATABASE_SCHEMA.sql in SQL Editor"
echo "   - Create 'spec-screenshots' storage bucket"
echo ""
echo "3. Start development server:"
echo "   npm run dev"
echo ""
echo "4. (Optional) Start screenshot worker:"
echo "   npm run worker"
echo ""
echo "📚 For detailed instructions, see QUICKSTART.md"
echo ""
echo "Made with 🍒"
