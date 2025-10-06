/* Simple logger wrapper (can replace with winston later) */
export function info(message: string, ...meta: any[]) {
  console.log(`ℹ️  [INFO] ${message}`, ...meta);
}

export function error(message: string, ...meta: any[]) {
  console.error(`❌ [ERROR] ${message}`, ...meta);
}

export function warn(message: string, ...meta: any[]) {
  console.warn(`⚠️  [WARN] ${message}`, ...meta);
}
