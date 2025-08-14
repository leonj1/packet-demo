/**
 * Microservices Authentication Scenario
 * Demonstrates service-to-service authentication in microservices architecture
 * 
 * Flow Description:
 * 1. Mobile app starts with no token
 * 2. Ingress Gateway authenticates mobile app
 * 3. Gateway validates and routes requests to services
 * 4. Services use service tokens for inter-service communication
 * 5. Services validate tokens before processing requests
 */

import { createAuthToken, exchangeToken } from '../utils/jwtHelpers';

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
      token: null // Mobile app starts with no token
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
      token: null // Gateway validates tokens, doesn't hold them
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
      token: null // Auth service issues tokens
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
      token: null // Services receive tokens from requests
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
      token: null // Services receive tokens from requests
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
      token: null // Services receive tokens from requests
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
      token: null // Services receive tokens from requests
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
      token: null // Databases accessed with service tokens
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
      token: null // Databases accessed with service tokens
    }
  ],

  connections: [
    { 
      from: 0, 
      to: 1,
      tokenExchange: {
        type: 'initial-auth',
        description: 'Mobile app sends credentials to API Gateway',
        token: null // No token yet - sending credentials
      }
    },
    { 
      from: 1, 
      to: 2,
      tokenExchange: {
        type: 'auth-validation',
        description: 'Gateway requests token from Auth Service',
        token: null // Internal auth request
      }
    },
    { 
      from: 1, 
      to: 3,
      tokenExchange: {
        type: 'service-call',
        description: 'Gateway routes to User Service with auth token',
        token: createAuthToken(
          'auth-service',
          'user@example.com',
          'user-service',
          ['user:read', 'profile:read']
        )
      }
    },
    { 
      from: 1, 
      to: 4,
      tokenExchange: {
        type: 'service-call',
        description: 'Gateway routes to Order Service with auth token',
        token: createAuthToken(
          'auth-service',
          'user@example.com',
          'order-service',
          ['order:create', 'order:read']
        )
      }
    },
    { 
      from: 3, 
      to: 7,
      tokenExchange: {
        type: 'db-access',
        description: 'User Service accesses User DB with service token',
        token: exchangeToken(
          createAuthToken('auth-service', 'user@example.com', 'user-service', []),
          {
            issuer: 'user-service',
            audience: 'user-db',
            resource: 'https://platform.com/databases/users',
            scopes: ['db:read', 'db:write'],
            exchangeType: 'database-access'
          }
        )
      }
    },
    { 
      from: 4, 
      to: 5,
      tokenExchange: {
        type: 'payment-processing',
        description: 'Order Service calls Payment Service with service token',
        token: exchangeToken(
          createAuthToken('auth-service', 'user@example.com', 'order-service', []),
          {
            issuer: 'order-service',
            audience: 'payment-service',
            resource: 'https://platform.com/payments',
            scopes: ['payment:process'],
            exchangeType: 'service-to-service'
          }
        )
      }
    },
    { 
      from: 4, 
      to: 6,
      tokenExchange: {
        type: 'notification',
        description: 'Order Service triggers Notification Service',
        token: exchangeToken(
          createAuthToken('auth-service', 'user@example.com', 'order-service', []),
          {
            issuer: 'order-service',
            audience: 'notification-service',
            resource: 'https://platform.com/notifications',
            scopes: ['notification:send'],
            exchangeType: 'service-to-service'
          }
        )
      }
    },
    { 
      from: 4, 
      to: 8,
      tokenExchange: {
        type: 'db-access',
        description: 'Order Service accesses Order DB with service token',
        token: exchangeToken(
          createAuthToken('auth-service', 'user@example.com', 'order-service', []),
          {
            issuer: 'order-service',
            audience: 'order-db',
            resource: 'https://platform.com/databases/orders',
            scopes: ['db:read', 'db:write'],
            exchangeType: 'database-access'
          }
        )
      }
    },
    { 
      from: 5, 
      to: 8,
      tokenExchange: {
        type: 'payment-update',
        description: 'Payment Service updates Order DB',
        token: exchangeToken(
          createAuthToken('order-service', 'service', 'payment-service', []),
          {
            issuer: 'payment-service',
            audience: 'order-db',
            resource: 'https://platform.com/databases/orders',
            scopes: ['db:write', 'payment:status:update'],
            exchangeType: 'database-update'
          }
        )
      }
    },
    { 
      from: 6, 
      to: 3,
      tokenExchange: {
        type: 'user-lookup',
        description: 'Notification Service queries User Service',
        token: exchangeToken(
          createAuthToken('order-service', 'service', 'notification-service', []),
          {
            issuer: 'notification-service',
            audience: 'user-service',
            resource: 'https://platform.com/users',
            scopes: ['user:read', 'contact:read'],
            exchangeType: 'service-to-service'
          }
        )
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