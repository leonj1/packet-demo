import React from 'react'
import { ArrowLeft, ArrowRight, Play, RotateCcw } from 'lucide-react'

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
  return (
    <div 
      className="navigation-controls flex items-center gap-3"
      role="group"
      aria-label="navigation controls"
      data-testid="navigation-controls"
    >
      {/* Speed Control */}
      <div className="flex items-center gap-2">
        <label className="text-sm" style={{ color: 'var(--neon-blue)', fontFamily: 'monospace' }}>
          SPEED
        </label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={animationSpeed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="w-24"
          disabled={isAnimating}
          aria-label="Animation speed"
        />
        <span className="text-sm" style={{ color: 'var(--neon-green)', fontFamily: 'monospace' }}>
          {animationSpeed}x
        </span>
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