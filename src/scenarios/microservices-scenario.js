/**
 * Microservices Authentication Scenario
 * Demonstrates service-to-service authentication in microservices architecture
 */

import { createJwtToken, exchangeToken } from '../utils/jwtHelpers';

// Create initial tokens for each microservice
const nodeTokens = {
  mobile: null, // Mobile app doesn't have a token initially
  ingress: createJwtToken({
    issuer: 'api-gateway',
    subject: 'gateway-service',
    audience: 'https://microservices.platform.com',
    resource: 'https://platform.com/api',
    scopes: ['gateway:route', 'service:discover'],
    expiresIn: '1h'
  }),
  'auth-service': createJwtToken({
    issuer: 'auth-service',
    subject: 'auth-service-account',
    audience: 'https://auth.microservices.com',
    resource: 'https://platform.com/auth',
    scopes: ['auth:validate', 'token:issue', 'token:refresh'],
    expiresIn: '2h'
  }),
  'user-service': createJwtToken({
    issuer: 'auth-service',
    subject: 'user-service-account',
    audience: 'https://users.microservices.com',
    resource: 'https://platform.com/users',
    scopes: ['user:read', 'user:write', 'profile:manage'],
    expiresIn: '1h'
  }),
  'order-service': createJwtToken({
    issuer: 'auth-service',
    subject: 'order-service-account',
    audience: 'https://orders.microservices.com',
    resource: 'https://platform.com/orders',
    scopes: ['order:create', 'order:read', 'order:update'],
    expiresIn: '1h'
  }),
  'payment-service': createJwtToken({
    issuer: 'auth-service',
    subject: 'payment-service-account',
    audience: 'https://payments.microservices.com',
    resource: 'https://platform.com/payments',
    scopes: ['payment:process', 'payment:refund', 'payment:read'],
    expiresIn: '30m'
  }),
  'notification-service': createJwtToken({
    issuer: 'auth-service',
    subject: 'notification-service-account',
    audience: 'https://notifications.microservices.com',
    resource: 'https://platform.com/notifications',
    scopes: ['notification:send', 'notification:schedule'],
    expiresIn: '1h'
  }),
  'user-db': createJwtToken({
    issuer: 'user-service',
    subject: 'user-db-connection',
    audience: 'https://userdb.microservices.com',
    resource: 'https://platform.com/databases/users',
    scopes: ['db:read', 'db:write'],
    expiresIn: '30m'
  }),
  'order-db': createJwtToken({
    issuer: 'order-service',
    subject: 'order-db-connection',
    audience: 'https://orderdb.microservices.com',
    resource: 'https://platform.com/databases/orders',
    scopes: ['db:read', 'db:write', 'db:admin'],
    expiresIn: '30m'
  })
};

export default {
  id: 'microservices-scenario',
  name: 'Microservices Authentication',
  description: 'Service mesh authentication with JWT tokens and mTLS',
  
  nodes: [
    { 
      id: 'mobile', 
      name: 'Mobile App', 
      x: 50, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Globe', 
      color: '#00d4ff',
      token: nodeTokens.mobile
    },
    { 
      id: 'ingress', 
      name: 'Ingress Gateway', 
      x: 250, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#b300ff',
      token: nodeTokens.ingress
    },
    { 
      id: 'auth-service', 
      name: 'Auth Service', 
      x: 450, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#ff00ff',
      token: nodeTokens['auth-service']
    },
    { 
      id: 'user-service', 
      name: 'User Service', 
      x: 450, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Server', 
      color: '#00ff88',
      token: nodeTokens['user-service']
    },
    { 
      id: 'order-service', 
      name: 'Order Service', 
      x: 450, 
      y: 300, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#ffff00',
      token: nodeTokens['order-service']
    },
    { 
      id: 'payment-service', 
      name: 'Payment Service', 
      x: 650, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#ff6600',
      token: nodeTokens['payment-service']
    },
    { 
      id: 'notification-service', 
      name: 'Notification Service', 
      x: 650, 
      y: 300, 
      width: 120, 
      height: 60, 
      icon: 'Cloud', 
      color: '#b300ff',
      token: nodeTokens['notification-service']
    },
    { 
      id: 'user-db', 
      name: 'User DB', 
      x: 650, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Database', 
      color: '#00ff88',
      token: nodeTokens['user-db']
    },
    { 
      id: 'order-db', 
      name: 'Order DB', 
      x: 850, 
      y: 250, 
      width: 120, 
      height: 60, 
      icon: 'Database', 
      color: '#ffff00',
      token: nodeTokens['order-db']
    }
  ],

  connections: [
    { 
      from: 0, 
      to: 1,
      tokenExchange: {
        type: 'initial-auth',
        description: 'Mobile app authenticates with API Gateway',
        token: createJwtToken({
          issuer: 'mobile-app',
          subject: 'user@example.com',
          audience: 'api-gateway',
          resource: 'https://platform.com/mobile',
          scopes: ['mobile:access'],
          expiresIn: '1h'
        })
      }
    },
    { 
      from: 1, 
      to: 2,
      tokenExchange: {
        type: 'auth-validation',
        description: 'Gateway validates token with Auth Service',
        token: exchangeToken(nodeTokens.ingress, {
          issuer: 'api-gateway',
          audience: 'auth-service',
          scopes: ['auth:validate', 'token:verify'],
          exchangeType: 'validation'
        })
      }
    },
    { 
      from: 1, 
      to: 3,
      tokenExchange: {
        type: 'service-call',
        description: 'Gateway routes to User Service',
        token: exchangeToken(nodeTokens.ingress, {
          issuer: 'api-gateway',
          audience: 'user-service',
          resource: 'https://platform.com/users',
          scopes: ['user:read', 'profile:read'],
          exchangeType: 'service-routing'
        })
      }
    },
    { 
      from: 1, 
      to: 4,
      tokenExchange: {
        type: 'service-call',
        description: 'Gateway routes to Order Service',
        token: exchangeToken(nodeTokens.ingress, {
          issuer: 'api-gateway',
          audience: 'order-service',
          resource: 'https://platform.com/orders',
          scopes: ['order:create', 'order:read'],
          exchangeType: 'service-routing'
        })
      }
    },
    { 
      from: 3, 
      to: 7,
      tokenExchange: {
        type: 'db-access',
        description: 'User Service accesses User DB',
        token: exchangeToken(nodeTokens['user-service'], {
          issuer: 'user-service',
          audience: 'user-db',
          resource: 'https://platform.com/databases/users',
          scopes: ['db:read', 'db:write'],
          exchangeType: 'database-access'
        })
      }
    },
    { 
      from: 4, 
      to: 5,
      tokenExchange: {
        type: 'payment-processing',
        description: 'Order Service calls Payment Service',
        token: exchangeToken(nodeTokens['order-service'], {
          issuer: 'order-service',
          audience: 'payment-service',
          resource: 'https://platform.com/payments',
          scopes: ['payment:process'],
          exchangeType: 'payment-request'
        })
      }
    },
    { 
      from: 4, 
      to: 6,
      tokenExchange: {
        type: 'notification',
        description: 'Order Service triggers Notification Service',
        token: exchangeToken(nodeTokens['order-service'], {
          issuer: 'order-service',
          audience: 'notification-service',
          resource: 'https://platform.com/notifications',
          scopes: ['notification:send'],
          exchangeType: 'notification-trigger'
        })
      }
    },
    { 
      from: 4, 
      to: 8,
      tokenExchange: {
        type: 'db-access',
        description: 'Order Service accesses Order DB',
        token: exchangeToken(nodeTokens['order-service'], {
          issuer: 'order-service',
          audience: 'order-db',
          resource: 'https://platform.com/databases/orders',
          scopes: ['db:read', 'db:write'],
          exchangeType: 'database-access'
        })
      }
    },
    { 
      from: 5, 
      to: 8,
      tokenExchange: {
        type: 'payment-update',
        description: 'Payment Service updates Order DB',
        token: exchangeToken(nodeTokens['payment-service'], {
          issuer: 'payment-service',
          audience: 'order-db',
          resource: 'https://platform.com/databases/orders',
          scopes: ['db:write', 'payment:status:update'],
          exchangeType: 'payment-status-update'
        })
      }
    },
    { 
      from: 6, 
      to: 3,
      tokenExchange: {
        type: 'user-lookup',
        description: 'Notification Service queries User Service',
        token: exchangeToken(nodeTokens['notification-service'], {
          issuer: 'notification-service',
          audience: 'user-service',
          resource: 'https://platform.com/users',
          scopes: ['user:read', 'contact:read'],
          exchangeType: 'user-query'
        })
      }
    }
  ],

  platformBoxes: [
    {
      id: 'service-mesh',
      name: 'Service Mesh',
      x: 430,
      y: 80,
      width: 360,
      height: 300,
      color: '#00d4ff',
      opacity: 0.15
    },
    {
      id: 'data-layer',
      name: 'Data Layer',
      x: 630,
      y: 80,
      width: 360,
      height: 200,
      color: '#00ff88',
      opacity: 0.15
    }
  ]
}