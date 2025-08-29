// src/components/ui/button.jsx
export const Button = ({ className = '', children, ...props }) => {
  return (
    <button
      className={`px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}