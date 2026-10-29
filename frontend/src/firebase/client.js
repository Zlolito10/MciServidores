// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { recoveryEnvironment } from "../config/environment.js";
import { e as Jt, f as Kt, h as Zt, G as Yt, j as Xt, k as Qt, l as es, m as ts, n as ss, o as rs, q as ns } from "../vendor/vendor-firebase-BjYbfC3F.js";
import { Os } from "./functions-sdk.js";
const buildFlags = recoveryEnvironment.flags;
const firebaseConfig = recoveryEnvironment.firebase;
const firebaseApp = Xt(firebaseConfig);
const firestoreDb = Kt(firebaseApp, {
  localCache: Zt()
});
const bffMode = buildFlags?.VITE_BFF_MODE === "1";
const configuredPersistence = buildFlags?.VITE_AUTH_PERSISTENCE;
const authPersistence = bffMode || configuredPersistence === "memory" ? "memory" : configuredPersistence === "session" ? "session" : "local";
const firebaseAuth = Jt(firebaseApp, {
  persistence: authPersistence === "memory" ? ts : authPersistence === "session" ? ss : [rs, ns],
  popupRedirectResolver: es
});
const authReady = Promise.resolve();
const googleProvider = new Yt();
const firebaseStorage = Qt(firebaseApp);
const cloudFunctions = Os(firebaseApp);
const emulatorsEnabled = buildFlags?.VITE_USE_EMULATORS === "1";
const firebaseRuntimeState = globalThis;
export { buildFlags, firebaseConfig, firebaseApp, firestoreDb, bffMode, configuredPersistence, authPersistence, firebaseAuth, authReady, googleProvider, firebaseStorage, cloudFunctions, emulatorsEnabled, firebaseRuntimeState };
