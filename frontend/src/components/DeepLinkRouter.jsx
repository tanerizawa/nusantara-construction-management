/**
 * Deep Link Router Component
 * Handles deep link navigation and authentication
 */

import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registerDeepLinkListener, handlePostLoginRedirect } from '../utils/deepLinkHandler';

const DeepLinkRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('🔗 DeepLinkRouter mounted');

    // Check for post-login redirect
    if (location.pathname === '/dashboard' || location.pathname === '/') {
      const redirected = handlePostLoginRedirect(navigate);
      if (redirected) {
        console.log('✅ Post-login redirect handled');
      }
    }

    // Register deep link listener
    const cleanup = registerDeepLinkListener(navigate);

    // Check for deep link in URL params (for web-based deep links)
    const urlParams = new URLSearchParams(window.location.search);
    const deepLink = urlParams.get('deeplink');
    
    if (deepLink) {
      console.log('🌐 Deep link from URL param:', deepLink);
      
      // Remove deeplink param from URL
      urlParams.delete('deeplink');
      const newSearch = urlParams.toString();
      const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '');
      window.history.replaceState({}, '', newUrl);

      // Trigger deep link handler
      window.dispatchEvent(new CustomEvent('nusantara-deep-link', {
        detail: { url: deepLink }
      }));
    }

    // Cleanup on unmount
    return cleanup;
  }, [navigate, location.pathname]);

  // This component doesn't render anything
  return null;
};

export default DeepLinkRouter;
