import React from 'react';
import { Stage, Layer, Rect, Text, Line, Circle, Group } from 'react-konva';
import { useState, useEffect } from 'react';
import { Zap, Shield, Globe, Database, Server, Cloud, Lock, Cpu } from 'lucide-react';

const NetworkCanvas = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 100
  });
  
  const [packetPosition, setPacketPosition] = useState({ x: 150, y: 200 });
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [packetTrail, setPacketTrail] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [connectionGlow, setConnectionGlow] = useState(-1);

  const nodes = [
    { id: 'browser', name: 'Browser', x: 150, y: 200, width: 120, height: 60, icon: Globe, color: '#00d4ff' },
    { id: 'okta', name: 'Okta', x: 350, y: 100, width: 120, height: 60, icon: Shield, color: '#b300ff' },
    { id: 'idp2', name: 'IdP2', x: 550, y: 100, width: 120, height: 60, icon: Lock, color: '#ff00ff' },
    { id: 'permissions', name: 'Permissions', x: 750, y: 200, width: 120, height: 60, icon: Shield, color: '#00ff88' },
    { id: 'nextjs', name: 'NextJS App', x: 350, y: 300, width: 120, height: 60, icon: Server, color: '#00d4ff' },
    { id: 'api1', name: 'API 1', x: 550, y: 400, width: 120, height: 60, icon: Cpu, color: '#ff6600' },
    { id: 'api2', name: 'API 2', x: 750, y: 400, width: 120, height: 60, icon: Cloud, color: '#ffff00' },
    { id: 'database', name: 'Database', x: 950, y: 300, width: 120, height: 60, icon: Database, color: '#00ff88' }
  ];

  const connections = [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 1, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },
    { from: 6, to: 7 },
    { from: 3, to: 7 }
  ];

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 100
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const animatePacket = (fromNode, toNode, connectionIndex) => {
    const steps = Math.floor(30 / animationSpeed);
    let step = 0;
    const trail = [];
    
    setConnectionGlow(connectionIndex);
    
    const animate = () => {
      if (step <= steps) {
        const progress = step / steps;
        const easeProgress = easeInOutCubic(progress);
        const x = fromNode.x + (toNode.x - fromNode.x) * easeProgress + fromNode.width / 2;
        const y = fromNode.y + (toNode.y - fromNode.y) * easeProgress + fromNode.height / 2;
        
        setPacketPosition({ x, y });
        
        // Add to trail
        if (step % 2 === 0) {
          trail.push({ x, y, opacity: 1 });
          if (trail.length > 5) trail.shift();
          setPacketTrail([...trail]);
        }
        
        // Fade trail
        trail.forEach((point, i) => {
          point.opacity = (i + 1) / trail.length * 0.6;
        });
        
        step++;
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setPacketTrail([]);
        setConnectionGlow(-1);
      }
    };
    
    setIsAnimating(true);
    animate();
  };

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const handleNext = () => {
    if (currentNodeIndex < connections.length - 1 && !isAnimating) {
      const connection = connections[currentNodeIndex];
      animatePacket(nodes[connection.from], nodes[connection.to], currentNodeIndex);
      setCurrentNodeIndex(currentNodeIndex + 1);
    }
  };

  const handleStart = () => {
    setCurrentNodeIndex(0);
    setPacketPosition({ 
      x: nodes[0].x + nodes[0].width / 2, 
      y: nodes[0].y + nodes[0].height / 2 
    });
    setPacketTrail([]);
  };

  const handleAutoPlay = () => {
    handleStart();
    let index = 0;
    const playNext = () => {
      if (index < connections.length) {
        const connection = connections[index];
        animatePacket(nodes[connection.from], nodes[connection.to], index);
        index++;
        setTimeout(playNext, 1500 / animationSpeed);
      }
    };
    setTimeout(playNext, 100);
  };

  return (
    <div className="w-full h-screen flex flex-col relative overflow-hidden" style={{ background: 'var(--cyber-darker)' }}>
      {/* Animated grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-dark-gradient opacity-30" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 h-px opacity-20 animate-scan" 
             style={{ background: 'linear-gradient(to right, transparent, var(--neon-blue), transparent)' }} />
      </div>
      
      {/* Header with controls */}
      <div className="relative z-10 p-4 backdrop-blur-sm" 
           style={{ 
             background: 'linear-gradient(to bottom, var(--cyber-dark), transparent)',
             borderBottom: '1px solid rgba(0, 212, 255, 0.2)'
           }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-transparent bg-cyber-gradient animate-pulse" 
                style={{ fontFamily: 'Orbitron, sans-serif' }}>
              NETWORK MATRIX
            </h1>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--neon-green)', fontFamily: 'monospace' }}>
              <Zap className="w-4 h-4 animate-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <label className="text-sm" style={{ color: 'var(--neon-blue)', fontFamily: 'monospace' }}>SPEED</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.5"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-sm" style={{ color: 'var(--neon-green)', fontFamily: 'monospace' }}>{animationSpeed}x</span>
            </div>
            
            <button 
              onClick={handleStart}
              className="btn-neon relative px-6 py-2 text-black font-bold rounded-lg border transition-all duration-300"
              style={{ 
                background: 'linear-gradient(to right, var(--neon-green), var(--neon-blue))',
                borderColor: 'rgba(0, 255, 136, 0.5)'
              }}
              onMouseEnter={(e) => e.target.style.boxShadow = '0 0 30px rgba(0, 255, 136, 0.5)'}
              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
            >
              <span className="relative z-10">INITIALIZE</span>
            </button>
            
            <button 
              onClick={handleNext}
              disabled={isAnimating || currentNodeIndex >= connections.length - 1}
              className="btn-neon relative px-6 py-2 text-white font-bold rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: 'linear-gradient(to right, var(--neon-blue), var(--neon-purple))',
                borderColor: 'rgba(0, 212, 255, 0.5)'
              }}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.5)')}
              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
            >
              <span className="relative z-10">TRANSMIT →</span>
            </button>
            
            <button 
              onClick={handleAutoPlay}
              disabled={isAnimating}
              className="btn-neon relative px-6 py-2 text-white font-bold rounded-lg border transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: 'linear-gradient(to right, var(--neon-purple), var(--neon-pink))',
                borderColor: 'rgba(179, 0, 255, 0.5)'
              }}
              onMouseEnter={(e) => !e.target.disabled && (e.target.style.boxShadow = '0 0 30px rgba(179, 0, 255, 0.5)')}
              onMouseLeave={(e) => e.target.style.boxShadow = 'none'}
            >
              <span className="relative z-10">▶ AUTO</span>
            </button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'var(--cyber-light)' }}>
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${(currentNodeIndex / connections.length) * 100}%`,
              background: 'linear-gradient(to right, var(--neon-green), var(--neon-blue), var(--neon-purple))'
            }}
          />
        </div>
      </div>
      
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Draw connections with glow effect */}
          {connections.map((conn, index) => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            const isActive = index === connectionGlow;
            
            return (
              <Group key={index}>
                {/* Glow layer */}
                {isActive && (
                  <Line
                    points={[
                      fromNode.x + fromNode.width / 2,
                      fromNode.y + fromNode.height / 2,
                      toNode.x + toNode.width / 2,
                      toNode.y + toNode.height / 2
                    ]}
                    stroke="#00d4ff"
                    strokeWidth={8}
                    opacity={0.3}
                    shadowBlur={20}
                    shadowColor="#00d4ff"
                  />
                )}
                {/* Main line */}
                <Line
                  points={[
                    fromNode.x + fromNode.width / 2,
                    fromNode.y + fromNode.height / 2,
                    toNode.x + toNode.width / 2,
                    toNode.y + toNode.height / 2
                  ]}
                  stroke={isActive ? "#00d4ff" : "#1a1f3a"}
                  strokeWidth={isActive ? 3 : 2}
                  opacity={isActive ? 1 : 0.5}
                  dash={isActive ? [] : [5, 5]}
                />
              </Group>
            );
          })}
          
          {/* Draw nodes */}
          {nodes.map((node, index) => {
            const isActive = index === nodes.findIndex(n => 
              Math.abs(n.x + n.width/2 - packetPosition.x) < 10 && 
              Math.abs(n.y + n.height/2 - packetPosition.y) < 10
            );
            const nodeColor = node.color;
            
            return (
              <Group 
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Node glow effect */}
                {(isActive || hoveredNode === node.id) && (
                  <Rect
                    x={node.x - 5}
                    y={node.y - 5}
                    width={node.width + 10}
                    height={node.height + 10}
                    fill="transparent"
                    stroke={nodeColor}
                    strokeWidth={2}
                    cornerRadius={12}
                    shadowBlur={30}
                    shadowColor={nodeColor}
                    opacity={0.5}
                  />
                )}
                
                {/* Main node */}
                <Rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  fill={isActive ? `${nodeColor}20` : '#0a0e27'}
                  stroke={isActive ? nodeColor : hoveredNode === node.id ? nodeColor : '#1a1f3a'}
                  strokeWidth={2}
                  cornerRadius={8}
                />
                
                {/* Node label */}
                <Text
                  x={node.x}
                  y={node.y + node.height / 2 - 8}
                  width={node.width}
                  text={node.name}
                  fontSize={14}
                  fontFamily="Courier New"
                  fill={isActive || hoveredNode === node.id ? nodeColor : "#e5e7eb"}
                  align="center"
                />
                
                {/* Hover info */}
                {hoveredNode === node.id && (
                  <Group>
                    <Rect
                      x={node.x + node.width + 10}
                      y={node.y}
                      width={150}
                      height={50}
                      fill="#0a0e27"
                      stroke={nodeColor}
                      strokeWidth={1}
                      cornerRadius={4}
                      opacity={0.9}
                    />
                    <Text
                      x={node.x + node.width + 20}
                      y={node.y + 10}
                      text={`ID: ${node.id}`}
                      fontSize={12}
                      fontFamily="Courier New"
                      fill={nodeColor}
                    />
                    <Text
                      x={node.x + node.width + 20}
                      y={node.y + 28}
                      text={`Status: ${isActive ? 'ACTIVE' : 'IDLE'}`}
                      fontSize={12}
                      fontFamily="Courier New"
                      fill={isActive ? '#00ff88' : '#e5e7eb'}
                    />
                  </Group>
                )}
              </Group>
            );
          })}
          
          {/* Draw packet trail */}
          {packetTrail.map((point, index) => (
            <Circle
              key={index}
              x={point.x}
              y={point.y}
              radius={6 - index}
              fill="#00ff88"
              opacity={point.opacity}
              shadowBlur={10}
              shadowColor="#00ff88"
            />
          ))}
          
          {/* Draw main packet */}
          <Group>
            {/* Outer glow */}
            <Circle
              x={packetPosition.x}
              y={packetPosition.y}
              radius={15}
              fill="#00ff88"
              opacity={0.2}
              shadowBlur={30}
              shadowColor="#00ff88"
            />
            {/* Middle ring */}
            <Circle
              x={packetPosition.x}
              y={packetPosition.y}
              radius={10}
              fill="transparent"
              stroke="#00ff88"
              strokeWidth={2}
              opacity={0.6}
            />
            {/* Core */}
            <Circle
              x={packetPosition.x}
              y={packetPosition.y}
              radius={6}
              fill="#00ff88"
              shadowBlur={20}
              shadowColor="#00ff88"
              shadowOpacity={1}
            />
          </Group>
        </Layer>
      </Stage>
      
      {/* Status bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2" 
           style={{ background: 'linear-gradient(to top, var(--cyber-dark), transparent)' }}>
        <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'monospace' }}>
          <div className="flex items-center gap-4">
            <span style={{ color: 'var(--neon-green)' }}>● CONNECTED</span>
            <span style={{ color: 'var(--neon-blue)' }}>PACKETS: {currentNodeIndex}/{connections.length}</span>
            <span style={{ color: 'var(--neon-purple)' }}>LATENCY: {Math.floor(Math.random() * 50)}ms</span>
          </div>
          <div style={{ color: 'rgba(0, 212, 255, 0.6)' }}>
            SYSTEM v2.0.1 | SECURE CHANNEL ACTIVE
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkCanvas;