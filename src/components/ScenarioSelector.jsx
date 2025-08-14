import React, { useState, useEffect } from 'react'
import { ChevronDown, AlertCircle, Info } from 'lucide-react'
import { getAvailableScenarios } from '../utils/scenarioLoader'

const ScenarioSelector = ({ onScenarioChange, currentScenario }) => {
  const [scenarios, setScenarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredScenario, setHoveredScenario] = useState(null)

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        setLoading(true)
        const availableScenarios = await getAvailableScenarios()
        setScenarios(availableScenarios)
        setError(null)
      } catch (err) {
        console.error('Failed to load scenarios:', err)
        setError('Error loading scenarios')
      } finally {
        setLoading(false)
      }
    }

    loadScenarios()
  }, [])

  const handleScenarioChange = (scenarioId) => {
    onScenarioChange(scenarioId)
    setIsOpen(false)
  }

  const getCurrentScenarioName = () => {
    const current = scenarios.find(s => s.id === currentScenario)
    return current ? current.name : 'Unknown Scenario'
  }

  const getCurrentScenarioDescription = () => {
    const current = scenarios.find(s => s.id === currentScenario)
    return current ? current.description : ''
  }

  if (loading) {
    return (
      <div className="scenario-selector flex items-center gap-2">
        <div className="animate-pulse text-sm" style={{ color: 'var(--neon-blue)', fontFamily: 'monospace' }}>
          Loading...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="scenario-selector flex items-center gap-2">
        <AlertCircle className="w-4 h-4" style={{ color: 'var(--neon-red, #ff4444)' }} />
        <span className="text-sm" style={{ color: 'var(--neon-red, #ff4444)', fontFamily: 'monospace' }}>
          Error loading scenarios
        </span>
      </div>
    )
  }

  return (
    <div className="scenario-selector relative">
      {/* Scenario Label */}
      <div className="flex items-center gap-2 mb-1">
        <label className="text-xs font-bold tracking-wider" 
               style={{ color: 'var(--neon-green)', fontFamily: 'Orbitron, monospace' }}>
          SCENARIO
        </label>
        <div className="group relative">
          <Info className="w-3 h-3 opacity-60 hover:opacity-100 transition-opacity" 
                style={{ color: 'var(--neon-blue)' }} />
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black border rounded 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 min-w-64"
               style={{ 
                 borderColor: 'var(--neon-blue)', 
                 background: 'rgba(4, 6, 20, 0.95)',
                 boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)'
               }}>
            <div className="text-xs" style={{ color: 'var(--neon-blue)', fontFamily: 'monospace' }}>
              {getCurrentScenarioDescription()}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                 style={{ borderTopColor: 'var(--neon-blue)' }} />
          </div>
        </div>
      </div>

      {/* Custom Dropdown */}
      <div className="relative">
        <button
          className="cyber-select w-48 px-4 py-2 bg-transparent border-2 rounded-lg text-left flex items-center justify-between
                     transition-all duration-300 hover:shadow-neon focus:shadow-neon focus:outline-none group"
          style={{
            borderColor: isOpen ? 'var(--neon-blue)' : 'rgba(0, 212, 255, 0.4)',
            color: 'var(--neon-blue)',
            fontFamily: 'Courier New, monospace',
            background: isOpen ? 'rgba(0, 212, 255, 0.05)' : 'rgba(4, 6, 20, 0.8)'
          }}
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        >
          <span className="text-sm truncate font-medium">
            {getCurrentScenarioName()}
          </span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--neon-blue)' }}
          />
        </button>

        {/* Dropdown Options */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-black border-2 rounded-lg z-50 overflow-hidden"
               style={{
                 borderColor: 'var(--neon-blue)',
                 background: 'rgba(4, 6, 20, 0.95)',
                 boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)'
               }}>
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                className="w-full px-4 py-3 text-left hover:bg-blue-900/30 transition-colors duration-200 
                           border-b border-blue-900/20 last:border-b-0 group"
                style={{
                  color: scenario.id === currentScenario ? 'var(--neon-green)' : 'var(--neon-blue)',
                  fontFamily: 'Courier New, monospace'
                }}
                onClick={() => handleScenarioChange(scenario.id)}
                onMouseEnter={() => setHoveredScenario(scenario.id)}
                onMouseLeave={() => setHoveredScenario(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {scenario.name}
                    </div>
                    {hoveredScenario === scenario.id && (
                      <div className="text-xs mt-1 opacity-80" style={{ color: 'var(--neon-blue)' }}>
                        {scenario.description}
                      </div>
                    )}
                  </div>
                  {scenario.id === currentScenario && (
                    <div className="w-2 h-2 rounded-full ml-2 animate-pulse"
                         style={{ background: 'var(--neon-green)' }} />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hidden select for accessibility and testing */}
      <select
        className="sr-only"
        value={currentScenario}
        onChange={(e) => onScenarioChange(e.target.value)}
        aria-label="Select network scenario"
      >
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ScenarioSelector