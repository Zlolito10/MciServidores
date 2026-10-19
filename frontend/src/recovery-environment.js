// Added during recovery. Published modules are preserved in recovered/hosting.
// Build defaults to local demo services; production services require an explicit flag.
export const recoveryEnvironment = __MCI_RECOVERY_ENV__;
if (recoveryEnvironment.emulators) {
  globalThis.__FIREBASE_DEFAULTS__ = {
    emulatorHosts: { storage: '127.0.0.1:9199' },
  };
}
