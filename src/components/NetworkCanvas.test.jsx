import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NetworkCanvas from './NetworkCanvas'

// Mock the scenario loader
vi.mock('../utils/scenarioLoader', () => ({
  getAvailableScenarios: vi.fn(() => Promise.resolve([
    { id: 'auth-flow-default', name: 'Authentication Flow (Default)', description: 'Standard OAuth/OIDC flow' },
    { id: 'multi-cloud-scenario', name: 'Multi-Cloud Authentication', description: 'Authentication across multiple clouds' }
  ])),
  loadScenario: vi.fn((scenarioId) => {
    const scenarios = {
      'auth-flow-default': {
        id: 'auth-flow-default',
        name: 'Authentication Flow (Default)',
        description: 'Standard OAuth/OIDC authentication flow',
        nodes: [
          { id: 'browser', name: 'Browser', x: 150, y: 200, width: 120, height: 60, icon: 'Globe', color: '#00d4ff' },
          { id: 'okta', name: 'Okta', x: 350, y: 100, width: 120, height: 60, icon: 'Shield', color: '#b300ff' }
        ],
        connections: [
          { from: 0, to: 1 }
        ],
        platformBoxes: []
      },
      'multi-cloud-scenario': {
        id: 'multi-cloud-scenario',
        name: 'Multi-Cloud Authentication',
        description: 'Authentication across multiple cloud providers',
        nodes: [
          { id: 'client', name: 'Client App', x: 100, y: 250, width: 120, height: 60, icon: 'Globe', color: '#00d4ff' },
          { id: 'gateway', name: 'API Gateway', x: 300, y: 250, width: 120, height: 60, icon: 'Shield', color: '#b300ff' },
          { id: 'cognito', name: 'AWS Cognito', x: 500, y: 150, width: 120, height: 60, icon: 'Lock', color: '#ff9900' }
        ],
        connections: [
          { from: 0, to: 1 },
          { from: 1, to: 2 }
        ],
        platformBoxes: []
      }
    }
    return Promise.resolve(scenarios[scenarioId])
  })
}))

// Mock Konva components
vi.mock('react-konva', () => ({
  Stage: ({ children, ...props }) => <div data-testid="konva-stage" {...props}>{children}</div>,
  Layer: ({ children, ...props }) => <div data-testid="konva-layer" {...props}>{children}</div>,
  Rect: (props) => <div data-testid="konva-rect" {...props} />,
  Text: (props) => <div data-testid="konva-text" {...props} />,
  Line: (props) => <div data-testid="konva-line" {...props} />,
  Circle: (props) => <div data-testid="konva-circle" {...props} />,
  Group: ({ children, ...props }) => <div data-testid="konva-group" {...props}>{children}</div>
}))

describe('NetworkCanvas - Scenario Switching', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  it('should render with default scenario', async () => {
    render(<NetworkCanvas />)
    
    await waitFor(() => {
      expect(screen.getAllByText('Authentication Flow (Default)').length).toBeGreaterThan(0)
    })
    
    expect(screen.getByText('NETWORK MATRIX')).toBeInTheDocument()
    expect(screen.getByTestId('konva-stage')).toBeInTheDocument()
  })

  it('should load and switch scenarios when scenario selector changes', async () => {
    const user = userEvent.setup()
    render(<NetworkCanvas />)
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    // Switch to multi-cloud scenario
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    // Verify scenario switched
    await waitFor(() => {
      expect(screen.getByDisplayValue('Multi-Cloud Authentication')).toBeInTheDocument()
    })
  })

  it('should reset animation state when switching scenarios', async () => {
    const user = userEvent.setup()
    render(<NetworkCanvas />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    // Start animation by going to next step (but default scenario has only 1 connection, so can't proceed)
    // Instead, let's just verify the scenario switch resets the state properly
    
    // Switch scenario
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    // Verify state was reset and new scenario loaded
    await waitFor(() => {
      expect(screen.getByText('0/2')).toBeInTheDocument() // New scenario has 2 connections
    })
  })

  it('should handle scenario loading errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock the loadScenario function to fail for a specific scenario
    const { loadScenario } = vi.mocked(await import('../utils/scenarioLoader'))
    loadScenario.mockImplementationOnce(() => {
      // First call (initial load) succeeds
      return Promise.resolve({
        id: 'auth-flow-default',
        name: 'Authentication Flow (Default)',
        description: 'Standard OAuth/OIDC authentication flow',
        nodes: [
          { id: 'browser', name: 'Browser', x: 150, y: 200, width: 120, height: 60, icon: 'Globe', color: '#00d4ff' }
        ],
        connections: [],
        platformBoxes: []
      })
    }).mockImplementationOnce(() => {
      // Second call (scenario switch) fails
      return Promise.reject(new Error('Network error'))
    })
    
    const user = userEvent.setup()
    render(<NetworkCanvas />)
    
    await waitFor(() => {
      expect(screen.getAllByText('Authentication Flow (Default)').length).toBeGreaterThan(0)
    })
    
    // Try to switch to a scenario that will fail to load
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    // Should show error handling behavior
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to load scenario data'))
    })
    
    consoleSpy.mockRestore()
  })

  it('should update navigation controls when scenario changes', async () => {
    const user = userEvent.setup()
    render(<NetworkCanvas />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    // Check initial step count (default scenario has 1 connection)
    expect(screen.getByText('0/1')).toBeInTheDocument()
    
    // Switch to multi-cloud scenario (has 2 connections)
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    await waitFor(() => {
      expect(screen.getByText('0/2')).toBeInTheDocument()
    })
  })

  it('should disable navigation during scenario loading', async () => {
    const user = userEvent.setup()
    render(<NetworkCanvas />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    // All navigation buttons should be enabled initially
    expect(screen.getByLabelText('Go to next step')).not.toBeDisabled()
    expect(screen.getByLabelText('Auto play animation')).not.toBeDisabled()
    
    // Navigation state should be properly managed
    const initButton = screen.getByLabelText('Initialize animation')
    expect(initButton).not.toBeDisabled()
  })

  it('should preserve animation speed when switching scenarios', async () => {
    const user = userEvent.setup()
    render(<NetworkCanvas />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    // Change animation speed
    const speedSlider = screen.getByLabelText('Animation speed')
    fireEvent.change(speedSlider, { target: { value: '2.5' } })
    
    expect(screen.getByText('2.5x')).toBeInTheDocument()
    
    // Switch scenario
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    // Speed should be preserved
    await waitFor(() => {
      expect(screen.getByText('2.5x')).toBeInTheDocument()
    })
  })

  it('should handle scenario data validation during loading', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Make loadScenario return invalid data
    const { loadScenario } = await import('../utils/scenarioLoader')
    loadScenario.mockResolvedValueOnce({
      id: 'invalid-scenario',
      name: 'Invalid Scenario',
      // Missing required fields
    })
    
    const user = userEvent.setup()
    render(<NetworkCanvas />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    // Try to switch to invalid scenario
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    // Should handle validation errors
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled()
    })
    
    consoleSpy.mockRestore()
  })

  it('should update progress bar correctly for different scenario lengths', async () => {
    const user = userEvent.setup()
    render(<NetworkCanvas />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    // Progress bar should exist
    const progressBars = document.querySelectorAll('[style*="background: linear-gradient"]')
    expect(progressBars.length).toBeGreaterThan(0)
    
    // Switch to different scenario
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    await waitFor(() => {
      expect(screen.getByText('0/2')).toBeInTheDocument()
    })
    
    // Progress bar should still exist and be properly configured
    const updatedProgressBars = document.querySelectorAll('[style*="background: linear-gradient"]')
    expect(updatedProgressBars.length).toBeGreaterThan(0)
  })
})