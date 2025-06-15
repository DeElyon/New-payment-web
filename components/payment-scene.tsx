"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, Float, Text3D, Html, Stars } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import type { Group, Mesh } from "three"
import { useTheme } from "next-themes"
import { Loader } from "@/components/ui/loader"
import * as THREE from "three"

// Simple loading fallback that doesn't use useProgress
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <Loader size="lg" className="mb-4" />
        <div className="text-sm font-medium text-primary">Loading 3D scene...</div>
      </div>
    </Html>
  )
}

// Animated logo component
function Logo() {
  const groupRef = useRef<Group>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  // Pulse animation for the logo
  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the logo gently
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2

      // Add a subtle floating effect when clicked
      if (clicked) {
        groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1
      }
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={clicked ? 1.5 : 0.5} floatingRange={[-0.1, 0.1]}>
        <Text3D
          font="/fonts/Geist_Bold.json"
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          position={[-4.5, 0, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
        >
          ELCODERS
          <meshStandardMaterial
            color={hovered ? "#4dabf7" : isDark ? "#3498db" : "#0066a1"}
            metalness={0.8}
            roughness={0.2}
            emissive={hovered ? "#1c7ed6" : "#000000"}
            emissiveIntensity={hovered ? 0.5 : 0}
          />
        </Text3D>
      </Float>

      {/* Base platform with glow effect */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[5, 5, 0.1, 64]} />
        <meshStandardMaterial
          color={isDark ? "#1e3a5f" : "#e0f2fe"}
          metalness={0.2}
          roughness={0.8}
          emissive={isDark ? "#1e3a5f" : "#e0f2fe"}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Animated ring around the platform */}
      <AnimatedRing />

      {/* Animated spheres */}
      <AnimatedSphere position={[-3, 2, -2]} color="#0066a1" speed={1.5} scale={clicked ? 1.2 : 1} />
      <AnimatedSphere position={[3, 1.5, -1]} color="#4dabf7" speed={2} scale={clicked ? 1.2 : 1} />
      <AnimatedSphere position={[4, -1, -3]} color="#74c0fc" speed={1} scale={clicked ? 1.2 : 1} />
      <AnimatedSphere position={[-4, -0.5, -2]} color="#1864ab" speed={1.8} scale={clicked ? 1.2 : 1} />
      <AnimatedSphere position={[0, 3, -4]} color="#339af0" speed={1.2} scale={clicked ? 1.2 : 1} />

      {/* Payment symbols that float around */}
      <PaymentSymbol position={[-2.5, 0, 2]} symbol="₦" />
      <PaymentSymbol position={[2.5, 0, 2]} symbol="$" />
      <PaymentSymbol position={[0, 2, 2]} symbol="₮" />

      {/* Hint text */}
      <Html position={[0, -3, 0]} center>
        <div className="text-xs text-center opacity-70 pointer-events-none">Click on elements to interact</div>
      </Html>
    </group>
  )
}

// Animated ring component
function AnimatedRing() {
  const ringRef = useRef<Mesh>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.5

      // Pulse scale animation
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05
      ringRef.current.scale.set(scale, scale, 1)
    }
  })

  return (
    <mesh ref={ringRef} position={[0, -1.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[5.2, 5.4, 64]} />
      <meshStandardMaterial
        color={isDark ? "#4dabf7" : "#0066a1"}
        emissive={isDark ? "#4dabf7" : "#0066a1"}
        emissiveIntensity={0.5}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Animated sphere component
function AnimatedSphere({
  position,
  color,
  speed,
  scale = 1,
}: {
  position: [number, number, number]
  color: string
  speed: number
  scale?: number
}) {
  const ref = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (ref.current) {
      // Vertical bobbing motion
      ref.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * speed) * 0.3

      // Gentle rotation
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.5
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.3

      // Scale effect when clicked
      if (clicked) {
        ref.current.scale.x = scale * (1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.1)
        ref.current.scale.y = scale * (1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.1)
        ref.current.scale.z = scale * (1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.1)
      } else {
        ref.current.scale.x = scale * (hovered ? 1.2 : 1)
        ref.current.scale.y = scale * (hovered ? 1.2 : 1)
        ref.current.scale.z = scale * (hovered ? 1.2 : 1)
      }
    }
  })

  return (
    <mesh
      ref={ref}
      position={[position[0], position[1], position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => setClicked(!clicked)}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color={hovered ? "#74c0fc" : color}
        metalness={0.4}
        roughness={0.2}
        emissive={hovered ? "#74c0fc" : color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
    </mesh>
  )
}

// Payment symbol component
function PaymentSymbol({ position, symbol }: { position: [number, number, number]; symbol: string }) {
  const ref = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (ref.current) {
      // Orbit around the center
      const angle = state.clock.getElapsedTime() * 0.5
      ref.current.position.x = position[0] * Math.cos(angle)
      ref.current.position.z = position[0] * Math.sin(angle)

      // Always face the camera
      ref.current.rotation.y = angle + Math.PI

      // Hover effect
      ref.current.scale.x = hovered ? 1.5 : 1
      ref.current.scale.y = hovered ? 1.5 : 1
      ref.current.scale.z = hovered ? 1.5 : 1
    }
  })

  return (
    <group ref={ref} position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
      <Text3D font="/fonts/Geist_Bold.json" size={0.5} height={0.1} curveSegments={12} bevelEnabled={false}>
        {symbol}
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.8}
          roughness={0.2}
          emissive="#ffffff"
          emissiveIntensity={hovered ? 1 : 0.5}
        />
      </Text3D>
    </group>
  )
}

// Camera controller for smooth animations
function CameraController() {
  const { camera } = useThree()
  const [targetPosition] = useState(new THREE.Vector3(0, 0, 10))

  useFrame(() => {
    // Smoothly move camera to target position
    camera.position.lerp(targetPosition, 0.05)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Main scene component
export default function PaymentScene() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border relative">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
        <CameraController />

        <color attach="background" args={["#000000"]} />
        <fog attach="fog" args={["#000000", 10, 20]} />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} color="#4dabf7" intensity={0.5} />

        <Suspense fallback={<LoadingFallback />}>
          <Logo />
          <Environment preset="city" />
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Overlay instructions */}
      <div className="absolute bottom-2 left-2 right-2 text-center text-xs text-white bg-black/50 p-1 rounded">
        Drag to rotate • Click elements to interact
      </div>
    </div>
  )
}
