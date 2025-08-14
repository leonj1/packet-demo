/**
 * Scenario loader utility for dynamic scenario management
 */

/**
 * Validates a scenario object structure
 * @param {Object} scenario - The scenario object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function validateScenario(scenario) {
  if (!scenario || typeof scenario !== 'object') {
    return false
  }

  // Check required top-level fields
  const requiredFields = ['id', 'name', 'description', 'nodes', 'connections']
  for (const field of requiredFields) {
    if (!(field in scenario)) {
      console.error(`Missing required field: ${field}`)
      return false
    }
  }

  // Check optional platformBoxes field if present
  if ('platformBoxes' in scenario) {
    if (!Array.isArray(scenario.platformBoxes)) {
      console.error('PlatformBoxes must be an array')
      return false
    }
    
    for (const platformBox of scenario.platformBoxes) {
      if (!validatePlatformBox(platformBox)) {
        return false
      }
    }
  }

  // Validate nodes array
  if (!Array.isArray(scenario.nodes) || scenario.nodes.length === 0) {
    console.error('Nodes must be a non-empty array')
    return false
  }

  // Validate each node
  for (const node of scenario.nodes) {
    if (!validateNode(node)) {
      return false
    }
  }

  // Validate connections array
  if (!Array.isArray(scenario.connections)) {
    console.error('Connections must be an array')
    return false
  }

  // Validate each connection
  for (const connection of scenario.connections) {
    if (!validateConnection(connection, scenario.nodes.length)) {
      return false
    }
  }

  return true
}

/**
 * Validates a node object structure
 * @param {Object} node - The node object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validateNode(node) {
  if (!node || typeof node !== 'object') {
    console.error('Node must be an object')
    return false
  }

  const requiredNodeFields = ['id', 'name', 'x', 'y', 'width', 'height', 'icon', 'color']
  for (const field of requiredNodeFields) {
    if (!(field in node)) {
      console.error(`Node missing required field: ${field}`)
      return false
    }
  }

  // Validate numeric fields
  const numericFields = ['x', 'y', 'width', 'height']
  for (const field of numericFields) {
    if (typeof node[field] !== 'number' || isNaN(node[field])) {
      console.error(`Node field ${field} must be a valid number`)
      return false
    }
  }

  // Validate string fields
  const stringFields = ['id', 'name', 'icon', 'color']
  for (const field of stringFields) {
    if (typeof node[field] !== 'string' || node[field].trim() === '') {
      console.error(`Node field ${field} must be a non-empty string`)
      return false
    }
  }

  return true
}

/**
 * Validates a connection object structure
 * @param {Object} connection - The connection object to validate
 * @param {number} nodeCount - Total number of nodes for index validation
 * @returns {boolean} - True if valid, false otherwise
 */
function validateConnection(connection, nodeCount) {
  if (!connection || typeof connection !== 'object') {
    console.error('Connection must be an object')
    return false
  }

  const requiredConnectionFields = ['from', 'to']
  for (const field of requiredConnectionFields) {
    if (!(field in connection)) {
      console.error(`Connection missing required field: ${field}`)
      return false
    }
  }

  // Validate indices
  if (typeof connection.from !== 'number' || typeof connection.to !== 'number') {
    console.error('Connection from and to must be numbers')
    return false
  }

  if (connection.from < 0 || connection.from >= nodeCount || 
      connection.to < 0 || connection.to >= nodeCount) {
    console.error('Connection indices must be valid node indices')
    return false
  }

  return true
}

/**
 * Validates a platform box object structure
 * @param {Object} platformBox - The platform box object to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function validatePlatformBox(platformBox) {
  if (!platformBox || typeof platformBox !== 'object') {
    console.error('Platform box must be an object')
    return false
  }

  const requiredPlatformFields = ['id', 'name', 'x', 'y', 'width', 'height', 'color', 'opacity']
  for (const field of requiredPlatformFields) {
    if (!(field in platformBox)) {
      console.error(`Platform box missing required field: ${field}`)
      return false
    }
  }

  // Validate numeric fields
  const numericFields = ['x', 'y', 'width', 'height', 'opacity']
  for (const field of numericFields) {
    if (typeof platformBox[field] !== 'number' || isNaN(platformBox[field])) {
      console.error(`Platform box field ${field} must be a valid number`)
      return false
    }
  }

  // Validate string fields
  const stringFields = ['id', 'name', 'color']
  for (const field of stringFields) {
    if (typeof platformBox[field] !== 'string' || platformBox[field].trim() === '') {
      console.error(`Platform box field ${field} must be a non-empty string`)
      return false
    }
  }

  return true
}

/**
 * Loads a scenario by ID using dynamic import
 * @param {string} scenarioId - The ID of the scenario to load
 * @returns {Promise<Object>} - The loaded scenario object
 */
export async function loadScenario(scenarioId) {
  try {
    const scenarioModule = await import(`../scenarios/${scenarioId}.js`)
    const scenario = scenarioModule.default
    
    if (!validateScenario(scenario)) {
      throw new Error('Invalid scenario structure')
    }
    
    return scenario
  } catch (error) {
    console.error(`Failed to load scenario ${scenarioId}:`, error)
    throw new Error(`Failed to load scenario: ${scenarioId}`)
  }
}

/**
 * Gets list of available scenarios with metadata
 * @returns {Promise<Array>} - Array of scenario metadata objects
 */
export async function getAvailableScenarios() {
  // This would ideally use a manifest file or directory scanning
  // For now, we'll maintain a static list of known scenarios
  const knownScenarios = [
    'auth-flow-default',
    'multi-cloud-scenario',
    'microservices-scenario',
    'proposal-1'
  ]

  const scenarios = []
  
  for (const scenarioId of knownScenarios) {
    try {
      const scenario = await loadScenario(scenarioId)
      scenarios.push({
        id: scenario.id,
        name: scenario.name,
        description: scenario.description
      })
    } catch (error) {
      console.warn(`Could not load scenario ${scenarioId}:`, error.message)
      // Continue loading other scenarios
    }
  }

  return scenarios
}