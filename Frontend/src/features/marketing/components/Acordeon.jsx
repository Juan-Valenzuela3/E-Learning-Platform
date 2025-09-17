
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Acordeon({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-900 focus:outline-none"
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
}