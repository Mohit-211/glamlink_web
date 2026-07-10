import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onPayNow?: () => void;
  title?: string;
  message?: React.ReactNode;
}

const SuccessModal: React.FC<Props> = ({
  open,
  onClose,
  onPayNow,
  title = "Success",
  message = (
    <>
      Your business card was created successfully.
      <br />
      <strong>Please check your email.</strong>
    </>
  ),
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          ✅ {title}
        </h2>

        <p className="mt-3 text-gray-600">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 bg-gray-50 py-2.5 text-gray-700 font-medium hover:bg-gray-100"
          >
            OK
          </button>

          {onPayNow && (
            <button
              onClick={onPayNow}
              className="flex-1 rounded-lg py-2.5 text-white font-medium hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, #23aeb8 0%, #53bec6 50%, #5cc2d6 100%)",
              }}
            >
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;