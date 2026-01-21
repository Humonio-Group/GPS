export const deviceModels = [
  "Chrome",
  "Safari",
  "Firefox",
  "Edge",
  "Opera",
  "Unknown",
] as const;
export type DeviceModel = typeof deviceModels[number];

export interface DeviceInfo {
  ip: string;
  model: DeviceModel;
  platform: string;
  version: string;
  appVersion: string;
  uuid: string;
}
