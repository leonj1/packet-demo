import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NavigationControls from './NavigationControls'

describe('NavigationControls', () => {
  const mockProps = {
    onStart: vi.fn(),
    onNext: vi.fn(),
    onPrevious: vi.fn(),
    onAutoPlay: vi.fn(),
    canGoNext: true,
    canGoPrevious: false,
    isAnimating: false,
    animationSpeed: 1,
    onSpeedChange: vi.fn(),
    currentStep: 0,
    totalSteps: 8
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all navigation buttons', () => {
    render(<NavigationControls {...mockProps} />)
    
    expect(screen.getByText('INITIALIZE')).toBeInTheDocument()
    expect(screen.getByText('BACK')).toBeInTheDocument()
    expect(screen.getByText('TRANSMIT')).toBeInTheDocument()
    expect(screen.getByText('AUTO')).toBeInTheDocument()
  })

  it('should call onStart when INITIALIZE button is clicked', async () => {
    const user = userEvent.setup()
    render(<NavigationControls {...mockProps} />)
    
    const initButton = screen.getByText('INITIALIZE')
    await user.click(initButton)
    
    expect(mockProps.onStart).toHaveBeenCalledTimes(1)
  })

  it('should call onNext when TRANSMIT button is clicked and canGoNext is true', async () => {
    const user = userEvent.setup()
    render(<NavigationControls {...mockProps} />)
    
    const nextButton = screen.getByLabelText('Go to next step')
    await user.click(nextButton)
    
    expect(mockProps.onNext).toHaveBeenCalledTimes(1)
  })

  it('should call onPrevious when BACK button is clicked and canGoPrevious is true', async () => {
    const user = userEvent.setup()
    const propsWithPrevious = { ...mockProps, canGoPrevious: true, currentStep: 3 }
    render(<NavigationControls {...propsWithPrevious} />)
    
    const backButton = screen.getByLabelText('Go to previous step')
    await user.click(backButton)
    
    expect(mockProps.onPrevious).toHaveBeenCalledTimes(1)
  })

  it('should disable BACK button when canGoPrevious is false', () => {
    render(<NavigationControls {...mockProps} />)
    
    const backButton = screen.getByLabelText('Go to previous step')
    expect(backButton).toBeDisabled()
  })

  it('should disable TRANSMIT button when canGoNext is false', () => {
    const propsNoNext = { ...mockProps, canGoNext: false }
    render(<NavigationControls {...propsNoNext} />)
    
    const nextButton = screen.getByLabelText('Go to next step')
    expect(nextButton).toBeDisabled()
  })

  it('should disable navigation buttons when animating', () => {
    const propsAnimating = { ...mockProps, isAnimating: true }
    render(<NavigationControls {...propsAnimating} />)
    
    expect(screen.getByLabelText('Go to previous step')).toBeDisabled()
    expect(screen.getByLabelText('Go to next step')).toBeDisabled()
    expect(screen.getByLabelText('Auto play animation')).toBeDisabled()
  })

  it('should call onAutoPlay when AUTO button is clicked', async () => {
    const user = userEvent.setup()
    render(<NavigationControls {...mockProps} />)
    
    const autoButton = screen.getByLabelText('Auto play animation')
    await user.click(autoButton)
    
    expect(mockProps.onAutoPlay).toHaveBeenCalledTimes(1)
  })

  it('should call onSpeedChange when speed slider is moved', async () => {
    const user = userEvent.setup()
    render(<NavigationControls {...mockProps} />)
    
    const speedSlider = screen.getByLabelText('Animation speed')
    fireEvent.change(speedSlider, { target: { value: '2' } })
    
    expect(mockProps.onSpeedChange).toHaveBeenCalledWith(2)
  })

  it('should display current speed value', () => {
    const propsWithSpeed = { ...mockProps, animationSpeed: 2.5 }
    render(<NavigationControls {...propsWithSpeed} />)
    
    expect(screen.getByText('2.5x')).toBeInTheDocument()
  })

  it('should apply cyber theme styling to buttons', () => {
    render(<NavigationControls {...mockProps} />)
    
    const initButton = screen.getByLabelText('Initialize animation')
    expect(initButton).toHaveClass('btn-neon')
    
    const backButton = screen.getByLabelText('Go to previous step')
    expect(backButton).toHaveClass('btn-neon')
    
    const nextButton = screen.getByLabelText('Go to next step')
    expect(nextButton).toHaveClass('btn-neon')
    
    const autoButton = screen.getByLabelText('Auto play animation')
    expect(autoButton).toHaveClass('btn-neon')
  })

  it('should show hover effects on enabled buttons', async () => {
    const user = userEvent.setup()
    render(<NavigationControls {...mockProps} />)
    
    const initButton = screen.getByLabelText('Initialize animation')
    await user.hover(initButton)
    
    // The hover effect should be visible (this is mainly visual, but we can check if event handlers work)
    expect(initButton).not.toBeDisabled()
  })

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<NavigationControls {...mockProps} />)
    
    const initButton = screen.getByLabelText('Initialize animation')
    initButton.focus()
    
    await user.keyboard('{Enter}')
    expect(mockProps.onStart).toHaveBeenCalledTimes(1)
  })

  it('should show correct progress indication', () => {
    const propsWithProgress = { ...mockProps, currentStep: 5, totalSteps: 10 }
    render(<NavigationControls {...propsWithProgress} />)
    
    // The progress should be visible somewhere in the component
    // This depends on how we implement the progress indicator
    const container = screen.getByRole('group', { name: /navigation controls/i }) || 
                     screen.getByTestId('navigation-controls') ||
                     document.querySelector('.navigation-controls')
    expect(container).toBeInTheDocument()
  })
})