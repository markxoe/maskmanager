#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

CAP_PLUGIN(CameraPermissionPlugin, "CameraPermission",
    CAP_PLUGIN_METHOD(checkPermission, CAPPluginReturnPromise);
)
