import React from 'react'
import { CgSpinner } from 'react-icons/cg'

// type ButtonProps = {
//   children: React.ReactNode
//   onClick?: () => void
//   variant?: 
//   | 'primary'
//   | 'secondary'
//   | 'danger'
//   | 'success'
//   | 'warning'
//   | 'info'
//   | 'light'
//   | 'dark'
//   | 'ghost'
//   | 'soft'
//   | 'cool'
//   | 'neon'
//   | 'royal'
//   | 'pastel'
//   | 'muted'
//   | 'ocean'
//   | 'forest'
//   | 'sun'
//   | 'flame'
//   | 'berry'
//   | 'frost'
//   | 'shadow'
//   disabled?: boolean
//   className?: string
//   isLoading?: boolean
//   rounded?: boolean
//   notificationCount?: number
//   shape?: 'diamond' | 'rectangle' | 'circle'
// }

// const Button: React.FC<ButtonProps> = ({
 const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  isLoading = false,
  notificationCount,
  shape = 'rectangle'
}) => {
  const baseStyles = `px-4 py-2 font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 cursor-pointer`
  // const shapeStyle: Record<string, string> = {
   const shapeStyle = {
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    diamond: ''

  }
  // const variantStyles: Record<string, string> = {
    const variantStyles = {
    primary:    `bg-blue-500      hover:bg-blue-600     focus:ring-blue-400     text-blue-200`,
    secondary:  `bg-gray-600      hover:bg-gray-700     focus:ring-gray-500     text-gray-800`,
    danger:     `bg-red-600       hover:bg-red-700      focus:ring-red-500      text-red-100`,
    success:    `bg-green-600     hover:bg-green-700    focus:ring-green-500    text-green-800`,
    warning:    `bg-yellow-600    hover:bg-yellow-700   focus:ring-yellow-500   text-yellow-800`,
    info:       `bg-teal-600      hover:bg-teal-700     focus:ring-teal-500     text-teal-200`,
    light:      `bg-white         hover:bg-gray-100     focus:ring-gray-300     text-gray-800`,
    dark:       `bg-gray-800      hover:bg-gray-900     focus:ring-gray-700     text-gray-200`,
    ghost:      `bg-transparent   hover:bg-blue-100     focus:ring-blue-500     text-blue-800`,
    soft:       `bg-indigo-200    hover:bg-indigo-300   focus:ring-indigo-500   text-indigo-700`,
    cool:       `bg-cyan-600      hover:bg-cyan-700     focus:ring-cyan-500     text-cyan-100`,
    neon:       `bg-pink-500      hover:bg-pink-600     focus:ring-pink-400     text-pink-150`,
    royal:      `bg-purple-600    hover:bg-purple-700   focus:ring-purple-500   text-purple-200`,
    pastel:     `bg-pink-200      hover:bg-pink-300     focus:ring-pink-500     text-pink-800`,
    muted:      `bg-gray-400      hover:bg-gray-500     focus:ring-gray-300     text-gray-900`,
    ocean:      `bg-blue-300      hover:bg-blue-400     focus:ring-blue-200     text-blue-900`,
    forest:     `bg-green-700     hover:bg-green-800    focus:ring-green-600    text-green-100`,
    sun:        `bg-yellow-400    hover:bg-yellow-500   focus:ring-yellow-300   text-yellow-900`,
    flame:      `bg-orange-600    hover:bg-orange-700   focus:ring-orange-500   text-orange-100`,
    berry:      `bg-red-700       hover:bg-red-800      focus:ring-red-600      text-red-200`,
    frost:      `bg-cyan-200      hover:bg-cyan-300     focus:ring-cyan-400     text-cyan-900`,
    shadow:     `bg-black         hover:bg-gray-800     focus:ring-gray-900     text-gray-200`,
  };
  
  const disabledStyles = `opacity-50 cursor-not-allowed`

  return (
    <div className="relative inline-block">
      <button
        onClick={onClick}
        className={`${baseStyles} ${shapeStyle[shape]} ${variantStyles[variant]} ${disabled ? disabledStyles : ''} ${className}`}
        disabled={disabled}
      >
        {isLoading ? <CgSpinner className='animate-spin text-2xl' /> : children}
      </button>
      {notificationCount !== undefined && (
        <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full transform translate-x-1/2 -translate-y-1/2">
          { notificationCount > 0 ? notificationCount : ""}
        </span>
      )}
    </div>
  )
}

export default Button
