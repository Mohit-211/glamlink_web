// src/components/glamcard/GlamCardForm/Modal.tsx
import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative rounded-lg bg-white p-6">{children}</div>
      <button
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
      >
        ✕
      </button>
    </div>
  );
};

export default Modal;
