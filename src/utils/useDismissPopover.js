import { useEffect } from 'react'

/**
 * Dismiss an open popover when tapping outside its container ref or pressing Escape.
 */
export function useDismissPopover(ref, isOpen, onClose) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handlePointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, isOpen, onClose])
}

