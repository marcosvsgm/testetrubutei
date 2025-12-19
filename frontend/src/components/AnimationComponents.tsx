import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedPageProps {
  children: ReactNode
  className?: string
}

// Página com fade e slide
export const AnimatedPage = ({ children, className = '' }: AnimatedPageProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

// Modal animado com fade + scale
interface AnimatedModalProps {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  className?: string
}

export const AnimatedModal = ({ children, isOpen, onClose, className = '' }: AnimatedModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={`modal-content ${className}`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Linha de tabela animada
interface AnimatedTableRowProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const AnimatedTableRow = ({ children, className = '', delay = 0 }: AnimatedTableRowProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ x: 5 }}
    >
      {children}
    </motion.div>
  )
}

// Botão com loading
interface LoadingButtonProps {
  children: ReactNode
  onClick?: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const LoadingButton = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  type = 'button'
}: LoadingButtonProps) => {
  return (
    <motion.button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      transition={{ duration: 0.1 }}
    >
      {loading ? (
        <span className="loading-content">
          <motion.span
            className="loading-spinner-btn"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            ⏳
          </motion.span>
          Carregando...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}

// Contador animado
interface AnimatedCounterProps {
  value: number
  className?: string
}

export const AnimatedCounter = ({ value, className = '' }: AnimatedCounterProps) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        key={value}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.span>
    </motion.span>
  )
}

// Shake animation para erros
interface ShakeContainerProps {
  children: ReactNode
  shake: boolean
  className?: string
}

export const ShakeContainer = ({ children, shake, className = '' }: ShakeContainerProps) => {
  return (
    <motion.div
      className={className}
      animate={shake ? {
        x: [-10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      } : {}}
    >
      {children}
    </motion.div>
  )
}

// Fade in para elementos
interface FadeInProps {
  children: ReactNode
  delay?: number
  className?: string
}

export const FadeIn = ({ children, delay = 0, className = '' }: FadeInProps) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  )
}

// Pulsar para alertas
interface PulseProps {
  children: ReactNode
  className?: string
}

export const Pulse = ({ children, className = '' }: PulseProps) => {
  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {children}
    </motion.div>
  )
}

// Stagger children animation
interface StaggerContainerProps {
  children: ReactNode
  className?: string
}

export const StaggerContainer = ({ children, className = '' }: StaggerContainerProps) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
