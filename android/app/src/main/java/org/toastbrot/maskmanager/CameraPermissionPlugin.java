package org.toastbrot.maskmanager;

import static android.content.Context.MODE_PRIVATE;

import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

interface SimpleCallback {
    void callback();
}

@CapacitorPlugin(name = "CameraPermission", permissions = {@Permission(strings = Manifest.permission.CAMERA, alias = CameraPermissionPlugin.PERMISSION_ALIAS_CAMERA)})
public class CameraPermissionPlugin extends Plugin {
    public static final String PERMISSION_ALIAS_CAMERA = "camera";
    private static final String PERMISSION_NAME = Manifest.permission.CAMERA;
    private static final String PREFS_PERMISSION_FIRST_TIME_ASKING = "PREFS_PERMISSION_FIRST_TIME_ASKING";
    private JSObject savedReturnObject;

    @PluginMethod
    public void checkPermission(PluginCall call) {
        savedReturnObject = new JSObject();
        if (getPermissionState(PERMISSION_ALIAS_CAMERA) == PermissionState.GRANTED) {
            savedReturnObject.put("authorized", true);
            savedReturnObject.put("permissionPrompted", false);
        } else {
            boolean neverAsked = isPermissionFirstTimeAsking();

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (neverAsked || getActivity().shouldShowRequestPermissionRationale(PERMISSION_NAME)) {
                    requestPermissionForAlias(PERMISSION_ALIAS_CAMERA, call, "cameraPermsCallback");
                    return;
                } else {
                    askIfTheUserWantsToThinkAboutIt(call, this::openAppSettings);
                }
            }
        }
        call.resolve(savedReturnObject);
    }


    private void askIfTheUserWantsToThinkAboutIt(PluginCall call, SimpleCallback callbackOnOk) {
        new AlertDialog.Builder(getContext())
                .setTitle(call.getString("promptTitle"))
                .setMessage(call.getString("promptMessage"))
                .setPositiveButton("Ok", (dialog, which) -> callbackOnOk.callback()).setNegativeButton("No", null)
                .show();
    }

    @PermissionCallback
    private void cameraPermsCallback(PluginCall call) {
        if (this.savedReturnObject == null) {
            return;
        }

        setPermissionFirstTimeAskingToFalse();

        boolean granted = false;
        if (getPermissionState(PERMISSION_ALIAS_CAMERA) == PermissionState.GRANTED) {
            granted = true;
        }

        if (granted) {
            this.savedReturnObject.put("authorized", true);
            this.savedReturnObject.put("permissionPrompted", false);
        } else {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                askIfTheUserWantsToThinkAboutIt(call, this::openAppSettings);
                this.savedReturnObject.put("authorized", false);
                this.savedReturnObject.put("permissionPrompted", true);
            } else {
                this.savedReturnObject.put("authorized", true);
                this.savedReturnObject.put("permissionPrompted", false);
            }
        }
        call.resolve(this.savedReturnObject);
        this.savedReturnObject = null;
    }

    private boolean isPermissionFirstTimeAsking() {
        return getActivity().getSharedPreferences(PREFS_PERMISSION_FIRST_TIME_ASKING, MODE_PRIVATE).getBoolean(CameraPermissionPlugin.PERMISSION_NAME, true);
    }

    private void setPermissionFirstTimeAskingToFalse() {
        SharedPreferences sharedPreference = getActivity().getSharedPreferences(PREFS_PERMISSION_FIRST_TIME_ASKING, MODE_PRIVATE);
        sharedPreference.edit().putBoolean(CameraPermissionPlugin.PERMISSION_NAME, false).apply();
    }

    public void openAppSettings() {
        Intent intent = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.fromParts("package", getAppId(), null));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getActivity().startActivity(intent);
    }
}
