import { motion } from 'framer-motion'
import '../styles/SkeletonLoader.css'

export const SkeletonTableRow = () => {
  return (
    <div className="skeleton-row">
      {[...Array(9)].map((_, i) => (
        <motion.div
          key={i}
          className="skeleton-cell"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1
          }}
        />
      ))}
    </div>
  )
}

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => {
  return (
    <div className="skeleton-table">
      <div className="skeleton-header">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="skeleton-header-cell"
            animate={{
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
      {[...Array(rows)].map((_, i) => (
        <SkeletonTableRow key={i} />
      ))}
    </div>
  )
}

export const SkeletonCard = () => {
  return (
    <motion.div
      className="skeleton-card"
      animate={{
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      <div className="skeleton-card-icon" />
      <div className="skeleton-card-content">
        <div className="skeleton-card-label" />
        <div className="skeleton-card-value" />
      </div>
    </motion.div>
  )
}

export const SkeletonDashboard = () => {
  return (
    <div className="skeleton-dashboard">
      <div className="skeleton-cards-grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}
