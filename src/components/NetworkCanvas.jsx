import React from 'react';
import { Stage, Layer, Rect, Text, Line, Circle, Group } from 'react-konva';
import { useState, useEffect } from 'react';
import { Zap, Shield, Globe, Database, Server, Cloud, Lock, Cpu } from 'lucide-react';
import ScenarioSelector from './ScenarioSelector';
import NavigationControls from './NavigationControls';
import JwtTokenDisplay from './JwtTokenDisplay';
import { loadScenario } from '../utils/scenarioLoader';
import { getTokenSummary } from '../utils/jwtHelpers';

const NetworkCanvas = () => {
  const HUD_WIDTH = 340; // Width of JWT HUD panel + gap
  const MIN_CANVAS_WIDTH = 800;
  
  const [dimensions, setDimensions] = useState({
    width: Math.max(window.innerWidth - HUD_WIDTH, MIN_CANVAS_WIDTH),
    height: window.innerHeight - 100
  });
  
  const [packetPosition, setPacketPosition] = useState({ x: 150, y: 200 });
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [packetTrail, setPacketTrail] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [connectionGlow, setConnectionGlow] = useState(-1);
  const [currentScenario, setCurrentScenario] = useState('auth-flow-default');
  const [scenarioData, setScenarioData] = useState(null);
  const [isLoadingScenario, setIsLoadingScenario] = useState(true);
  const [scenarioError, setScenarioError] = useState(null);
  const [nodeTokens, setNodeTokens] = useState({});
  const [packetToken, setPacketToken] = useState(null);
  const [currentNodeAtPacket, setCurrentNodeAtPacket] = useState(null);

  // Icon mapping for scenarios
  const iconMap = {
    'Globe': Globe,
    'Shield': Shield,
    'Lock': Lock,
    'Server': Server,
    'Cpu': Cpu,
    'Cloud': Cloud,
    'Database': Database,
    'Zap': Zap
  };

  // Get current scenario data
  const nodes = scenarioData?.nodes || [];
  const connections = scenarioData?.connections || [];
  const platformBoxes = scenarioData?.platformBoxes || [];

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: Math.max(window.innerWidth - HUD_WIDTH, MIN_CANVAS_WIDTH),
        height: window.innerHeight - 100
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [HUD_WIDTH, MIN_CANVAS_WIDTH]);

  // Load initial scenario
  useEffect(() => {
    loadScenarioData(currentScenario);
  }, []);

  // Update packet position and tokens when scenario data changes
  useEffect(() => {
    if (scenarioData?.nodes && scenarioData.nodes.length > 0) {
      const firstNode = scenarioData.nodes[0];
      setPacketPosition({ 
        x: firstNode.x + firstNode.width / 2, 
        y: firstNode.y + firstNode.height / 2 
      });
      
      // Initialize node tokens
      const tokens = {};
      scenarioData.nodes.forEach(node => {
        if (node.token) {
          tokens[node.id] = node.token;
        }
      });
      setNodeTokens(tokens);
      
      // Set initial packet token if first node has one
      if (firstNode.token) {
        setPacketToken(firstNode.token);
        setCurrentNodeAtPacket(firstNode.id);
      }
    }
  }, [scenarioData]);

  const loadScenarioData = async (scenarioId) => {
    try {
      setIsLoadingScenario(true);
      setScenarioError(null);
      const data = await loadScenario(scenarioId);
      setScenarioData(data);
    } catch (error) {
      console.error('Failed to load scenario data:', error);
      setScenarioError(error.message);
    } finally {
      setIsLoadingScenario(false);
    }
  };

  const animatePacket = (fromNode, toNode, connectionIndex) => {
    const steps = Math.floor(30 / animationSpeed);
    let step = 0;
    const trail = [];
    
    setConnectionGlow(connectionIndex);
    
    // Update packet token based on connection
    const connection = connections[connectionIndex];
    if (connection?.tokenExchange?.token) {
      setPacketToken(connection.tokenExchange.token);
    }
    
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
        setCurrentNodeAtPacket(toNode.id);
      }
    };
    
    setIsAnimating(true);
    animate();
  };

  const animatePacketBackward = (fromNode, toNode, connectionIndex) => {
    const steps = Math.floor(30 / animationSpeed);
    let step = 0;
    const trail = [];
    
    setConnectionGlow(connectionIndex);
    
    // When going backward, use the previous connection's token or the origin node's token
    if (connectionIndex > 0) {
      const prevConnection = connections[connectionIndex - 1];
      if (prevConnection?.tokenExchange?.token) {
        setPacketToken(prevConnection.tokenExchange.token);
      }
    } else if (toNode.token) {
      setPacketToken(toNode.token);
    }
    
    const animate = () => {
      if (step <= steps) {
        const progress = step / steps;
        const easeProgress = easeInOutCubic(progress);
        const x = fromNode.x + (toNode.x - fromNode.x) * easeProgress + fromNode.width / 2;
        const y = fromNode.y + (toNode.y - fromNode.y) * easeProgress + fromNode.height / 2;
        
        setPacketPosition({ x, y });
        
        // Add to trail (for backward animation, we reverse the trail effect)
        if (step % 2 === 0) {
          trail.unshift({ x, y, opacity: 1 });
          if (trail.length > 5) trail.pop();
          setPacketTrail([...trail]);
        }
        
        // Fade trail
        trail.forEach((point, i) => {
          point.opacity = (trail.length - i) / trail.length * 0.6;
        });
        
        step++;
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        setPacketTrail([]);
        setConnectionGlow(-1);
        setCurrentNodeAtPacket(toNode.id);
      }
    };
    
    setIsAnimating(true);
    animate();
  };

  const easeInOutCubic = (t) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const handleNext = () => {
    if (currentNodeIndex < connections.length && !isAnimating) {
      const connection = connections[currentNodeIndex];
      animatePacket(nodes[connection.from], nodes[connection.to], currentNodeIndex);
      setCurrentNodeIndex(currentNodeIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentNodeIndex > 0 && !isAnimating) {
      const prevConnectionIndex = currentNodeIndex - 1;
      const connection = connections[prevConnectionIndex];
      // Animate backward from current position to previous node
      animatePacketBackward(nodes[connection.to], nodes[connection.from], prevConnectionIndex);
      setCurrentNodeIndex(currentNodeIndex - 1);
    }
  };

  const handleStart = () => {
    setCurrentNodeIndex(0);
    if (nodes.length > 0) {
      const firstNode = nodes[0];
      setPacketPosition({ 
        x: firstNode.x + firstNode.width / 2, 
        y: firstNode.y + firstNode.height / 2 
      });
      // Reset packet token to first node's token
      if (firstNode.token) {
        setPacketToken(firstNode.token);
      } else {
        setPacketToken(null);
      }
      setCurrentNodeAtPacket(firstNode.id);
    }
    setPacketTrail([]);
  };

  const handleAutoPlay = () => {
    if (connections.length === 0) {
      console.warn('No connections available for auto-play');
      return;
    }
    
    handleStart();
    let index = 0;
    const playNext = () => {
      if (index < connections.length && !isAnimating) {
        const connection = connections[index];
        if (nodes[connection.from] && nodes[connection.to]) {
          animatePacket(nodes[connection.from], nodes[connection.to], index);
          setCurrentNodeIndex(index + 1);
          index++;
          setTimeout(playNext, 1500 / animationSpeed);
        } else {
          console.error('Invalid connection nodes at index', index);
        }
      }
    };
    setTimeout(playNext, 100);
  };

  const handleScenarioChange = async (scenarioId) => {
    console.log('Scenario changed to:', scenarioId);
    setCurrentScenario(scenarioId);
    
    // Reset animation state when changing scenarios
    setCurrentNodeIndex(0);
    setPacketTrail([]);
    setIsAnimating(false);
    setConnectionGlow(-1);
    setPacketToken(null);
    setNodeTokens({});
    setCurrentNodeAtPacket(null);
    
    // Load new scenario data
    await loadScenarioData(scenarioId);
    
    // Reset packet position to first node of new scenario
    if (scenarioData?.nodes && scenarioData.nodes.length > 0) {
      const firstNode = scenarioData.nodes[0];
      setPacketPosition({ 
        x: firstNode.x + firstNode.width / 2, 
        y: firstNode.y + firstNode.height / 2 
      });
      if (firstNode.token) {
        setPacketToken(firstNode.token);
        setCurrentNodeAtPacket(firstNode.id);
      }
    }
  };

  // Show loading state
  if (isLoadingScenario) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: 'var(--cyber-darker)' }}>
        <div className="text-center">
          <div className="animate-pulse text-xl mb-4" style={{ color: 'var(--neon-blue)', fontFamily: 'Orbitron, sans-serif' }}>
            LOADING SCENARIO...
          </div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (scenarioError) {
    return (
      <div className="w-full h-screen flex items-center justify-center" style={{ background: 'var(--cyber-darker)' }}>
        <div className="text-center">
          <div className="text-xl mb-4" style={{ color: 'var(--neon-red, #ff4444)', fontFamily: 'Orbitron, sans-serif' }}>
            SCENARIO LOAD ERROR
          </div>
          <div className="text-sm" style={{ color: 'var(--neon-blue)', fontFamily: 'monospace' }}>
            {scenarioError}
          </div>
          <button 
            onClick={() => loadScenarioData(currentScenario)}
            className="mt-4 px-6 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-500 hover:text-black transition-colors"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden" style={{ background: 'var(--cyber-darker)' }}>
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
          
          <div className="flex items-center gap-6">
            {/* Scenario Selector */}
            <ScenarioSelector 
              onScenarioChange={handleScenarioChange}
              currentScenario={currentScenario}
            />
            
            <NavigationControls
              onStart={handleStart}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onAutoPlay={handleAutoPlay}
              canGoNext={currentNodeIndex < connections.length}
              canGoPrevious={currentNodeIndex > 0}
              isAnimating={isAnimating}
              animationSpeed={animationSpeed}
              onSpeedChange={setAnimationSpeed}
              currentStep={currentNodeIndex}
              totalSteps={connections.length}
            />
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-3 h-1 rounded-full overflow-hidden relative" style={{ background: 'var(--cyber-light)' }}>
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${(currentNodeIndex / connections.length) * 100}%`,
              background: 'linear-gradient(to right, var(--neon-green), var(--neon-blue), var(--neon-purple))'
            }}
          />
          {/* Progress steps indicator */}
          <div className="absolute top-0 left-0 right-0 h-full flex">
            {connections.map((_, index) => (
              <div
                key={index}
                className="flex-1 border-r border-gray-600 last:border-r-0 relative"
              >
                {index < currentNodeIndex && (
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-500 to-blue-500 opacity-80" />
                )}
                {index === currentNodeIndex - 1 && isAnimating && (
                  <div className="absolute top-0 left-0 w-full h-full bg-yellow-400 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content area with canvas and HUD */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Canvas area */}
        <div className="flex-1" style={{ minWidth: `${MIN_CANVAS_WIDTH}px` }}>
          <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Draw Platform boxes */}
          {platformBoxes.map((platformBox) => (
            <Group key={platformBox.id}>
              {/* Platform box */}
              <Rect
                x={platformBox.x}
                y={platformBox.y}
                width={platformBox.width}
                height={platformBox.height}
                fill="transparent"
                stroke={platformBox.color}
                strokeWidth={1}
                cornerRadius={4}
                opacity={platformBox.opacity}
                dash={[5, 5]}
              />
              
              {/* Platform label background */}
              <Rect
                x={platformBox.x + platformBox.width / 2 - platformBox.name.length * 3}
                y={platformBox.y - 12}
                width={platformBox.name.length * 6}
                height={16}
                fill="#040614"
                cornerRadius={2}
              />
              
              {/* Platform label */}
              <Text
                x={platformBox.x + platformBox.width / 2 - platformBox.name.length * 3 + 5}
                y={platformBox.y - 10}
                text={platformBox.name}
                fontSize={12}
                fontFamily="Courier New"
                fill={platformBox.color}
                opacity={0.7}
              />
            </Group>
          ))}
          
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
                      width={200}
                      height={70}
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
                    <Text
                      x={node.x + node.width + 20}
                      y={node.y + 46}
                      text={`Token: ${node.token ? getTokenSummary(node.token) : 'None'}`}
                      fontSize={10}
                      fontFamily="Courier New"
                      fill={nodeColor}
                      width={180}
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
        </div>
        
        {/* JWT Token Display HUD */}
        <div className="flex-shrink-0" style={{ width: '320px' }}>
          <JwtTokenDisplay 
            nodeTokens={nodeTokens}
            packetToken={packetToken}
            currentNodeId={currentNodeAtPacket}
          />
        </div>
      </div>
      
      {/* Status bar */}
      <div className="relative z-10 p-2" 
           style={{ background: 'linear-gradient(to top, var(--cyber-dark), transparent)' }}>
        <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'monospace' }}>
          <div className="flex items-center gap-4">
            <span style={{ color: 'var(--neon-green)' }}>● CONNECTED</span>
            <span style={{ color: 'var(--neon-blue)' }}>PACKETS: {currentNodeIndex}/{connections.length}</span>
            <span style={{ color: 'var(--neon-purple)' }}>LATENCY: {Math.floor(Math.random() * 50)}ms</span>
            {packetToken && (
              <span style={{ color: 'var(--neon-yellow)' }}>JWT: {getTokenSummary(packetToken)}</span>
            )}
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