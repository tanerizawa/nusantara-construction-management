#!/bin/bash
# 🍎 SSH Setup Script untuk Mac - Copy dan jalankan di Terminal Mac Anda

echo "🍎 SSH Key Setup untuk Mac - VS Code Remote Passwordless"
echo "=================================================="

echo ""
echo "📋 LANGKAH 1: Setup SSH Directory"
echo "Jalankan command berikut di Terminal Mac Anda:"
echo ""
echo "mkdir -p ~/.ssh"
echo "chmod 700 ~/.ssh"
echo ""

echo "📋 LANGKAH 2: Create Authorized Keys File"
echo "Jalankan command ini:"
echo ""
echo "cat > ~/.ssh/authorized_keys << 'EOF'"
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQClfRlvM9dPHOvdsKFLV9hfdPtwXutOJrruFuX8d20yDX57TI0hmECt6usK2YqaezwSAJF7QXFhTPthRBAAz8nfPZvhRRe2k4mUrFPN3eU1f4n84TCm2WI+SxF6Mq94oEeE75yU9j9YQO2jwM3F5OfvLNsmUvX/oPwwZlBIC5ybQTfQN5cGdZz1yElPCwN+Of25BVzCfASYFSoHCnh3zahUJ6n9ilaO8rUIXH2rceh97tzUS7ew0WOuKk3NvsI0jJV6/h8XlFidsutYGQv25hakyA2rW1MGgQK4ArcRrCarnUEgWay9bEsE5CX90UlWUJYzw29hsFCoY4KashL8OQfPcTiP25J5gL+jJ1IQyuLMz9B3lSXdAFFZmEHwWiZrEUHdIP/eNKi+wpbs4jtssOLYu4era7B7OwFLO6EjavhFroWGEu3i2D3fWjkZ0MnSNNf9kDOH/tjEXY0ek+1s83JwONr0OowYrCmAlX6eU3YOi4VzverDvspHAsiKkMAMJplXQxk1ziVTfE++hP+BU4ahOR2605iU5gjlg87yNorqhoNB84lP6kkKD2TXn5ph0EU1xPW59U87JkejuIUon6n2YIeRL9q1QDfIatMgv2lNdn/TAmu2nZX1cd0XQKXRda4SwbnlhzILiDKNe1JQtSnfFCT1T2M4exldlKoA4fd2HQ== root@srv982494.hstgr.cloud"
echo "EOF"
echo ""

echo "📋 LANGKAH 3: Set Permissions"
echo "chmod 600 ~/.ssh/authorized_keys"
echo ""

echo "📋 LANGKAH 4: Create SSH Config"
echo "cat > ~/.ssh/config << 'EOF'"
echo "Host srv982494"
echo "    HostName srv982494.euw.hosting.ovh.net"
echo "    User root"
echo "    Port 22"
echo "    PubkeyAuthentication yes"
echo "    PasswordAuthentication yes"
echo "    PreferredAuthentications publickey,password"
echo "EOF"
echo ""

echo "📋 LANGKAH 5: Set Config Permissions"
echo "chmod 600 ~/.ssh/config"
echo ""

echo "🧪 LANGKAH 6: Test Connection"
echo "ssh root@srv982494.euw.hosting.ovh.net"
echo ""
echo "Atau dengan alias:"
echo "ssh srv982494"
echo ""

echo "✅ Setelah test berhasil, buka VS Code dan connect ke Remote SSH!"
echo "🎯 Host: srv982494.euw.hosting.ovh.net"
echo ""
