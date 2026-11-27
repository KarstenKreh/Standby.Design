export const SETUP_ERROR = 'STANDBY_SETUP';

export function setupError(message, details = {}) {
  return Object.assign(new Error(message), { code: SETUP_ERROR, ...details });
}
