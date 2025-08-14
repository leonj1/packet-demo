import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, Play, RotateCcw, ChevronDown } from 'lucide-react'

const NavigationControls = ({
  onStart,
  onNext,
  onPrevious,
  onAutoPlay,
  canGoNext,
  canGoPrevious,
  isAnimating,
  animationSpeed,
  onSpeedChange,
  currentStep,
  totalSteps
}) => {
  const [speedDropdownOpen, setSpeedDropdownOpen] = useState(false)
  
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 1.5, label: '1.5x' },
    { value: 2, label: '2x' },
    { value: 2.5, label: '2.5x' },
    { value: 3, label: '3x' }
  ]
  
  const handleSpeedSelect = (speed) => {
    onSpeedChange(speed)
    setSpeedDropdownOpen(false)
  }
  
  return (
    <div 
      className="navigation-controls flex items-center gap-3"
      role="group"
      aria-label="navigation controls"
      data-testid="navigation-controls"
    >
      {/* Speed Control Dropdown */}
      <div className="relative">
        <label className="text-xs font-bold tracking-wider mb-1 block" 
               style={{ color: 'var(--neon-blue)', fontFamily: 'Orbitron, monospace' }}>
          SPEED
        </label>
        <button
          className="w-24 px-3 py-2 bg-transparent border-2 rounded-lg text-left flex items-center justify-between
                     transition-all duration-300 hover:shadow-neon focus:shadow-neon focus:outline-none"
          style={{
            borderColor: speedDropdownOpen ? 'var(--neon-blue)' : 'rgba(0, 212, 255, 0.4)',
            color: 'var(--neon-green)',
            fontFamily: 'Courier New, monospace',
            fontSize: '14px',
            background: speedDropdownOpen ? 'rgba(0, 212, 255, 0.05)' : 'rgba(4, 6, 20, 0.8)'
          }}
          onClick={() => setSpeedDropdownOpen(!speedDropdownOpen)}
          onBlur={() => setTimeout(() => setSpeedDropdownOpen(false), 150)}
          disabled={isAnimating}
          aria-label="Animation speed"
        >
          <span className="font-medium">{animationSpeed}x</span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${speedDropdownOpen ? 'rotate-180' : ''}`}
            style={{ color: 'var(--neon-blue)' }}
          />
        </button>
        
        {/* Speed Dropdown Options */}
        {speedDropdownOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 border-2 rounded-lg z-50 overflow-hidden"
               style={{
                 borderColor: 'var(--neon-blue)',
                 backgroundColor: '#040614',
                 background: 'linear-gradient(to bottom, #0a0e27, #040614)',
                 boxShadow: '0 8px 32px rgba(0, 212, 255, 0.3)',
                 backdropFilter: 'blur(10px)'
               }}>
            {speedOptions.map((option) => (
              <button
                key={option.value}
                className="w-full px-3 py-2 text-left transition-all duration-200 text-sm"
                style={{
                  color: option.value === animationSpeed ? 'var(--neon-green)' : 'var(--neon-blue)',
                  fontFamily: 'Courier New, monospace',
                  backgroundColor: option.value === animationSpeed ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                  borderBottom: '1px solid rgba(0, 212, 255, 0.2)'
                }}
                onClick={() => handleSpeedSelect(option.value)}
                onMouseEnter={(e) => {
                  if (option.value !== animationSpeed) {
                    e.target.style.backgroundColor = 'rgba(0, 212, 255, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.value !== animationSpeed) {
                    e.target.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {option.value === animationSpeed && (
                    <div className="w-2 h-2 rounded-full animate-pulse"
                         style={{ background: 'var(--neon-green)' }} />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Initialize Button */}
      <button 
        onClick={onStart}
        disabled={isAnimating}
        className="btn-neon relative px-6 py-2 text-black font-bold rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          background: 'linear-gradient(to right, var(--neon-green), var(--neon-blue))',
          borderColor: 'rgba(0, 255, 136, 0.5)'
        }}
        onMouseEnter={(e) => !e.target.disabled && (e.target.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.5)')}
        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
        aria-label="Initialize animation"
      >
        <span className="relative z-10 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          INITIALIZE
        </span>
      </button>
      
      {/* Back Button */}
      <button 
        onClick={onPrevious}
        disabled={!canGoPrevious || isAnimating}
        className="btn-neon relative px-6 py-2 text-white font-bold rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          background: 'linear-gradient(to right, var(--neon-purple), var(--neon-pink))',
          borderColor: 'rgba(179, 0, 255, 0.5)'
        }}
        onMouseEnter={(e) => !e.target.disabled && (e.target.style.boxShadow = '0 0 30px rgba(179, 0, 255, 0.5)')}
        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
        aria-label="Go to previous step"
      >
        <span className="relative z-10 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          BACK
        </span>
      </button>
      
      {/* Next Button */}
      <button 
        onClick={onNext}
        disabled={!canGoNext || isAnimating}
        className="btn-neon relative px-6 py-2 text-white font-bold rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          background: 'linear-gradient(to right, var(--neon-blue), var(--neon-purple))',
          borderColor: 'rgba(0, 212, 255, 0.5)'
        }}
        onMouseEnter={(e) => !e.target.disabled && (e.target.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)')}
        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
        aria-label="Go to next step"
      >
        <span className="relative z-10 flex items-center gap-2">
          TRANSMIT
          <ArrowRight className="w-4 h-4" />
        </span>
      </button>
      
      {/* Auto Play Button */}
      <button 
        onClick={onAutoPlay}
        disabled={isAnimating}
        className="btn-neon relative px-6 py-2 text-white font-bold rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ 
          background: 'linear-gradient(to right, var(--neon-purple), var(--neon-pink))',
          borderColor: 'rgba(179, 0, 255, 0.5)'
        }}
        onMouseEnter={(e) => !e.target.disabled && (e.target.style.boxShadow = '0 0 30px rgba(179, 0, 255, 0.5)')}
        onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
        aria-label="Auto play animation"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Play className="w-4 h-4" />
          AUTO
        </span>
      </button>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 ml-4">
        <span className="text-xs" style={{ color: 'var(--neon-blue)', fontFamily: 'monospace' }}>
          STEP
        </span>
        <span className="text-sm font-bold" style={{ color: 'var(--neon-green)', fontFamily: 'monospace' }}>
          {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  )
}

export default NavigationControls