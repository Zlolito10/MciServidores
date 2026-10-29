// Explicit Auth-only proof. Never import the application, its providers or data services here.
import { j as initializeApp, a9 as authSdk } from '../../frontend/src/vendor/vendor-firebase-BjYbfC3F.js';

if (location.hostname !== 'localhost') throw new Error('This Auth proof requires authorized localhost');

const app = initializeApp({
  apiKey: 'AIzaSyCJFCaTuhu_Tz1kPVIsZBeWcLdxdTlED-Y',
  authDomain: 'mcimachala-servidor.firebaseapp.com',
  projectId: 'mcimachala-servidor',
}, 'mci-isolated-google-auth-proof');
const auth = authSdk.initializeAuth(app, {
  persistence: authSdk.inMemoryPersistence,
  popupRedirectResolver: authSdk.browserPopupRedirectResolver,
});
const provider = new authSdk.GoogleAuthProvider();
const root = document.getElementById('google-proof-root');
root.innerHTML = `<main>
  <h1>Prueba aislada de Google · MCI</h1>
  <p>Utiliza únicamente la cuenta existente que ya se verificó. Este acceso real actualiza el último inicio de sesión de Firebase y puede solicitar autorización de Google.</p>
  <p>Esta página usa solo Firebase Auth con sesión en memoria. No carga la aplicación, perfiles, Firestore, Functions ni sesión BFF.</p>
  <label for="account-hint">Cuenta sugerida (opcional)</label>
  <input id="account-hint" type="email" autocomplete="off" spellcheck="false" placeholder="Escribir una cuenta existente verificada">
  <div><button id="google-login">Continuar con Google</button> <button id="google-signout" disabled>Cerrar sesión de prueba</button></div>
  <p>Al finalizar, pulsa «Cerrar sesión de prueba». La evidencia muestra solo proveedor, cuenta existente y estado de cierre.</p>
  <pre id="google-proof-result" aria-live="polite"></pre>
</main>`;

const login = root.querySelector('#google-login');
const logout = root.querySelector('#google-signout');
const accountHint = root.querySelector('#account-hint');
const output = root.querySelector('#google-proof-result');
const status = {
  phase: 'ready',
  persistence: 'memory',
  provider: null,
  existingUser: null,
  signedIn: false,
  signOutCompleted: false,
  errorCode: null,
};
const render = () => { output.textContent = JSON.stringify(status, null, 2); };
const safeCode = (error) => /^auth\/[a-z0-9-]+$/.test(error?.code || '') ? error.code : 'auth/proof-failed';
render();

login.addEventListener('click', async () => {
  login.disabled = true;
  accountHint.disabled = true;
  status.phase = 'opening-popup';
  status.errorCode = null;
  status.signOutCompleted = false;
  render();
  try {
    const hint = accountHint.value.trim();
    provider.setCustomParameters({ prompt: 'select_account', ...(hint ? { login_hint: hint } : {}) });
    const result = await authSdk.signInWithPopup(auth, provider);
    const additionalInfo = typeof authSdk.getAdditionalUserInfo === 'function' ? authSdk.getAdditionalUserInfo(result) : null;
    const response = result._tokenResponse;
    const validResponse = response !== null && typeof response === 'object' && !Array.isArray(response);
    // The Auth response may omit the optional false value. Do not coerce a
    // malformed value or an absent response object into an existing-user proof.
    const responseIsNewUser = validResponse && (response.isNewUser === undefined || typeof response.isNewUser === 'boolean')
      ? response.isNewUser ?? false : null;
    const isNewUser = typeof additionalInfo?.isNewUser === 'boolean' ? additionalInfo.isNewUser : responseIsNewUser;
    status.provider = result.providerId === 'google.com' ? 'google.com' : 'unexpected-provider';
    status.existingUser = typeof isNewUser === 'boolean' ? !isNewUser : null;
    status.signedIn = !!auth.currentUser;
    status.phase = status.provider !== 'google.com' ? 'unexpected-provider'
      : status.existingUser === true ? 'verified'
      : status.existingUser === false ? 'new-user-unexpected' : 'signed-in';
    // Do not retain the result, tokens, email, UID or provider profile in proof data.
    accountHint.value = '';
  } catch (error) {
    status.phase = 'error';
    status.errorCode = safeCode(error);
    status.signedIn = !!auth.currentUser;
  } finally {
    login.disabled = status.signedIn;
    accountHint.disabled = status.signedIn;
    logout.disabled = !status.signedIn;
    render();
  }
});

logout.addEventListener('click', async () => {
  logout.disabled = true;
  try {
    await authSdk.signOut(auth);
    status.signedIn = !!auth.currentUser;
    status.signOutCompleted = !status.signedIn;
    status.phase = status.signOutCompleted ? 'signed-out' : 'signout-incomplete';
    status.errorCode = null;
    accountHint.value = '';
  } catch (error) {
    status.phase = 'error';
    status.errorCode = safeCode(error);
  } finally {
    login.disabled = status.signedIn;
    accountHint.disabled = status.signedIn;
    logout.disabled = !status.signedIn;
    render();
  }
});
window.addEventListener('pagehide', () => { void authSdk.signOut(auth).catch(() => {}); });
