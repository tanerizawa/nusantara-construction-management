// Development Mode WebSocket Configuration
(function() {
    'use strict';
    
    // Only run in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🛠️ Development mode detected - WebSocket Hot Reload enabled');
        // Let webpack handle hot reload normally in development
        return;
    }
    
    // For production domain access during development
    if (window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
        console.log('🌐 Production domain detected - Configuring for development access');
        
        // Override WebSocket to use local development server
        if (typeof window !== 'undefined' && window.WebSocket) {
            const originalWebSocket = window.WebSocket;
            window.WebSocket = function(url, protocols) {
                // Redirect WebSocket connections to local development server
                if (url.includes('ws://') || url.includes('wss://')) {
                    const localUrl = url.replace(/wss?:\/\/[^\/]+/, 'ws://localhost:3000');
                    console.log('🔄 Redirecting WebSocket to local dev server:', localUrl);
                    try {
                        return new originalWebSocket(localUrl, protocols);
                    } catch (error) {
                        console.log('⚠️ Cannot connect to local dev server, disabling WebSocket');
                        return {
                            close: () => {},
                            send: () => {},
                            addEventListener: () => {},
                            removeEventListener: () => {}
                        };
                    }
                }
                return new originalWebSocket(url, protocols);
            };
        }
    }
})();
