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
     Your Access Card has been created successfully.
    
    </>
  ),
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl text-center">
        <h2 className="text-xl font-semibold text-foreground">
          ✅ {title}
        </h2>

        {/* <p className="mt-3 text-muted-foreground">{message}</p> */}

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border bg-muted py-2.5 text-foreground/80 font-medium hover:bg-muted"
          >
            OK
          </button>

          {onPayNow && (
            <button
              onClick={onPayNow}
              className="btn-primary flex-1"
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