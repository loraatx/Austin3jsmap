import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { LandmarkData } from '../types';

// Fix for missing R3F types in the environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      cylinderGeometry: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
    }
  }
}

interface BuildingProps {
  data: LandmarkData;
  isSelected: boolean;
  onSelect: (landmark: LandmarkData) => void;
}

const Building: React.FC<BuildingProps> = ({ data, isSelected, onSelect }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  // Simple animation for selection
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Bobbing animation if selected
      if (isSelected) {
        meshRef.current.position.y = (data.position[1] + data.scale![1] / 2) + Math.sin(state.clock.elapsedTime * 2) * 0.5;
        meshRef.current.rotation.y += delta * 0.5;
      } else {
        // Reset position
        meshRef.current.position.y = THREE.MathUtils.lerp(
            meshRef.current.position.y,
            data.position[1] + data.scale![1] / 2,
            0.1
        );
        meshRef.current.rotation.y = 0;
      }
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect(data);
  };

  // Determine geometry based on type for visual variety
  const isCapitol = data.id === 'capitol';
  const isPark = data.type === 'park';
  const isWater = data.type === 'water';

  // Base opacity
  const opacity = isWater ? 0.6 : 1;
  const transparent = isWater;

  return (
    <group position={[data.position[0], 0, data.position[2]]}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
        position={[0, data.scale![1] / 2, 0]} // Center vertically based on height
      >
        {isCapitol ? (
            // Simplified Capitol shape
            <cylinderGeometry args={[2, 3, data.scale![1], 8]} />
        ) : isPark ? (
            <boxGeometry args={data.scale} />
        ) : (
            <boxGeometry args={data.scale} />
        )}
        
        <meshStandardMaterial
          color={hovered ? '#fff' : data.color}
          emissive={isSelected ? data.color : '#000'}
          emissiveIntensity={isSelected ? 0.5 : 0}
          roughness={isWater ? 0.1 : 0.7}
          metalness={isWater ? 0.8 : 0.1}
          transparent={transparent}
          opacity={opacity}
        />
      </mesh>
      
      {/* Label always visible if selected or hovered */}
      {(hovered || isSelected) && (
        <Html position={[0, data.scale![1] + 2, 0]} center distanceFactor={15} zIndexRange={[100, 0]}>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap border border-white/20 backdrop-blur-sm pointer-events-none">
            {data.name}
          </div>
        </Html>
      )}
      
      {/* Capitol Dome extra */}
      {isCapitol && (
        <mesh position={[0, data.scale![1] + 1, 0]}>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color="#E57373" />
        </mesh>
      )}
    </group>
  );
};

export default Building;