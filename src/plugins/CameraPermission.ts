import { registerPlugin } from "@capacitor/core";

export interface CameraPermissionPlugin {
  checkPermission(options: {
    promptTitle: string;
    promptMessage: string;
    no?: string;
    ok?: string;
  }): Promise<{
    authorized: boolean;
    permissionPrompted: boolean;
    restricted?: boolean;
  }>;
}

const CameraPermission =
  registerPlugin<CameraPermissionPlugin>("CameraPermission");

export default CameraPermission;
