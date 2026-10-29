/** Local recovery UI only. Client secrets and refresh tokens never enter this page. */
export async function bootDriveOAuthPage({ window: browser = globalThis, document = browser.document, fetch: request = browser.fetch.bind(browser) } = {}) {
  const elements = {};
  for (const name of ['prepare', 'authorize', 'folder', 'save', 'message', 'result']) elements[name] = document.getElementById('drive-' + name);
  let config;
  let codeClient;
  let authorizationState;
  let busy = false;
  let prepared = false;
  let ready = false;
  let picker = null;
  const phases = new Set(['awaiting-consent', 'awaiting-folder', 'ready', 'saved']);
  const proof = { phase: 'loading', mode: 'gis-code-popup', authorized: false, folderSelected: false, saved: false, error: null };
  const safeCode = (value) => typeof value === 'string' && /^[A-Z][A-Z0-9_]{0,79}$/.test(value) ? value : 'LOCAL_AUTHORIZATION_FAILED';
  const failure = (code) => Object.assign(new Error(code), { code });

  function render(message) {
    if (message) elements.message.textContent = message;
    // Deliberately whitelist evidence. Never render configuration, codes or tokens.
    elements.result.textContent = JSON.stringify(proof, null, 2);
    elements.prepare.disabled = !ready || busy || proof.authorized || proof.saved;
    elements.authorize.disabled = busy || !prepared || proof.authorized || proof.saved;
    elements.folder.disabled = busy || !proof.authorized || proof.saved;
    elements.save.disabled = busy || !proof.folderSelected || proof.saved;
  }
  function applyStatus(status) {
    if (!phases.has(status.phase)) throw failure('INVALID_SERVER_STATE');
    proof.phase = status.phase;
    proof.authorized = ['awaiting-folder', 'ready', 'saved'].includes(status.phase);
    proof.folderSelected = ['ready', 'saved'].includes(status.phase);
    proof.saved = status.phase === 'saved';
  }
  function showError(error) {
    proof.error = safeCode(error?.code);
    render('No se completó el paso. Revisa el estado mostrado y vuelve a intentarlo.');
  }
  async function api(route, body) {
    const options = { credentials: 'same-origin', cache: 'no-store', referrerPolicy: 'no-referrer' };
    if (body !== undefined) {
      options.method = 'POST';
      options.headers = { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-MCI-CSRF': config.csrfToken };
      options.body = JSON.stringify(body);
    }
    const response = await request(route, options);
    let result;
    try { result = await response.json(); } catch { throw failure('INVALID_SERVER_RESPONSE'); }
    if (!response.ok) throw failure(safeCode(result?.error));
    return result;
  }
  function loadScript(source) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = source;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(failure('GOOGLE_LIBRARY_UNAVAILABLE'));
      document.head.append(script);
    });
  }
  async function loadGIS() {
    if (!browser.google?.accounts?.oauth2?.initCodeClient) await loadScript('https://accounts.google.com/gsi/client');
    if (!browser.google?.accounts?.oauth2?.initCodeClient) throw failure('GOOGLE_LIBRARY_UNAVAILABLE');
  }
  async function loadPicker() {
    if (browser.google?.picker) return;
    if (!browser.gapi?.load) await loadScript('https://apis.google.com/js/api.js');
    await new Promise((resolve, reject) => browser.gapi.load('picker', {
      callback: resolve,
      onerror: () => reject(failure('PICKER_LIBRARY_UNAVAILABLE')),
      timeout: 15000,
      ontimeout: () => reject(failure('PICKER_LIBRARY_UNAVAILABLE')),
    }));
    if (!browser.google?.picker) throw failure('PICKER_LIBRARY_UNAVAILABLE');
  }
  function disposePicker() {
    if (picker) { picker.setVisible(false); picker.dispose?.(); picker = null; }
  }

  elements.prepare.addEventListener('click', async () => {
    if (!ready || busy || proof.authorized || proof.saved) return;
    busy = true;
    prepared = false;
    proof.error = null;
    render('Preparando una autorización local nueva...');
    try {
      const start = await api('/api/oauth/start', {});
      if (typeof start.state !== 'string' || !start.state) throw failure('INVALID_AUTHORIZATION_STATE');
      authorizationState = start.state;
      const boundState = start.state;
      codeClient = browser.google.accounts.oauth2.initCodeClient({
        client_id: config.clientId,
        scope: 'openid email https://www.googleapis.com/auth/drive.file',
        include_granted_scopes: false,
        ux_mode: 'popup',
        select_account: true,
        ...(config.expectedOwnerEmail ? { login_hint: config.expectedOwnerEmail } : {}),
        state: boundState,
        callback: async (response) => {
          if (authorizationState !== boundState) return;
          busy = true;
          proof.error = null;
          render('Comprobando la autorización y la cuenta propietaria...');
          try {
            if (response.error || typeof response.code !== 'string' || !response.code) throw failure('GOOGLE_AUTHORIZATION_NOT_COMPLETED');
            await api('/api/oauth/code', { code: response.code, state: boundState });
            // Drop the code reference after the same-origin exchange; never log it.
            const status = await api('/api/status');
            applyStatus(status);
            render('Google autorizado. Selecciona la carpeta existente RespaldoMCI.');
          } catch (error) { showError(error); }
          finally { busy = false; prepared = false; render(); }
        },
        error_callback: (error) => {
          busy = false;
          proof.error = error?.type === 'popup_closed' ? 'GOOGLE_POPUP_CLOSED' : 'GOOGLE_POPUP_UNAVAILABLE';
          render('La ventana de Google se cerró o no pudo abrirse. Puedes intentarlo de nuevo.');
        },
      });
      prepared = true;
      render('Revisa el permiso solicitado. Pulsa «Continuar con Google» y completa tú el consentimiento.');
    } catch (error) { showError(error); }
    finally { busy = false; render(); }
  });

  elements.authorize.addEventListener('click', () => {
    if (busy || !prepared || !codeClient || proof.authorized || proof.saved) return;
    proof.error = null;
    busy = true;
    render('Completa el consentimiento en la ventana oficial de Google.');
    // Must remain synchronous inside the click to retain the browser user gesture.
    try { codeClient.requestCode(); }
    catch { busy = false; proof.error = 'GOOGLE_POPUP_UNAVAILABLE'; render(); }
  });

  elements.folder.addEventListener('click', async () => {
    if (busy || !proof.authorized || proof.saved) return;
    busy = true;
    proof.error = null;
    render('Abriendo el selector oficial. Elige únicamente RespaldoMCI.');
    let accessToken;
    try {
      await loadPicker();
      const grant = await api('/api/picker-token', {});
      if (typeof grant.accessToken !== 'string' || !grant.accessToken) throw failure('PICKER_TOKEN_UNAVAILABLE');
      accessToken = grant.accessToken;
      const sdk = browser.google.picker;
      const view = new sdk.DocsView(sdk.ViewId.FOLDERS)
        .setIncludeFolders(true).setSelectFolderEnabled(true).setMode(sdk.DocsViewMode.LIST);
      const builder = new sdk.PickerBuilder().addView(view)
        .setOAuthToken(accessToken).setDeveloperKey(config.publicApiKey)
        .setAppId(config.projectNumber).setOrigin(browser.location.origin)
        .setTitle('Selecciona la carpeta existente RespaldoMCI')
        .setCallback(async (data) => {
          const action = data[sdk.Response.ACTION];
          if (action !== sdk.Action.PICKED && action !== sdk.Action.CANCEL) return;
          disposePicker();
          busy = true;
          try {
            if (action === sdk.Action.CANCEL) { render('Selección cancelada. La carpeta no cambió.'); return; }
            const documents = data[sdk.Response.DOCUMENTS];
            const selected = documents?.length === 1 ? documents[0] : null;
            if (!selected || selected[sdk.Document.ID] !== config.folderId) throw failure('ARCHIVE_FOLDER_MISMATCH');
            const result = await api('/api/folder', { folderId: selected[sdk.Document.ID] });
            if (result.ready !== true) throw failure('ARCHIVE_FOLDER_NOT_READY');
            applyStatus(await api('/api/status'));
            render('Carpeta verificada. Puedes guardar la autorización local protegida.');
          } catch (error) { showError(error); }
          finally { busy = false; render(); }
        });
      picker = builder.build();
      accessToken = null;
      picker.setVisible(true);
    } catch (error) { disposePicker(); showError(error); }
    finally { accessToken = null; if (!picker) busy = false; render(); }
  });

  elements.save.addEventListener('click', async () => {
    if (busy || !proof.folderSelected || proof.saved) return;
    busy = true;
    proof.error = null;
    render('Guardando la autorización local con protección del sistema...');
    try {
      const result = await api('/api/save', {});
      if (result.saved !== true) throw failure('AUTHORIZATION_NOT_SAVED');
      applyStatus(await api('/api/status'));
      render('Autorización local guardada. La carpeta y la web publicada permanecen sin cambios.');
    } catch (error) { showError(error); }
    finally { busy = false; render(); }
  });
  browser.addEventListener('pagehide', () => { authorizationState = null; codeClient = null; disposePicker(); });

  busy = true;
  render('Cargando la configuración local y la biblioteca oficial de Google...');
  try {
    config = await api('/api/status');
    if (config.origin !== 'http://localhost:5000' || browser.location.origin !== config.origin || config.mode !== 'gis-code-popup' || !config.csrfToken || !config.clientId || !config.publicApiKey || !config.projectNumber || !config.folderId) throw failure('INVALID_LOCAL_CONFIGURATION');
    await loadGIS();
    applyStatus(config);
    ready = true;
    render(proof.saved ? 'Autorización local guardada.' : proof.authorized ? 'Selecciona la carpeta existente para continuar.' : 'Prepara la autorización y revisa el permiso antes de continuar con Google.');
  } catch (error) { showError(error); }
  finally { busy = false; render(); }
}

export function renderDriveOAuthPage() {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>MCI · Autorización del respaldo</title><style>body{font:16px system-ui;color:#15314a;background:#f5f8fc}main{max-width:850px;margin:32px auto;padding:24px;background:white;border-radius:14px}h1{font-size:26px}p{line-height:1.6}button{padding:12px 16px;margin:6px;background:#245185;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer}button:disabled{opacity:.45;cursor:default}pre{padding:20px;background:#eef3f9;white-space:pre-wrap}</style></head><body><main><h1>Autorizar el respaldo de MCI</h1><p>Usa la cuenta propietaria previamente verificada. Google solicitará acceso a los archivos creados o seleccionados para esta aplicación. La autorización permitirá respaldos sin volver a iniciar sesión cada vez.</p><p>Seleccionarás la carpeta existente <strong>RespaldoMCI</strong>. Esta preparación no mueve, renombra, comparte ni elimina la carpeta. La web publicada no cambia.</p><div><button id="drive-prepare" disabled>Preparar autorización</button><button id="drive-authorize" disabled>Continuar con Google</button><button id="drive-folder" disabled>Seleccionar RespaldoMCI</button><button id="drive-save" disabled>Guardar autorización local</button></div><p id="drive-message" role="status"></p><pre id="drive-result" aria-live="polite"></pre><p>Completa tú el consentimiento en la ventana de Google. Los códigos y tokens no aparecen en esta evidencia; la credencial renovable se guarda localmente solo al pulsar Guardar.</p></main><script>(${bootDriveOAuthPage.toString()})();</script></body></html>\n`;
}
