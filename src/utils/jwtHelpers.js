/**
 * JWT Token Helper Utilities
 * Provides functions for handling JWT tokens in the authentication flow
 */

/**
 * Creates a JWT token object with standard claims
 * @param {Object} config - Token configuration
 * @returns {Object} JWT token object
 */
export const createJwtToken = ({
  issuer = 'unknown',
  subject = 'unknown',
  audience = 'unknown',
  resource = 'unknown',
  scopes = [],
  expiresIn = '1h',
  additionalClaims = {}
}) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + parseExpiration(expiresIn);
  
  return {
    header: {
      alg: 'RS256',
      typ: 'JWT',
      kid: generateKid()
    },
    payload: {
      iss: issuer,
      sub: subject,
      aud: audience,
      resource,
      scopes,
      iat: now,
      exp,
      jti: generateJti(),
      ...additionalClaims
    },
    signature: 'mock-signature'
  };
};

/**
 * Exchange one JWT token for another (simulates token exchange)
 * @param {Object} sourceToken - The source JWT token
 * @param {Object} exchangeConfig - Configuration for the new token
 * @returns {Object} New JWT token
 */
export const exchangeToken = (sourceToken, exchangeConfig) => {
  const { payload } = sourceToken;
  
  return createJwtToken({
    issuer: exchangeConfig.issuer || payload.iss,
    subject: payload.sub,
    audience: exchangeConfig.audience || payload.aud,
    resource: exchangeConfig.resource || payload.resource,
    scopes: exchangeConfig.scopes || payload.scopes,
    expiresIn: exchangeConfig.expiresIn || '1h',
    additionalClaims: {
      ...payload,
      original_iss: payload.iss,
      exchange_type: exchangeConfig.exchangeType || 'token-exchange',
      ...exchangeConfig.additionalClaims
    }
  });
};

/**
 * Format JWT token for display
 * @param {Object} token - JWT token object
 * @returns {Object} Formatted token for display
 */
export const formatTokenForDisplay = (token) => {
  if (!token || !token.payload) {
    return {
      issuer: 'N/A',
      subject: 'N/A',
      audience: 'N/A',
      resource: 'N/A',
      scopes: [],
      expiresAt: 'N/A'
    };
  }
  
  const { payload } = token;
  
  return {
    issuer: payload.iss || 'N/A',
    subject: payload.sub || 'N/A',
    audience: Array.isArray(payload.aud) ? payload.aud.join(', ') : (payload.aud || 'N/A'),
    resource: payload.resource || 'N/A',
    scopes: payload.scopes || [],
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toLocaleTimeString() : 'N/A',
    issuedAt: payload.iat ? new Date(payload.iat * 1000).toLocaleTimeString() : 'N/A',
    jti: payload.jti || 'N/A'
  };
};

/**
 * Validate if a token is expired
 * @param {Object} token - JWT token object
 * @returns {boolean} True if token is expired
 */
export const isTokenExpired = (token) => {
  if (!token || !token.payload || !token.payload.exp) {
    return true;
  }
  
  const now = Math.floor(Date.now() / 1000);
  return now > token.payload.exp;
};

/**
 * Get token color based on issuer or type
 * @param {Object} token - JWT token object
 * @returns {string} Color hex code
 */
export const getTokenColor = (token) => {
  if (!token || !token.payload) {
    return '#666666';
  }
  
  const issuer = token.payload.iss;
  
  const colorMap = {
    'okta': '#b300ff',
    'b-idp': '#ff00ff',
    'idp': '#00ff88',
    'cognito': '#ff6600',
    'auth-service': '#ff00ff',
    'api-gateway': '#00d4ff',
    'internal': '#ffff00'
  };
  
  return colorMap[issuer?.toLowerCase()] || '#00d4ff';
};

/**
 * Parse expiration string to seconds
 * @param {string} expiration - Expiration string (e.g., '1h', '30m', '7d')
 * @returns {number} Seconds until expiration
 */
const parseExpiration = (expiration) => {
  const match = expiration.match(/^(\d+)([smhd])$/);
  if (!match) return 3600; // Default 1 hour
  
  const [, num, unit] = match;
  const value = parseInt(num, 10);
  
  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 3600;
    case 'd': return value * 86400;
    default: return 3600;
  }
};

/**
 * Generate a random Key ID
 * @returns {string} Random kid
 */
const generateKid = () => {
  return `kid-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a random JWT ID
 * @returns {string} Random jti
 */
const generateJti = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create a display-friendly token summary
 * @param {Object} token - JWT token object
 * @returns {string} Token summary string
 */
export const getTokenSummary = (token) => {
  if (!token || !token.payload) {
    return 'No Token';
  }
  
  const { iss, aud, scopes = [] } = token.payload;
  const scopeStr = scopes.length > 0 ? scopes.slice(0, 2).join(', ') : 'none';
  
  return `${iss} → ${aud} [${scopeStr}]`;
};

/**
 * Create a validation request token
 * @param {Object} token - Token to validate
 * @param {string} validator - Service that will validate
 * @returns {Object} Validation request token
 */
export const createValidationToken = (token, validator) => {
  if (!token) return null;
  
  return createJwtToken({
    issuer: validator,
    subject: 'validation-request',
    audience: token.payload.iss,
    resource: 'validation',
    scopes: ['token:validate'],
    expiresIn: '5m',
    additionalClaims: {
      token_to_validate: token.payload.jti,
      validation_type: 'introspection'
    }
  });
};

/**
 * Create an authentication token from credentials
 * @param {string} issuer - Token issuer (IdP)
 * @param {string} subject - User or service
 * @param {string} audience - Intended audience
 * @param {Array} scopes - Granted scopes
 * @returns {Object} New authentication token
 */
export const createAuthToken = (issuer, subject, audience, scopes = []) => {
  return createJwtToken({
    issuer,
    subject,
    audience,
    resource: `https://${audience}`,
    scopes,
    expiresIn: '1h',
    additionalClaims: {
      auth_time: Math.floor(Date.now() / 1000),
      auth_method: 'credentials'
    }
  });
};

export default {
  createJwtToken,
  exchangeToken,
  formatTokenForDisplay,
  isTokenExpired,
  getTokenColor,
  getTokenSummary,
  createValidationToken,
  createAuthToken
};