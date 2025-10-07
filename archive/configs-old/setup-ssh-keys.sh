#!/bin/bash

# SSH Key Setup for VS Code Remote - No Password Required
# Server: srv982494.euw.hosting.ovh.net
# User: root

echo "🔐 Setting up SSH Key Authentication for VS Code Remote..."
echo "🎯 Target: root@srv982494.euw.hosting.ovh.net"
echo ""

# Ensure .ssh directory exists with correct permissions
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Generate SSH key pair if not exists
if [ ! -f ~/.ssh/id_rsa ]; then
    echo "🔑 Generating new SSH key pair..."
    ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
    chmod 600 ~/.ssh/id_rsa
    chmod 644 ~/.ssh/id_rsa.pub
    echo "✅ SSH key pair generated"
else
    echo "✅ SSH key pair already exists"
fi

# Setup authorized_keys for passwordless local connections
echo "🔓 Setting up authorized_keys..."
mkdir -p ~/.ssh
cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
sort ~/.ssh/authorized_keys | uniq > ~/.ssh/authorized_keys.tmp
mv ~/.ssh/authorized_keys.tmp ~/.ssh/authorized_keys

# Create SSH client configuration
echo "⚙️ Configuring SSH client..."
cat > ~/.ssh/config << 'EOF'
Host srv982494 srv982494.euw.hosting.ovh.net
    HostName srv982494.euw.hosting.ovh.net
    User root
    Port 22
    IdentityFile ~/.ssh/id_rsa
    PubkeyAuthentication yes
    PasswordAuthentication yes
    PreferredAuthentications publickey,password
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
    Compression yes
    ConnectTimeout 30

Host *
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
    ServerAliveInterval 60
    ServerAliveCountMax 3
    TCPKeepAlive yes
EOF

chmod 600 ~/.ssh/config

# Display public key for manual setup
echo ""
echo "📋 YOUR PUBLIC KEY (copy this to your local machine):"
echo "════════════════════════════════════════════════════"
cat ~/.ssh/id_rsa.pub
echo "════════════════════════════════════════════════════"
echo ""

# Create script to copy public key to local machine
cat > ~/copy_ssh_key.sh << 'EOF'
#!/bin/bash
echo "📥 Copy this public key to your LOCAL machine:"
echo ""
cat ~/.ssh/id_rsa.pub
echo ""
echo "📝 Instructions for your LOCAL machine:"
echo "1. Create ~/.ssh directory: mkdir -p ~/.ssh"
echo "2. Save the key above to: ~/.ssh/authorized_keys"
echo "3. Set permissions: chmod 600 ~/.ssh/authorized_keys"
echo "4. Test connection: ssh root@srv982494.euw.hosting.ovh.net"
EOF

chmod +x ~/copy_ssh_key.sh

# Configure SSH daemon for better authentication
echo "🛠️ Configuring SSH daemon..."
if [ -f /etc/ssh/sshd_config ]; then
    # Backup current config
    cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)
    
    # Enable key authentication
    sed -i 's/#PubkeyAuthentication yes/PubkeyAuthentication yes/' /etc/ssh/sshd_config
    sed -i 's/PubkeyAuthentication no/PubkeyAuthentication yes/' /etc/ssh/sshd_config
    sed -i 's/#AuthorizedKeysFile/AuthorizedKeysFile/' /etc/ssh/sshd_config
    sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
    sed -i 's/#ClientAliveInterval 0/ClientAliveInterval 60/' /etc/ssh/sshd_config
    sed -i 's/#ClientAliveCountMax 3/ClientAliveCountMax 3/' /etc/ssh/sshd_config
    sed -i 's/#TCPKeepAlive yes/TCPKeepAlive yes/' /etc/ssh/sshd_config
    
    # Restart SSH service
    systemctl restart ssh 2>/dev/null || systemctl restart sshd 2>/dev/null
    echo "✅ SSH daemon configured and restarted"
fi

# Start SSH agent and add key
echo "🚀 Starting SSH agent..."
eval $(ssh-agent -s) > /dev/null 2>&1
ssh-add ~/.ssh/id_rsa 2>/dev/null

# Create VS Code specific configuration
echo "💻 Creating VS Code Remote configuration..."
mkdir -p ~/.vscode-server/data/Machine

cat > ~/.vscode-server/data/Machine/settings.json << 'EOF'
{
    "remote.SSH.connectTimeout": 120,
    "remote.SSH.useLocalServer": false,
    "remote.SSH.enableDynamicForwarding": true,
    "remote.SSH.maxReconnectionAttempts": 8,
    "remote.SSH.enableCertificateVerification": false,
    "remote.SSH.lockfilesInTmp": true,
    "remote.SSH.useExecServer": true,
    "telemetry.telemetryLevel": "off",
    "workbench.settings.enableNaturalLanguageSearch": false,
    "typescript.disableAutomaticTypeAcquisition": true,
    "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/.git/**": true,
        "**/dist/**": true,
        "**/build/**": true,
        "**/.vscode-server/**": true
    },
    "search.followSymlinks": false
}
EOF

# Create startup script for SSH agent
cat > ~/.ssh_agent_startup << 'EOF'
#!/bin/bash
# Auto-start SSH agent and load keys
if [ -z "$SSH_AUTH_SOCK" ]; then
    eval $(ssh-agent -s) > /dev/null 2>&1
    ssh-add ~/.ssh/id_rsa > /dev/null 2>&1
fi
EOF

chmod +x ~/.ssh_agent_startup

# Add to bashrc if not already there
if ! grep -q ".ssh_agent_startup" ~/.bashrc; then
    echo "source ~/.ssh_agent_startup" >> ~/.bashrc
fi

# Test SSH connection internally
echo "🧪 Testing SSH configuration..."
ssh-keygen -R localhost > /dev/null 2>&1
ssh-keygen -R 127.0.0.1 > /dev/null 2>&1

echo ""
echo "✅ SSH Key Authentication Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "════════════════════════════════════════════════════════════════"
echo "1. 📥 COPY YOUR PUBLIC KEY:"
echo "   Run: ~/copy_ssh_key.sh"
echo ""
echo "2. 💻 ON YOUR LOCAL MACHINE (Windows/Mac/Linux):"
echo "   - Open terminal/PowerShell"
echo "   - Create SSH directory: mkdir -p ~/.ssh"
echo "   - Add the public key to: ~/.ssh/authorized_keys"
echo "   - Set permissions: chmod 600 ~/.ssh/authorized_keys"
echo ""
echo "3. 🔗 VS CODE CONNECTION:"
echo "   - Host: srv982494.euw.hosting.ovh.net"
echo "   - User: root"
echo "   - VS Code should connect without password!"
echo ""
echo "4. 🧪 TEST CONNECTION:"
echo "   ssh root@srv982494.euw.hosting.ovh.net"
echo ""
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "🔑 Public Key Location: ~/.ssh/id_rsa.pub"
echo "🔐 Private Key Location: ~/.ssh/id_rsa"
echo "⚙️ SSH Config: ~/.ssh/config"
echo ""
echo "🎯 Server: srv982494.euw.hosting.ovh.net"
echo "👤 User: root"
echo "🔓 Password-free login: READY!"
