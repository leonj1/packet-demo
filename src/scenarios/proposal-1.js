/**
 * Proposal 1 Scenario
 * Complex authentication flow with Direct platform containing Umbrella and RE-Port App
 * 
 * Flow Description:
 * 1. Browser attempts to access Umbrella without token - gets redirected
 * 2. Browser authenticates with Okta and receives Okta JWT
 * 3. Browser returns to Umbrella with Okta token
 * 4. Umbrella validates token with Okta
 * 5. RE-Port App accepts Okta token but needs IdP token for RE-Port API
 * 6. RE-Port App exchanges Okta token for IdP token
 * 7. RE-Port API validates IdP token and processes request
 */

import { createAuthToken, exchangeToken, createValidationToken } from '../utils/jwtHelpers';

export default {
  id: 'proposal-1',
  name: 'Proposal 1',
  description: 'Multi-step authentication flow through Direct platform with Umbrella gateway and RE-Port services',
  
  nodes: [
    { 
      id: 'browser', 
      name: 'Browser', 
      x: 100, 
      y: 250, 
      width: 120, 
      height: 60, 
      icon: 'Globe', 
      color: '#00d4ff',
      token: null // Browser starts with no token
    },
    { 
      id: 'okta', 
      name: 'Okta', 
      x: 300, 
      y: 150, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#b300ff',
      token: null // Okta is an IdP - it issues tokens, doesn't have them
    },
    { 
      id: 'b-idp', 
      name: 'B-Idp', 
      x: 500, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#ff00ff',
      token: null // B-IdP is an IdP - it issues tokens
    },
    { 
      id: 'idp', 
      name: 'Idp', 
      x: 700, 
      y: 150, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#00ff88',
      token: null // IdP is an identity provider - it issues tokens
    },
    { 
      id: 'cognito', 
      name: 'Cognito', 
      x: 900, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Cloud', 
      color: '#ff6600',
      token: null // Cognito is an IdP - it issues tokens
    },
    { 
      id: 'umbrella', 
      name: 'Umbrella', 
      x: 300, 
      y: 350, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#00d4ff',
      token: null // Umbrella is a gateway - it validates tokens
    },
    { 
      id: 're-port-app', 
      name: 'RE-Port App', 
      x: 500, 
      y: 350, 
      width: 120, 
      height: 60, 
      icon: 'Server', 
      color: '#00ff88',
      token: null // RE-Port App receives tokens from requests
    },
    { 
      id: 're-port-api', 
      name: 'RE-Port API', 
      x: 700, 
      y: 400, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#ffff00',
      token: null // RE-Port API receives tokens from requests
    },
    { 
      id: 'b-api', 
      name: 'B-API', 
      x: 900, 
      y: 350, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#b300ff',
      token: null // B-API receives tokens from requests
    },
    { 
      id: 'permissions', 
      name: 'Permissions', 
      x: 100, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#ff00ff',
      token: null // Permissions service validates and checks permissions
    }
  ],

  connections: [
    { 
      from: 0, 
      to: 5,
      tokenExchange: {
        type: 'initial-access',
        description: 'Browser attempts to access Umbrella without token',
        token: null // No token yet
      }
    },
    { 
      from: 5, 
      to: 0,
      tokenExchange: {
        type: 'auth-redirect',
        description: 'Umbrella redirects browser to authenticate',
        token: null // Still no token, just redirect instruction
      }
    },
    { 
      from: 0, 
      to: 1,
      tokenExchange: {
        type: 'auth-request',
        description: 'Browser sends credentials to Okta',
        token: null // Credentials sent, no token yet
      }
    },
    { 
      from: 1, 
      to: 9,
      tokenExchange: {
        type: 'permission-check',
        description: 'Okta checks user permissions',
        token: null // Internal check, no token for this
      }
    },
    { 
      from: 9, 
      to: 1,
      tokenExchange: {
        type: 'permission-response',
        description: 'Permissions confirmed to Okta',
        token: null // Internal response, no token
      }
    },
    { 
      from: 1, 
      to: 0,
      tokenExchange: {
        type: 'auth-response',
        description: 'Okta issues JWT token to Browser',
        token: createAuthToken(
          'okta',
          'user@example.com',
          'platform.com',
          ['openid', 'profile', 'email', 'platform:access']
        )
      }
    },
    { 
      from: 0, 
      to: 5,
      tokenExchange: {
        type: 'authenticated-access',
        description: 'Browser accesses Umbrella with Okta token',
        token: createAuthToken(
          'okta',
          'user@example.com',
          'platform.com',
          ['openid', 'profile', 'email', 'platform:access']
        )
      }
    },
    { 
      from: 5, 
      to: 6,
      tokenExchange: {
        type: 'forward-request',
        description: 'Umbrella forwards request to RE-Port App with Okta token',
        token: createAuthToken(
          'okta',
          'user@example.com',
          'platform.com',
          ['openid', 'profile', 'email', 'platform:access']
        )
      }
    },
    { 
      from: 6, 
      to: 3,
      tokenExchange: {
        type: 'token-exchange-request',
        description: 'RE-Port App requests token exchange from IdP (Okta → IdP)',
        token: createAuthToken(
          'okta',
          'user@example.com',
          'platform.com',
          ['openid', 'profile', 'email', 'platform:access']
        )
      }
    },
    { 
      from: 3, 
      to: 6,
      tokenExchange: {
        type: 'token-exchange-response',
        description: 'IdP issues new token for RE-Port API access',
        token: createAuthToken(
          'idp',
          'user@example.com',
          're-port-api',
          ['re-port-api:read', 're-port-api:write']
        )
      }
    },
    { 
      from: 6, 
      to: 7,
      tokenExchange: {
        type: 'api-call',
        description: 'RE-Port App calls RE-Port API with IdP token',
        token: createAuthToken(
          'idp',
          'user@example.com',
          're-port-api',
          ['re-port-api:read', 're-port-api:write']
        )
      }
    },
    { 
      from: 7, 
      to: 3,
      tokenExchange: {
        type: 'token-validation',
        description: 'RE-Port API validates token with IdP',
        token: createAuthToken(
          'idp',
          'user@example.com',
          're-port-api',
          ['re-port-api:read', 're-port-api:write']
        )
      }
    },
    { 
      from: 3, 
      to: 7,
      tokenExchange: {
        type: 'validation-response',
        description: 'IdP confirms token is valid',
        token: createAuthToken(
          'idp',
          'user@example.com',
          're-port-api',
          ['re-port-api:read', 're-port-api:write']
        )
      }
    },
    { 
      from: 7, 
      to: 6,
      tokenExchange: {
        type: 'api-response',
        description: 'RE-Port API returns data to RE-Port App',
        token: createAuthToken(
          'idp',
          'user@example.com',
          're-port-api',
          ['re-port-api:read', 're-port-api:write']
        )
      }
    },
    { 
      from: 6, 
      to: 5,
      tokenExchange: {
        type: 'app-response',
        description: 'RE-Port App returns to Umbrella with Okta token',
        token: createAuthToken(
          'okta',
          'user@example.com',
          'platform.com',
          ['openid', 'profile', 'email', 'platform:access']
        )
      }
    },
    { 
      from: 5, 
      to: 0,
      tokenExchange: {
        type: 'final-response',
        description: 'Umbrella returns response to Browser with Okta token',
        token: createAuthToken(
          'okta',
          'user@example.com',
          'platform.com',
          ['openid', 'profile', 'email', 'platform:access', 'request:complete']
        )
      }
    }
  ],

  platformBoxes: [
    {
      id: 'direct-platform',
      name: 'Direct',
      x: 280,
      y: 320,
      width: 360,
      height: 110,
      color: '#00d4ff',
      opacity: 0.3
    },
    {
      id: 'authentication-platform',
      name: 'Authentication',
      x: 280,
      y: 70,
      width: 760,
      height: 120,
      color: '#b300ff',
      opacity: 0.3
    },
    {
      id: 'authorization-platform',
      name: 'Authorization',
      x: 70,
      y: 70,
      width: 180,
      height: 120,
      color: '#00ff88',
      opacity: 0.3
    }
  ]
}