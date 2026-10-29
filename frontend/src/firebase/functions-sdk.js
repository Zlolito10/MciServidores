// Reconstructed from the published MCI application. Original JSX/TSX and original symbol names were not available.
import { _ as Ft, C as zt, r as Je, a as $t, g as Vt, b as Bt, c as ht, d as Wt, i as Ht, p as Gt, u as qt } from "../vendor/vendor-firebase-BjYbfC3F.js";
const bt = "functions";
class Rs {
  constructor(s, r, n, a) {
    this.app = s, this.auth = null, this.messaging = null, this.appCheck = null, this.serverAppAppCheckToken = null, $t(s) && s.settings.appCheckToken && (this.serverAppAppCheckToken = s.settings.appCheckToken), this.auth = r.getImmediate({
      optional: !0
    }), this.messaging = n.getImmediate({
      optional: !0
    }), this.auth || r.get().then(l => this.auth = l, () => {}), this.messaging || n.get().then(l => this.messaging = l, () => {}), this.appCheck || a?.get().then(l => this.appCheck = l, () => {});
  }
  async getAuthToken() {
    if (this.auth) try {
      return (await this.auth.getToken())?.accessToken;
    } catch {
      return;
    }
  }
  async getMessagingToken() {
    if (!(!this.messaging || !("Notification" in self) || Notification.permission !== "granted")) try {
      return await this.messaging.getToken();
    } catch {
      return;
    }
  }
  async getAppCheckToken(s) {
    if (this.serverAppAppCheckToken) return this.serverAppAppCheckToken;
    if (this.appCheck) {
      const r = s ? await this.appCheck.getLimitedUseToken() : await this.appCheck.getToken();
      return r.error ? null : r.token;
    }
    return null;
  }
  async getContext(s) {
    const r = await this.getAuthToken(),
      n = await this.getMessagingToken(),
      a = await this.getAppCheckToken(s);
    return {
      authToken: r,
      messagingToken: n,
      appCheckToken: a
    };
  }
}
const Ue = "us-central1";
class Is {
  constructor(s, r, n, a, l = Ue, c = (...f) => fetch(...f)) {
    this.app = s, this.fetchImpl = c, this.emulatorOrigin = null, this.contextProvider = new Rs(s, r, n, a), this.cancelAllRequests = new Promise(f => {
      this.deleteService = () => Promise.resolve(f());
    });
    try {
      const f = new URL(l);
      this.customDomain = f.origin + (f.pathname === "/" ? "" : f.pathname), this.region = Ue;
    } catch {
      this.customDomain = null, this.region = l;
    }
  }
  _delete() {
    return this.deleteService();
  }
  _url(s) {
    const r = this.app.options.projectId;
    return this.emulatorOrigin !== null ? `${this.emulatorOrigin}/${r}/${this.region}/${s}` : this.customDomain !== null ? `${this.customDomain}/${s}` : `https://${this.region}-${r}.cloudfunctions.net/${s}`;
  }
}
function Ls(t, s, r) {
  const n = Ht(s);
  t.emulatorOrigin = `http${n ? "s" : ""}://${s}:${r}`, n && (Gt(t.emulatorOrigin + "/backends"), qt("Functions", !0));
}
const Ye = "@firebase/functions";
const Xe = "0.13.1";
const Ps = "auth-internal";
const Ts = "app-check-internal";
const Ms = "messaging-internal";
function Ds(t) {
  const s = (r, {
    instanceIdentifier: n
  }) => {
    const a = r.getProvider("app").getImmediate(),
      l = r.getProvider(Ps),
      c = r.getProvider(Ms),
      f = r.getProvider(Ts);
    return new Is(a, l, c, f, n);
  };
  Ft(new zt(bt, s, "PUBLIC").setMultipleInstances(!0)), Je(Ye, Xe, t), Je(Ye, Xe, "esm2020");
}
function Os(t = Vt(), s = Ue) {
  const n = Bt(ht(t), bt).getImmediate({
      identifier: s
    }),
    a = Wt("functions");
  return a && yt(n, ...a), n;
}
function yt(t, s, r) {
  Ls(ht(t), s, r);
}
Ds();
export { bt, Rs, Ue, Is, Ls, Ye, Xe, Ps, Ts, Ms, Ds, Os, yt };
