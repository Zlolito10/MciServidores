/** Recovery adapter. Production services require an explicit build option. */
export const recoveryEnvironment=__MCI_RECOVERY_ENV__;
if(recoveryEnvironment.emulators){
 globalThis.__FIREBASE_DEFAULTS__={emulatorHosts:{storage:'127.0.0.1:9199'}};
}
