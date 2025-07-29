
export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${className}`}
      {...props}
    />
  )
} 






