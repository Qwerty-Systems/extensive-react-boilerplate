import { useCallback } from "react";
import { toast, ToastOptions, Bounce } from "react-toastify";

export function useSnackbar() {
  const enqueueSnackbar = useCallback(
    (
      message: string,
      config?: {
        variant?: "success" | "error";
        autoHideDuration?: number;
        position?: ToastOptions["position"];
        hideProgressBar?: boolean;
        closeOnClick?: boolean;
        pauseOnHover?: boolean;
        draggable?: boolean;
        progress?: ToastOptions["progress"];
        theme?: ToastOptions["theme"];
        transition?: ToastOptions["transition"];
      }
    ) => {
      toast(message, {
        type: config?.variant,
        autoClose: config?.autoHideDuration,
        position: config?.position ?? "top-right",
        hideProgressBar: config?.hideProgressBar ?? false,
        closeOnClick: config?.closeOnClick ?? false,
        pauseOnHover: config?.pauseOnHover ?? true,
        draggable: config?.draggable ?? true,
        progress: config?.progress,
        theme: config?.theme ?? "light",
        transition: config?.transition ?? Bounce,
      });
    },
    []
  );

  return { enqueueSnackbar };
}
