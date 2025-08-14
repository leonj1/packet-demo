/**
 * Multi-Cloud Authentication Scenario
 * Demonstrates authentication across multiple cloud providers
 */

export default {
  id: 'multi-cloud-scenario',
  name: 'Multi-Cloud Authentication',
  description: 'Authentication flow spanning AWS, Azure, and GCP services',
  
  nodes: [
    { 
      id: 'client', 
      name: 'Client App', 
      x: 100, 
      y: 250, 
      width: 120, 
      height: 60, 
      icon: 'Globe', 
      color: '#00d4ff' 
    },
    { 
      id: 'gateway', 
      name: 'API Gateway', 
      x: 300, 
      y: 250, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#b300ff' 
    },
    { 
      id: 'cognito', 
      name: 'AWS Cognito', 
      x: 500, 
      y: 150, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#ff9900' 
    },
    { 
      id: 'azure-ad', 
      name: 'Azure AD', 
      x: 500, 
      y: 250, 
      width: 120, 
      height: 60, 
      icon: 'Shield', 
      color: '#0078d4' 
    },
    { 
      id: 'gcp-iam', 
      name: 'GCP IAM', 
      x: 500, 
      y: 350, 
      width: 120, 
      height: 60, 
      icon: 'Lock', 
      color: '#4285f4' 
    },
    { 
      id: 'lambda', 
      name: 'AWS Lambda', 
      x: 700, 
      y: 150, 
      width: 120, 
      height: 60, 
      icon: 'Cpu', 
      color: '#ff9900' 
    },
    { 
      id: 'azure-func', 
      name: 'Azure Function', 
      x: 700, 
      y: 250, 
      width: 120, 
      height: 60, 
      icon: 'Server', 
      color: '#0078d4' 
    },
    { 
      id: 'cloud-run', 
      name: 'Cloud Run', 
      x: 700, 
      y: 350, 
      width: 120, 
      height: 60, 
      icon: 'Cloud', 
      color: '#4285f4' 
    },
    { 
      id: 'database', 
      name: 'Multi-Cloud DB', 
      x: 900, 
      y: 250, 
      width: 120, 
      height: 60, 
      icon: 'Database', 
      color: '#00ff88' 
    }
  ],

  connections: [
    { from: 0, to: 1 }, // Client -> API Gateway
    { from: 1, to: 2 }, // Gateway -> AWS Cognito
    { from: 1, to: 3 }, // Gateway -> Azure AD
    { from: 1, to: 4 }, // Gateway -> GCP IAM
    { from: 2, to: 5 }, // Cognito -> Lambda
    { from: 3, to: 6 }, // Azure AD -> Azure Function
    { from: 4, to: 7 }, // GCP IAM -> Cloud Run
    { from: 5, to: 8 }, // Lambda -> Database
    { from: 6, to: 8 }, // Azure Function -> Database
    { from: 7, to: 8 }  // Cloud Run -> Database
  ],

  platformBoxes: [
    {
      id: 'aws-platform',
      name: 'AWS',
      x: 480,
      y: 130,
      width: 360,
      height: 100,
      color: '#ff9900',
      opacity: 0.2
    },
    {
      id: 'azure-platform',
      name: 'Azure',
      x: 480,
      y: 230,
      width: 360,
      height: 100,
      color: '#0078d4',
      opacity: 0.2
    },
    {
      id: 'gcp-platform',
      name: 'GCP',
      x: 480,
      y: 330,
      width: 360,
      height: 100,
      color: '#4285f4',
      opacity: 0.2
    }
  ]
}