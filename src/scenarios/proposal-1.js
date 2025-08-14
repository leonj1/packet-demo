/**
 * Proposal 1 Scenario
 * Complex authentication flow with Direct platform containing Umbrella and RE-Port App
 */

import { createJwtToken, exchangeToken } from '../utils/jwtHelpers';

// Create initial tokens for each node in the complex flow
const nodeTokens = {
  browser: null, // Browser doesn't have a token initially
  okta: createJwtToken({
    issuer: 'okta',
    subject: 'user@example.com',
    audience: 'https://platform.com',
    resource: 'https://platform.com/resources',
    scopes: ['openid', 'profile', 'email', 'federate'],
    expiresIn: '1h'
  }),
  'b-idp': createJwtToken({
    issuer: 'b-idp',
    subject: 'user@example.com',
    audience: 'https://b-idp.platform.com',
    resource: 'https://platform.com/b-idp/resources',
    scopes: ['b-idp:access', 'federate:idp', 'user:profile'],
    expiresIn: '2h'
  }),
  idp: createJwtToken({
    issuer: 'idp',
    subject: 'user@example.com',
    audience: 'https://idp.platform.com',
    resource: 'https://platform.com/idp/resources',
    scopes: ['idp:access', 'resource:all', 'api:invoke'],
    expiresIn: '2h'
  }),
  cognito: createJwtToken({
    issuer: 'cognito',
    subject: 'user@example.com',
    audience: 'https://cognito.aws.amazon.com',
    resource: 'https://platform.com/aws/resources',
    scopes: ['aws:access', 'cognito:user', 'lambda:invoke'],
    expiresIn: '1h'
  }),
  umbrella: createJwtToken({
    issuer: 'umbrella',
    subject: 'gateway-service',
    audience: 'https://umbrella.direct.com',
    resource: 'https://direct.platform.com/gateway',
    scopes: ['gateway:route', 'service:discover', 'auth:validate'],
    expiresIn: '1h'
  }),
  're-port-app': createJwtToken({
    issuer: 're-port-app',
    subject: 'app-service',
    audience: 'https://report.direct.com',
    resource: 'https://direct.platform.com/app',
    scopes: ['app:access', 'report:generate', 'data:read'],
    expiresIn: '4h'
  }),
  're-port-api': createJwtToken({
    issuer: 're-port-api',
    subject: 'api-service',
    audience: 'https://api.report.direct.com',
    resource: 'https://direct.platform.com/api',
    scopes: ['api:read', 'api:write', 'report:api'],
    expiresIn: '1h'
  }),
  'b-api': createJwtToken({
    issuer: 'b-api',
    subject: 'b-api-service',
    audience: 'https://b-api.platform.com',
    resource: 'https://platform.com/b-api',
    scopes: ['b-api:access', 'data:process', 'integration:external'],
    expiresIn: '1h'
  }),
  permissions: createJwtToken({
    issuer: 'permissions',
    subject: 'permission-service',
    audience: 'https://permissions.platform.com',
    resource: 'https://platform.com/permissions',
    scopes: ['permissions:check', 'permissions:grant', 'audit:log'],
    expiresIn: '30m'
  })
};

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
      token: nodeTokens.browser
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
      token: nodeTokens.okta
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
      token: nodeTokens['b-idp']
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
      token: nodeTokens.idp
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
      token: nodeTokens.cognito
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
      token: nodeTokens.umbrella
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
      token: nodeTokens['re-port-app']
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
      token: nodeTokens['re-port-api']
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
      token: nodeTokens['b-api']
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
      token: nodeTokens.permissions
    }
  ],

  connections: [
    { 
      from: 0, 
      to: 5,
      tokenExchange: {
        type: 'initial-access',
        description: 'Browser accesses Umbrella gateway',
        token: null
      }
    },
    { 
      from: 5, 
      to: 0,
      tokenExchange: {
        type: 'redirect',
        description: 'Umbrella redirects to authentication',
        token: createJwtToken({
          issuer: 'umbrella',
          subject: 'redirect',
          audience: 'browser',
          scopes: ['auth:required'],
          expiresIn: '5m'
        })
      }
    },
    { 
      from: 0, 
      to: 1,
      tokenExchange: {
        type: 'auth-initiate',
        description: 'Browser initiates Okta authentication',
        token: null
      }
    },
    { 
      from: 1, 
      to: 9,
      tokenExchange: {
        type: 'permission-check',
        description: 'Okta checks user permissions',
        token: exchangeToken(nodeTokens.okta, {
          issuer: 'okta',
          audience: 'permissions',
          scopes: ['permissions:check', 'user:validate'],
          exchangeType: 'permission-validation'
        })
      }
    },
    { 
      from: 9, 
      to: 1,
      tokenExchange: {
        type: 'permission-response',
        description: 'Permissions service responds to Okta',
        token: exchangeToken(nodeTokens.permissions, {
          issuer: 'permissions',
          audience: 'okta',
          scopes: ['permissions:granted', 'user:authorized'],
          exchangeType: 'permission-grant',
          additionalClaims: { permissions: ['read', 'write', 'admin'] }
        })
      }
    },
    { 
      from: 1, 
      to: 0,
      tokenExchange: {
        type: 'auth-complete',
        description: 'Okta returns auth token to Browser',
        token: exchangeToken(nodeTokens.okta, {
          issuer: 'okta',
          audience: 'browser',
          resource: 'https://platform.com',
          scopes: ['authenticated', 'umbrella:access'],
          exchangeType: 'auth-token'
        })
      }
    },
    { 
      from: 0, 
      to: 5,
      tokenExchange: {
        type: 'authenticated-access',
        description: 'Browser accesses Umbrella with token',
        token: exchangeToken(nodeTokens.okta, {
          issuer: 'okta',
          audience: 'umbrella',
          scopes: ['umbrella:access', 'direct:platform'],
          exchangeType: 'authenticated-request'
        })
      }
    },
    { 
      from: 5, 
      to: 6,
      tokenExchange: {
        type: 'app-routing',
        description: 'Umbrella routes to RE-Port App',
        token: exchangeToken(nodeTokens.umbrella, {
          issuer: 'umbrella',
          audience: 're-port-app',
          resource: 'https://direct.platform.com/app',
          scopes: ['app:access', 'report:generate'],
          exchangeType: 'service-routing'
        })
      }
    },
    { 
      from: 6, 
      to: 3,
      tokenExchange: {
        type: 'idp-auth',
        description: 'RE-Port App authenticates with Idp',
        token: exchangeToken(nodeTokens['re-port-app'], {
          issuer: 're-port-app',
          audience: 'idp',
          scopes: ['idp:access', 'resource:request'],
          exchangeType: 'idp-authentication'
        })
      }
    },
    { 
      from: 3, 
      to: 6,
      tokenExchange: {
        type: 'idp-token',
        description: 'Idp provides token to RE-Port App',
        token: exchangeToken(nodeTokens.idp, {
          issuer: 'idp',
          audience: 're-port-app',
          resource: 'https://platform.com/idp/resources',
          scopes: ['resource:granted', 'api:access'],
          exchangeType: 'idp-grant'
        })
      }
    },
    { 
      from: 6, 
      to: 7,
      tokenExchange: {
        type: 'api-call',
        description: 'RE-Port App calls RE-Port API',
        token: exchangeToken(nodeTokens['re-port-app'], {
          issuer: 're-port-app',
          audience: 're-port-api',
          resource: 'https://direct.platform.com/api',
          scopes: ['api:invoke', 'report:data'],
          exchangeType: 'api-request'
        })
      }
    },
    { 
      from: 7, 
      to: 3,
      tokenExchange: {
        type: 'api-idp-auth',
        description: 'RE-Port API validates with Idp',
        token: exchangeToken(nodeTokens['re-port-api'], {
          issuer: 're-port-api',
          audience: 'idp',
          scopes: ['idp:validate', 'api:authorize'],
          exchangeType: 'api-validation'
        })
      }
    },
    { 
      from: 3, 
      to: 7,
      tokenExchange: {
        type: 'api-authorization',
        description: 'Idp authorizes RE-Port API',
        token: exchangeToken(nodeTokens.idp, {
          issuer: 'idp',
          audience: 're-port-api',
          scopes: ['api:authorized', 'data:access'],
          exchangeType: 'api-grant'
        })
      }
    },
    { 
      from: 7, 
      to: 6,
      tokenExchange: {
        type: 'api-response',
        description: 'RE-Port API returns data to App',
        token: exchangeToken(nodeTokens['re-port-api'], {
          issuer: 're-port-api',
          audience: 're-port-app',
          scopes: ['data:response', 'report:complete'],
          exchangeType: 'api-response',
          additionalClaims: { data: 'report-data' }
        })
      }
    },
    { 
      from: 6, 
      to: 5,
      tokenExchange: {
        type: 'app-response',
        description: 'RE-Port App returns to Umbrella',
        token: exchangeToken(nodeTokens['re-port-app'], {
          issuer: 're-port-app',
          audience: 'umbrella',
          scopes: ['response:complete', 'session:maintain'],
          exchangeType: 'app-response'
        })
      }
    },
    { 
      from: 5, 
      to: 0,
      tokenExchange: {
        type: 'final-response',
        description: 'Umbrella returns response to Browser',
        token: exchangeToken(nodeTokens.umbrella, {
          issuer: 'umbrella',
          audience: 'browser',
          scopes: ['response:final', 'session:complete'],
          exchangeType: 'gateway-response',
          additionalClaims: { status: 'success' }
        })
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