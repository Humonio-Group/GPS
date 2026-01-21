import { v4 as uuidv4 } from "uuid";
import { useLocalStorage } from "@vueuse/core";
import type { DeviceInfo, DeviceModel } from "~/types/misc/device";

async function detectIp(): Promise<string> {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  }
  catch (error) {
    useLogger().warn("Failed to fetch IP:", error);
    return "Unknown";
  }
}
function detectModel(): DeviceModel {
  const userAgent = navigator.userAgent;

  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) return "Safari";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
  return "Unknown";
}
function detectVersion(): string {
  const match = navigator.userAgent.match(/(Chrome|Safari|Firefox|Edge|Opera|OPR)\/(\d+\.\d+)/);
  return match ? match[2]! : "Unknown";
}

export async function useDeviceInfo(): Promise<DeviceInfo> {
  const ip = await detectIp();
  const platform = navigator.platform || "Unknown";
  const model = detectModel();
  const version = detectVersion();
  const appVersion = useVersion().version;
  const uuid = useLocalStorage("device-identifier", uuidv4()).value;

  return {
    ip,
    model,
    platform,
    version,
    appVersion,
    uuid,
  };
}
