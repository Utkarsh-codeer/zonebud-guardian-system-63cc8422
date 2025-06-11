
export interface DeviceInfo {
  fingerprint: string;
  userAgent: string;
  deviceName: string;
}

export const generateDeviceFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};

export const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent;
  let deviceName = 'Unknown Device';
  
  if (/iPhone/.test(userAgent)) {
    deviceName = 'iPhone';
  } else if (/iPad/.test(userAgent)) {
    deviceName = 'iPad';
  } else if (/Android/.test(userAgent)) {
    deviceName = 'Android Device';
  } else if (/Windows/.test(userAgent)) {
    deviceName = 'Windows PC';
  } else if (/Mac/.test(userAgent)) {
    deviceName = 'Mac';
  }
  
  return {
    fingerprint: generateDeviceFingerprint(),
    userAgent,
    deviceName
  };
};
