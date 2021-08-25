import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { isPlatform } from "@ionic/react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import CameraPermission from "../plugins/CameraPermission";

export const newScan = async (
  videoElement: HTMLVideoElement,
  nativeSettingsRedirectPrompt: (redirectFun: () => any) => any,
  deviceDirection?: "environment" | "user"
): Promise<{ status: "ok" | "err"; data?: string; err?: string }> => {
  const scan = (
    deviceDirection: "environment" | "user",
    videoElement: HTMLVideoElement,
    timeout = 30000
  ): Promise<{ data?: string; err?: string }> => {
    const qr = new BrowserMultiFormatReader();
    return new Promise((resolve) => {
      const start = Date.now();
      videoElement.removeAttribute("hidden");
      qr.decodeFromConstraints(
        { video: { facingMode: deviceDirection } },
        videoElement,
        (result, err, controls) => {
          if (result) {
            resolve({ data: result.toString() });
            controls.stop();
            videoElement.setAttribute("hidden", "");
          }
          if (start + timeout < Date.now()) {
            controls.stop();
            resolve({ err: "Timeout" });
            videoElement.setAttribute("hidden", "");
          }
        }
      ).catch((e) => {
        resolve({
          err: `Err: ${e}`,
        });
        videoElement.setAttribute("hidden", "");
      });
    });
  };

  if (isPlatform("hybrid")) {
    const permissions = await CameraPermission.checkPermission({
      promptMessage:
        "Kamera für QR Codes und Barcodes benötigt. Zu den Einstellungen gehen?",
      promptTitle: "Kamera benötigt",
      ok: "Ok",
      no: "Nö",
    });
    console.log(permissions);
    if (permissions.authorized) {
      const BSResult = await BarcodeScanner.scan({
        showTorchButton: true,
        showFlipCameraButton: true,
      });
      return {
        status: BSResult.cancelled ? "err" : "ok",
        data: BSResult.text,
        err: BSResult.cancelled ? "Cancelled" : undefined,
      };
    } else {
      return { status: "err", err: "Nicht erlaubt" };
    }
  } else {
    const scanner = await scan(deviceDirection!, videoElement, 15000);
    return {
      status: scanner.err ? "err" : "ok",
      data: scanner.data,
      err: scanner.err,
    };
  }
};
