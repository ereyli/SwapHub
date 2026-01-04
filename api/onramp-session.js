/**
 * Vercel Serverless Function for Coinbase Onramp Session Token
 * 
 * This endpoint creates a session token for Coinbase Onramp.
 * Requires CDP API credentials in environment variables.
 * 
 * Environment Variables Required:
 * - COINBASE_API_KEY_NAME: Your CDP API Key Name (format: organizations/{org_id}/apiKeys/{key_id})
 * - COINBASE_API_KEY_PRIVATE_KEY: Your CDP API Key Private Key (PEM format)
 * 
 * See: https://docs.cdp.coinbase.com/onramp-&-offramp/session-token-authentication
 * 
 * NOTE: This is a simplified implementation. For production, consider using
 * the @coinbase/cdp-sdk package which handles JWT generation automatically.
 */

import jsonwebtoken from 'jsonwebtoken';

/**
 * Generate JWT for Coinbase Developer Platform API
 * Uses ES256 algorithm (ECDSA with P-256 curve)
 */
function generateJWT(keyName, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: keyName,
    iss: 'coinbase-cloud',
    nbf: now,
    exp: now + 120, // 2 minutes
    aud: 'https://api.developer.coinbase.com'
  };

  // ES256 algorithm requires elliptic curve private key
  return jsonwebtoken.sign(payload, privateKey, {
    algorithm: 'ES256'
  });
}

/**
 * Create session token from Coinbase Onramp API
 * @param {string} jwt - JWT token
 * @param {string} address - User wallet address
 * @param {string} clientIp - Client IP address
 * @returns {Promise<string>} Session token
 */
async function createSessionToken(jwt, address, clientIp) {
  const response = await fetch('https://api.developer.coinbase.com/onramp/v1/token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${jwt}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      addresses: [{
        address: address,
        blockchains: ['base']
      }],
      assets: ['USDC'],
      clientIp: clientIp
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Coinbase API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.token;
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    // Get API credentials from environment variables
    const apiKeyName = process.env.COINBASE_API_KEY_NAME;
    const apiKeyPrivateKey = process.env.COINBASE_API_KEY_PRIVATE_KEY;

    if (!apiKeyName || !apiKeyPrivateKey) {
      console.error('Missing Coinbase API credentials');
      return res.status(500).json({ 
        error: 'Server configuration error: Coinbase API credentials not configured',
        hint: 'Please set COINBASE_API_KEY_NAME and COINBASE_API_KEY_PRIVATE_KEY environment variables'
      });
    }

    // Get client IP from request
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.connection?.remoteAddress || 
                     '127.0.0.1';

    // Generate JWT
    const privateKey = apiKeyPrivateKey.replace(/\\n/g, '\n');
    const jwtToken = generateJWT(apiKeyName, privateKey);

    // Create session token
    const sessionToken = await createSessionToken(jwtToken, address, clientIp);

    return res.status(200).json({ 
      token: sessionToken 
    });

  } catch (error) {
    console.error('Error creating session token:', error);
    return res.status(500).json({ 
      error: 'Failed to create session token',
      message: error.message 
    });
  }
}

