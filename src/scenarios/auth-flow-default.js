/**
 * Default Authentication Flow Scenario
 * Extracted from the original NetworkCanvas hardcoded data
 */

import { createJwtToken, exchangeToken } from '../utils/jwtHelpers';

// Create initial tokens for each node
const nodeTokens = {
  browser: null, // Browser doesn't have a token initially
  okta: createJwtToken({
    issuer: 'okta',
    subject: 'user@example.com',
    audience: 'https://api.platform.com',
    resource: 'https://platform.com/resources',
    scopes: ['openid', 'profile', 'email'],
    expiresIn: '1h'
  }),
  idp2: createJwtToken({
    issuer: 'idp2',
    subject: 'user@example.com',
    audience: 'https://idp2.platform.com',
    resource: 'https://platform.com/idp2/resources',
    scopes: ['admin', 'read:all', 'write:all'],
    expiresIn: '2h'
  }),
  permissions: createJwtToken({
    issuer: 'permissions',
    subject: 'user@example.com',
    audience: 'https://permissions.platform.com',
    resource: 'https://platform.com/permissions',
    scopes: ['permissions:read', 'permissions:write', 'permissions:admin'],
    expiresIn: '30m'
  }),
  nextjs: createJwtToken({
    issuer: 'nextjs',
    subject: 'user@example.com',
    audience: 'https://nextjs.platform.com',
    resource: 'https://platform.com/app',
    scopes: ['app:access', 'api:call'],
    expiresIn: '4h'
  }),
  api1: createJwtToken({
    issuer: 'api1',
    subject: 'service-account-api1',
    audience: 'https://api1.platform.com',
    resource: 'https://platform.com/api/v1',
    scopes: ['api:read', 'api:write'],
    expiresIn: '1h'
  }),
  api2: createJwtToken({
    issuer: 'api2',
    subject: 'service-account-api2',
    audience: 'https://api2.platform.com',
    resource: 'https://platform.com/api/v2',
    scopes: ['api:read', 'api:write', 'db:access'],
    expiresIn: '1h'
  }),
  database: createJwtToken({
    issuer: 'database',
    subject: 'db-service',
    audience: 'https://db.platform.com',
    resource: 'https://platform.com/database',
    scopes: ['db:read', 'db:write', 'db:admin'],
    expiresIn: '30m'
  })
};

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
      token: nodeTokens.browser
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
      token: nodeTokens.okta
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
      token: nodeTokens.idp2
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
      token: nodeTokens.permissions
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
      token: nodeTokens.nextjs
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
      token: nodeTokens.api1
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
      token: nodeTokens.api2
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
      token: nodeTokens.database
    }
  ],

  connections: [
    { 
      from: 0, 
      to: 1,
      tokenExchange: {
        type: 'initial',
        description: 'Browser initiates OAuth flow with Okta',
        token: null // No token yet
      }
    },
    { 
      from: 1, 
      to: 2,
      tokenExchange: {
        type: 'federation',
        description: 'Okta federates to IdP2',
        token: exchangeToken(nodeTokens.okta, {
          issuer: 'okta',
          audience: 'idp2',
          exchangeType: 'federation'
        })
      }
    },
    { 
      from: 2, 
      to: 3,
      tokenExchange: {
        type: 'permission-check',
        description: 'IdP2 validates permissions',
        token: exchangeToken(nodeTokens.idp2, {
          issuer: 'idp2',
          audience: 'permissions',
          scopes: ['permissions:read', 'permissions:validate'],
          exchangeType: 'permission-validation'
        })
      }
    },
    { 
      from: 1, 
      to: 4,
      tokenExchange: {
        type: 'app-auth',
        description: 'Okta provides token to NextJS App',
        token: exchangeToken(nodeTokens.okta, {
          issuer: 'okta',
          audience: 'nextjs-app',
          resource: 'https://platform.com/app',
          scopes: ['app:access', 'api:call', 'user:profile'],
          exchangeType: 'app-authentication'
        })
      }
    },
    { 
      from: 4, 
      to: 5,
      tokenExchange: {
        type: 'api-call',
        description: 'NextJS App calls API 1',
        token: exchangeToken(nodeTokens.nextjs, {
          issuer: 'nextjs',
          audience: 'api1',
          resource: 'https://platform.com/api/v1',
          scopes: ['api:read', 'api:write'],
          exchangeType: 'service-to-service'
        })
      }
    },
    { 
      from: 5, 
      to: 6,
      tokenExchange: {
        type: 'api-chain',
        description: 'API 1 calls API 2',
        token: exchangeToken(nodeTokens.api1, {
          issuer: 'api1',
          audience: 'api2',
          resource: 'https://platform.com/api/v2',
          scopes: ['api:read', 'api:write', 'db:access'],
          exchangeType: 'api-chaining'
        })
      }
    },
    { 
      from: 6, 
      to: 7,
      tokenExchange: {
        type: 'db-access',
        description: 'API 2 accesses Database',
        token: exchangeToken(nodeTokens.api2, {
          issuer: 'api2',
          audience: 'database',
          resource: 'https://platform.com/database',
          scopes: ['db:read', 'db:write'],
          exchangeType: 'database-access'
        })
      }
    },
    { 
      from: 3, 
      to: 7,
      tokenExchange: {
        type: 'permission-enforcement',
        description: 'Permissions service enforces access to Database',
        token: exchangeToken(nodeTokens.permissions, {
          issuer: 'permissions',
          audience: 'database',
          resource: 'https://platform.com/database',
          scopes: ['db:admin', 'permissions:enforce'],
          exchangeType: 'permission-enforcement'
        })
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