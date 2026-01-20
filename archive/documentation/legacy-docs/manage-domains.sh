#!/bin/bash

echo "🌐 DOMAIN MANAGEMENT HELPER"
echo "=========================="
echo ""
echo "Available Commands:"
echo "1. List domains: virtualmin list-domains"
echo "2. Create domain: virtualmin create-domain --domain DOMAIN --user USER --pass PASSWORD"
echo "3. Delete domain: virtualmin delete-domain --domain DOMAIN"
echo "4. List SSL certs: virtualmin list-certs"
echo "5. Install SSL: virtualmin install-cert --domain DOMAIN --cert /path/to/cert.pem --key /path/to/key.pem"
echo ""
echo "Current domains managed by Virtualmin:"
if command -v virtualmin &> /dev/null; then
    virtualmin list-domains
else
    echo "Virtualmin not yet fully configured"
fi
