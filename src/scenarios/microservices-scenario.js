/**
 * Microservices Authentication Scenario
 * Demonstrates service-to-service authentication in microservices architecture
 */

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
      color: '#00d4ff' 
    },
    { 
      id: 'ingress', 
      name: 'Ingress Gateway', 
      x: 250, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#b300ff' 
    },
    { 
      id: 'auth-service', 
      name: 'Auth Service', 
      x: 450, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#ff00ff' 
    },
    { 
      id: 'user-service', 
      name: 'User Service', 
      x: 450, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Server', 
      color: '#00ff88' 
    },
    { 
      id: 'order-service', 
      name: 'Order Service', 
      x: 450, 
      y: 300, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#ffff00' 
    },
    { 
      id: 'payment-service', 
      name: 'Payment Service', 
      x: 650, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#ff6600' 
    },
    { 
      id: 'notification-service', 
      name: 'Notification Service', 
      x: 650, 
      y: 300, 
      width: 120, 
      height: 60, 
      icon: 'Cloud', 
      color: '#b300ff' 
    },
    { 
      id: 'user-db', 
      name: 'User DB', 
      x: 650, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Database', 
      color: '#00ff88' 
    },
    { 
      id: 'order-db', 
      name: 'Order DB', 
      x: 850, 
      y: 250, 
      width: 120, 
      height: 60, 
      icon: 'Database', 
      color: '#ffff00' 
    }
  ],

  connections: [
    { from: 0, to: 1 }, // Mobile -> Ingress Gateway
    { from: 1, to: 2 }, // Gateway -> Auth Service
    { from: 1, to: 3 }, // Gateway -> User Service
    { from: 1, to: 4 }, // Gateway -> Order Service
    { from: 3, to: 7 }, // User Service -> User DB
    { from: 4, to: 5 }, // Order Service -> Payment Service
    { from: 4, to: 6 }, // Order Service -> Notification Service
    { from: 4, to: 8 }, // Order Service -> Order DB
    { from: 5, to: 8 }, // Payment Service -> Order DB
    { from: 6, to: 3 }  // Notification Service -> User Service
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