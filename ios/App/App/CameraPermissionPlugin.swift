import Capacitor
import AVFoundation

@objc(CameraPermissionPlugin)
public class CameraPermissionPlugin: CAPPlugin {
    @objc func checkPermission(_ call: CAPPluginCall) {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            call.resolve(["authorized": true, "permissionPrompted": false]);
            return;
        case .notDetermined:
            self.requestPerm(call: call);
            return;
        case .restricted:
            call.resolve(["authorized": false, "permissionPrompted": false, "restricted": true]);
            return;
        case .denied:
            let alert = UIAlertController(title: call.getString("promptTitle"), message: call.getString("promptMessage"), preferredStyle: .alert);
            alert.addAction(UIAlertAction(title: "Cancel", style: .destructive, handler: { _ in
                call.resolve(["authorized": false, "permissionPrompted": true]);
            }));
            alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { _ in
                guard let settingsURL = URL(string: UIApplication.openSettingsURLString) else {
                    call.resolve(["authorized": false, "permissionPrompted": false]);
                    return;
                };

                if UIApplication.shared.canOpenURL(settingsURL) {
                    UIApplication.shared.open(settingsURL);
                }
                call.resolve(["authorized": false, "permissionPrompted": false]);
            }));
            
            self.bridge?.viewController?.present(alert, animated: true, completion: nil);
            return;

        @unknown default:
            call.resolve(["authorized": false, "permissionPrompted": false, "unknown": true]);
        }
    }
    
    private func requestPerm(call: CAPPluginCall) {
        AVCaptureDevice.requestAccess(for: .video, completionHandler: { granted in
            if granted {
                call.resolve(["authorized": true, "permissionPrompted": true]);
            } else {
                call.resolve(["authorized": false, "permissionPrompted": true]);
            }
        })
    }
}
