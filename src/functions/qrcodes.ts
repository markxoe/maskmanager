import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { isPlatform } from "@ionic/react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export const newScan = async (
  videoElement: HTMLVideoElement,
  deviceId?: string
): Promise<{ status: "ok" | "err"; data?: string; err?: string }> => {
  const scan = (
    deviceId: string,
    videoElement: HTMLVideoElement,
    timeout = 30000
  ): Promise<{ data?: string; err?: string }> => {
    const qr = new BrowserMultiFormatReader();
    return new Promise((resolve) => {
      const start = Date.now();
      videoElement.removeAttribute("hidden");
      qr.decodeFromVideoDevice(
        deviceId,
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
    const scanner = await scan(deviceId!, videoElement, 15000);
    return {
      status: scanner.err ? "err" : "ok",
      data: scanner.data,
      err: scanner.err,
    };
  }
};
