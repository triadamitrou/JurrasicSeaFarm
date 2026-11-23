/**
 * The password gate. The password itself is never stored: this is its
 * SHA-256 fingerprint, which is also what the visitor's cookie holds
 * once they have entered it correctly.
 */
export const GATE_COOKIE = "jsf_gate";
export const GATE_TOKEN = "07b127ac51087308897e5e3d32d70b486a227185707d2119fbd17055bc1344cd";
