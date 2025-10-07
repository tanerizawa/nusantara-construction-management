#!/bin/bash

echo "🔐 Configuring VS Code Remote Auto-Login..."

# Generate SSH key if not exists
if [ ! -f ~/.ssh/id_rsa ]; then
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
    echo "✅ SSH key generated"
fi

# Setup authorized_keys
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys 2>/dev/null
chmod 600 ~/.ssh/authorized_keys
echo "✅ Authorized keys configured"

# Configure SSH client
cat > ~/.ssh/config << 'EOF'
Host *
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    ServerAliveInterval 60
    PasswordAuthentication yes
    PubkeyAuthentication yes
EOF
chmod 600 ~/.ssh/config
echo "✅ SSH client configured"

# Set up VS Code settings for better remote experience
mkdir -p ~/.vscode-server/data/Machine
cat > ~/.vscode-server/data/Machine/settings.json << 'EOF'
{
    "remote.SSH.connectTimeout": 120,
    "telemetry.telemetryLevel": "off",
    "typescript.disableAutomaticTypeAcquisition": true,
    "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/.git/**": true,
        "**/dist/**": true,
        "**/build/**": true
    }
}
EOF
echo "✅ VS Code settings configured"

# Store password for future reference
echo "export AUTO_LOGIN_PASSWORD='Tegalmalaka12089@'" >> ~/.bashrc
echo "✅ Password stored in environment"

echo ""
echo "🎉 Auto-login setup completed!"
echo "🔄 Please restart VS Code and reconnect to the remote server"
echo "🔑 Password: Tegalmalaka12089@"
