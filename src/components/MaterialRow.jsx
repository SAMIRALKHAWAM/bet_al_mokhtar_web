import React from "react";

export default function MaterialRow({ material, onQtyChange }) {
  const { material_id, name, quantity, addQty, removeQty } = material;

  return (
    <tr>
      <td className="border border-gray-300 p-2 text-center">{name}</td>
      <td className="border border-gray-300 p-2 text-center">{quantity}</td>
      <td className="border border-gray-300 p-2">
        <input
          type="number"
          min="0"
          value={addQty}
          onChange={(e) => onQtyChange(material_id, "addQty", e.target.value)}
          className="w-full border rounded px-2 py-1 text-center"
        />
      </td>
      <td className="border border-gray-300 p-2">
        <input
          type="number"
          min="0"
          value={removeQty}
          onChange={(e) => onQtyChange(material_id, "removeQty", e.target.value)}
          className="w-full border rounded px-2 py-1 text-center"
        />
      </td>
    </tr>
  );
}
