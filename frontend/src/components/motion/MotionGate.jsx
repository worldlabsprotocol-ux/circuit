import { useEffect, useState } from 'react'

/**
 * MotionGate
 * - Renders children immediately (static)
 * - Optionally enhances with motion if available
 * - Never throws, never blocks render
 */
export default function MotionGate({ children, as = 'div', style = {}, className }) {
  const [Motion, setMotion] = useState(null)

  useEffect(() => {
    let mounted = true

    // Lazy-load motion library
    import('framer-motion')
      .then(mod => {
        if (mounted && mod?.motion) {
          setMotion(() => mod.motion)
        }
      })
      .catch(() => {
        // Fail closed: no motion
        setMotion(null)
      })

    return () => {
      mounted = false
    }
  }, [])

  // No motion available yet → render static
  if (!Motion) {
    const Tag = as
    return (
      <Tag style={style} className={className}>
        {children}
      </Tag>
    )
  }

  // Motion available → enhance
  const MotionTag = Motion[as] || Motion.div

  return (
    <MotionTag
      style={style}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </MotionTag>
  )
}
