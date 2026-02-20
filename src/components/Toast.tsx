"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
    message: string;
    type: "success" | "error";
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed top-24 right-8 z-50 transition-all duration-300 ${
                isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            }`}
        >
            <div
                className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl backdrop-blur-xl border ${
                    type === "success"
                        ? "bg-green-500/20 border-green-500/30 text-green-400"
                        : "bg-red-500/20 border-red-500/30 text-red-400"
                }`}
            >
                {type === "success" ? (
                    <CheckCircle className="flex-shrink-0" size={20} />
                ) : (
                    <XCircle className="flex-shrink-0" size={20} />
                )}
                <span className="font-medium">{message}</span>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="ml-2 hover:opacity-70 transition-opacity"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
