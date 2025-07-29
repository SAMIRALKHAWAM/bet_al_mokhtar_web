
import React from 'react'

export const MultiSelect = ({ options = [], selected = [], setSelected }) => {
  const toggleOption = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id))
    } else {
      setSelected([...selected, id])
    }
  }

  return (
    <div className="space-y-1">
      {options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-2 cursor-pointer text-sm"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.id)}
            onChange={() => toggleOption(option.id)}
          />
          {option.name}
        </label>
      ))}
    </div>
  )
}
