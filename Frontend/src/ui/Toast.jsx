import { useEffect, useState } from "react";

export default function AnimatedLoaderToast({ message, type = "info", show, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // esperar fade-out
      }, 2000); // duración del toast
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !visible) return null;

  const bgColor = {
    info: "bg-blue-500",
    success: "bg-green-500",
    error: "bg-red-500",
  }[type];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div
        className={`flex items-center gap-3 text-white px-5 py-3 rounded-lg shadow-lg pointer-events-auto transform transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        } ${bgColor}`}
      >
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}
