import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNotification, removeNotification } from "../store/slices/uiSlice";

export const useToast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state) => state.ui.notifications);

  const showToast = useCallback(
    (message, type = "info", options = {}) => {
      const toast = {
        message,
        type, // 'success', 'error', 'warning', 'info'
        duration: options.duration || 4000,
        ...options,
      };

      dispatch(addNotification(toast));

      // Auto remove after duration
      if (toast.duration > 0) {
        setTimeout(() => {
          dispatch(removeNotification(toast.id));
        }, toast.duration);
      }

      return toast.id;
    },
    [dispatch],
  );

  const removeToast = useCallback(
    (id) => {
      dispatch(removeNotification(id));
    },
    [dispatch],
  );

  const showSuccess = useCallback(
    (message, options = {}) => {
      return showToast(message, "success", options);
    },
    [showToast],
  );

  const showError = useCallback(
    (message, options = {}) => {
      return showToast(message, "error", { duration: 5000, ...options });
    },
    [showToast],
  );

  const showWarning = useCallback(
    (message, options = {}) => {
      return showToast(message, "warning", options);
    },
    [showToast],
  );

  const showInfo = useCallback(
    (message, options = {}) => {
      return showToast(message, "info", options);
    },
    [showToast],
  );

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
