import React from 'react'

export default function StatCard({ label, count, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-4">
      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-2xl">
        {icon}
      </span>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  )
}