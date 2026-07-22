import { useRef } from 'react'
import PropTypes from 'prop-types'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { getThemeColors } from '@/lib/theme'
import { PARALLAX_MAX_PX } from '@/lib/motion'

/**
 * The distorted icosahedron itself. Rotation gently drifts on its own
 * (via <Float>) and tilts a little further toward the pointer — capped
 * well within a "subtle" range, never a full spin-to-follow.
 */
function DistortedBlob({ reducedMotion, colors }) {
  const meshRef = useRef(null)

  useFrame((state) => {
    if (reducedMotion || !meshRef.current) return
    // Pointer is normalized [-1, 1]. Cap the extra tilt so it reads as
    // a subtle parallax nudge, not a dramatic follow — mirrors the
    // 15px-max parallax rule translated into a small rotation budget.
    const maxTilt = (PARALLAX_MAX_PX / 100) * 1.2
    const targetX = state.pointer.y * maxTilt
    const targetY = state.pointer.x * maxTilt
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      targetX,
      0.04
    )
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      targetY,
      0.04
    )
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.4, 4]} />
      <MeshDistortMaterial
        color={colors.primary}
        emissive={colors.secondary}
        emissiveIntensity={0.15}
        roughness={0.25}
        metalness={0.4}
        distort={0.35}
        speed={reducedMotion ? 0 : 1.4}
      />
    </mesh>
  )
}

DistortedBlob.propTypes = {
  reducedMotion: PropTypes.bool.isRequired,
  colors: PropTypes.shape({
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
  }).isRequired,
}

/**
 * Self-contained lighting rig — no drei <Environment> HDRI (that
 * fetches an external asset at runtime, an avoidable network
 * dependency for what's otherwise a fully self-hosted site).
 */
function Lighting({ colors }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 3, 5]} intensity={60} color={colors.secondary} />
      <pointLight position={[-4, -2, -3]} intensity={40} color={colors.primary} />
    </>
  )
}

Lighting.propTypes = {
  colors: PropTypes.shape({
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
  }).isRequired,
}

/**
 * Hero 3D object. Lazy-loaded by the Hero section (three.js is heavy —
 * see App-level code splitting) and capped at 2x DPR to keep it cheap
 * on high-density displays, per 11_performance.md ("Optimize 3D").
 */
function HeroScene({ reducedMotion = false, theme = 'dark' }) {
  const colors = getThemeColors(theme)
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      frameloop={reducedMotion ? 'demand' : 'always'}
    >
      <Lighting colors={colors} />
      <Float
        speed={reducedMotion ? 0 : 1.6}
        rotationIntensity={reducedMotion ? 0 : 0.6}
        floatIntensity={reducedMotion ? 0 : 0.8}
      >
        <DistortedBlob reducedMotion={reducedMotion} colors={colors} />
      </Float>
    </Canvas>
  )
}

HeroScene.propTypes = {
  reducedMotion: PropTypes.bool,
  theme: PropTypes.oneOf(['dark', 'light']),
}

export default HeroScene
