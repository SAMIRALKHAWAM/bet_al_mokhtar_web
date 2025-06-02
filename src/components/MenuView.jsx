import React from "react";

const MenuViewer = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md text-center">
        <h1 className="text-3xl font-semibold mb-4 text-gray-800">📋 منيو المطعم</h1>
        <a
          href="/menu.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition"
        >
          عرض المينيو
        </a>
      </div>
    </div>
  );
};

export default MenuViewer;
