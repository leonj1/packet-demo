import React from 'react';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import { useState, useEffect } from 'react';

const NetworkCanvas = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight - 100
  });
  
  const [packetPosition, setPacketPosition] = useState({ x: 150, y: 200 });
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nodes = [
    { id: 'browser', name: 'Browser', x: 150, y: 200, width: 120, height: 60 },
    { id: 'okta', name: 'Okta', x: 350, y: 100, width: 120, height: 60 },
    { id: 'idp2', name: 'IdP2', x: 550, y: 100, width: 120, height: 60 },
    { id: 'permissions', name: 'Permissions', x: 750, y: 200, width: 120, height: 60 },
    { id: 'nextjs', name: 'NextJS App', x: 350, y: 300, width: 120, height: 60 },
    { id: 'api1', name: 'API 1', x: 550, y: 400, width: 120, height: 60 },
    { id: 'api2', name: 'API 2', x: 750, y: 400, width: 120, height: 60 },
    { id: 'database', name: 'Database', x: 950, y: 300, width: 120, height: 60 }
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

  const animatePacket = (fromNode, toNode) => {
    const steps = 30;
    let step = 0;
    
    const animate = () => {
      if (step <= steps) {
        const progress = step / steps;
        const x = fromNode.x + (toNode.x - fromNode.x) * progress + fromNode.width / 2;
        const y = fromNode.y + (toNode.y - fromNode.y) * progress + fromNode.height / 2;
        
        setPacketPosition({ x, y });
        step++;
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };
    
    setIsAnimating(true);
    animate();
  };

  const handleNext = () => {
    if (currentNodeIndex < connections.length - 1 && !isAnimating) {
      const connection = connections[currentNodeIndex];
      animatePacket(nodes[connection.from], nodes[connection.to]);
      setCurrentNodeIndex(currentNodeIndex + 1);
    }
  };

  const handleStart = () => {
    setCurrentNodeIndex(0);
    setPacketPosition({ 
      x: nodes[0].x + nodes[0].width / 2, 
      y: nodes[0].y + nodes[0].height / 2 
    });
  };

  return (
    <div className="w-full h-screen bg-gray-950 flex flex-col">
      <div className="p-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-100">Network Request Visualizer</h1>
          <button 
            onClick={handleStart}
            className="bg-green-600 hover:bg-green-700"
          >
            Start
          </button>
          <button 
            onClick={handleNext}
            disabled={isAnimating || currentNodeIndex >= connections.length - 1}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
      
      <Stage width={dimensions.width} height={dimensions.height}>
        <Layer>
          {/* Draw connections */}
          {connections.map((conn, index) => {
            const fromNode = nodes[conn.from];
            const toNode = nodes[conn.to];
            return (
              <Line
                key={index}
                points={[
                  fromNode.x + fromNode.width / 2,
                  fromNode.y + fromNode.height / 2,
                  toNode.x + toNode.width / 2,
                  toNode.y + toNode.height / 2
                ]}
                stroke="#374151"
                strokeWidth={2}
              />
            );
          })}
          
          {/* Draw nodes */}
          {nodes.map((node, index) => {
            const isActive = index === nodes.findIndex(n => 
              Math.abs(n.x + n.width/2 - packetPosition.x) < 10 && 
              Math.abs(n.y + n.height/2 - packetPosition.y) < 10
            );
            
            return (
              <React.Fragment key={node.id}>
                <Rect
                  x={node.x}
                  y={node.y}
                  width={node.width}
                  height={node.height}
                  fill={isActive ? '#1e40af' : '#1f2937'}
                  stroke={isActive ? '#3b82f6' : '#4b5563'}
                  strokeWidth={2}
                  cornerRadius={8}
                />
                <Text
                  x={node.x}
                  y={node.y + node.height / 2 - 8}
                  width={node.width}
                  text={node.name}
                  fontSize={14}
                  fill="#e5e7eb"
                  align="center"
                />
              </React.Fragment>
            );
          })}
          
          {/* Draw packet */}
          <Circle
            x={packetPosition.x}
            y={packetPosition.y}
            radius={8}
            fill="#10b981"
            shadowBlur={20}
            shadowColor="#10b981"
            shadowOpacity={0.8}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default NetworkCanvas;