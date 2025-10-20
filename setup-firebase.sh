#!/bin/bash

# Firebase Setup Helper Script
# This script helps you setup Firebase Cloud Messaging for push notifications

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$SCRIPT_DIR/backend/config"
SERVICE_ACCOUNT_FILE="$CONFIG_DIR/firebase-service-account.json"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔥 Firebase Cloud Messaging Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if file already exists
if [ -f "$SERVICE_ACCOUNT_FILE" ]; then
    echo "⚠️  Firebase service account already exists!"
    echo "📁 Location: $SERVICE_ACCOUNT_FILE"
    echo ""
    read -p "Do you want to replace it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled"
        exit 0
    fi
fi

echo "📋 STEP 1: Get Firebase Service Account Key"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Please follow these steps:"
echo ""
echo "1. Open Firebase Console in your browser:"
echo "   👉 https://console.firebase.google.com/"
echo ""
echo "2. Select your project (or create a new one)"
echo ""
echo "3. Go to: Settings (⚙️) → Project settings → Service accounts"
echo ""
echo "4. Click 'Generate new private key' button"
echo ""
echo "5. Click 'Generate key' in the confirmation dialog"
echo ""
echo "6. A JSON file will be downloaded to your computer"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Press Enter when you have downloaded the JSON file..."
echo ""

echo "📋 STEP 2: Upload Service Account Key"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Now you need to upload the JSON file to this server."
echo ""
echo "Choose upload method:"
echo ""
echo "1) Paste JSON content directly (recommended for SSH)"
echo "2) Provide file path (if file already on server)"
echo "3) Manual instructions (upload via SCP/SFTP)"
echo ""
read -p "Select option (1/2/3): " -n 1 -r option
echo ""
echo ""

case $option in
    1)
        echo "📝 Paste your JSON content below"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Paste the entire JSON content and press Ctrl+D when done:"
        echo ""
        
        # Read JSON content from stdin
        json_content=$(cat)
        
        # Validate JSON
        if echo "$json_content" | jq . > /dev/null 2>&1; then
            echo "$json_content" > "$SERVICE_ACCOUNT_FILE"
            echo "✅ JSON content saved successfully!"
        else
            echo "❌ Invalid JSON format!"
            echo "Please check your JSON and try again."
            exit 1
        fi
        ;;
        
    2)
        echo "📁 Enter the full path to your JSON file:"
        read -r file_path
        
        if [ -f "$file_path" ]; then
            # Validate JSON
            if jq . "$file_path" > /dev/null 2>&1; then
                cp "$file_path" "$SERVICE_ACCOUNT_FILE"
                echo "✅ File copied successfully!"
            else
                echo "❌ Invalid JSON format in file!"
                exit 1
            fi
        else
            echo "❌ File not found: $file_path"
            exit 1
        fi
        ;;
        
    3)
        echo "📋 Manual Upload Instructions"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "From your local machine, run:"
        echo ""
        echo "   scp /path/to/your-firebase-key.json root@your-server:$SERVICE_ACCOUNT_FILE"
        echo ""
        echo "Or use Docker copy if file is on server:"
        echo ""
        echo "   docker cp /path/to/firebase-key.json nusantara-backend:/app/config/firebase-service-account.json"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        read -p "Press Enter when file is uploaded..."
        
        # Check if file exists now
        if [ ! -f "$SERVICE_ACCOUNT_FILE" ]; then
            echo "❌ File not found. Please upload the file and run this script again."
            exit 1
        fi
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "📋 STEP 3: Verify File"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check file size
file_size=$(stat -f%z "$SERVICE_ACCOUNT_FILE" 2>/dev/null || stat -c%s "$SERVICE_ACCOUNT_FILE" 2>/dev/null)
echo "✓ File exists: $SERVICE_ACCOUNT_FILE"
echo "✓ File size: $file_size bytes"

# Validate JSON structure
if jq . "$SERVICE_ACCOUNT_FILE" > /dev/null 2>&1; then
    echo "✓ Valid JSON format"
    
    # Extract and display key information
    project_id=$(jq -r '.project_id' "$SERVICE_ACCOUNT_FILE")
    client_email=$(jq -r '.client_email' "$SERVICE_ACCOUNT_FILE")
    
    echo "✓ Project ID: $project_id"
    echo "✓ Client Email: $client_email"
else
    echo "❌ Invalid JSON format!"
    rm "$SERVICE_ACCOUNT_FILE"
    exit 1
fi

# Set secure permissions
chmod 600 "$SERVICE_ACCOUNT_FILE"
echo "✓ File permissions set to 600 (secure)"

echo ""
echo "📋 STEP 4: Restart Backend"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "$SCRIPT_DIR/docker-compose.yml" ]; then
    echo "Restarting backend container..."
    cd "$SCRIPT_DIR"
    docker-compose restart backend
    echo "✓ Backend restarted"
    
    echo ""
    echo "Waiting for backend to initialize..."
    sleep 5
    
    echo ""
    echo "Checking FCM initialization..."
    fcm_status=$(docker-compose logs backend --tail 100 2>&1 | grep -i "Firebase Cloud Messaging initialized" | tail -1 || echo "")
    
    if [ -n "$fcm_status" ]; then
        echo "✅ $fcm_status"
    else
        echo "⚠️  FCM initialization not confirmed yet"
        echo "Check logs: docker-compose logs backend -f"
    fi
else
    echo "⚠️  docker-compose.yml not found"
    echo "Please restart backend manually:"
    echo "   docker-compose restart backend"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Firebase Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Verify FCM is initialized:"
echo "   docker-compose logs backend | grep 'Firebase Cloud Messaging initialized'"
echo ""
echo "2. Test notifications:"
echo "   - Login to your app"
echo "   - Create RAB with status 'under_review'"
echo "   - Check if notification appears"
echo ""
echo "3. Monitor notifications:"
echo "   docker-compose logs backend -f | grep -i notification"
echo ""
echo "📚 Documentation:"
echo "   - See: FIREBASE_SETUP_GUIDE.md"
echo "   - See: RAB_NOTIFICATION_FIX_COMPLETE.md"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
