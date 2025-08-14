import React from 'react';
import { Shield, Key, User, Target, Globe, Package, Clock, AlertCircle } from 'lucide-react';
import { formatTokenForDisplay, getTokenColor, isTokenExpired } from '../utils/jwtHelpers';

/**
 * JWT Token Display Component
 * Displays JWT tokens for nodes and the current packet in a HUD panel
 */
const JwtTokenDisplay = ({ nodeTokens = {}, packetToken = null, currentNodeId = null }) => {
  const formatScopes = (scopes) => {
    if (!scopes || scopes.length === 0) return 'none';
    if (scopes.length <= 3) return scopes.join(', ');
    return `${scopes.slice(0, 2).join(', ')}... (+${scopes.length - 2})`;
  };

  const TokenCard = ({ title, token, isActive = false }) => {
    const formatted = formatTokenForDisplay(token);
    const color = getTokenColor(token);
    const expired = isTokenExpired(token);
    
    return (
      <div 
        className={`p-3 rounded-lg border transition-all duration-300 ${
          isActive ? 'border-2 shadow-lg' : 'border opacity-90'
        }`}
        style={{
          background: isActive 
            ? `linear-gradient(135deg, ${color}15 0%, rgba(4, 6, 20, 0.9) 100%)`
            : 'rgba(10, 14, 39, 0.8)',
          borderColor: isActive ? color : 'rgba(26, 31, 58, 0.8)',
          boxShadow: isActive ? `0 0 20px ${color}40` : 'none'
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 
            className="text-sm font-bold flex items-center gap-1"
            style={{ color: isActive ? color : '#e5e7eb' }}
          >
            <Shield className="w-3 h-3" />
            {title}
          </h3>
          {expired && (
            <div className="flex items-center gap-1 text-xs" style={{ color: '#ff4444' }}>
              <AlertCircle className="w-3 h-3" />
              <span>Expired</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1 text-xs" style={{ fontFamily: 'Courier New, monospace' }}>
          <div className="flex items-start gap-2">
            <Key className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: color }} />
            <div className="flex-1">
              <span className="opacity-60">Issuer:</span>
              <span className="ml-1" style={{ color: color }}>{formatted.issuer}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <User className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: color }} />
            <div className="flex-1">
              <span className="opacity-60">Subject:</span>
              <span className="ml-1">{formatted.subject}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Target className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: color }} />
            <div className="flex-1">
              <span className="opacity-60">Audience:</span>
              <span className="ml-1">{formatted.audience}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Globe className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: color }} />
            <div className="flex-1">
              <span className="opacity-60">Resource:</span>
              <span className="ml-1">{formatted.resource}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Package className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: color }} />
            <div className="flex-1">
              <span className="opacity-60">Scopes:</span>
              <span className="ml-1">{formatScopes(formatted.scopes)}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-2 pt-1 border-t" style={{ borderColor: `${color}20` }}>
            <Clock className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: color }} />
            <div className="flex-1 space-y-0.5">
              <div>
                <span className="opacity-60">Issued:</span>
                <span className="ml-1 text-xs">{formatted.issuedAt}</span>
              </div>
              <div>
                <span className="opacity-60">Expires:</span>
                <span className="ml-1 text-xs">{formatted.expiresAt}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="h-full overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(4, 6, 20, 0.95) 100%)',
        backdropFilter: 'blur(10px)',
        borderLeft: '1px solid rgba(0, 212, 255, 0.2)'
      }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 p-3 border-b"
        style={{ 
          background: 'rgba(4, 6, 20, 0.9)',
          borderColor: 'rgba(0, 212, 255, 0.2)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <h2 
          className="text-lg font-bold flex items-center gap-2"
          style={{ color: '#00d4ff', fontFamily: 'Orbitron, sans-serif' }}
        >
          <Shield className="w-5 h-5" />
          JWT TOKENS
        </h2>
        <div className="text-xs mt-1" style={{ color: 'rgba(0, 212, 255, 0.6)' }}>
          Token Exchange Monitor
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* Packet Token */}
        {packetToken && (
          <div>
            <div 
              className="text-xs font-bold mb-2 uppercase tracking-wide"
              style={{ color: '#00ff88' }}
            >
              Current Packet Token
            </div>
            <TokenCard 
              title="Packet JWT"
              token={packetToken}
              isActive={true}
            />
          </div>
        )}

        {/* Node Tokens */}
        {Object.keys(nodeTokens).length > 0 && (
          <div>
            <div 
              className="text-xs font-bold mb-2 uppercase tracking-wide"
              style={{ color: '#b300ff' }}
            >
              Node Tokens
            </div>
            <div className="space-y-2">
              {Object.entries(nodeTokens).map(([nodeId, token]) => (
                <TokenCard
                  key={nodeId}
                  title={nodeId}
                  token={token}
                  isActive={nodeId === currentNodeId}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!packetToken && Object.keys(nodeTokens).length === 0 && (
          <div className="text-center py-8 opacity-60">
            <Shield className="w-12 h-12 mx-auto mb-2" style={{ color: '#1a1f3a' }} />
            <div className="text-sm">No tokens available</div>
            <div className="text-xs mt-1">Tokens will appear during authentication flow</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JwtTokenDisplay;