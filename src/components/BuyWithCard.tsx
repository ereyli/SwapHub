import React, { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { base } from 'wagmi/chains';

interface BuyWithCardProps {
  onSuccess?: () => void;
}

/**
 * BuyWithCard Component
 * 
 * Integrates Coinbase Onramp to allow users to buy USDC with fiat (card/bank)
 * Uses URL-based redirect flow (non-secure but simple)
 * 
 * For production, consider using session token API for better security
 * See: https://docs.cdp.coinbase.com/onramp-&-offramp/onramp-apis/generating-onramp-url
 */
const BuyWithCard: React.FC<BuyWithCardProps> = ({ onSuccess }) => {
  const { address, isConnected } = useAccount();
  const [isOpening, setIsOpening] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Check for onramp success on mount (when redirected back)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const onrampSuccess = urlParams.get('onramp') === 'success';
    
    if (onrampSuccess) {
      setShowSuccess(true);
      // Remove the parameter from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Show success message
      setTimeout(() => {
        setShowSuccess(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 5000);
    }
  }, [onSuccess]);

  const handleBuyWithCard = async () => {
    if (!address || !isConnected) {
      console.warn('⚠️ Wallet not connected');
      return;
    }

    setIsOpening(true);

    try {
      // Get session token from backend API
      const response = await fetch('/api/onramp-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create session token');
      }

      const { token: sessionToken } = await response.json();

      // Generate Coinbase Onramp URL with session token
      // URL format: https://pay.coinbase.com/buy?sessionToken=...&<params>
      // 
      // See: https://docs.cdp.coinbase.com/onramp-&-offramp/onramp-apis/generating-onramp-url
      const baseUrl = 'https://pay.coinbase.com/buy';
      
      // Build redirect URL with success parameter
      const redirectUrl = new URL(window.location.href);
      redirectUrl.searchParams.set('onramp', 'success');
      
      const params = new URLSearchParams({
        // Session token (required for secure initialization)
        sessionToken: sessionToken,
        // Default asset
        defaultAsset: 'USDC',
        // Default network (Base)
        defaultNetwork: 'base',
        // Redirect URL after successful purchase
        redirectUrl: redirectUrl.toString(),
        // Default experience: 'buy' (purchase with card/bank)
        defaultExperience: 'buy',
        // Optional: Preset fiat amount (remove to let user choose)
        // presetFiatAmount: '100',
        // fiatCurrency: 'USD',
      });

      const onrampUrl = `${baseUrl}?${params.toString()}`;
      
      console.log('🚀 Opening Coinbase Onramp:', onrampUrl);
      console.log('📍 Destination wallet:', address);
      console.log('🌐 Network: Base');
      console.log('💰 Asset: USDC');
      console.log('🔄 Redirect URL:', redirectUrl.toString());
      
      // Redirect to Coinbase Onramp
      // User will be redirected back to redirectUrl after purchase
      window.location.href = onrampUrl;
    } catch (error) {
      console.error('❌ Error creating session token:', error);
      alert(`Error: ${error.message}\n\nPlease ensure Coinbase API credentials are configured in Vercel environment variables.`);
      setIsOpening(false);
    }
  };

  if (!isConnected) {
    return null; // Don't show button if wallet not connected
  }

  return (
    <>
      {showSuccess && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px'
          }}
        >
          <span>✅</span>
          <div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>USDC cüzdanına ulaştı!</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>Takas edebilirsin.</div>
          </div>
        </div>
      )}
      <button
        onClick={handleBuyWithCard}
        disabled={isOpening}
        style={{
          padding: '12px 24px',
          backgroundColor: isOpening ? '#333' : '#6366f1',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: isOpening ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          opacity: isOpening ? 0.7 : 1,
          whiteSpace: 'nowrap'
        }}
        title="Kartla USDC al (Coinbase Onramp)"
      >
        {isOpening ? (
          <>
            <span>⏳</span>
            <span>Açılıyor...</span>
          </>
        ) : (
          <>
            <span>💳</span>
            <span>Kartla Al (USDC)</span>
          </>
        )}
      </button>
    </>
  );
};

export default BuyWithCard;

