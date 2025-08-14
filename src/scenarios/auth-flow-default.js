/**
 * Default Authentication Flow Scenario
 * Extracted from the original NetworkCanvas hardcoded data
 */

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
      color: '#00d4ff' 
    },
    { 
      id: 'okta', 
      name: 'Okta', 
      x: 350, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#b300ff' 
    },
    { 
      id: 'idp2', 
      name: 'IdP2', 
      x: 550, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#ff00ff' 
    },
    { 
      id: 'permissions', 
      name: 'Permissions', 
      x: 750, 
      y: 200, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#00ff88' 
    },
    { 
      id: 'nextjs', 
      name: 'NextJS App', 
      x: 350, 
      y: 300, 
      width: 120, 
      height: 60, 
      icon: 'Server', 
      color: '#00d4ff' 
    },
    { 
      id: 'api1', 
      name: 'API 1', 
      x: 550, 
      y: 400, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#ff6600' 
    },
    { 
      id: 'api2', 
      name: 'API 2', 
      x: 750, 
      y: 400, 
      width: 120, 
      height: 60, 
      icon: 'Cloud', 
      color: '#ffff00' 
    },
    { 
      id: 'database', 
      name: 'Database', 
      x: 950, 
      y: 300, 
      width: 120, 
      height: 60, 
      icon: 'Database', 
      color: '#00ff88' 
    }
  ],

  connections: [
    { from: 0, to: 1 }, // Browser -> Okta
    { from: 1, to: 2 }, // Okta -> IdP2
    { from: 2, to: 3 }, // IdP2 -> Permissions
    { from: 1, to: 4 }, // Okta -> NextJS App
    { from: 4, to: 5 }, // NextJS App -> API 1
    { from: 5, to: 6 }, // API 1 -> API 2
    { from: 6, to: 7 }, // API 2 -> Database
    { from: 3, to: 7 }  // Permissions -> Database
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