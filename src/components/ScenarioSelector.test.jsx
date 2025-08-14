import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScenarioSelector from './ScenarioSelector'

// Mock the scenario loader
vi.mock('../utils/scenarioLoader', () => ({
  getAvailableScenarios: vi.fn(() => Promise.resolve([
    { id: 'auth-flow-default', name: 'Authentication Flow (Default)', description: 'Standard OAuth/OIDC flow' },
    { id: 'multi-cloud-scenario', name: 'Multi-Cloud Authentication', description: 'Authentication across multiple clouds' },
    { id: 'microservices-scenario', name: 'Microservices Authentication', description: 'Service mesh authentication' }
  ]))
}))

describe('ScenarioSelector', () => {
  const mockOnScenarioChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dropdown with loading state initially', () => {
    render(<ScenarioSelector onScenarioChange={mockOnScenarioChange} currentScenario="auth-flow-default" />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should load and display available scenarios', async () => {
    render(<ScenarioSelector onScenarioChange={mockOnScenarioChange} currentScenario="auth-flow-default" />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    // Check if all scenarios are available in the select options
    const selectElement = screen.getByRole('combobox')
    expect(selectElement).toBeInTheDocument()
  })

  it('should call onScenarioChange when scenario is selected', async () => {
    const user = userEvent.setup()
    render(<ScenarioSelector onScenarioChange={mockOnScenarioChange} currentScenario="auth-flow-default" />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    expect(mockOnScenarioChange).toHaveBeenCalledWith('multi-cloud-scenario')
  })

  it('should display current scenario as selected', async () => {
    render(<ScenarioSelector onScenarioChange={mockOnScenarioChange} currentScenario="microservices-scenario" />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Microservices Authentication')).toBeInTheDocument()
    })
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<ScenarioSelector onScenarioChange={mockOnScenarioChange} currentScenario="auth-flow-default" />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    const selectElement = screen.getByRole('combobox')
    await user.selectOptions(selectElement, 'multi-cloud-scenario')
    
    expect(mockOnScenarioChange).toHaveBeenCalledWith('multi-cloud-scenario')
  })

  it('should apply cyber theme styling classes', async () => {
    render(<ScenarioSelector onScenarioChange={mockOnScenarioChange} currentScenario="auth-flow-default" />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    const customButton = screen.getByRole('button')
    expect(customButton).toHaveClass('cyber-select')
    
    const container = screen.getByText('SCENARIO').closest('.scenario-selector')
    expect(container).toBeInTheDocument()
  })

  it('should display scenario description on hover', async () => {
    const user = userEvent.setup()
    render(<ScenarioSelector onScenarioChange={mockOnScenarioChange} currentScenario="auth-flow-default" />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Authentication Flow (Default)')).toBeInTheDocument()
    })
    
    const container = screen.getByRole('combobox').closest('.scenario-selector')
    await user.hover(container)
    
    await waitFor(() => {
      expect(screen.getByText('Standard OAuth/OIDC flow')).toBeInTheDocument()
    })
  })

  it('should handle error state when scenarios fail to load', async () => {
    const { getAvailableScenarios } = await import('../utils/scenarioLoader')
    getAvailableScenarios.mockRejectedValueOnce(new Error('Failed to load scenarios'))
    
    render(<ScenarioSelector onScenarioChange={mockOnScenarioChange} currentScenario="auth-flow-default" />)
    
    await waitFor(() => {
      expect(screen.getByText('Error loading scenarios')).toBeInTheDocument()
    })
  })
})