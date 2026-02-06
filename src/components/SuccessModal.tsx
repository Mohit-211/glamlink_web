import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          ✅ Success
        </h2>

        <p className="mt-3 text-gray-600">
          Your business card was created successfully.
          <br />
          <strong>Please check your email.</strong>
        </p>

        {/* OK BUTTON */}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg bg-black py-2.5 text-white font-medium hover:bg-gray-900"
           style={{
              background:
                "linear-gradient(135deg, #23aeb8 0%, #53bec6 50%, #5cc2d6 100%)",
            }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
