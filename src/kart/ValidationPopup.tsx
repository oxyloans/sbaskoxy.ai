import React from 'react';
import { Dialog } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';

interface ValidationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: () => void;
}

const ValidationPopup: React.FC<ValidationPopupProps> = ({ isOpen, onClose, onAction }) => {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
            
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-2">
              Profile Incomplete
            </Dialog.Title>
            
            <Dialog.Description className="text-sm text-gray-500 text-center mb-6">
              Please complete your profile before proceeding to cart. This helps us serve you better.
            </Dialog.Description>

            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              
              <button
                onClick={onAction}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ValidationPopup;