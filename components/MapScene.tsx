import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { AUSTIN_LANDMARKS } from '../constants';
import { LandmarkData } from '../types';
import Building from './Building';

// Fix for missing R3F types in the environment
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      planeGeometry: any;
      meshStandardMaterial: any;
      fog: any;
    }
  }
}

interface MapSceneProps {
  selectedLandmark: LandmarkData | null;
  onSelectLandmark: (landmark: LandmarkData) => void;
}

// Controls component to handle camera movement
const CameraController: React.FC<{ selectedLandmark: LandmarkData | null }> = ({ selectedLandmark }) => {
  const { camera, controls } = useThree();
  const vec = new THREE.Vector3();

  useEffect(() => {
    if (selectedLandmark) {
      const [x, y, z] = selectedLandmark.position;
      const targetPosition = new THREE.Vector3(x, y, z);
      
      // Calculate offset for camera based on landmark size
      const offset = Math.max(
          selectedLandmark.scale?.[0] || 5, 
          selectedLandmark.scale?.[1] || 5, 
          selectedLandmark.scale?.[2] || 5
      ) * 2 + 15;

      const cameraPos = new THREE.Vector3(x + offset, y + offset, z + offset);
      
      // Smoothly animate camera
      // Note: In a real app we might use 'drei/CameraControls' or 'tween', 
      // but simple lerping in useFrame or direct assignment for this demo works.
      // We will just snap for responsiveness in this lightweight demo, 
      // or rely on OrbitControls damping if we manually set target.
      
      // @ts-ignore - OrbitControls type definition issues
      if (controls) {
          // @ts-ignore
          controls.target.set(x, 0, z);
          camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
          // @ts-ignore
          controls.update();
      }
    }
  }, [selectedLandmark, camera, controls]);

  return null;
};

const MapScene: React.FC<MapSceneProps> = ({ selectedLandmark, onSelectLandmark }) => {
  return (
    <div className="w-full h-full bg-gray-900">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[50, 50, 50]} fov={50} />
        <CameraController selectedLandmark={selectedLandmark} />
        
        <OrbitControls 
          maxPolarAngle={Math.PI / 2 - 0.1} // Don't go below ground
          minDistance={10}
          maxDistance={200}
          enableDamping
          dampingFactor={0.05}
        />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[50, 50, 25]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[1024, 1024]} 
        />
        
        <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Ground Grid */}
        <Grid 
          position={[0, -0.1, 0]} 
          args={[300, 300]} 
          cellColor="#4B5563" 
          sectionColor="#6B7280" 
          fadeDistance={150}
        />
        
        {/* Base Plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]} receiveShadow>
          <planeGeometry args={[500, 500]} />
          <meshStandardMaterial color="#1f2937" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Landmarks */}
        {AUSTIN_LANDMARKS.map((landmark) => (
          <Building 
            key={landmark.id} 
            data={landmark} 
            isSelected={selectedLandmark?.id === landmark.id}
            onSelect={onSelectLandmark}
          />
        ))}
        
        {/* Environmental Fog */}
        <fog attach="fog" args={['#111827', 30, 250]} />
      </Canvas>
    </div>
  );
};

export default MapScene;