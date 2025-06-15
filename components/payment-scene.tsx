"use client"

import { Canvas } from "@react-three/fiber"
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Float,
  Text3D,
  Html,
  Stars,
  Sphere,
  Box,
  Torus,
} from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import type { Group } from "three"
import { useTheme } from "next-themes"
import { Loader } from "@/components/ui/loader"
import * as THREE from "three"

// Enhanced loading fallback
function LoadingFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/80 backdrop-blur-sm rounded-lg border border-cyan-400/30">
        <Loader size="lg" className="mb-4" />
        <div className="text-sm font-medium text-cyan-400">Loading 3D Experience...</div>
        <div className="text-xs text-cyan-300/70 mt-1">Initializing quantum interface</div>
      </div>
    </Html>
  )
}

// Enhanced animated logo with cool tech colors
function TechLogo() {
  const groupRef = useRef<Group>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (groupRef.current) {
      // Smooth rotation animation
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1

      // Floating effect
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        {/* Main logo text with cool gradient effect */}
        <Text3D
          font="/fonts/Geist_Bold.json"
          size={1.2}
          height={0.3}
          curveSegments={16}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={8}
          position={[-3.5, 0, 0]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
        >
          ELCODERS
          <meshStandardMaterial
            color={hovered ? "#00ffff" : "#00d4ff"}
            metalness={0.9}
            roughness={0.1}
            emissive={hovered ? "#0099cc" : "#003366"}
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </Text3D>

        {/* Subtitle with neon effect */}
        <Text3D font="/fonts/Geist_Regular.json" size={0.3} height={0.1} position={[-2.5, -1, 0]}>
          PAYMENT PORTAL
          <meshStandardMaterial
            color="#00ffaa"
            metalness={0.7}
            roughness={0.2}
            emissive="#004433"
            emissiveIntensity={0.3}
          />
        </Text3D>
      </Float>

      {/* Holographic platform */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[6, 6, 0.2, 64]} />
        <meshStandardMaterial
          color="#001133"
          metalness={0.9}
          roughness={0.1}
          emissive="#002266"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Animated tech elements */}
      <TechElements clicked={clicked} />

      {/* Payment symbols with cool colors */}
      <PaymentSymbols />

      {/* Floating data particles */}
      <DataParticles />
    </group>
  )
}

// Enhanced tech elements with cool colors
function TechElements({ clicked }: { clicked: boolean }) {
  const elementsRef = useRef<Group>(null)

  useFrame((state) => {
    if (elementsRef.current) {
      elementsRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group ref={elementsRef}>
      {/* Floating geometric shapes with cool colors */}
      <Float speed={2} rotationIntensity={1} floatIntensity={0.8}>
        <Box position={[-4, 2, -2]} args={[0.5, 0.5, 0.5]}>
          <meshStandardMaterial
            color="#00ffaa"
            metalness={0.8}
            roughness={0.2}
            emissive="#004433"
            emissiveIntensity={0.3}
          />
        </Box>
      </Float>

      <Float speed={1.5} rotationIntensity={0.8} floatIntensity={1}>
        <Torus position={[4, 1, -3]} args={[0.8, 0.3, 16, 32]}>
          <meshStandardMaterial
            color="#ff6b9d"
            metalness={0.7}
            roughness={0.3}
            emissive="#662244"
            emissiveIntensity={0.4}
          />
        </Torus>
      </Float>

      <Float speed={2.5} rotationIntensity={1.2} floatIntensity={0.6}>
        <Sphere position={[0, 3, -4]} args={[0.6, 32, 32]}>
          <meshStandardMaterial
            color="#4ecdc4"
            metalness={0.9}
            roughness={0.1}
            emissive="#1a4d4a"
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Float>
    </group>
  )
}

// Enhanced payment symbols with cool neon colors
function PaymentSymbols() {
  const symbolsRef = useRef<Group>(null)

  useFrame((state) => {
    if (symbolsRef.current) {
      symbolsRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  const symbols = [
    { symbol: "₦", position: [-3, 0, 3], color: "#00d4ff", emissive: "#003366" },
    { symbol: "$", position: [3, 0, 3], color: "#00ffaa", emissive: "#004433" },
    { symbol: "€", position: [0, 2, 3], color: "#ff6b9d", emissive: "#662244" },
    { symbol: "£", position: [-1.5, -1, 3], color: "#4ecdc4", emissive: "#1a4d4a" },
    { symbol: "¥", position: [1.5, -1, 3], color: "#a78bfa", emissive: "#3d2a66" },
  ]

  return (
    <group ref={symbolsRef}>
      {symbols.map((item, index) => (
        <Float key={index} speed={1 + index * 0.2} rotationIntensity={0.5} floatIntensity={0.8}>
          <Text3D
            font="/fonts/Geist_Bold.json"
            size={0.6}
            height={0.2}
            position={item.position as [number, number, number]}
          >
            {item.symbol}
            <meshStandardMaterial
              color={item.color}
              metalness={0.8}
              roughness={0.2}
              emissive={item.emissive}
              emissiveIntensity={0.6}
            />
          </Text3D>
        </Float>
      ))}
    </group>
  )
}

// Data particles with cool tech colors
function DataParticles() {
  const particlesRef = useRef<Group>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  const particles = Array.from({ length: 30 }, (_, i) => ({
    position: [(Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 15] as [
      number,
      number,
      number,
    ],
    scale: Math.random() * 0.1 + 0.05,
    color: [
      "#00d4ff",
      "#00ffaa",
      "#ff6b9d",
      "#4ecdc4",
      "#a78bfa",
      "#fbbf24",
      "#f472b6",
      "#34d399",
      "#60a5fa",
      "#c084fc",
    ][Math.floor(Math.random() * 10)],
  }))

  return (
    <group ref={particlesRef}>
      {particles.map((particle, index) => (
        <Float key={index} speed={1 + Math.random()} rotationIntensity={2} floatIntensity={1}>
          <Sphere position={particle.position} args={[particle.scale, 8, 8]}>
            <meshStandardMaterial
              color={particle.color}
              emissive={particle.color}
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </Sphere>
        </Float>
      ))}
    </group>
  )
}

// Enhanced camera controller
function CameraController() {
  const { camera } = useThree()
  const [targetPosition] = useState(new THREE.Vector3(0, 2, 12))

  useFrame(() => {
    camera.position.lerp(targetPosition, 0.02)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// Main enhanced scene with cool colors
export default function PaymentScene() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-full rounded-lg overflow-hidden border border-cyan-400/30 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-cyan-400/30 relative bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={60} />
        <CameraController />

        {/* Enhanced lighting with cool colors */}
        <color attach="background" args={["#000011"]} />
        <fog attach="fog" args={["#000022", 15, 25]} />

        <ambientLight intensity={0.3} color="#4a90e2" />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow color="#00d4ff" />
        <pointLight position={[-10, -10, -10]} color="#ff6b9d" intensity={1} />
        <pointLight position={[10, 10, 5]} color="#00ffaa" intensity={0.8} />
        <pointLight position={[0, 5, -10]} color="#a78bfa" intensity={0.6} />

        <Suspense fallback={<LoadingFallback />}>
          <TechLogo />
          <Environment preset="city" />
          <Stars radius={150} depth={80} count={2000} factor={6} saturation={0.8} fade speed={2} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={8}
          maxDistance={20}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.3}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>

      {/* Enhanced overlay with cool styling */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-400/30 rounded-lg p-3">
          <div className="text-xs text-cyan-400 font-mono mb-1">QUANTUM INTERFACE ACTIVE</div>
          <div className="text-xs text-cyan-300/80">Drag to rotate • Scroll to zoom • Click elements to interact</div>
        </div>
      </div>

      {/* Tech corner indicators */}
      <div className="absolute top-4 right-4">
        <div className="bg-emerald-500/20 border border-emerald-400/50 rounded px-2 py-1">
          <div className="text-xs text-emerald-400 font-mono flex items-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
            ONLINE
          </div>
        </div>
      </div>
    </div>
  )
}
