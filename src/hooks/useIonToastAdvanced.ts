import { ToastOptions, useIonToast } from "@ionic/react";

export const useIonToastAdvanced = () => {
  const [showToast] = useIonToast();
  return (message: string, duration?: number, options?: ToastOptions) =>
    showToast({ ...options, message, duration });
};
