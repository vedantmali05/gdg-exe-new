import React from "react";
import { CLASSES } from "../utils/constants";

interface DialogProps {
    isActive?: boolean;
    content?: React.ReactNode;
    primaryAction?: React.ReactNode;
    cancelButtonLabel?: string;
    onCancel?: () => void;
    closeOnScrimClick?: boolean;
}

export default function Dialog({
    isActive = false,
    content = "",
    primaryAction,
    cancelButtonLabel = "Close",
    onCancel,
    closeOnScrimClick = true,
}: DialogProps) {
    const handleScrimClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && closeOnScrimClick && onCancel) {
            onCancel();
        }
    };

    return (
        isActive && (
            <div
                className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                onClick={handleScrimClick}
            >
                <div className="bg-white rounded-xl shadow-lg min-w-[560px] max-w-[90%] max-h-[90vh] overflow-y-auto">
                    <div className="mb-6 p-4">{content}</div>

                    <div className="flex justify-between sticky bottom-0 bg-white p-4 border-t border-gray-200">
                        <button
                            className={CLASSES.buttonNegativeSecondary}
                            onClick={onCancel}
                        >
                            {cancelButtonLabel}
                        </button>

                        <div>{primaryAction}</div>
                    </div>
                </div>
            </div>
        )
    );
}
