"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useTexture, Float, Html, Environment } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Button } from "../ui/button";

// Sharp Icons for labels
const FastIcon = () => <span className="text-orange-500 text-xl">⚡</span>;
const ConnectIcon = () => <span className="text-blue-500 text-xl">📶</span>;
const BattIcon = () => <span className="text-green-500 text-xl">🔋</span>;
const NeuralIcon = () => <span className="text-pink-500 text-xl">🧠</span>;

function RotatingBall() {
  const texture = useTexture("/basketball.png");
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ballRef.current) ballRef.current.rotation.y += 0.005;
  });

  return (
    <mesh ref={ballRef} position={[0, 0, -2.5]}>
      <sphereGeometry args={[3.2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function FloatingJordan() {
  // 🔥 Ab hum assume kar rahe hain ki public/jordan.png transparent hai 🔥
  const texture = useTexture("/jordan.png");
  texture.anisotropy = 16;

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh position={[0, 0, 1.5]} rotation={[0, -0.3, 0.4]}>
        <planeGeometry args={[5, 5]} />
        {/* Transparent set true rakhna hai, and depthWrite need not be handled manually now */}
        <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} />
      </mesh>
    </Float>
  );
}

export function InteractiveProduct() {
  return (
    <div className="relative w-full h-screen min-h-[750px] flex flex-col items-center justify-center overflow-hidden bg-[#fafafa]">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/10 rounded-full blur-[160px] -z-10" />
      
      {/* Main 3D Canvas Container */}
      <div className="relative w-full max-w-5xl h-[65%] mt-8 flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={2} />
          <pointLight position={[10, 10, 10]} intensity={2.5} />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <RotatingBall />
            <FloatingJordan />
            <ContactShadows position={[0, -4, 0]} opacity={0.6} scale={20} blur={3} far={10} color="#666666" />

            {/* Labels in 3D space */}
            <Html position={[-3, 2, 0]} center zIndexRange={[100, 0]}>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-md border border-gray-100 whitespace-nowrap transition-all duration-300">
                <FastIcon /> <span className="text-sm font-bold text-black">Fast Charge 30min</span>
              </div>
            </Html>

            <Html position={[3.2, 1.2, 0]} center zIndexRange={[100, 0]}>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-md border border-gray-100 whitespace-nowrap transition-all duration-300">
                <ConnectIcon /> <span className="text-sm font-bold text-black">Connectivity 6.0</span>
              </div>
            </Html>

            <Html position={[-2.8, -1.8, 0]} center zIndexRange={[100, 0]}>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-md border border-gray-100 whitespace-nowrap transition-all duration-300">
                <BattIcon /> <span className="text-sm font-bold text-black">Battery 72h</span>
              </div>
            </Html>

            <Html position={[2.8, -2.5, 0]} center zIndexRange={[100, 0]}>
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-2 rounded-xl shadow-md border border-gray-100 whitespace-nowrap text-right transition-all duration-300">
                <NeuralIcon /> 
                <div className="flex flex-col leading-tight text-left">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Processor</span>
                  <span className="text-sm font-black text-black">Neural</span>
                </div>
              </div>
            </Html>
          </Suspense>

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Product Title & Button Below */}
      <div className="relative z-20 text-center mt-[-30px] px-4">
        <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-black uppercase">
          Nike Air Jordan 1 "Chicago"
        </h2>
        <p className="text-gray-500 mt-3 font-semibold tracking-widest text-sm uppercase">
          Interactive 3D View — Full Inspect
        </p>
        <Button size="lg" className="mt-8 bg-black text-white hover:bg-gray-800 px-12 py-7 rounded-full text-lg shadow-xl transition-transform hover:-translate-y-1">
          Watch Demo
        </Button>
      </div>

    </div>
  );
}