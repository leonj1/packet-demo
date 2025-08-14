/**
 * Default Authentication Flow Scenario
 * Standard OAuth/OIDC authentication flow through Okta with API access
 * 
 * Flow Description:
 * 1. Browser starts with no token
 * 2. Browser authenticates with Okta and receives JWT
 * 3. Okta federates to IdP2 for additional claims
 * 4. IdP2 checks permissions
 * 5. NextJS App receives token and makes API calls
 * 6. APIs validate tokens and access resources
 */

import { createAuthToken, exchangeToken } from '../utils/jwtHelpers';

export default {
  id: 'auth-flow-default',
  name: 'Authentication Flow (Default)',
  description: 'Standard OAuth/OIDC authentication flow through Okta with API access',
  
  nodes: [
    { 
      id: 'browser', 
      name: 'Browser', 
      x: 150, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Globe', 
      color: '#00d4ff',
      token: null // Browser starts with no token
    },
    { 
      id: 'okta', 
      name: 'Okta', 
      x: 350, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#b300ff',
      token: null // Okta is an IdP - issues tokens
    },
    { 
      id: 'idp2', 
      name: 'IdP2', 
      x: 550, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#ff00ff',
      token: null // IdP2 is an identity provider
    },
    { 
      id: 'permissions', 
      name: 'Permissions', 
      x: 750, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#00ff88',
      token: null // Permissions service validates permissions
    },
    { 
      id: 'nextjs', 
      name: 'NextJS App', 
      x: 350, 
      y: 300, 
      width: 120, 
      height: 60, 
      icon: 'Server', 
      color: '#00d4ff',
      token: null // NextJS App receives tokens from requests
    },
    { 
      id: 'api1', 
      name: 'API 1', 
      x: 550, 
      y: 400, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#ff6600',
      token: null // API 1 receives tokens from requests
    },
    { 
      id: 'api2', 
      name: 'API 2', 
      x: 750, 
      y: 400, 
      width: 120, 
      height: 60, 
      icon: 'Cloud', 
      color: '#ffff00',
      token: null // API 2 receives tokens from requests
    },
    { 
      id: 'database', 
      name: 'Database', 
      x: 950, 
      y: 300, 
      width: 120, 
      height: 60, 
      icon: 'Database', 
      color: '#00ff88',
      token: null // Database receives tokens from services
    }
  ],

  connections: [
    { 
      from: 0, 
      to: 1,
      tokenExchange: {
        type: 'auth-request',
        description: 'Browser initiates OAuth flow with Okta',
        token: null // No token yet - sending credentials
      }
    },
    { 
      from: 1, 
      to: 2,
      tokenExchange: {
        type: 'federation',
        description: 'Okta federates to IdP2 for additional claims',
        token: null // Internal federation - no packet token
      }
    },
    { 
      from: 2, 
      to: 3,
      tokenExchange: {
        type: 'permission-check',
        description: 'IdP2 validates permissions',
        token: null // Internal check - no packet token
      }
    },
    { 
      from: 1, 
      to: 4,
      tokenExchange: {
        type: 'auth-response',
        description: 'Okta provides token to NextJS App',
        token: createAuthToken(
          'okta',
          'user@example.com',
          'nextjs-app',
          ['app:access', 'api:call', 'user:profile']
        )
      }
    },
    { 
      from: 4, 
      to: 5,
      tokenExchange: {
        type: 'api-call',
        description: 'NextJS App calls API 1 with Okta token',
        token: createAuthToken(
          'okta',
          'user@example.com',
          'api1',
          ['api:read', 'api:write']
        )
      }
    },
    { 
      from: 5, 
      to: 6,
      tokenExchange: {
        type: 'api-chain',
        description: 'API 1 calls API 2 with service token',
        token: exchangeToken(
          createAuthToken('okta', 'user@example.com', 'api1', []),
          {
            issuer: 'api1',
            audience: 'api2',
            resource: 'https://platform.com/api/v2',
            scopes: ['api:read', 'api:write', 'db:access'],
            exchangeType: 'service-to-service'
          }
        )
      }
    },
    { 
      from: 6, 
      to: 7,
      tokenExchange: {
        type: 'db-access',
        description: 'API 2 accesses Database with DB token',
        token: exchangeToken(
          createAuthToken('api1', 'service', 'api2', []),
          {
            issuer: 'api2',
            audience: 'database',
            resource: 'https://platform.com/database',
            scopes: ['db:read', 'db:write'],
            exchangeType: 'database-access'
          }
        )
      }
    },
    { 
      from: 3, 
      to: 7,
      tokenExchange: {
        type: 'permission-enforcement',
        description: 'Permissions service enforces access to Database',
        token: exchangeToken(
          createAuthToken('okta', 'user@example.com', 'permissions', []),
          {
            issuer: 'permissions',
            audience: 'database',
            resource: 'https://platform.com/database',
            scopes: ['db:admin', 'permissions:enforce'],
            exchangeType: 'permission-enforcement'
          }
        )
      }
    }
  ],

  platformBoxes: [
    {
      id: 'platform1',
      name: 'Platform1',
      x: 330,
      y: 280,
      width: 260,
      height: 140,
      color: '#00d4ff',
      opacity: 0.3
    }
  ]
}