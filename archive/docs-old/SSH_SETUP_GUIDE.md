# 🔐 SSH Key Setup untuk VS Code Remote - Tanpa Password

## 📋 Public Key Anda:
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQClfRlvM9dPHOvdsKFLV9hfdPtwXutOJrruFuX8d20yDX57TI0hmECt6usK2YqaezwSAJF7QXFhTPthRBAAz8nfPZvhRRe2k4mUrFPN3eU1f4n84TCm2WI+SxF6Mq94oEeE75yU9j9YQO2jwM3F5OfvLNsmUvX/oPwwZlBIC5ybQTfQN5cGdZz1yElPCwN+Of25BVzCfASYFSoHCnh3zahUJ6n9ilaO8rUIXH2rceh97tzUS7ew0WOuKk3NvsI0jJV6/h8XlFidsutYGQv25hakyA2rW1MGgQK4ArcRrCarnUEgWay9bEsE5CX90UlWUJYzw29hsFCoY4KashL8OQfPcTiP25J5gL+jJ1IQyuLMz9B3lSXdAFFZmEHwWiZrEUHdIP/eNKi+wpbs4jtssOLYu4era7B7OwFLO6EjavhFroWGEu3i2D3fWjkZ0MnSNNf9kDOH/tjEXY0ek+1s83JwONr0OowYrCmAlX6eU3YOi4VzverDvspHAsiKkMAMJplXQxk1ziVTfE++hP+BU4ahOR2605iU5gjlg87yNorqhoNB84lP6kkKD2TXn5ph0EU1xPW59U87JkejuIUon6n2YIeRL9q1QDfIatMgv2lNdn/TAmu2nZX1cd0XQKXRda4SwbnlhzILiDKNe1JQtSnfFCT1T2M4exldlKoA4fd2HQ== root@srv982494.hstgr.cloud
```

## 🪟 Untuk Windows (PowerShell):

### 1. Buka PowerShell sebagai Administrator
```powershell
# Buat directory SSH
mkdir $HOME\.ssh -Force

# Buat file authorized_keys dan paste public key di atas
notepad $HOME\.ssh\authorized_keys
```

### 2. Paste public key dan save file
- Copy public key di atas
- Paste ke notepad
- Save dan close

### 3. Set permissions
```powershell
# Set file permissions
icacls $HOME\.ssh\authorized_keys /inheritance:r
icacls $HOME\.ssh\authorized_keys /grant:r $env:USERNAME:F
```

### 4. Buat SSH config
```powershell
# Edit SSH config
notepad $HOME\.ssh\config
```

Paste ini ke config file:
```
Host srv982494
    HostName srv982494.euw.hosting.ovh.net
    User root
    Port 22
    PubkeyAuthentication yes
    PasswordAuthentication yes
    PreferredAuthentications publickey,password
```

## 🐧 Untuk Linux/Mac (Terminal):

### 1. Setup SSH directory
```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
```

### 2. Add public key
```bash
# Buat file authorized_keys
nano ~/.ssh/authorized_keys
```

Paste public key di atas, save dan exit (Ctrl+X, Y, Enter)

### 3. Set permissions
```bash
chmod 600 ~/.ssh/authorized_keys
```

### 4. Create SSH config
```bash
nano ~/.ssh/config
```

Paste:
```
Host srv982494
    HostName srv982494.euw.hosting.ovh.net
    User root
    Port 22
    PubkeyAuthentication yes
    PasswordAuthentication yes
    PreferredAuthentications publickey,password
```

Set permissions:
```bash
chmod 600 ~/.ssh/config
```

## 🧪 Test Connection:

```bash
# Test SSH connection
ssh root@srv982494.euw.hosting.ovh.net
```

Atau dengan alias:
```bash
ssh srv982494
```

## 💻 VS Code Setup:

### 1. Install Extension
- Install "Remote - SSH" extension di VS Code

### 2. Connect to Host
- Press `Ctrl+Shift+P` (Windows) atau `Cmd+Shift+P` (Mac)
- Type: "Remote-SSH: Connect to Host"
- Select: `srv982494.euw.hosting.ovh.net` atau `srv982494`

### 3. VS Code akan connect tanpa password!

## 🚨 Troubleshooting:

### Jika masih diminta password:
```bash
# Regenerate SSH key di komputer lokal
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa

# Copy public key ke server
ssh-copy-id root@srv982494.euw.hosting.ovh.net
```

### Untuk debug connection:
```bash
ssh -v root@srv982494.euw.hosting.ovh.net
```

## ✅ Final Check:

Setelah setup selesai, VS Code Remote harus:
- ✅ Connect tanpa meminta password
- ✅ Load workspace langsung
- ✅ Terminal tersedia instant

**🎯 Server Details:**
- Host: `srv982494.euw.hosting.ovh.net`
- User: `root`
- Port: `22`
- Auth: SSH Key (no password required)
