import React from 'react'

export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 z-50">
        <p className="text-gray-700 text-base mb-6">
          {message || 'Are you sure you want to proceed?'}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}