import React from 'react'

export function Dialog({ children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        {children}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          ✖
        </button>
      </div>
    </div>
  )
}

export function DialogTitle({ children }) {
  return <h2 className="text-xl font-bold mb-4">{children}</h2>
}

export function DialogFooter({ children }) {
  return <div className="mt-6 flex justify-end gap-2">{children}</div>
}
// في أسفل dialog.jsx

export function DialogTrigger({ onClick, children }) {
  return (
    <button onClick={onClick} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      {children}
    </button>
  );
}
// داخل dialog.jsx أو الملف الذي تضع فيه مكونات الـ Dialog

export function DialogContent({ children, className = "" }) {
  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      {children}
    </div>
  )
}

export function DialogHeader({ children }) {
  return (
    <div className="mb-4">
      {children}
    </div>
  )
}

