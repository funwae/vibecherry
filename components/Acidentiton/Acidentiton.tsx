'use client'

import { useMemo } from 'react'

interface AcidentitonProps {
  seed: string
  size?: number
  className?: string
}

// Simple seeded random number generator
function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  let value = Math.abs(hash)

  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

export function Acidentiton({ seed, size = 64, className }: AcidentitonProps) {
  const pattern = useMemo(() => {
    const rng = seededRandom(seed)

    // Generate colors from seed
    const hue = Math.floor(rng() * 360)
    const saturation = 60 + rng() * 20 // 60-80%
    const lightness = 50 + rng() * 20 // 50-70%

    const primary = `hsl(${hue}, ${saturation}%, ${lightness}%)`
    const secondary = `hsl(${(hue + 120) % 360}, ${saturation}%, ${lightness - 10}%)`
    const accent = `hsl(${(hue + 240) % 360}, ${saturation}%, ${lightness + 10}%)`

    // Generate pattern
    const shapeCount = 3 + Math.floor(rng() * 4) // 3-6 shapes
    const shapes: Array<{
      type: 'circle' | 'rect' | 'polygon'
      x: number
      y: number
      size: number
      rotation: number
      color: string
    }> = []

    for (let i = 0; i < shapeCount; i++) {
      const type = ['circle', 'rect', 'polygon'][Math.floor(rng() * 3)] as 'circle' | 'rect' | 'polygon'
      shapes.push({
        type,
        x: rng() * 100,
        y: rng() * 100,
        size: 20 + rng() * 40,
        rotation: rng() * 360,
        color: [primary, secondary, accent][Math.floor(rng() * 3)],
      })
    }

    return { primary, secondary, accent, shapes }
  }, [seed])

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={pattern.primary} />
          <stop offset="100%" stopColor={pattern.secondary} />
        </linearGradient>
      </defs>

      <rect width="100" height="100" fill={pattern.accent} opacity="0.1" />

      {pattern.shapes.map((shape, i) => {
        const transform = `translate(${shape.x}, ${shape.y}) rotate(${shape.rotation} ${shape.size / 2} ${shape.size / 2})`

        if (shape.type === 'circle') {
          return (
            <circle
              key={i}
              cx={shape.size / 2}
              cy={shape.size / 2}
              r={shape.size / 2}
              fill={shape.color}
              opacity="0.8"
              transform={transform}
            />
          )
        }

        if (shape.type === 'rect') {
          return (
            <rect
              key={i}
              x={0}
              y={0}
              width={shape.size}
              height={shape.size}
              fill={shape.color}
              opacity="0.8"
              transform={transform}
            />
          )
        }

        // polygon
        const points = [
          `${shape.size / 2},0`,
          `${shape.size},${shape.size}`,
          `0,${shape.size}`,
        ].join(' ')

        return (
          <polygon
            key={i}
            points={points}
            fill={shape.color}
            opacity="0.8"
            transform={transform}
          />
        )
      })}
    </svg>
  )
}

