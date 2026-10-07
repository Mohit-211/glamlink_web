// src/components/glamcard/GlamCardForm/Modal.tsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  // Rendered via a portal so this modal is a direct child of <body> —
  // it can otherwise end up nested inside an ancestor (e.g. a `sticky`
  // sidebar) that creates its own stacking context, which traps this
  // modal's z-index locally instead of letting it win at the page root.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
      <button
        className="absolute top-4 right-4 text-white"
        onClick={onClose}
      >
        ✕
      </button>
    </div>,
    document.body
  );
};

export default Modal;
