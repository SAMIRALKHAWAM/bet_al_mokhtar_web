import React, { useState, useRef, useEffect } from 'react'

export const BasicMultiSelect = ({ options = [], selected = [], onChange }) => {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      <button
        type="button"
        className="w-full p-2 bg-gray-200 dark:bg-gray-700 rounded"
        onClick={() => setOpen(!open)}
      >
        {selected.length > 0
          ? `المحدد: ${selected.length} فرع`
          : 'اختر الفروع'}
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded shadow p-2 space-y-2">
          {options.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggleOption(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}

          <div className="flex justify-between mt-2 text-sm">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => onChange(options.map((o) => o.value))}
            >
              تحديد الكل
            </button>
            <button
              className="text-red-600 hover:underline"
              onClick={() => onChange([])}
            >
              إلغاء الكل
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
