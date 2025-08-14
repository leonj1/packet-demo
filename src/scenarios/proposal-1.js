/**
 * Proposal 1 Scenario
 * Complex authentication flow with Direct platform containing Umbrella and RE-Port App
 */

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
      color: '#00d4ff' 
    },
    { 
      id: 'okta', 
      name: 'Okta', 
      x: 300, 
      y: 150, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#b300ff' 
    },
    { 
      id: 'b-idp', 
      name: 'B-Idp', 
      x: 500, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#ff00ff' 
    },
    { 
      id: 'idp', 
      name: 'Idp', 
      x: 700, 
      y: 150, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#00ff88' 
    },
    { 
      id: 'cognito', 
      name: 'Cognito', 
      x: 900, 
      y: 100, 
      width: 120, 
      height: 60, 
      icon: 'Cloud', 
      color: '#ff6600' 
    },
    { 
      id: 'umbrella', 
      name: 'Umbrella', 
      x: 300, 
      y: 350, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#00d4ff' 
    },
    { 
      id: 're-port-app', 
      name: 'RE-Port App', 
      x: 500, 
      y: 350, 
      width: 120, 
      height: 60, 
      icon: 'Server', 
      color: '#00ff88' 
    },
    { 
      id: 're-port-api', 
      name: 'RE-Port API', 
      x: 700, 
      y: 400, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#ffff00' 
    },
    { 
      id: 'b-api', 
      name: 'B-API', 
      x: 900, 
      y: 350, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#b300ff' 
    },
    { 
      id: 'permissions', 
      name: 'Permissions', 
      x: 500, 
      y: 500, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#ff00ff' 
    }
  ],

  connections: [
    { from: 0, to: 5 },  // 1. Browser -> Umbrella
    { from: 5, to: 0 },  // 2. Umbrella -> Browser
    { from: 0, to: 1 },  // 3. Browser -> Okta
    { from: 1, to: 9 },  // 4. Okta -> Permissions
    { from: 9, to: 1 },  // 5. Permissions -> Okta
    { from: 1, to: 0 },  // 6. Okta -> Browser
    { from: 0, to: 5 },  // 7. Browser -> Umbrella
    { from: 5, to: 6 },  // 8. Umbrella -> RE-Port App
    { from: 6, to: 3 },  // 9. RE-Port App -> Idp
    { from: 3, to: 6 },  // 10. Idp -> RE-Port App
    { from: 6, to: 7 },  // 11. RE-Port App -> RE-Port API
    { from: 7, to: 3 },  // 12. RE-Port API -> Idp
    { from: 3, to: 7 },  // 13. Idp -> RE-Port API
    { from: 7, to: 6 },  // 14. RE-Port API -> RE-Port App
    { from: 6, to: 5 },  // 15. RE-Port App -> Umbrella
    { from: 5, to: 0 }   // 16. Umbrella -> Browser
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
    }
  ]
}