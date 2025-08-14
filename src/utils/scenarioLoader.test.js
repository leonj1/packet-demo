import { describe, it, expect, vi, beforeEach } from 'vitest'
import { validateScenario, loadScenario, getAvailableScenarios } from './scenarioLoader'

describe('scenarioLoader', () => {
  describe('validateScenario', () => {
    it('should validate a correct scenario structure', () => {
      const validScenario = {
        id: 'test-scenario',
        name: 'Test Scenario',
        description: 'A test scenario',
        nodes: [
          { id: 'node1', name: 'Node 1', x: 100, y: 100, width: 120, height: 60, icon: 'Globe', color: '#00d4ff' },
          { id: 'node2', name: 'Node 2', x: 200, y: 200, width: 120, height: 60, icon: 'Server', color: '#ff0000' }
        ],
        connections: [
          { from: 0, to: 1 }
        ]
      }

      expect(validateScenario(validScenario)).toBe(true)
    })

    it('should reject scenario with missing required fields', () => {
      const invalidScenario = {
        id: 'test-scenario',
        // missing name, description, nodes, connections
      }

      expect(validateScenario(invalidScenario)).toBe(false)
    })

    it('should reject scenario with invalid node structure', () => {
      const invalidScenario = {
        id: 'test-scenario',
        name: 'Test Scenario',
        description: 'A test scenario',
        nodes: [
          { id: 'node1', name: 'Node 1' } // missing required fields
        ],
        connections: []
      }

      expect(validateScenario(invalidScenario)).toBe(false)
    })

    it('should reject scenario with invalid connection structure', () => {
      const invalidScenario = {
        id: 'test-scenario',
        name: 'Test Scenario',
        description: 'A test scenario',
        nodes: [
          { id: 'node1', name: 'Node 1', x: 100, y: 100, width: 120, height: 60, icon: 'Globe', color: '#00d4ff' }
        ],
        connections: [
          { from: 0 } // missing 'to' field
        ]
      }

      expect(validateScenario(invalidScenario)).toBe(false)
    })
  })

  describe('loadScenario', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('should load a real scenario by id', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const result = await loadScenario('auth-flow-default')
      expect(result).toBeDefined()
      expect(result.id).toBe('auth-flow-default')
      expect(result.name).toBeDefined()
      expect(result.description).toBeDefined()
      expect(Array.isArray(result.nodes)).toBe(true)
      expect(Array.isArray(result.connections)).toBe(true)
      
      consoleSpy.mockRestore()
    })

    it('should throw error for non-existent scenario', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      await expect(loadScenario('non-existent')).rejects.toThrow('Failed to load scenario: non-existent')
      
      consoleSpy.mockRestore()
    })
  })

  describe('getAvailableScenarios', () => {
    it('should return list of available scenarios', async () => {
      const scenarios = await getAvailableScenarios()
      expect(Array.isArray(scenarios)).toBe(true)
      expect(scenarios.length).toBeGreaterThan(0)
      
      // Each scenario should have required metadata
      scenarios.forEach(scenario => {
        expect(scenario).toHaveProperty('id')
        expect(scenario).toHaveProperty('name')
        expect(scenario).toHaveProperty('description')
      })
    })
  })
})