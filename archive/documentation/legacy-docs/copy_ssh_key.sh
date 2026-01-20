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
