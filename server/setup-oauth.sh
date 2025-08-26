#!/bin/bash

# Setup script for Fitbit OAuth integration
echo "🏃‍♂️ Sports Fitness Tracker - Fitbit OAuth Setup"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the server directory"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📄 Creating .env file from example..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "📄 .env file already exists"
fi

# Check if required environment variables are set
echo ""
echo "🔍 Checking environment configuration..."

source .env

required_vars=("FITBIT_CLIENT_ID" "FITBIT_CLIENT_SECRET" "MONGODB_URI" "SESSION_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [ "${!var}" = "your-fitbit-client-id" ] || [ "${!var}" = "your-fitbit-client-secret" ] || [ "${!var}" = "your-super-secret-session-key-change-this-in-production" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    echo "✅ All required environment variables are configured"
else
    echo "⚠️  The following environment variables need to be configured:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please update your .env file with the correct values."
    echo "See FITBIT_OAUTH_SETUP.md for detailed instructions."
fi

echo ""
echo "🔧 Next steps:"
echo "1. Configure your Fitbit app at https://dev.fitbit.com/apps"
echo "2. Update .env file with your Fitbit credentials"
echo "3. Start MongoDB if using local database"
echo "4. Run 'npm run dev' to start the server"
echo "5. Run 'npm run dev' in the client directory"
echo ""
echo "📖 For detailed setup instructions, see FITBIT_OAUTH_SETUP.md"
