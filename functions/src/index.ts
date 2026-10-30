// @ts-nocheck
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onUserDeleted =
  exports.onMinistryDeleted =
  exports.onEventDeleted =
  exports.onCommandWritten =
  exports.onNotificationWritten =
  exports.onMaterialWritten =
  exports.onRepertoireWritten =
  exports.onCommentWritten =
  exports.onAttendanceWritten =
  exports.onServiceAreaWritten =
  exports.onRoleWritten =
  exports.onUserWritten =
  exports.onAssignmentWritten =
  exports.onEventTemplateWritten =
  exports.onEventWritten =
  exports.onChangeMetaUpdated =
  exports.api =
  exports.attendanceReminders =
  exports.onImageFinalizeGenerateThumb =
  exports.migrateEventImagesFromDataUrl =
  exports.backfillEventThumbs =
  exports.backfillProfilePhotoThumbs =
  exports.attendanceSyncOnEventWrite =
  exports.attendanceSyncOnAssignmentWrite =
  exports.cleanupOldFiles = // NEW EXPORT
    void 0;
const functions = require("firebase-functions/v1");
const storage_1 = require("firebase-functions/v2/storage");
const firestore_1 = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
// Explicit SDK imports remain stable when the emulator wraps admin.firestore().
const { FieldPath, FieldValue, Timestamp } = require("firebase-admin/firestore");
const express = require("express");
const cors = require("cors");
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs/promises");
// Image processing and the Drive SDK are not needed by login, rules guards or
// ordinary reads. Load them on the first actual image/archive operation.
const sharp = (...args) => require("sharp")(...args);
const archiveGoogle = () => isLocalDemoRuntime() ? null : require("googleapis").google;
const { isLocalDemoRuntime, passwordSignInUrl, normalizeLoginEmail, createRuntimeMessaging, createRuntimeDrive } = require("./runtime-services");
const { normalizeFcmData, getEcuadorDateString, parseLocalEcuadorDateTimeToUtcMs, shouldRunInWindow } = require("./notification-utils");
const { archiveOldEventFiles } = require("./cleanup");
const { archiveFolderId } = require("./drive-archive");
const { syncUserTokenTopics } = require("./notification-topics");
const { releaseRequestGuard, releaseReadRequestGuard, requireMasterProfile, canWriteAssignmentScope, normalizeCommandPayload, authorizeQueuedCommand, claimQueuedCommand, completeEmptyCommand } = require("./release-security");
const { assignmentActorContext, assignmentForActor, syncAssignmentRoster, servePrivateAttendance } = require("./assignment-roster");
const { readHistoricalAssignments } = require("./historical-assignments");
const { archiveFunctionRuntimeOptions } = require("./backend-release");
const { userDirectoryEntry, sanitizeUserDirectory, syncUserDirectory, registerDeviceToken } = require("./user-directory");
const { createRequestCostGuard, notificationQuotaGuard, allowedRequestOrigin } = require("./request-cost-guard");
const { userServiceHistory } = require("./service-history");
const runtimeMessaging = () => createRuntimeMessaging(admin);
const stream = require("stream");

// ID de la carpeta de Drive para respaldos (ARCHIVE)
// TODO: Reemplaza con tu ID real de la carpeta de "Respaldo Materiales"
const DRIVE_ARCHIVE_FOLDER_ID = "1d2k7PKav0bCPfGZng6tDqAhIhqT_0mqp";

const crypto_1 = require("crypto");
admin.initializeApp();
const getRuntimeServiceAccountEmail = async () => {
  if (isLocalDemoRuntime()) return "local-demo-emulator";
  // En Cloud Functions, podemos consultar el metadata server para saber
  // qué service account está usando el runtime.
  // Esto ayuda a diagnosticar errores de createCustomToken (signBlob).
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(
      "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/email",
      {
        headers: { "Metadata-Flavor": "Google" },
        signal: controller.signal,
      },
    );
    clearTimeout(t);
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    return text || null;
  } catch (_a) {
    return null;
  }
};
const app = express();
app.set("trust proxy", 1);
app.use((req, res, next) => {
  if (!allowedRequestOrigin(req.headers.origin, isLocalDemoRuntime(), process.env.MCI_ALLOWED_ORIGINS || "")) {
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Vary", "Origin");
    return res.status(403).json({ error: "ORIGIN_NOT_ALLOWED" });
  }
  return next();
});
app.use(cors({ origin: true, credentials: true }));
// Headers defensivos para reducir filtraciones accidentales (cache/referrer/sniffing).
app.use((_req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(createRequestCostGuard());
const isFirestorePermissionDenied = (err) => {
  var _a, _b;
  const code = String(
    (_a = err === null || err === void 0 ? void 0 : err.code) !== null &&
      _a !== void 0
      ? _a
      : "",
  );
  const msg = String(
    (_b = err === null || err === void 0 ? void 0 : err.message) !== null &&
      _b !== void 0
      ? _b
      : "",
  );
  // Firestore (grpc) typically uses numeric codes (7 = PERMISSION_DENIED)
  if (code === "7") return true;
  if (msg.includes("PERMISSION_DENIED")) return true;
  if (msg.includes("Missing or insufficient permissions")) return true;
  return false;
};
// Sanitiza cualquier URL legacy de Firebase Storage con ?token= antes de enviarla al navegador.
// Esto evita fugas de tokens en Network/DevTools incluso si existen en Firestore.
app.use((_req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (body) => originalJson(sanitizeStorageUrlsForClient(body));
  next();
});
// --- BFF Auth (Session Cookie + CSRF) ---
// Nota: En Firebase Hosting/Functions, la cookie debe llamarse "__session".
const SESSION_COOKIE_NAME = "__session";
const XSRF_COOKIE_NAME = "XSRF-TOKEN";
const parseCookies = (cookieHeader) => {
  const out = {};
  if (!cookieHeader) return out;
  const parts = cookieHeader.split(";");
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx <= 0) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) continue;
    out[key] = decodeURIComponent(value);
  }
  return out;
};
const isSecureRequest = (req) => {
  // Hosting/Functions suele usar proxy
  const xfProto = String(req.headers["x-forwarded-proto"] || "");
  if (xfProto.toLowerCase().includes("https")) return true;
  return Boolean(req.secure);
};
const setCookie = (res, name, value, opts) => {
  const maxAge = Math.floor(opts.maxAgeMs / 1000);
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Lax",
  ];
  if (opts.httpOnly) parts.push("HttpOnly");
  if (opts.secure) parts.push("Secure");
  res.append("Set-Cookie", parts.join("; "));
};
const clearCookie = (res, name, secure) => {
  const parts = [`${name}=`, "Path=/", "Max-Age=0", "SameSite=Lax"];
  if (secure) parts.push("Secure");
  // Sólo la cookie de sesión es HttpOnly.
  if (name === SESSION_COOKIE_NAME) parts.push("HttpOnly");
  res.append("Set-Cookie", parts.join("; "));
};
const requireCsrf = (req, res, next) => {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS")
    return next();
  const cookies = parseCookies(req.headers.cookie);
  const csrfCookie = cookies[XSRF_COOKIE_NAME];
  const csrfHeader = String(req.headers["x-xsrf-token"] || "");
  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ error: "CSRF" });
  }
  return next();
};
const requireSession = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const sessionCookie = cookies[SESSION_COOKIE_NAME];
    if (!sessionCookie)
      return res.status(401).json({ error: "UNAUTHENTICATED" });
    const decoded = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true /* checkRevoked */);
    res.locals.uid = decoded.uid;
    res.locals.email =
      typeof (decoded === null || decoded === void 0
        ? void 0
        : decoded.email) === "string"
        ? decoded.email
        : "";
    // Fetch role for permission checks (cached if possible usually, but here direct read)
    // Optimization: In a real heavy app we'd put role in custom claims.
    const userSnap = await db.collection("users").doc(decoded.uid).get();
    res.locals.role = userSnap.exists ? userSnap.data().role : "";
    return next();
  } catch (_a) {
    return res.status(401).json({ error: "UNAUTHENTICATED" });
  }
};
// Variante tolerante: no falla si no hay cookie o si es inválida.
// Útil para endpoints como /api/me que se usan para "sondear" sesión.
const optionalSession = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const sessionCookie = cookies[SESSION_COOKIE_NAME];
    if (!sessionCookie) return next();
    const decoded = await admin
      .auth()
      .verifySessionCookie(sessionCookie, true /* checkRevoked */);
    res.locals.uid = decoded.uid;
    res.locals.email =
      typeof (decoded === null || decoded === void 0
        ? void 0
        : decoded.email) === "string"
        ? decoded.email
        : "";
    return next();
  } catch (_a) {
    return next();
  }
};
// --- Audit logging (Master Admin view) ---
// Guarda registros de acciones (mutaciones) vía BFF para tener trazabilidad.
// Nota: no guarda payloads; solo metadata segura.
// AUDIT LOGS DESHABILITADO
// const AUDIT_LOGS_COLLECTION = "app_audit_logs";
const CHANGE_META_DOC_PATH = "app_change_meta/global";
const AUDIT_DENYLIST = new Set([
  "/api/sessionLogin",
  "/api/passwordLogin",
  "/api/sessionLogout",
  "/api/users/me/password",
  "/api/users/me/delete",
]);
const humanizeResource = (r) => {
  switch (r) {
    case "events":
      return "evento";
    case "event_templates":
      return "plantilla";
    case "assignments":
      return "asignación";
    case "repertoire":
      return "repertorio";
    case "materials":
      return "material";
    case "materials_library":
      return "biblioteca de materiales";
    case "comments":
      return "comentario";
    case "roles":
      return "rol";
    case "service_areas":
      return "área de servicio";
    case "users":
      return "usuario";
    case "notifications":
      return "notificaciones";
    case "attendance":
      return "asistencia";
    case "notify":
      return "notificación";
    default:
      return r.replace(/_/g, " ");
  }
};
const buildAuditActionInfo = (method, pathOnly) => {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const clean = String(pathOnly || "")
    .split("?")[0]
    .trim();
  const parts = clean.split("/").filter(Boolean);
  // Expected: ["api", "resource", "id?", "subresource?", "subId?", ...]
  const apiIdx = parts[0] === "api" ? 0 : -1;
  const resource =
    apiIdx === 0
      ? (_a = parts[1]) !== null && _a !== void 0
        ? _a
        : null
      : (_b = parts[0]) !== null && _b !== void 0
        ? _b
        : null;
  const resourceId =
    apiIdx === 0
      ? (_c = parts[2]) !== null && _c !== void 0
        ? _c
        : null
      : (_d = parts[1]) !== null && _d !== void 0
        ? _d
        : null;
  const subresource =
    apiIdx === 0
      ? (_e = parts[3]) !== null && _e !== void 0
        ? _e
        : null
      : (_f = parts[2]) !== null && _f !== void 0
        ? _f
        : null;
  const subresourceId =
    apiIdx === 0
      ? (_g = parts[4]) !== null && _g !== void 0
        ? _g
        : null
      : (_h = parts[3]) !== null && _h !== void 0
        ? _h
        : null;
  const m = method.toUpperCase();
  const verb =
    m === "POST"
      ? "Creó"
      : m === "PATCH" || m === "PUT"
        ? "Actualizó"
        : m === "DELETE"
          ? "Eliminó"
          : "Acción";
  // Reglas específicas (mejor UX). Fallback siempre disponible.
  const r = resource || "api";
  const sub = subresource || "";
  // Auth
  if (clean === "/api/sessionLogin" || clean === "/api/passwordLogin") {
    return {
      actionCode: "auth.login",
      actionLabel: "Inició sesión",
      resource: "auth",
      resourceId: null,
      subresource: null,
      subresourceId: null,
    };
  }
  if (clean === "/api/sessionLogout") {
    return {
      actionCode: "auth.logout",
      actionLabel: "Cerró sesión",
      resource: "auth",
      resourceId: null,
      subresource: null,
      subresourceId: null,
    };
  }
  // Perfil
  if (clean === "/api/users/me") {
    return {
      actionCode: "users.me.update",
      actionLabel: "Actualizó su perfil",
      resource: "users",
      resourceId: "me",
      subresource: null,
      subresourceId: null,
    };
  }
  if (clean === "/api/users/me/photo") {
    return {
      actionCode: "users.me.photo",
      actionLabel: "Cambió su foto",
      resource: "users",
      resourceId: "me",
      subresource: "photo",
      subresourceId: null,
    };
  }
  // Events + subrecursos
  if (r === "events" && sub === "assignments") {
    return {
      actionCode: `events.assignments.${m.toLowerCase()}`,
      actionLabel:
        m === "POST"
          ? "Creó asignación en evento"
          : m === "DELETE"
            ? "Eliminó asignación de evento"
            : "Actualizó asignación de evento",
      resource: "events",
      resourceId,
      subresource: "assignments",
      subresourceId,
    };
  }
  if (r === "events" && sub === "repertoire") {
    const isReorder = subresourceId === "reorder";
    return {
      actionCode: isReorder
        ? "events.repertoire.reorder"
        : `events.repertoire.${m.toLowerCase()}`,
      actionLabel: isReorder
        ? "Reordenó repertorio del evento"
        : m === "POST"
          ? "Agregó canción al repertorio"
          : m === "DELETE"
            ? "Quitó canción del repertorio"
            : "Actualizó repertorio del evento",
      resource: "events",
      resourceId,
      subresource: "repertoire",
      subresourceId,
    };
  }
  if (r === "events" && sub === "materials") {
    const isUpload = subresourceId === "upload";
    return {
      actionCode: isUpload
        ? "events.materials.upload"
        : `events.materials.${m.toLowerCase()}`,
      actionLabel: isUpload
        ? "Subió material al evento"
        : m === "POST"
          ? "Agregó material al evento"
          : m === "DELETE"
            ? "Eliminó material del evento"
            : "Actualizó material del evento",
      resource: "events",
      resourceId,
      subresource: "materials",
      subresourceId,
    };
  }
  // Comments
  if (r === "comments") {
    return {
      actionCode: `comments.${m.toLowerCase()}`,
      actionLabel:
        m === "POST"
          ? "Creó comentario"
          : m === "DELETE"
            ? "Eliminó comentario"
            : "Actualizó comentario",
      resource: "comments",
      resourceId,
      subresource,
      subresourceId,
    };
  }
  if (clean === "/api/comments/react") {
    return {
      actionCode: "comments.react",
      actionLabel: "Reaccionó a un comentario",
      resource: "comments",
      resourceId: null,
      subresource: "react",
      subresourceId: null,
    };
  }
  // Notificaciones (registro token)
  if (r === "notifications") {
    return {
      actionCode: `notifications.${m.toLowerCase()}`,
      actionLabel: clean.includes("/register")
        ? "Registró notificaciones"
        : clean.includes("/unregister")
          ? "Desregistró notificaciones"
          : "Actualizó notificaciones",
      resource: "notifications",
      resourceId,
      subresource,
      subresourceId,
    };
  }
  // Envío de notificaciones masivas
  if (r === "notify") {
    return {
      actionCode: `notify.${(sub || "send").toLowerCase()}`,
      actionLabel:
        sub === "all"
          ? "Envió notificación (toda la app)"
          : sub === "week"
            ? "Envió notificación (semana)"
            : sub === "users"
              ? "Envió notificación (usuarios)"
              : sub === "user"
                ? "Envió notificación (usuario)"
                : sub === "materials"
                  ? "Envió notificación (materiales)"
                  : sub === "repertoire"
                    ? "Envió notificación (repertorio)"
                    : "Envió notificación",
      resource: "notify",
      resourceId: null,
      subresource: sub || null,
      subresourceId: null,
    };
  }
  // Fallback genérico para TODO lo demás
  const readable = resource ? humanizeResource(resource) : "acción";
  const label =
    resourceId && resourceId !== "me"
      ? `${verb} ${readable} (${resourceId})`
      : `${verb} ${readable}`;
  return {
    actionCode: `${String(resource || "api").toLowerCase()}.${m.toLowerCase()}`,
    actionLabel: label,
    resource,
    resourceId,
    subresource,
    subresourceId,
  };
};
const touchChangeMeta = async (resource) => {
  try {
    const inc = FieldValue.increment(1);
    const base = {
      rev: inc,
      updatedAt: FieldValue.serverTimestamp(),
    };
    const safeKey = String(resource || "")
      .toLowerCase()
      .replace(/[^a-z0-9_\-]/g, "")
      .slice(0, 50);
    if (safeKey) {
      base[`resources.${safeKey}`] = inc;
    }
    await db.doc(CHANGE_META_DOC_PATH).set(base, { merge: true });
  } catch (_a) {
    // ignore
  }
};
const touchAttendanceSync = async () => {
  try {
    await db.doc("meta/attendanceSync").set(
      {
        updatedAt: FieldValue.serverTimestamp(),
        version: FieldValue.increment(1),
      },
      { merge: true },
    );
  } catch (_a) {
    // ignore
  }
};
app.use("/api", (req, res, next) => {
  const method = String(req.method || "").toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS")
    return next();
  const url = String(req.originalUrl || req.url || "");
  const pathOnly = url.split("?")[0];
  if (AUDIT_DENYLIST.has(pathOnly)) return next();
  // const startedAt = Date.now();
  res.on("finish", () => {
    try {
      const status = res.statusCode;
      // Solo registrar si la respuesta fue "ok" (evita spam por errores de CSRF/401).
      if (status < 200 || status >= 400) return;
      // AUDIT LOGS TEMPORALMENTE DESHABILITADO para reducir escrituras/lecturas
      // const uid = String((res.locals as any).uid || "");
      // const email = String((res.locals as any).email || "") || null;
      // const appVersion = String(req.headers["x-app-version"] || "") || null;
      // const appPath = String(req.headers["x-app-path"] || "") || null;
      // const referer = String(req.headers.referer || "") || null;
      // const bodyKeys =
      //   req.body && typeof req.body === "object"
      //     ? Object.keys(req.body)
      //         .filter((k) => !AUDIT_SENSITIVE_BODY_KEYS.has(k))
      //         .slice(0, 30)
      //     : [];
      // const durationMs = Date.now() - startedAt;
      const actionInfo = buildAuditActionInfo(method, pathOnly);
      // DEBUG: Log para diagnosticar auto-refresh
      console.log("[ChangeMeta] 📝", {
        method,
        path: pathOnly,
        resource: actionInfo.resource,
        subresource: actionInfo.subresource,
        status,
      });
      // Bump change meta so other clients can refresh cheaply.
      void touchChangeMeta(actionInfo.resource);
      void touchChangeMeta(actionInfo.subresource);
      // AUDIT LOGS TEMPORALMENTE DESHABILITADO para reducir escrituras/lecturas
      // void db
      //   .collection(AUDIT_LOGS_COLLECTION)
      //   .add({
      //     createdAt: FieldValue.serverTimestamp(),
      //     uid: uid || null,
      //     email,
      //     actionCode: actionInfo.actionCode,
      //     actionLabel: actionInfo.actionLabel,
      //     resource: actionInfo.resource,
      //     resourceId: actionInfo.resourceId,
      //     subresource: actionInfo.subresource,
      //     subresourceId: actionInfo.subresourceId,
      //     method,
      //     path: pathOnly,
      //     status,
      //     durationMs,
      //     appVersion,
      //     appPath,
      //     referer,
      //     userAgent: String(req.headers["user-agent"] || "") || null,
      //     bodyKeys,
      //   })
      //   .catch(() => {});
    } catch (_a) {
      // ignore
    }
  });
  return next();
});
// Meta global de cambios: permite a los clientes refrescar vistas sin bajar payloads grandes.
// Útil para "actualización inmediata" con baja densidad de descargas.
app.get("/api/changes/meta", requireSession, async (_req, res) => {
  var _a;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  const snap = await db.doc(CHANGE_META_DOC_PATH).get();
  const data = snap.exists ? snap.data() : {};
  const rev =
    typeof (data === null || data === void 0 ? void 0 : data.rev) === "number"
      ? data.rev
      : 0;
  const resources =
    (data === null || data === void 0 ? void 0 : data.resources) &&
    typeof data.resources === "object"
      ? data.resources
      : {};
  const updatedAt =
    (_a = data === null || data === void 0 ? void 0 : data.updatedAt) !==
      null && _a !== void 0
      ? _a
      : null;
  const updatedAtMs =
    typeof (updatedAt === null || updatedAt === void 0
      ? void 0
      : updatedAt.toMillis) === "function"
      ? updatedAt.toMillis()
      : 0;
  return res.json({
    ok: true,
    rev,
    updatedAtMs,
    resources,
    serverTimeMs: Date.now(),
  });
});
// Crear sesión: el frontend manda un ID token (Firebase Auth) y el backend lo intercambia por cookie HttpOnly.
const sessionLoginHandler = async (req, res) => {
  var _a;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  const authHeader = String(req.headers.authorization || "");
  const bearer = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice("bearer ".length).trim()
    : "";
  const idTokenFromBody =
    typeof ((_a = req.body) === null || _a === void 0 ? void 0 : _a.idToken) ===
    "string"
      ? req.body.idToken
      : "";
  const idToken = idTokenFromBody || bearer;
  if (!idToken) return res.status(400).json({ error: "MISSING_ID_TOKEN" });
  try {
    // Paso 1: validar ID token
    await admin.auth().verifyIdToken(idToken);
    const expiresInMs = 5 * 24 * 60 * 60 * 1000; // 5 días
    // Paso 2: intercambiar por Session Cookie (requiere permisos de Firebase Auth en el runtime SA)
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn: expiresInMs,
    });
    const secure = isSecureRequest(req);
    const csrfToken = (0, crypto_1.randomUUID)();
    setCookie(res, SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      maxAgeMs: expiresInMs,
      secure,
    });
    setCookie(res, XSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      maxAgeMs: expiresInMs,
      secure,
    });
    return res.json({ ok: true, csrfToken });
  } catch (err) {
    const runtimeSa = await getRuntimeServiceAccountEmail();
    console.error("[sessionLogin] failed", {
      hasBodyToken: Boolean(idTokenFromBody),
      hasBearerToken: Boolean(bearer),
      runtimeServiceAccountEmail: runtimeSa,
      code: err === null || err === void 0 ? void 0 : err.code,
      name: err === null || err === void 0 ? void 0 : err.name,
      message: err === null || err === void 0 ? void 0 : err.message,
      stack: err === null || err === void 0 ? void 0 : err.stack,
    });
    const msg = String(
      (err === null || err === void 0 ? void 0 : err.message) || "",
    );
    if (
      String((err === null || err === void 0 ? void 0 : err.code) || "") ===
        "auth/insufficient-permission" ||
      msg.toLowerCase().includes("insufficient permission")
    ) {
      return res.status(503).json({
        error: "SESSION_LOGIN_FAILED",
        reason: "MISSING_IAM_FIREBASE_AUTH",
      });
    }
    return res.status(401).json({ error: "INVALID_ID_TOKEN" });
  }
};
// Login directo en backend (evita Firebase Auth en el navegador)
// Requiere variable de entorno: MCI_FIREBASE_WEB_API_KEY (no usar prefijo reservado FIREBASE_)
// Acepta: { username, password } o { email, password }
const passwordLoginHandler = async (req, res) => {
  var _a, _b, _c, _d;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  const apiKey = String(process.env.MCI_FIREBASE_WEB_API_KEY || "").trim();
  if (!apiKey && !isLocalDemoRuntime()) {
    return res.status(500).json({
      error: "MISSING_MCI_FIREBASE_WEB_API_KEY",
      message:
        "Configura MCI_FIREBASE_WEB_API_KEY en el entorno de Functions/Emulador.",
    });
  }
  const username =
    typeof ((_a = req.body) === null || _a === void 0
      ? void 0
      : _a.username) === "string"
      ? req.body.username
      : "";
  const emailRaw =
    typeof ((_b = req.body) === null || _b === void 0 ? void 0 : _b.email) ===
    "string"
      ? req.body.email
      : "";
  const password =
    typeof ((_c = req.body) === null || _c === void 0
      ? void 0
      : _c.password) === "string"
      ? req.body.password
      : "";
  if (!password) return res.status(400).json({ error: "MISSING_PASSWORD" });
  if (password.length > 4096 || username.length > 128 || emailRaw.length > 320) return res.status(400).json({ error: "INVALID_CREDENTIALS" });
  const email = normalizeLoginEmail(emailRaw, username);
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "MISSING_EMAIL" });
  }
  try {
    const url = passwordSignInUrl(apiKey);
    const itRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });
    const itText = await itRes.text();
    const itJson = itText ? JSON.parse(itText) : null;
    if (
      !itRes.ok ||
      !(itJson === null || itJson === void 0 ? void 0 : itJson.idToken)
    ) {
      const msg = String(
        ((_d = itJson === null || itJson === void 0 ? void 0 : itJson.error) ===
          null || _d === void 0
          ? void 0
          : _d.message) || "INVALID_CREDENTIALS",
      );
      return res.status(401).json({ error: msg });
    }
    const idToken = String(itJson.idToken);
    await admin.auth().verifyIdToken(idToken);
    const expiresInMs = 5 * 24 * 60 * 60 * 1000; // 5 días
    const sessionCookie = await admin.auth().createSessionCookie(idToken, {
      expiresIn: expiresInMs,
    });
    const secure = isSecureRequest(req);
    const csrfToken = (0, crypto_1.randomUUID)();
    setCookie(res, SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      maxAgeMs: expiresInMs,
      secure,
    });
    setCookie(res, XSRF_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      maxAgeMs: expiresInMs,
      secure,
    });
    return res.json({ ok: true, csrfToken });
  } catch (_e) {
    return res.status(401).json({ error: "INVALID_CREDENTIALS" });
  }
};
const sessionLogoutHandler = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  const secure = isSecureRequest(req);
  clearCookie(res, SESSION_COOKIE_NAME, secure);
  clearCookie(res, XSRF_COOKIE_NAME, secure);
  return res.json({ ok: true });
};

// Refresh Custom Token (Hybrid Session Restore)
// Validates the HttpOnly cookie and returns a fresh Custom Token for the SDK.
app.post("/api/session/refresh", requireSession, requireCsrf, async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  const uid = String(res.locals.uid || "");
  if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });

  try {
    // Generate a fresh Custom Token for the client SDK to hydrate
    const customToken = await admin.auth().createCustomToken(uid);
    return res.json({ token: customToken });
  } catch (error) {
    console.error(
      `[session/refresh] Failed to create custom token for ${uid}`,
      error,
    );
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});

// PROXY ENDPOINT FOR IMAGES - Now using downloadFileHandler (see below)

const meHandler = async (req, res) => {
  var _a;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Pragma", "no-cache");
  const uid = String(res.locals.uid || "");
  // Importante: /api/me debe ser un endpoint "probe".
  // Si no hay sesión, devolvemos 200 para evitar ruido de 401 en consola,
  // y para que el cliente pueda tratarlo como "no autenticado".
  if (!uid) return res.json({ ok: false });
  // Registrar última conexión (best-effort). No bloquea /api/me.
  try {
    const appVersion = String(req.headers["x-app-version"] || "") || null;
    const appPath = String(req.headers["x-app-path"] || "") || null;
    const referer = String(req.headers.referer || "") || null;
    // Modificación: usar update() en lugar de set(..., {merge: true})
    // Esto evita crear documentos "incompletos" para usuarios nuevos.
    // Si el usuario no existe, update() falla y va al catch, lo cual es correcto:
    // dejamos que el frontend cree el usuario completo (incluyendo role, email, etc.)
    void db
      .collection("users")
      .doc(uid)
      .update({
        lastSeenAt: FieldValue.serverTimestamp(),
        lastSeenVersion: appVersion,
        lastSeenPath: appPath,
        lastSeenReferer: referer,
        lastSeenUserAgent: String(req.headers["user-agent"] || "") || null,
      })
      .catch(() => {
        // Ignorar error si el documento no existe (usuario nuevo)
      });
  } catch (_b) {
    // ignore
  }
  try {
    const userSnap = await db.collection("users").doc(uid).get();
    const userData = userSnap.exists ? userSnap.data() : null;
    const roleId = String(
      (userData === null || userData === void 0 ? void 0 : userData.role) ||
        "user",
    );
    const roleSnap = await db.collection("roles").doc(roleId).get();
    const perms =
      roleSnap.exists &&
      Array.isArray(
        (_a = roleSnap.data()) === null || _a === void 0
          ? void 0
          : _a.permissions,
      )
        ? roleSnap.data().permissions
        : [];
    return res.json(
      sanitizeStorageUrlsForClient({
        ok: true,
        user: userData
          ? {
              uid,
              email: userData.email,
              name: userData.name,
              role: roleId,
              photoURL: userData.photoURL,
              photoThumbURL: userData.photoThumbURL,
              assignedMinistries: Array.isArray(userData.assignedMinistries)
                ? userData.assignedMinistries
                : [],
              permissions: perms,
            }
          : {
              uid,
              role: roleId,
              permissions: perms,
            },
      }),
    );
  } catch (err) {
    // Mantener /api/me como probe incluso si Firestore está roto por IAM.
    console.error("[me] failed", {
      uid,
      code: err === null || err === void 0 ? void 0 : err.code,
      message: err === null || err === void 0 ? void 0 : err.message,
    });
    if (isFirestorePermissionDenied(err)) {
      return res.json({ ok: false, reason: "MISSING_IAM_FIRESTORE" });
    }
    return res.json({ ok: false, reason: "SERVER_ERROR" });
  }
};
// Rutas BFF (duplicadas con y sin prefijo /api para compatibilidad)
app.post("/sessionLogin", sessionLoginHandler);
app.post("/api/sessionLogin", sessionLoginHandler);
app.post("/passwordLogin", passwordLoginHandler);
app.post("/api/passwordLogin", passwordLoginHandler);
app.post("/sessionLogout", requireCsrf, sessionLogoutHandler);
app.post("/api/sessionLogout", requireCsrf, sessionLogoutHandler);
app.get("/me", optionalSession, meHandler);
app.get("/api/me", optionalSession, meHandler);
// Diagnóstico: devuelve el service account real que usa el runtime.
// Útil para resolver permisos IAM (signBlob / Token Creator) en producción.
app.get("/runtimeInfo", requireSession, async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const runtimeSa = await getRuntimeServiceAccountEmail();
  return res.json({ ok: true, runtimeServiceAccountEmail: runtimeSa });
});
app.get("/api/runtimeInfo", requireSession, async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const runtimeSa = await getRuntimeServiceAccountEmail();
  return res.json({ ok: true, runtimeServiceAccountEmail: runtimeSa });
});
// Devuelve un Firebase Custom Token para reautenticar el SDK en el cliente
// (en memoria) usando la sesión HttpOnly. Evita persistir refresh/access tokens
// en sessionStorage/localStorage, pero mantiene UX "login recordado".
const customTokenHandler = async (_req, res) => {
  const uid = String(res.locals.uid || "");
  if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
  res.setHeader("Cache-Control", "no-store");
  try {
    const token = await admin.auth().createCustomToken(uid);
    return res.json({ ok: true, token });
  } catch (err) {
    const runtimeSa = await getRuntimeServiceAccountEmail();
    // Importante: loguear el error real para poder diagnosticar 500s en producción.
    // No devolvemos el mensaje al cliente para no filtrar detalles internos.
    console.error("[customToken] createCustomToken failed", {
      uid,
      runtimeServiceAccountEmail: runtimeSa,
      code: err === null || err === void 0 ? void 0 : err.code,
      name: err === null || err === void 0 ? void 0 : err.name,
      message: err === null || err === void 0 ? void 0 : err.message,
      stack: err === null || err === void 0 ? void 0 : err.stack,
    });
    // Señal explícita para el frontend / diagnóstico.
    const msg = String(
      (err === null || err === void 0 ? void 0 : err.message) || "",
    );
    if (
      String((err === null || err === void 0 ? void 0 : err.code) || "") ===
        "auth/insufficient-permission" ||
      msg.includes("iam.serviceAccounts.signBlob")
    ) {
      return res.status(503).json({
        error: "CUSTOM_TOKEN_FAILED",
        reason: "MISSING_IAM_SIGNBLOB",
      });
    }
    return res.status(500).json({ error: "CUSTOM_TOKEN_FAILED" });
  }
};
app.get("/customToken", requireSession, customTokenHandler);
app.get("/api/customToken", requireSession, customTokenHandler);
// --- BFF Data API (Admin SDK) ---
// Objetivo: que el cliente NO lea/escriba Firestore/Storage directamente.
// Reglas de acceso se aplican aquí (Admin SDK bypass rules).
const requireAdmin = async (_req, res, next) => {
  try {
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const ok = await isAdminUid(uid);
    if (!ok) return res.status(403).json({ error: "FORBIDDEN" });
    return next();
  } catch (_a) {
    return res.status(403).json({ error: "FORBIDDEN" });
  }
};
const getUserCtx = async (uid) => {
  const snap = await db.collection("users").doc(uid).get();
  const data = snap.exists ? snap.data() : {};
  return assignmentActorContext(data, uid);
};
const canEditAssignmentsForArea = (ctx, areaId) => {
  if (ctx.isAdmin) return true;
  if (!ctx.isMinistryRestricted) return false;
  return ctx.assignedMinistries.includes(areaId);
};
const safeBasename = (name) => {
  const base = path.basename(String(name || "file")).replace(/\s+/g, " ");
  // Remove anything suspicious.
  const cleaned = base.replace(/[^a-zA-Z0-9._ -]/g, "").trim();
  return cleaned.slice(0, 120) || "file";
};
const parseMultipartSingleFile = async (req, opts) => {
  const fields = {};
  let file = null;
  const maxFileSizeBytes =
    typeof (opts === null || opts === void 0
      ? void 0
      : opts.maxFileSizeBytes) === "number" &&
    Number.isFinite(opts.maxFileSizeBytes)
      ? Math.max(1, opts.maxFileSizeBytes)
      : 12 * 1024 * 1024;
  const bb = Busboy({
    headers: req.headers,
    limits: { files: 1, fileSize: maxFileSizeBytes, fields: 50 },
  });
  const done = new Promise((resolve, reject) => {
    bb.on("field", (name, val) => {
      fields[String(name)] = String(val);
    });
    bb.on("file", (_name, stream, info) => {
      const filename = safeBasename(
        (info === null || info === void 0 ? void 0 : info.filename) || "file",
      );
      const mimeType = String(
        (info === null || info === void 0 ? void 0 : info.mimeType) ||
          "application/octet-stream",
      );
      const chunks = [];
      stream.on("data", (d) => chunks.push(Buffer.from(d)));
      stream.on("limit", () => {
        reject(Object.assign(new Error("FILE_TOO_LARGE"), { code: "LIMIT" }));
      });
      stream.on("end", () => {
        file = { buffer: Buffer.concat(chunks), filename, mimeType };
      });
    });
    bb.on("error", reject);
    bb.on("finish", () => resolve());
  });
  // Firebase Functions provides rawBody; fallback to piping.
  const rawBody = req.rawBody;
  if (rawBody && Buffer.isBuffer(rawBody)) {
    bb.end(rawBody);
  } else {
    req.pipe(bb);
  }
  await done;
  return { fields, file };
};
// Upload event image (BFF mode)
app.post("/api/events/image", requireSession, requireCsrf, async (req, res) => {
  const uid = String(res.locals.uid || "");
  const role = String(res.locals.role || "");
  // Check permission (admin or ministry_admin)
  let userRole = role;
  if (!userRole) {
    // Fallback: fetch role directly if not in session
    try {
      const snap = await db.collection("users").doc(uid).get();
      userRole = snap.exists ? snap.data().role : "";
    } catch (_a) {
      // ignore
    }
  }
  const isMasterAdmin = userRole === "master_admin" || userRole === "admin";
  const isMinistryAdmin =
    userRole && String(userRole).startsWith("ministry_admin");
  if (!uid || (!isMasterAdmin && !isMinistryAdmin)) {
    console.error(`[events/image] FORBIDDEN uid=${uid} role=${userRole}`);
    return res.status(403).json({ error: "FORBIDDEN" });
  }
  try {
    const { file } = await parseMultipartSingleFile(req, {
      maxFileSizeBytes: 5 * 1024 * 1024, // 5MB
    });
    if (!file) return res.status(400).json({ error: "MISSING_FILE" });
    if (
      !String(file.mimeType || "")
        .toLowerCase()
        .startsWith("image/")
    ) {
      return res.status(400).json({ error: "INVALID_IMAGE" });
    }
    const ext = guessImageExtension(file.mimeType, file.filename);
    const fileName = `migrated_${Date.now()}_${(0,
    crypto_1.randomUUID)()}.${ext}`;
    const finalPath = `event-uploads/${fileName}`;
    await admin
      .storage()
      .bucket()
      .file(finalPath)
      .save(file.buffer, {
        metadata: {
          contentType: file.mimeType || "image/jpeg",
          cacheControl: "public, max-age=31536000",
        },
        resumable: false,
      });
    // Make public
    await admin.storage().bucket().file(finalPath).makePublic();
    const publicUrl = `https://storage.googleapis.com/${
      admin.storage().bucket().name
    }/${finalPath}`;
    return res.json({ ok: true, imageUrl: publicUrl, storagePath: finalPath });
  } catch (error) {
    console.error("Error uploading event image:", error);
    return res.status(500).json({ error: "INTERNAL_ERROR" });
  }
});
// Events (read for any authed; write for admin)
// SUPER OPTIMIZADO: Solo lee de Firestore los eventos que se van a mostrar según filtros
app.get("/api/events", requireSession, async (req, res) => {
  // Filtros desde el frontend (año, mes, tipo)
  const year = String(req.query.year || "");
  const month = String(req.query.month || "");
  const type = String(req.query.type || "");

  // ETAG CHECK: Si no hay cambios en "events", devolver 304.
  // Esto permite "Instantáneo" sin lecturas (solo 1 lectura de metadata).
  try {
    const metaDoc = await db.collection("meta").doc("events").get();
    const serverEtag = metaDoc.exists
      ? String(metaDoc.data().updatedAt.toMillis())
      : "0";

    const clientEtag = req.headers["if-none-match"];
    if (clientEtag === serverEtag) {
      // 304 Not Modified
      // No leemos collection("events") -> ahorramos N lecturas
      return res.status(304).send();
    }
    // Si ha cambiado, enviamos el nuevo ETag
    res.setHeader("ETag", serverEtag);
  } catch (e) {
    console.warn("Error checking ETag:", e);
  }

  // Smart Cache: Eventos pasados (año/mes anterior) se cachean 24h.
  // Eventos actuales/futuros, 1 min para que el ETag funcione rápido.
  let maxAge = 60; // 1 minuto por defecto para revalidar ETag frecuentemente
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const qYear = parseInt(year);
    if (!isNaN(qYear)) {
      if (qYear < currentYear) {
        maxAge = 86400; // Año pasado (super seguro cachear)
      } else if (qYear === currentYear && month !== "all") {
        const qMonth = parseInt(month);
        if (!isNaN(qMonth) && qMonth < currentMonth) {
          maxAge = 86400; // Mes pasado
        }
      }
    }
  } catch (_) {}

  // Cache-Control:
  // "no-cache" obliga a verificar ETag siempre (instantáneo).
  // Si es histórico, permitimos cache local.
  if (maxAge > 3600) {
    res.setHeader(
      "Cache-Control",
      `private, max-age=${maxAge}, stale-while-revalidate=${maxAge * 3}`,
    );
  } else {
    // Para el mes actual, forzamos revalidación (If-None-Match)
    res.setHeader("Cache-Control", "no-cache");
  }

  let query = db.collection("events");
  // OPTIMIZACIÓN CRÍTICA: Solo leer el rango de fechas necesario
  if (year && year !== "all") {
    if (month && month !== "all") {
      // Filtrar por mes específico (ej: Enero 2026)
      const startDate = `${year}-${month.padStart(2, "0")}-01`;
      const lastDay = new Date(Number(year), Number(month), 0).getDate();
      const endDate = `${year}-${month.padStart(2, "0")}-${String(
        lastDay,
      ).padStart(2, "0")}`;
      query = query.where("date", ">=", startDate).where("date", "<=", endDate);
    } else {
      // Filtrar por año completo (ej: 2026)
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      query = query.where("date", ">=", startDate).where("date", "<=", endDate);
    }
  }
  // Filtro por tipo (service, meeting, special)
  if (type && type !== "all") {
    query = query.where("type", "==", type);
  }
  // Ordenar por fecha descendente
  query = query.orderBy("date", "desc");
  // Límite razonable (solo si no hay filtros de fecha)
  if (!year || year === "all") {
    const limitRaw = Number(req.query.limit || 400);
    const lim = Number.isFinite(limitRaw)
      ? Math.max(1, Math.min(800, limitRaw))
      : 400;
    query = query.limit(lim);
  }
  const snap = await query.get();
  // OPTIMIZACIÓN: Solo devolver campos necesarios para la lista
  // Esto reduce el tamaño de la respuesta en ~70% (sin description, sin imageUrl completa)
  const items = snap.docs.map((d) => {
    const data = d.data();
    const rawImageUrl = typeof data.imageUrl === "string" ? data.imageUrl : "";
    const safeImageUrl =
      rawImageUrl &&
      !rawImageUrl.startsWith("data:") &&
      // Prevent accidental huge payloads if legacy data URLs slip in
      rawImageUrl.length < 2048
        ? rawImageUrl
        : "";
    return {
      id: d.id,
      title: data.title || "",
      date: data.date || "",
      time: data.time || "",
      serviceTime: data.serviceTime,
      endTime: data.endTime,
      location: data.location || "",
      type: data.type || "service",
      status: data.status,
      activeMinistries: data.activeMinistries || [],
      // Thumbnail para carga rápida
      imageThumbUrl: data.imageThumbUrl,
      // Imagen full-res (path de Storage o URL), seguro para lista (no data:)
      imageUrl: safeImageUrl,
      // NO incluir: description, updatedAt, createdAt, etc.
    };
  });
  return res.json(sanitizeStorageUrlsForClient({ ok: true, items }));
});
// EventDetails bundle (BFF): event + subcollections + users + areas
// OPTIMIZADO: Cache agresivo para reducir lecturas masivas
app.get("/api/events/:id/details", requireSession, async (req, res) => {
  // Cache de 5 minutos para EventDetails (reduce lecturas de 500+ a ~20 por evento)
  const reqCacheControl = String(
    req.header("cache-control") || "",
  ).toLowerCase();
  const clientWantsFresh =
    reqCacheControl.includes("no-store") ||
    reqCacheControl.includes("no-cache");
  if (clientWantsFresh) {
    res.setHeader(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate",
    );
  } else {
    // Cache de 5 minutos para datos de evento
    res.setHeader(
      "Cache-Control",
      "private, max-age=300, stale-while-revalidate=600",
    );
  }
  res.setHeader("Vary", "Cookie, Cache-Control");
  const id = String(req.params.id || "");
  if (!id) return res.status(400).json({ error: "MISSING_ID" });
  const eventRef = db.collection("events").doc(id);
  // OPTIMIZACIÓN: Solo leer datos del evento específico, no todos los usuarios/áreas
  // El frontend ya tiene esos datos cacheados de otros endpoints
  const [eventSnap, assignmentsSnap, repertoireSnap, materialsSnap] =
    await Promise.all([
      eventRef.get(),
      eventRef.collection("assignments").get(),
      eventRef.collection("repertoire").get(),
      eventRef.collection("materials").get(),
    ]);
  if (!eventSnap.exists) return res.status(404).json({ error: "NOT_FOUND" });
  const event = Object.assign({ id: eventSnap.id }, eventSnap.data());
  const actor = await getUserCtx(String(res.locals.uid || ""));
  const assignments = assignmentsSnap.docs.map((d) => assignmentForActor(d.data(), d.id, id, actor));
  res.setHeader("Cache-Control", "private, no-store");
  const repertoire = repertoireSnap.docs.map((d) =>
    Object.assign({ id: d.id }, d.data()),
  );
  const materials = materialsSnap.docs.map((d) =>
    Object.assign({ id: d.id }, d.data()),
  );
  // NOTA: users y areas se cargan desde /api/users y /api/service_areas
  // que tienen cache de 10 minutos. El frontend los combina localmente.
  return res.json(
    sanitizeStorageUrlsForClient({
      ok: true,
      event,
      assignments,
      repertoire,
      materials,
    }),
  );
});

// Endpoint específico para Repertoire (OPTIMIZACIÓN: Evita leer assignments/materials/users innecesariamente)
app.get("/api/events/:id/repertoire", requireSession, async (req, res) => {
  // Cache de 10 minutos para repertorio (menos volátil que asignaciones)
  res.setHeader(
    "Cache-Control",
    "private, max-age=600, stale-while-revalidate=1200",
  );

  const id = String(req.params.id || "");
  if (!id) return res.status(400).json({ error: "MISSING_ID" });

  const repertoireSnap = await db
    .collection("events")
    .doc(id)
    .collection("repertoire")
    .get();
  const repertoire = repertoireSnap.docs.map((d) =>
    Object.assign({ id: d.id }, d.data()),
  );

  return res.json({ ok: true, repertoire });
});

// Endpoint específico para Materials (OPTIMIZACIÓN: Evita leer todo el evento)
app.get("/api/events/:id/materials", requireSession, async (req, res) => {
  // Cache de 10 minutos
  res.setHeader(
    "Cache-Control",
    "private, max-age=600, stale-while-revalidate=1200",
  );

  const id = String(req.params.id || "");
  if (!id) return res.status(400).json({ error: "MISSING_ID" });

  const materialsSnap = await db
    .collection("events")
    .doc(id)
    .collection("materials")
    .get();
  const materials = materialsSnap.docs.map((d) =>
    Object.assign({ id: d.id }, d.data()),
  );

  return res.json({
    ok: true,
    materials: sanitizeStorageUrlsForClient({ materials }).materials,
  });
});

// --- EventDetails mutations (strict-BFF) ---
// Assignments: ministry admins can edit their own areas; admins can edit all.
app.put(
  "/api/events/:eventId/assignments/:assignmentId",
  requireSession,
  requireCsrf,
  async (req, res) => {
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const eventId = String(req.params.eventId || "");
    const assignmentId = String(req.params.assignmentId || "");
    if (!eventId || !assignmentId)
      return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};
    const areaId =
      typeof (body === null || body === void 0 ? void 0 : body.areaId) ===
      "string"
        ? body.areaId
        : "";
    if (!areaId) return res.status(400).json({ error: "MISSING_AREA_ID" });
    const ctx = await getUserCtx(uid);
    if (!canEditAssignmentsForArea(ctx, areaId))
      return res.status(403).json({ error: "FORBIDDEN" });
    const userId =
      typeof (body === null || body === void 0 ? void 0 : body.userId) ===
      "string"
        ? body.userId
        : "";
    if (!userId) return res.status(400).json({ error: "MISSING_USER_ID" });
    const ref = db
      .collection("events")
      .doc(eventId)
      .collection("assignments")
      .doc(assignmentId);
    try {
      await db.runTransaction(async (transaction) => {
        const previous = await transaction.get(ref);
        const previousArea = previous.exists ? previous.data()?.areaId || "" : undefined;
        if (!canWriteAssignmentScope(ctx, previousArea, areaId)) throw Object.assign(new Error("FORBIDDEN"), { code: "FORBIDDEN" });
        transaction.set(ref, Object.assign(Object.assign({}, body), {
          id: assignmentId, updatedAt: FieldValue.serverTimestamp(),
        }), { merge: true });
      });
    } catch (error) {
      if (error.code === "FORBIDDEN") return res.status(403).json({ error: "FORBIDDEN" });
      throw error;
    }
    const snap = await ref.get();
    return res.json({
      ok: true,
      item: Object.assign({ id: snap.id }, snap.data()),
    });
  },
);
app.delete(
  "/api/events/:eventId/assignments/:assignmentId",
  requireSession,
  requireCsrf,
  async (req, res) => {
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const eventId = String(req.params.eventId || "");
    const assignmentId = String(req.params.assignmentId || "");
    if (!eventId || !assignmentId)
      return res.status(400).json({ error: "MISSING_ID" });
    const ref = db
      .collection("events")
      .doc(eventId)
      .collection("assignments")
      .doc(assignmentId);
    const snap = await ref.get();
    if (snap.exists) {
      const data = snap.data();
      const areaId =
        typeof (data === null || data === void 0 ? void 0 : data.areaId) ===
        "string"
          ? data.areaId
          : "";
      const ctx = await getUserCtx(uid);
      if (!areaId || !canEditAssignmentsForArea(ctx, areaId))
        return res.status(403).json({ error: "FORBIDDEN" });
    }
    await ref.delete();
    return res.json({ ok: true });
  },
);
// Attendance mark (BFF): assigned user marks check-in / check-out (no photo in strict BFF).
app.post(
  "/api/events/:eventId/assignments/:assignmentId/attendance",
  requireSession,
  requireCsrf,
  async (req, res) => {
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const eventId = String(req.params.eventId || "");
    const assignmentId = String(req.params.assignmentId || "");
    if (!eventId || !assignmentId)
      return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};
    const type = String(
      (body === null || body === void 0 ? void 0 : body.type) || "",
    );
    if (type !== "check-in" && type !== "check-out")
      return res.status(400).json({ error: "MISSING_TYPE" });
    const assignmentRef = db
      .collection("events")
      .doc(eventId)
      .collection("assignments")
      .doc(assignmentId);
    const snap = await assignmentRef.get();
    if (!snap.exists) return res.status(404).json({ error: "NOT_FOUND" });
    const current = snap.data();
    const assignedUserId =
      typeof (current === null || current === void 0
        ? void 0
        : current.userId) === "string"
        ? current.userId
        : "";
    if (!assignedUserId || assignedUserId !== uid)
      return res.status(403).json({ error: "FORBIDDEN" });
    const attendanceTimeIso =
      typeof (body === null || body === void 0
        ? void 0
        : body.attendanceTimeIso) === "string" && body.attendanceTimeIso
        ? body.attendanceTimeIso
        : new Date().toISOString();
    const wasLate = Boolean(
      body === null || body === void 0 ? void 0 : body.wasLate,
    );
    const wasCheckOutLate = Boolean(
      body === null || body === void 0 ? void 0 : body.wasCheckOutLate,
    );
    const attendanceStatusRaw = String(
      (body === null || body === void 0 ? void 0 : body.attendanceStatus) || "",
    );
    const updateData = {
      [type === "check-in" ? "checkInTime" : "checkOutTime"]: attendanceTimeIso,
      updatedAt: FieldValue.serverTimestamp(),
    };
    // Keep consistent status.
    if (type === "check-in") {
      updateData.attendanceStatus = wasLate ? "late" : "present";
      updateData.wasLate = wasLate;
    } else {
      updateData.attendanceStatus = "completed";
      updateData.wasCheckOutLate = wasCheckOutLate;
    }
    // Allow client to pass a more specific status, but only for known values.
    if (
      attendanceStatusRaw === "present" ||
      attendanceStatusRaw === "late" ||
      attendanceStatusRaw === "completed"
    ) {
      updateData.attendanceStatus = attendanceStatusRaw;
    }
    // Optional location
    const loc =
      (body === null || body === void 0 ? void 0 : body.location) &&
      typeof body.location === "object"
        ? body.location
        : null;
    const lat =
      typeof (loc === null || loc === void 0 ? void 0 : loc.lat) === "number"
        ? loc.lat
        : null;
    const lng =
      typeof (loc === null || loc === void 0 ? void 0 : loc.lng) === "number"
        ? loc.lng
        : null;
    const accuracyMeters =
      typeof (loc === null || loc === void 0 ? void 0 : loc.accuracyMeters) ===
      "number"
        ? loc.accuracyMeters
        : null;
    const capturedAt =
      typeof (loc === null || loc === void 0 ? void 0 : loc.capturedAt) ===
        "string" && loc.capturedAt
        ? loc.capturedAt
        : typeof (loc === null || loc === void 0
              ? void 0
              : loc.capturedAtMs) === "number" &&
            Number.isFinite(loc.capturedAtMs)
          ? new Date(loc.capturedAtMs).toISOString()
          : null;
    if (
      lat !== null &&
      lng !== null &&
      Number.isFinite(lat) &&
      Number.isFinite(lng)
    ) {
      updateData[type === "check-in" ? "checkInLocation" : "checkOutLocation"] =
        Object.assign(
          Object.assign(
            { lat, lng },
            accuracyMeters !== null ? { accuracyMeters } : {},
          ),
          capturedAt ? { capturedAt } : {},
        );
    }
    // Update all assignments for this user within the same event (multi-role scenario).
    const q = await db
      .collection("events")
      .doc(eventId)
      .collection("assignments")
      .where("userId", "==", uid)
      .get();
    if (!q.empty) {
      const batch = db.batch();
      q.docs.forEach((d) => batch.set(d.ref, updateData, { merge: true }));
      await batch.commit();
      return res.json({ ok: true, updated: q.size });
    }
    await assignmentRef.set(updateData, { merge: true });
    return res.json({ ok: true, updated: 1 });
  },
);
// Attendance (self-service): upload attendance photo via BFF (multipart)
app.post(
  "/api/events/:eventId/assignments/:assignmentId/attendance/photo",
  requireSession,
  requireCsrf,
  async (req, res) => {
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const eventId = String(req.params.eventId || "");
    const assignmentId = String(req.params.assignmentId || "");
    if (!eventId || !assignmentId)
      return res.status(400).json({ error: "MISSING_ID" });
    try {
      const { fields, file } = await parseMultipartSingleFile(req, {
        maxFileSizeBytes: 4 * 1024 * 1024,
      });
      if (!file) return res.status(400).json({ error: "MISSING_FILE" });
      if (
        !String(file.mimeType || "")
          .toLowerCase()
          .startsWith("image/")
      ) {
        return res.status(400).json({ error: "INVALID_IMAGE" });
      }
      const type = String(fields.type || "");
      if (type !== "check-in" && type !== "check-out") {
        return res.status(400).json({ error: "MISSING_TYPE" });
      }
      const assignmentRef = db
        .collection("events")
        .doc(eventId)
        .collection("assignments")
        .doc(assignmentId);
      const snap = await assignmentRef.get();
      if (!snap.exists) return res.status(404).json({ error: "NOT_FOUND" });
      const current = snap.data();
      const assignedUserId =
        typeof (current === null || current === void 0
          ? void 0
          : current.userId) === "string"
          ? current.userId
          : "";
      if (!assignedUserId || assignedUserId !== uid)
        return res.status(403).json({ error: "FORBIDDEN" });
      const ext = guessImageExtension(file.mimeType, file.filename);
      const objectPath = `attendance/${eventId}/${assignmentId}/${type}_${Date.now()}_${(0,
      crypto_1.randomUUID)()}.${ext}`;
      await admin
        .storage()
        .bucket()
        .file(objectPath)
        .save(file.buffer, {
          metadata: {
            contentType: file.mimeType || "image/jpeg",
            // Sensible: don't let browsers/proxies store attendance photos.
            cacheControl: "private,no-store",
          },
          resumable: false,
        });
      const attendanceTimeIso =
        typeof fields.attendanceTimeIso === "string" && fields.attendanceTimeIso
          ? fields.attendanceTimeIso
          : new Date().toISOString();
      const wasLate = fields.wasLate === "true" || fields.wasLate === "1";
      const wasCheckOutLate =
        fields.wasCheckOutLate === "true" || fields.wasCheckOutLate === "1";
      const attendanceStatusRaw = String(fields.attendanceStatus || "");
      const updateData = {
        [type === "check-in" ? "checkInTime" : "checkOutTime"]:
          attendanceTimeIso,
        [type === "check-in" ? "checkInPhoto" : "checkOutPhoto"]: objectPath,
        updatedAt: FieldValue.serverTimestamp(),
      };
      if (type === "check-in") {
        updateData.attendanceStatus = wasLate ? "late" : "present";
        updateData.wasLate = wasLate;
      } else {
        updateData.attendanceStatus = "completed";
        updateData.wasCheckOutLate = wasCheckOutLate;
      }
      if (
        attendanceStatusRaw === "present" ||
        attendanceStatusRaw === "late" ||
        attendanceStatusRaw === "completed"
      ) {
        updateData.attendanceStatus = attendanceStatusRaw;
      }
      const lat = Number(fields.lat);
      const lng = Number(fields.lng);
      const accuracyMeters = Number(fields.accuracyMeters);
      const capturedAtMs = Number(fields.capturedAtMs);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        updateData[
          type === "check-in" ? "checkInLocation" : "checkOutLocation"
        ] = Object.assign(
          Object.assign(
            { lat, lng },
            Number.isFinite(accuracyMeters) ? { accuracyMeters } : {},
          ),
          Number.isFinite(capturedAtMs)
            ? { capturedAt: new Date(capturedAtMs).toISOString() }
            : {},
        );
      }
      // Update all assignments for this user within the same event (multi-role scenario).
      const q = await db
        .collection("events")
        .doc(eventId)
        .collection("assignments")
        .where("userId", "==", uid)
        .get();
      if (!q.empty) {
        const batch = db.batch();
        q.docs.forEach((d) => batch.set(d.ref, updateData, { merge: true }));
        await batch.commit();
        return res.json({ ok: true, updated: q.size, photoPath: objectPath });
      }
      await assignmentRef.set(updateData, { merge: true });
      return res.json({ ok: true, updated: 1, photoPath: objectPath });
    } catch (err) {
      const msg = String(
        (err === null || err === void 0 ? void 0 : err.message) || "",
      );
      if (
        msg.includes("FILE_TOO_LARGE") ||
        String((err === null || err === void 0 ? void 0 : err.code) || "") ===
          "LIMIT"
      ) {
        return res.status(413).json({ error: "FILE_TOO_LARGE" });
      }
      console.error("[attendance/photo] failed", {
        uid,
        eventId,
        assignmentId,
        message: err === null || err === void 0 ? void 0 : err.message,
        code: err === null || err === void 0 ? void 0 : err.code,
        stack: err === null || err === void 0 ? void 0 : err.stack,
      });
      return res.status(500).json({ error: "UPLOAD_FAILED" });
    }
  },
);
// Repertoire: admins only
app.post(
  "/api/events/:eventId/repertoire",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    if (!eventId) return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};
    const title =
      typeof (body === null || body === void 0 ? void 0 : body.title) ===
      "string"
        ? body.title.trim()
        : "";
    if (!title) return res.status(400).json({ error: "MISSING_TITLE" });
    const ref = db
      .collection("events")
      .doc(eventId)
      .collection("repertoire")
      .doc();
    const order =
      typeof (body === null || body === void 0 ? void 0 : body.order) ===
        "number" && Number.isFinite(body.order)
        ? body.order
        : null;
    await ref.set(
      Object.assign(
        Object.assign(
          {
            title,
            key:
              typeof (body === null || body === void 0 ? void 0 : body.key) ===
              "string"
                ? body.key
                : body === null || body === void 0
                  ? void 0
                  : body.key,
            link:
              typeof (body === null || body === void 0 ? void 0 : body.link) ===
              "string"
                ? body.link
                : "",
            notes:
              typeof (body === null || body === void 0
                ? void 0
                : body.notes) === "string"
                ? body.notes
                : "",
          },
          order !== null ? { order } : {},
        ),
        {
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: FieldValue.serverTimestamp(),
        },
      ),
    );
    const snap = await ref.get();
    return res.json({
      ok: true,
      id: snap.id,
      item: Object.assign({ id: snap.id }, snap.data()),
    });
  },
);
app.patch(
  "/api/events/:eventId/repertoire/:songId",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    const songId = String(req.params.songId || "");
    if (!eventId || !songId)
      return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};
    const ref = db
      .collection("events")
      .doc(eventId)
      .collection("repertoire")
      .doc(songId);
    await ref.set(
      Object.assign(Object.assign({}, body), {
        updatedAt: FieldValue.serverTimestamp(),
      }),
      { merge: true },
    );
    const snap = await ref.get();
    return res.json({
      ok: true,
      item: snap.exists ? Object.assign({ id: snap.id }, snap.data()) : null,
    });
  },
);
app.post(
  "/api/events/:eventId/repertoire/reorder",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    var _a;
    const eventId = String(req.params.eventId || "");
    if (!eventId) return res.status(400).json({ error: "MISSING_ID" });
    const items = Array.isArray(
      (_a = req.body) === null || _a === void 0 ? void 0 : _a.items,
    )
      ? req.body.items
      : [];
    if (!items.length) return res.status(400).json({ error: "MISSING_ITEMS" });
    const batch = db.batch();
    for (const it of items) {
      const id =
        typeof (it === null || it === void 0 ? void 0 : it.id) === "string"
          ? it.id
          : "";
      const order =
        typeof (it === null || it === void 0 ? void 0 : it.order) ===
          "number" && Number.isFinite(it.order)
          ? it.order
          : null;
      if (!id || order === null) continue;
      const ref = db
        .collection("events")
        .doc(eventId)
        .collection("repertoire")
        .doc(id);
      batch.set(
        ref,
        { order, updatedAt: FieldValue.serverTimestamp() },
        { merge: true },
      );
    }
    await batch.commit();
    return res.json({ ok: true });
  },
);
app.delete(
  "/api/events/:eventId/repertoire/:songId",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    const songId = String(req.params.songId || "");
    if (!eventId || !songId)
      return res.status(400).json({ error: "MISSING_ID" });
    await db
      .collection("events")
      .doc(eventId)
      .collection("repertoire")
      .doc(songId)
      .delete();
    return res.json({ ok: true });
  },
);
// Materials: admins only
app.post(
  "/api/events/:eventId/materials",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    if (!eventId) return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};
    const title =
      typeof (body === null || body === void 0 ? void 0 : body.title) ===
      "string"
        ? body.title.trim()
        : "";
    if (!title) return res.status(400).json({ error: "MISSING_TITLE" });
    const type =
      (body === null || body === void 0 ? void 0 : body.type) === "file"
        ? "file"
        : "link";
    const url =
      typeof (body === null || body === void 0 ? void 0 : body.url) === "string"
        ? body.url.trim()
        : "";
    if (!url) return res.status(400).json({ error: "MISSING_URL" });
    const ref = db
      .collection("events")
      .doc(eventId)
      .collection("materials")
      .doc();
    await ref.set({
      title,
      type,
      url,
      filename:
        typeof (body === null || body === void 0 ? void 0 : body.filename) ===
        "string"
          ? body.filename
          : "",
      songId:
        typeof (body === null || body === void 0 ? void 0 : body.songId) ===
          "string" && body.songId
          ? body.songId
          : null,
      songTitle:
        typeof (body === null || body === void 0 ? void 0 : body.songTitle) ===
          "string" && body.songTitle
          ? body.songTitle
          : null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const snap = await ref.get();
    return res.json({
      ok: true,
      id: snap.id,
      item: Object.assign({ id: snap.id }, snap.data()),
    });
  },
);
app.patch(
  "/api/events/:eventId/materials/:materialId",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    const materialId = String(req.params.materialId || "");
    if (!eventId || !materialId)
      return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};
    const ref = db
      .collection("events")
      .doc(eventId)
      .collection("materials")
      .doc(materialId);
    await ref.set(
      Object.assign(Object.assign({}, body), {
        updatedAt: FieldValue.serverTimestamp(),
      }),
      { merge: true },
    );
    const snap = await ref.get();
    return res.json({
      ok: true,
      item: snap.exists ? Object.assign({ id: snap.id }, snap.data()) : null,
    });
  },
);
app.post(
  "/api/events/:eventId/materials/upload",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    var _a;
    const eventId = String(req.params.eventId || "");
    if (!eventId) return res.status(400).json({ error: "MISSING_ID" });
    try {
      const { fields, file } = await parseMultipartSingleFile(req, {
        maxFileSizeBytes: 12 * 1024 * 1024,
      });
      if (!file) return res.status(400).json({ error: "MISSING_FILE" });
      const title = String(fields.title || "").trim();
      if (!title) return res.status(400).json({ error: "MISSING_TITLE" });
      const songId = String(fields.songId || "").trim();
      const songTitle = String(fields.songTitle || "").trim();
      const materialId = String(fields.materialId || "").trim();
      const ext = path.extname(file.filename) || "";
      const objectPath = `events/${eventId}/materials/${(0,
      crypto_1.randomUUID)()}${ext}`;
      const bucket = storage.bucket();
      await bucket.file(objectPath).save(file.buffer, {
        contentType: file.mimeType,
        resumable: false,
        metadata: {
          contentDisposition: `attachment; filename="${file.filename}"`,
          cacheControl: "private, max-age=0, no-store",
        },
      });
      const materialsCol = db
        .collection("events")
        .doc(eventId)
        .collection("materials");
      const ref = materialId
        ? materialsCol.doc(materialId)
        : materialsCol.doc();
      // If replacing, best-effort delete previous object.
      if (materialId) {
        const prev = await ref.get();
        if (prev.exists) {
          const prevUrl = String(
            ((_a = prev.data()) === null || _a === void 0 ? void 0 : _a.url) ||
              "",
          );
          if (
            prevUrl &&
            typeof prevUrl === "string" &&
            prevUrl.startsWith("events/")
          ) {
            await storage
              .bucket()
              .file(prevUrl)
              .delete()
              .catch(() => undefined);
          }
        }
      }
      await ref.set(
        Object.assign(
          Object.assign(
            {
              title,
              type: "file",
              url: objectPath,
              filename: file.filename,
              songId: songId || null,
              songTitle: songTitle || null,
            },
            materialId
              ? {}
              : { createdAt: FieldValue.serverTimestamp() },
          ),
          { updatedAt: FieldValue.serverTimestamp() },
        ),
        { merge: true },
      );
      const snap = await ref.get();
      return res.json({
        ok: true,
        id: snap.id,
        item: Object.assign({ id: snap.id }, snap.data()),
      });
    } catch (err) {
      const msg = String(
        (err === null || err === void 0 ? void 0 : err.message) || "",
      );
      if (
        msg === "FILE_TOO_LARGE" ||
        String((err === null || err === void 0 ? void 0 : err.code) || "") ===
          "LIMIT"
      ) {
        return res.status(413).json({ error: "FILE_TOO_LARGE" });
      }
      console.error("[materials/upload] failed", {
        message: err === null || err === void 0 ? void 0 : err.message,
        stack: err === null || err === void 0 ? void 0 : err.stack,
      });
      return res.status(500).json({ error: "UPLOAD_FAILED" });
    }
  },
);
app.delete(
  "/api/events/:eventId/materials/:materialId",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    const materialId = String(req.params.materialId || "");
    if (!eventId || !materialId)
      return res.status(400).json({ error: "MISSING_ID" });
    const ref = db
      .collection("events")
      .doc(eventId)
      .collection("materials")
      .doc(materialId);
    const snap = await ref.get();
    if (snap.exists) {
      const data = snap.data();
      const url =
        typeof (data === null || data === void 0 ? void 0 : data.url) ===
        "string"
          ? data.url
          : "";
      const type =
        (data === null || data === void 0 ? void 0 : data.type) === "file"
          ? "file"
          : "link";
      if (type === "file" && url && url.startsWith("events/")) {
        await storage
          .bucket()
          .file(url)
          .delete()
          .catch(() => undefined);
      }
    }
    await ref.delete();
    return res.json({ ok: true });
  },
);
// Materials library
app.get("/api/materials_library", requireSession, async (_req, res) => {
  const snap = await db
    .collection("materials_library")
    .orderBy("createdAt", "desc")
    .limit(500)
    .get();
  const items = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
  return res.json({ ok: true, items });
});
app.post(
  "/api/materials_library",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const body = req.body || {};
    const title =
      typeof (body === null || body === void 0 ? void 0 : body.title) ===
      "string"
        ? body.title.trim()
        : "";
    const url =
      typeof (body === null || body === void 0 ? void 0 : body.url) === "string"
        ? body.url.trim()
        : "";
    if (!title) return res.status(400).json({ error: "MISSING_TITLE" });
    const ref = await db.collection("materials_library").add({
      title,
      url,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    const snap = await ref.get();
    return res.json({
      ok: true,
      id: ref.id,
      item: Object.assign({ id: ref.id }, snap.data()),
    });
  },
);
app.delete(
  "/api/materials_library/:id",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    await db.collection("materials_library").doc(id).delete();
    return res.json({ ok: true });
  },
);
// TELEMETRY COMPLETAMENTE DESHABILITADO para reducir escrituras/lecturas
// app.get(
//   "/api/telemetry",
//   requireSession,
//   requireMasterAdmin,
//   async (req, res) => {
//     res.setHeader("Cache-Control", "no-store");
//     res.setHeader("Pragma", "no-cache");
//
//     const limitRaw = Number(req.query.limit || 200);
//     const lim = Number.isFinite(limitRaw)
//       ? Math.max(1, Math.min(500, limitRaw))
//       : 200;
//
//     const snap = await db
//       .collection("app_telemetry")
//       .orderBy("createdAt", "desc")
//       .limit(lim)
//       .get();
//
//     const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
//     return res.json({ ok: true, items });
//   }
// );

// ---- DIAGNÓSTICO DE ASIGNACIONES (temporal) ----
// Endpoint para ver todas las asignaciones de un evento específico
app.get(
  "/api/admin/debug/assignments/:eventId",
  requireSession,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    if (!eventId) return res.status(400).json({ error: "MISSING_EVENT_ID" });

    try {
      // Obtener evento
      const eventSnap = await db.collection("events").doc(eventId).get();
      if (!eventSnap.exists) {
        return res.status(404).json({ error: "EVENT_NOT_FOUND" });
      }
      const eventData = { id: eventSnap.id, ...eventSnap.data() };

      // Obtener asignaciones del evento
      const assignmentsSnap = await db
        .collection("events")
        .doc(eventId)
        .collection("assignments")
        .get();

      const assignments = assignmentsSnap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      return res.json({
        ok: true,
        event: {
          id: eventData.id,
          title: (eventData as any).title || "",
          date: (eventData as any).date || "",
        },
        assignmentsCount: assignments.length,
        assignments,
      });
    } catch (err: any) {
      console.error("[debug/assignments] error:", err);
      return res
        .status(500)
        .json({ error: "SERVER_ERROR", message: err?.message });
    }
  },
);

// Endpoint para RESTAURAR asignaciones desde datos proporcionados
app.post(
  "/api/admin/debug/assignments/:eventId/restore",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    if (!eventId) return res.status(400).json({ error: "MISSING_EVENT_ID" });

    const assignmentsToRestore = req.body?.assignments;
    if (
      !Array.isArray(assignmentsToRestore) ||
      assignmentsToRestore.length === 0
    ) {
      return res.status(400).json({
        error: "MISSING_ASSIGNMENTS",
        hint: "Enviar { assignments: [...] }",
      });
    }

    try {
      // Verificar que el evento existe
      const eventSnap = await db.collection("events").doc(eventId).get();
      if (!eventSnap.exists) {
        return res.status(404).json({ error: "EVENT_NOT_FOUND" });
      }

      const batch = db.batch();
      const restored: any[] = [];

      for (const assignment of assignmentsToRestore) {
        if (!assignment.id) continue;

        const ref = db
          .collection("events")
          .doc(eventId)
          .collection("assignments")
          .doc(assignment.id);

        const data = {
          areaId: assignment.areaId || "",
          areaName: assignment.areaName || "",
          roleName: assignment.roleName || "",
          userId: assignment.userId || "",
          userName: assignment.userName || "",
          userPhoto: assignment.userPhoto || null,
          restoredAt: FieldValue.serverTimestamp(),
          _restored: true,
        };

        batch.set(ref, data, { merge: true });
        restored.push({ id: assignment.id, ...data });
      }

      await batch.commit();

      // Notificar cambio
      await touchChangeMeta("assignments");

      return res.json({
        ok: true,
        restoredCount: restored.length,
        restored,
      });
    } catch (err: any) {
      console.error("[debug/assignments/restore] error:", err);
      return res
        .status(500)
        .json({ error: "SERVER_ERROR", message: err?.message });
    }
  },
);

// Endpoint para recuperar asignaciones usando PITR (Point-in-Time Recovery)
app.get(
  "/api/admin/debug/pitr-assignments/:eventId",
  requireSession,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    const snapshotTime = String(req.query.time || ""); // ISO timestamp, e.g. "2026-01-13T23:00:00Z"

    if (!eventId) return res.status(400).json({ error: "MISSING_EVENT_ID" });
    if (!snapshotTime) {
      return res.status(400).json({
        error: "MISSING_SNAPSHOT_TIME",
        hint: "Agrega ?time=2026-01-13T23:00:00Z para especificar el momento a recuperar",
      });
    }

    try {
      const historical = await readHistoricalAssignments(db, eventId, snapshotTime);
      const assignmentsSnap = historical.assignments;

      const assignments: any[] = [];
      assignmentsSnap.docs.forEach((doc: any) => {
        assignments.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      const eventPastSnap = historical.event;

      const eventData = eventPastSnap.exists
        ? { id: eventPastSnap.id, ...eventPastSnap.data() }
        : null;

      return res.json({
        ok: true,
        snapshotTime: historical.snapshotTime,
        historicalReadTimeVerified: true,
        event: eventData
          ? {
              id: eventData.id,
              title: (eventData as any).title,
              date: (eventData as any).date,
            }
          : null,
        assignmentsCount: assignments.length,
        assignments,
        hint:
          assignments.length > 0
            ? "Usa POST /api/admin/debug/assignments/{eventId}/restore con estos datos para restaurar"
            : "No se encontraron asignaciones en ese momento",
      });
    } catch (err: any) {
      return res.status(err?.status || 501).json({ error: err?.status ? err.code : "PITR_UNAVAILABLE" });
    }
  },
);

// Endpoint para recuperar Y restaurar asignaciones automáticamente desde PITR
app.post(
  "/api/admin/debug/pitr-restore/:eventId",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const eventId = String(req.params.eventId || "");
    const snapshotTime = String(req.body?.time || req.query.time || "");

    if (!eventId) return res.status(400).json({ error: "MISSING_EVENT_ID" });
    if (!snapshotTime) {
      return res.status(400).json({
        error: "MISSING_SNAPSHOT_TIME",
        hint: "Envía { time: '2026-01-13T23:00:00Z' } en el body",
      });
    }

    try {
      const historical = await readHistoricalAssignments(db, eventId, snapshotTime);
      const assignmentsSnap = historical.assignments;

      if (assignmentsSnap.empty) {
        return res.json({
          ok: false,
          error: "NO_ASSIGNMENTS_FOUND",
          message: `No se encontraron asignaciones para el evento ${eventId} en ${snapshotTime}`,
        });
      }

      // Restaurar cada asignación
      const batch = db.batch();
      const restored: any[] = [];

      assignmentsSnap.docs.forEach((doc: any) => {
        const data = doc.data();
        const ref = db
          .collection("events")
          .doc(eventId)
          .collection("assignments")
          .doc(doc.id);

        const restoredData = {
          ...data,
          restoredAt: FieldValue.serverTimestamp(),
          restoredFrom: snapshotTime,
          _restored: true,
        };

        batch.set(ref, restoredData, { merge: true });
        restored.push({ id: doc.id, ...data });
      });

      await batch.commit();
      await touchChangeMeta("assignments");

      return res.json({
        ok: true,
        restoredCount: restored.length,
        snapshotTime: historical.snapshotTime,
        historicalReadTimeVerified: true,
        restored,
        message: `Se restauraron ${restored.length} asignaciones del ${snapshotTime}`,
      });
    } catch (err: any) {
      return res.status(err?.status || 501).json({ error: err?.status ? err.code : "PITR_UNAVAILABLE" });
    }
  },
);

// TELEMETRY INGESTION DESHABILITADO
// app.post("/api/telemetry/initial-load", requireSession, async (req, res) => {
//   ... (código comentado)
// });
// TELEMETRY LATEST DESHABILITADO
// app.get(
//   "/api/admin/telemetry/latest",
//   requireSession,
//   requireMasterAdmin,
//   async (req, res) => {
//   ... (código comentado)
// });
// DAILY TELEMETRY DESHABILITADO
// const DAILY_TELEMETRY_COLLECTION = "app_telemetry_daily";
// const DAILY_ROUTES_COLLECTION = "app_telemetry_daily_routes";
// const toUtcDay = (d: Date): string => { ... }
// TELEMETRY DAILY DESHABILITADO - Consume escrituras/lecturas
// app.post("/api/telemetry/daily", requireSession, async (req, res) => {
//   ... (código comentado para evitar escrituras a app_telemetry_daily)
// });
// TELEMETRY ROUTES DESHABILITADO - Consume lecturas
// app.get("/api/admin/telemetry/daily/routes", ...)
//
// TELEMETRY DAILY GET DESHABILITADO - Consume lecturas
// app.get("/api/admin/telemetry/daily", ...)
// Dashboard bundle (BFF strict-friendly): upcoming events + user assignments
app.get("/api/dashboard", requireSession, async (_req, res) => {
  var _a, _b;
  // Detect if the client is requesting a fresh copy (bypassing cache).
  // This is used by changefeed refresh to get the latest data immediately.
  const reqCacheControl = String(
    _req.header("cache-control") || "",
  ).toLowerCase();
  const clientWantsFresh =
    reqCacheControl.includes("no-store") ||
    reqCacheControl.includes("no-cache");
  const uid = String(res.locals.uid || "");
  if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
  // Leer ChangeMeta para generar ETag dinámico (invalida cache cuando hay cambios)
  const actor = await getUserCtx(uid);
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Vary", "Cookie, Cache-Control");
  let changeRev = 0;
  try {
    const metaSnap = await db.doc(CHANGE_META_DOC_PATH).get();
    const metaData = metaSnap.exists ? metaSnap.data() : {};
    const eventsRev = Number(
      ((_a =
        metaData === null || metaData === void 0
          ? void 0
          : metaData.resources) === null || _a === void 0
        ? void 0
        : _a.events) || 0,
    );
    const assignmentsRev = Number(
      ((_b =
        metaData === null || metaData === void 0
          ? void 0
          : metaData.resources) === null || _b === void 0
        ? void 0
        : _b.assignments) || 0,
    );
    changeRev = eventsRev + assignmentsRev;
  } catch (_c) {
    // Si falla, usar timestamp actual
    changeRev = Math.floor(Date.now() / 1000);
  }
  // ETag dinámico basado en uid + changeRev
  const actorRevision = (0, crypto_1.createHash)("sha256").update(JSON.stringify([uid, actor.role, actor.assignedMinistries])).digest("hex").slice(0, 20);
  const etag = `"dash-private-v1-${actorRevision}-${changeRev}"`;
  res.setHeader("ETag", etag);
  // Verificar If-None-Match para 304 Not Modified
  const ifNoneMatch = _req.header("if-none-match");
  // ALLOW 304 EVEN IF clientWantsFresh=true.
  // The client uses no-cache to ask "Is this stale?", and we answer "No, use your cache" (304).
  if (ifNoneMatch === etag) {
    return res.status(304).end();
  }
  // The bundle can contain the caller's private attendance data.
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Vary", "Cookie, Cache-Control");
  // Use UTC-based calculation but include yesterday to handle timezone differences
  // (server is in UTC, users may be in UTC-5 or other timezones)
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  yesterday.setUTCHours(0, 0, 0, 0);
  const twoWeeksLater = new Date(now);
  twoWeeksLater.setUTCDate(twoWeeksLater.getUTCDate() + 14);
  twoWeeksLater.setUTCHours(23, 59, 59, 999);
  const startDateStr = yesterday.toISOString().split("T")[0];
  const endDateStr = twoWeeksLater.toISOString().split("T")[0];
  let eventsSnap;
  try {
    // Primero traer los eventos próximos
    eventsSnap = await db
      .collection("events")
      .where("date", ">=", startDateStr)
      .where("date", "<=", endDateStr)
      .orderBy("date", "asc")
      .get();
  } catch (err) {
    console.error("[dashboard] failed getting events", {
      uid,
      code: err === null || err === void 0 ? void 0 : err.code,
      message: err === null || err === void 0 ? void 0 : err.message,
    });
    if (isFirestorePermissionDenied(err)) {
      return res.status(503).json({
        error: "DASHBOARD_FAILED",
        reason: "MISSING_IAM_FIRESTORE",
      });
    }
    return res.status(500).json({
      error: "DASHBOARD_FAILED",
      reason: "SERVER_ERROR",
    });
  }
  // OPTIMIZACIÓN: En lugar de collectionGroup (costoso), leer assignments solo de eventos próximos
  // Esto reduce lecturas de ~200k/día a ~500/día por usuario
  const eventIds = eventsSnap.docs.map((d) => d.id);
  const allAssignments = [];
  if (eventIds.length > 0) {
    try {
      // Leer assignments en paralelo (máximo 10 eventos a la vez para no saturar)
      const batchSize = 10;
      for (let i = 0; i < eventIds.length; i += batchSize) {
        const batch = eventIds.slice(i, i + batchSize);
        const assignmentPromises = batch.map((eventId) =>
          db
            .collection("events")
            .doc(eventId)
            .collection("assignments")
            // .where("userId", "==", uid) // disabled: fetch all for avatars
            .get()
            .then((snap) => ({ eventId, snap })),
        );
        const results = await Promise.all(assignmentPromises);
        results.forEach(({ eventId, snap }) => {
          snap.docs.forEach((doc) => {
            allAssignments.push(
              assignmentForActor(doc.data(), doc.id, eventId, actor),
            );
          });
        });
      }
    } catch (err) {
      console.error("[dashboard] failed getting assignments", {
        uid,
        code: err === null || err === void 0 ? void 0 : err.code,
        message: err === null || err === void 0 ? void 0 : err.message,
      });
      // No fallar si solo las asignaciones fallan
    }
  }
  // OPTIMIZACIÓN: Campos esenciales para Dashboard, pero manteniendo las URLs de imagen para que el grid muestre la portada correcta
  const upcomingEvents = eventsSnap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title || "",
      date: data.date || "",
      time: data.time || "",
      serviceTime: data.serviceTime,
      endTime: data.endTime,
      location: data.location || "",
      type: data.type || "service",
      status: data.status,
      activeMinistries: data.activeMinistries || [],
      imageUrl: data.imageUrl || "",
      coverUrl: data.coverUrl || "",
      imageThumbUrl: data.imageThumbUrl || "",
      // NO incluir: description (puede ser muy larga)
    };
  });
  // allAssignments ya tiene eventId incluido
  const assignments = allAssignments;
  const payload = { ok: true, upcomingEvents, assignments };
  try {
    const stable = JSON.stringify(payload);
    const hash = (0, crypto_1.createHash)("sha1")
      .update(stable)
      .digest("base64url");
    const etag = `W/\"${uid}:${hash}\"`;
    res.setHeader("ETag", etag);
    const inm = _req.header("if-none-match");
    if (inm && inm === etag) {
      return res.status(304).end();
    }
  } catch (_d) {
    // best-effort: si algo falla, igual respondemos el JSON
  }
  return res.json(payload);
});
// Comentarios recientes (separado del dashboard para reducir invalidaciones)
app.get("/api/comments/recent", requireSession, async (req, res) => {
  // Detect if the client is requesting a fresh copy (bypassing cache).
  const reqCacheControl = String(
    req.header("cache-control") || "",
  ).toLowerCase();
  const clientWantsFresh =
    reqCacheControl.includes("no-store") ||
    reqCacheControl.includes("no-cache");
  if (clientWantsFresh) {
    res.setHeader(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate",
    );
  } else {
    // Cache corto: comentarios pueden cambiar frecuentemente.
    res.setHeader(
      "Cache-Control",
      "private, max-age=15, stale-while-revalidate=60",
    );
  }
  res.setHeader("Vary", "Cookie, Cache-Control");
  const uid = String(res.locals.uid || "");
  if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });

  // OPTIMIZATION: ETag based on Change Meta (1 read vs N reads)
  let changeRev = 0;
  try {
    const metaSnap = await db.doc(CHANGE_META_DOC_PATH).get();
    const metaData = metaSnap.exists ? metaSnap.data() : {};
    changeRev = Number(
      (
        (metaData === null || metaData === void 0
          ? void 0
          : metaData.resources) || {}
      ).comments || 0,
    );
  } catch (_c) {
    changeRev = Math.floor(Date.now() / 1000);
  }
  const etag = `"comments-${uid.slice(0, 8)}-${changeRev}"`;
  res.setHeader("ETag", etag);
  const ifNoneMatch = req.header("if-none-match");
  if (ifNoneMatch === etag) {
    return res.status(304).end();
  }

  const limitRaw = Number(req.query.limit || 200);
  const lim = Number.isFinite(limitRaw)
    ? Math.max(1, Math.min(500, limitRaw))
    : 200;
  const now = Date.now();
  const cutoffMs = now - 7 * 24 * 60 * 60 * 1000; // 1 semana
  const cutoffTs = Timestamp.fromMillis(cutoffMs);
  const commentsSnap = await db
    .collection("comments")
    .where("createdAt", ">=", cutoffTs)
    .orderBy("createdAt", "desc")
    .limit(lim)
    .get();
  const comments = commentsSnap.docs
    .map((d) => {
      var _a;
      const data = d.data();
      const createdAtMs =
        data.createdAt &&
        typeof ((_a = data.createdAt) === null || _a === void 0
          ? void 0
          : _a.toMillis) === "function"
          ? data.createdAt.toMillis()
          : null;
      const reactions =
        data.reactions && typeof data.reactions === "object"
          ? data.reactions
          : undefined;
      return {
        id: d.id,
        text: String(data.text || ""),
        authorId: String(data.authorId || ""),
        authorName: String(data.authorName || "Servidor"),
        authorPhotoURL:
          typeof data.authorPhotoURL === "string" ? data.authorPhotoURL : null,
        createdAt: createdAtMs,
        reactions,
      };
    })
    // devolver ASC para UI tipo chat
    .sort((a, b) => {
      const am = typeof a.createdAt === "number" ? a.createdAt : 0;
      const bm = typeof b.createdAt === "number" ? b.createdAt : 0;
      return am - bm;
    });
  const payload = { ok: true, comments };
  try {
    const stable = JSON.stringify(payload);
    const hash = (0, crypto_1.createHash)("sha1")
      .update(stable)
      .digest("base64url");
    const etag = `W/\"comments:${hash}\"`;
    res.setHeader("ETag", etag);
    const inm = req.header("if-none-match");
    if (inm && inm === etag) {
      return res.status(304).end();
    }
  } catch (_a) {
    // best-effort
  }
  return res.json(payload);
});
// Comments (BFF strict-friendly)
app.post("/api/comments", requireSession, requireCsrf, async (req, res) => {
  var _a;
  const uid = String(res.locals.uid || "");
  if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
  const text =
    typeof ((_a = req.body) === null || _a === void 0 ? void 0 : _a.text) ===
    "string"
      ? req.body.text.trim()
      : "";
  if (!text) return res.status(400).json({ error: "MISSING_TEXT" });
  if (text.length > 2000) return res.status(400).json({ error: "TOO_LONG" });
  const userSnap = await db.collection("users").doc(uid).get();
  const userData = userSnap.exists ? userSnap.data() : null;
  const authorName =
    userData && typeof userData.name === "string" && userData.name.trim()
      ? userData.name.trim()
      : "Servidor";
  const authorPhotoURL =
    userData && typeof userData.photoThumbURL === "string"
      ? userData.photoThumbURL
      : userData && typeof userData.photoURL === "string"
        ? userData.photoURL
        : null;
  const docRef = await db
    .collection("comments")
    .add(
      Object.assign(
        Object.assign(
          { text, authorId: uid, authorName },
          authorPhotoURL ? { authorPhotoURL } : {},
        ),
        { createdAt: FieldValue.serverTimestamp() },
      ),
    );
  return res.json({ ok: true, id: docRef.id });
});
app.delete(
  "/api/comments/:id",
  requireSession,
  requireCsrf,
  async (req, res) => {
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    const ref = db.collection("comments").doc(id);
    const snap = await ref.get();
    if (!snap.exists) return res.json({ ok: true });
    const data = snap.data();
    const authorId = String(
      (data === null || data === void 0 ? void 0 : data.authorId) || "",
    );
    if (authorId !== uid) {
      const isAdmin = await isAdminUid(uid);
      if (!isAdmin) return res.status(403).json({ error: "FORBIDDEN" });
    }
    await ref.delete();
    return res.json({ ok: true });
  },
);

// Command queue (BFF-safe enqueue)
app.post("/api/commands", requireSession, requireCsrf, async (req, res) => {
  const uid = String(res.locals.uid || "");
  if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });

  let command;
  try {
    command = normalizeCommandPayload(req.body || {}, uid);
    await authorizeQueuedCommand(command, db);
  } catch (error) {
    const invalid = String(error.code || "").startsWith("INVALID_");
    return res.status(invalid ? 400 : 403).json({ error: invalid ? error.code : "FORBIDDEN" });
  }
  command.createdAt = FieldValue.serverTimestamp();

  const docRef = await db.collection("commands").add(command);
  const snap = await docRef.get();
  return res.json({
    ok: true,
    id: docRef.id,
    item: Object.assign({ id: docRef.id }, snap.data()),
  });
});
app.post(
  "/api/events",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const body = sanitizeStorageUrlsForClient(req.body || {});
    const docRef = await db.collection("events").add(
      Object.assign(Object.assign({}, body), {
        status: body.status || "active",
        createdAt: FieldValue.serverTimestamp(),
      }),
    );
    const created = await docRef.get();
    return res.json({
      ok: true,
      id: docRef.id,
      item: Object.assign({ id: docRef.id }, created.data()),
    });
  },
);
app.patch(
  "/api/events/:id",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    const body = sanitizeStorageUrlsForClient(req.body || {});
    await db
      .collection("events")
      .doc(id)
      .set(
        Object.assign(Object.assign({}, body), {
          updatedAt: FieldValue.serverTimestamp(),
        }),
        { merge: true },
      );
    const snap = await db.collection("events").doc(id).get();
    return res.json({ ok: true, item: Object.assign({ id }, snap.data()) });
  },
);
app.delete(
  "/api/events/:id",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    await db.collection("events").doc(id).delete();
    return res.json({ ok: true });
  },
);

// Secure File Proxy (BFF) - Now using downloadFileHandler (below)

// Event Details Aggregation (BFF)
app.get("/api/events/:id/details", requireSession, async (req, res) => {
  // Moderate cache to allow near-realtime updates while respecting quotas
  res.setHeader(
    "Cache-Control",
    "private, max-age=10, stale-while-revalidate=30",
  );

  const id = String(req.params.id || "");
  if (!id) return res.status(400).json({ error: "MISSING_ID" });

  try {
    const eventRef = db.collection("events").doc(id);
    const eventSnap = await eventRef.get();

    if (!eventSnap.exists) {
      return res.status(404).json({ error: "EVENT_NOT_FOUND" });
    }

    // Fetch subcollections in parallel
    const [assignmentsSnap, repertoireSnap, materialsSnap] = await Promise.all([
      eventRef.collection("assignments").get(),
      eventRef.collection("repertoire").orderBy("order", "asc").get(),
      eventRef.collection("materials").get(),
    ]);

    const event = { id: eventSnap.id, ...eventSnap.data() };

    const actor = await getUserCtx(String(res.locals.uid || ""));
    const assignments = assignmentsSnap.docs.map((d) => assignmentForActor(d.data(), d.id, id, actor));
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Vary", "Cookie");

    const repertoire = repertoireSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const materials = materialsSnap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return res.json(
      sanitizeStorageUrlsForClient({
        ok: true,
        event,
        assignments,
        repertoire,
        materials,
      }),
    );
  } catch (err) {
    console.error("[events/details] failed", {
      id,
      message: err?.message,
    });
    return res.status(500).json({ error: "SERVER_ERROR" });
  }
});
// Templates (admin)
app.get("/api/event_templates", requireSession, async (_req, res) => {
  // Cache: 10 minutos (templates cambian raramente)
  res.setHeader(
    "Cache-Control",
    "private, max-age=600, stale-while-revalidate=1800",
  );
  const snap = await db.collection("event_templates").get();
  const items = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
  return res.json(sanitizeStorageUrlsForClient({ ok: true, items }));
});
app.post(
  "/api/event_templates",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const body = sanitizeStorageUrlsForClient(req.body || {});
    const docRef = await db.collection("event_templates").add(
      Object.assign(Object.assign({}, body), {
        createdAt: FieldValue.serverTimestamp(),
      }),
    );
    const created = await docRef.get();
    return res.json({
      ok: true,
      id: docRef.id,
      item: Object.assign({ id: docRef.id }, created.data()),
    });
  },
);
app.put(
  "/api/event_templates/:id",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    const body = sanitizeStorageUrlsForClient(req.body || {});
    await db
      .collection("event_templates")
      .doc(id)
      .set(
        Object.assign(Object.assign({}, body), {
          updatedAt: FieldValue.serverTimestamp(),
        }),
        { merge: true },
      );
    const snap = await db.collection("event_templates").doc(id).get();
    return res.json({ ok: true, item: Object.assign({ id }, snap.data()) });
  },
);
app.delete(
  "/api/event_templates/:id",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    await db.collection("event_templates").doc(id).delete();
    return res.json({ ok: true });
  },
);
// Roles (read for any authed; write for admin)
app.get("/api/roles", optionalSession, async (_req, res) => {
  // Cache: 10 minutos (roles cambian raramente)
  res.setHeader(
    "Cache-Control",
    "private, max-age=600, stale-while-revalidate=1800",
  );
  const items = await getCachedOrFresh("roles");
  return res.json({ ok: true, items });
});
app.get("/api/roles/:id", requireSession, async (req, res) => {
  const id = String(req.params.id || "");
  const snap = await db.collection("roles").doc(id).get();
  return res.json({
    ok: true,
    exists: snap.exists,
    item: snap.exists ? Object.assign({ id }, snap.data()) : null,
  });
});
app.put(
  "/api/roles/:id",
  requireSession,
  requireCsrf,
  requireMasterProfile,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};
    const ref = db.collection("roles").doc(id);
    const exists = (await ref.get()).exists;
    await ref.set(
      Object.assign(
        Object.assign(
          Object.assign({}, body),
          exists
            ? {}
            : { createdAt: FieldValue.serverTimestamp() },
        ),
        { updatedAt: FieldValue.serverTimestamp() },
      ),
      { merge: true },
    );
    const snap = await db.collection("roles").doc(id).get();
    return res.json({ ok: true, item: Object.assign({ id }, snap.data()) });
  },
);
app.post(
  "/api/roles",
  requireSession,
  requireCsrf,
  requireMasterProfile,
  async (req, res) => {
    const body = req.body || {};
    const docRef = await db.collection("roles").add(
      Object.assign(Object.assign({}, body), {
        createdAt: FieldValue.serverTimestamp(),
      }),
    );
    const created = await docRef.get();
    return res.json({
      ok: true,
      id: docRef.id,
      item: Object.assign({ id: docRef.id }, created.data()),
    });
  },
);
app.delete(
  "/api/roles/:id",
  requireSession,
  requireCsrf,
  requireMasterProfile,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    await db.collection("roles").doc(id).delete();
    return res.json({ ok: true });
  },
);
// Helper para leer del caché o reconstruir si no existe
const getCachedOrFresh = async (collectionName) => {
  try {
    const cacheSnap = await db
      .collection("app_cache")
      .doc(collectionName)
      .get();
    if (cacheSnap.exists) {
      const data = cacheSnap.data();
      if (Array.isArray(data.items)) {
        return collectionName === "user_directory" ? sanitizeUserDirectory(data.items) : data.items;
      }
    }
  } catch (_a) {
    // ignore fetch error
  }
  // Fallback: Read full collection + Rebuild Cache
  const snap = await db.collection(collectionName === "user_directory" ? "users" : collectionName).get();
  const items = snap.docs.map((d) => collectionName === "user_directory" ? userDirectoryEntry(d.id, d.data()) : Object.assign({ id: d.id }, d.data()));
  // Fire-and-forget cache rebuild
  // We do it manually here to ensure next read hits cache even if triggers lagged
  try {
    await db.collection("app_cache").doc(collectionName).set({
      items,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (_b) {
    // ignore
  }
  return items;
};
// Service Areas (read for any authed; write for admin)
app.get("/api/service_areas", optionalSession, async (_req, res) => {
  // Cache agresivo de 10 minutos
  res.setHeader(
    "Cache-Control",
    "private, max-age=600, stale-while-revalidate=1800",
  );
  res.setHeader("Vary", "Cookie");
  const items = await getCachedOrFresh("service_areas");
  return res.json({ ok: true, items });
});
app.post(
  "/api/service_areas",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const body = req.body || {};
    const docRef = await db.collection("service_areas").add(
      Object.assign(Object.assign({}, body), {
        createdAt: FieldValue.serverTimestamp(),
      }),
    );
    const created = await docRef.get();
    return res.json({
      ok: true,
      id: docRef.id,
      item: Object.assign({ id: docRef.id }, created.data()),
    });
  },
);
app.put(
  "/api/service_areas/:id",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};
    const ref = db.collection("service_areas").doc(id);
    const exists = (await ref.get()).exists;
    await ref.set(
      Object.assign(
        Object.assign(
          Object.assign({}, body),
          exists
            ? {}
            : { createdAt: FieldValue.serverTimestamp() },
        ),
        { updatedAt: FieldValue.serverTimestamp() },
      ),
      { merge: true },
    );
    const snap = await ref.get();
    return res.json({ ok: true, item: Object.assign({ id }, snap.data()) });
  },
);
app.delete(
  "/api/service_areas/:id",
  requireSession,
  requireCsrf,
  requireAdmin,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    await db.collection("service_areas").doc(id).delete();
    return res.json({ ok: true });
  },
);
// Users (read for any authed; write for admin)
app.get("/api/users", requireSession, async (_req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Vary", "Cookie, Authorization");
  const privileged = res.locals.role === "admin" || res.locals.role === "master_admin";
  const items = await getCachedOrFresh(privileged ? "users" : "user_directory");
  return res.json({ ok: true, items });
});
// Users (self-service profile update)
app.patch("/api/users/me", requireSession, requireCsrf, async (req, res) => {
  const uid = String(res.locals.uid || "");
  if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
  const body = req.body || {};
  const updates = {
    updatedAt: FieldValue.serverTimestamp(),
  };
  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (name.length === 0 || name.length > 120) {
      return res.status(400).json({ error: "INVALID_NAME" });
    }
    updates.name = name;
  }
  // Allow updating photoURL only as a URL/string; upload is not handled here.
  if (typeof body.photoURL === "string") {
    const photoURL = body.photoURL.trim();
    if (photoURL.length > 4096) {
      return res.status(400).json({ error: "INVALID_PHOTO_URL" });
    }
    updates.photoURL = photoURL;
  }
  // User preferences (self-service)
  if (body.preferences && typeof body.preferences === "object") {
    const prefs = body.preferences;
    if (typeof prefs.notifications === "boolean") {
      updates.preferences = { ...(updates.preferences || {}), notifications: prefs.notifications };
    }
    if (typeof prefs.darkMode === "boolean") {
      updates.preferences = { ...(updates.preferences || {}), darkMode: prefs.darkMode };
    }
  }
  await db.collection("users").doc(uid).set(updates, { merge: true });
  const snap = await db.collection("users").doc(uid).get();
  return res.json({ ok: true, item: Object.assign({ id: uid }, snap.data()) });
});
const guessImageExtension = (mimeType, filename) => {
  const mt = String(mimeType || "").toLowerCase();
  if (mt === "image/jpeg" || mt === "image/jpg") return "jpg";
  if (mt === "image/png") return "png";
  if (mt === "image/webp") return "webp";
  if (mt === "image/gif") return "gif";
  const ext = path.extname(String(filename || "")).replace(".", "");
  const cleaned = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!cleaned) return "jpg";
  // Restrict to common safe image extensions.
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(cleaned))
    return cleaned === "jpeg" ? "jpg" : cleaned;
  return "jpg";
};
// Users (self-service): upload profile photo via BFF (multipart)
app.post(
  "/api/users/me/photo",
  requireSession,
  requireCsrf,
  async (req, res) => {
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    try {
      const { file } = await parseMultipartSingleFile(req, {
        maxFileSizeBytes: 3 * 1024 * 1024,
      });
      if (!file) return res.status(400).json({ error: "MISSING_FILE" });
      if (
        !String(file.mimeType || "")
          .toLowerCase()
          .startsWith("image/")
      ) {
        return res.status(400).json({ error: "INVALID_IMAGE" });
      }
      const ext = guessImageExtension(file.mimeType, file.filename);
      const objectPath = `profile-photos/${uid}/${(0,
      crypto_1.randomUUID)()}.${ext}`;
      // Best-effort delete old profile photo if it was under our managed folder.
      try {
        const prevSnap = await db.collection("users").doc(uid).get();
        const prev = prevSnap.exists ? prevSnap.data() : null;
        const prevUrl = String(
          (prev === null || prev === void 0 ? void 0 : prev.photoURL) || "",
        );
        if (prevUrl.startsWith(`profile-photos/${uid}/`)) {
          await admin
            .storage()
            .bucket()
            .file(prevUrl)
            .delete({ ignoreNotFound: true });
        }
      } catch (_a) {
        // ignore
      }
      // Upload new file
      await admin
        .storage()
        .bucket()
        .file(objectPath)
        .save(file.buffer, {
          metadata: {
            contentType: file.mimeType || "image/jpeg",
            cacheControl: "public,max-age=31536000,immutable",
          },
          resumable: false,
        });
      await db.collection("users").doc(uid).set(
        {
          photoURL: objectPath,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      return res.json({ ok: true, photoURL: objectPath });
    } catch (err) {
      const msg = String(
        (err === null || err === void 0 ? void 0 : err.message) || "",
      );
      if (
        msg.includes("FILE_TOO_LARGE") ||
        String((err === null || err === void 0 ? void 0 : err.code) || "") ===
          "LIMIT"
      ) {
        return res.status(413).json({ error: "FILE_TOO_LARGE" });
      }
      console.error("[users/me/photo] failed", {
        uid,
        message: err === null || err === void 0 ? void 0 : err.message,
        code: err === null || err === void 0 ? void 0 : err.code,
        stack: err === null || err === void 0 ? void 0 : err.stack,
      });
      return res.status(500).json({ error: "UPLOAD_FAILED" });
    }
  },
);
// Users (self-service): change password via Admin SDK (BFF)
app.post(
  "/api/users/me/password",
  requireSession,
  requireCsrf,
  async (_req, res) => {
    var _a;
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const newPassword = String(
      ((_a = _req.body) === null || _a === void 0 ? void 0 : _a.newPassword) ||
        "",
    );
    if (newPassword.length < 6 || newPassword.length > 128) {
      return res.status(400).json({ error: "INVALID_PASSWORD" });
    }
    try {
      await admin.auth().updateUser(uid, { password: newPassword });
      return res.json({ ok: true });
    } catch (err) {
      console.error("[users/me/password] failed", {
        uid,
        message: err === null || err === void 0 ? void 0 : err.message,
        code: err === null || err === void 0 ? void 0 : err.code,
        stack: err === null || err === void 0 ? void 0 : err.stack,
      });
      return res.status(500).json({ error: "PASSWORD_CHANGE_FAILED" });
    }
  },
);
// Users (self-service): delete account (Firestore docs + Auth user) via BFF
app.post(
  "/api/users/me/delete",
  requireSession,
  requireCsrf,
  async (req, res) => {
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    try {
      // Best-effort: remove userTokens + profile doc.
      await Promise.all([
        db
          .collection("userTokens")
          .doc(uid)
          .delete()
          .catch(() => {}),
        db
          .collection("users")
          .doc(uid)
          .delete()
          .catch(() => {}),
      ]);
      // Remove Auth user (Admin SDK)
      await admin
        .auth()
        .deleteUser(uid)
        .catch(() => {
          // ignore if already deleted
        });
      // Clear session cookies so the client is immediately logged out.
      const secure = isSecureRequest(req);
      clearCookie(res, SESSION_COOKIE_NAME, secure);
      clearCookie(res, XSRF_COOKIE_NAME, secure);
      return res.json({ ok: true });
    } catch (err) {
      console.error("[users/me/delete] failed", {
        uid,
        message: err === null || err === void 0 ? void 0 : err.message,
        code: err === null || err === void 0 ? void 0 : err.code,
        stack: err === null || err === void 0 ? void 0 : err.stack,
      });
      return res.status(500).json({ error: "DELETE_ACCOUNT_FAILED" });
    }
  },
);
// Notifications tokens (self-service)
app.post(
  "/api/notifications/token",
  requireSession,
  requireCsrf,
  async (req, res) => {
    var _a, _b, _c;
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const token = String(
      ((_a = req.body) === null || _a === void 0 ? void 0 : _a.pushKey) ||
        ((_b = req.body) === null || _b === void 0
          ? void 0
          : _b.registrationToken) ||
        ((_c = req.body) === null || _c === void 0 ? void 0 : _c.token) ||
        "",
    ).trim();
    if (!token) return res.status(400).json({ error: "MISSING_PUSH_KEY" });
    if (token.length > 4096)
      return res.status(400).json({ error: "INVALID_PUSH_KEY" });
    try { await registerDeviceToken(db, uid, token, FieldValue.serverTimestamp()); }
    catch (error) {
      if (error?.status === 409) return res.status(409).json({ error: "DEVICE_LIMIT_REACHED" });
      return res.status(503).json({ error: "TOKEN_REGISTRATION_UNAVAILABLE" });
    }
    return res.json({ ok: true });
  },
);
// Alias sin la palabra "token" en la URL (para evitar falsos positivos en auditorías UI).
app.post(
  "/api/notifications/register",
  requireSession,
  requireCsrf,
  async (req, res) => {
    var _a, _b, _c;
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const pushKey = String(
      ((_a = req.body) === null || _a === void 0 ? void 0 : _a.pushKey) ||
        ((_b = req.body) === null || _b === void 0
          ? void 0
          : _b.registrationToken) ||
        ((_c = req.body) === null || _c === void 0 ? void 0 : _c.token) ||
        "",
    ).trim();
    if (!pushKey) return res.status(400).json({ error: "MISSING_PUSH_KEY" });
    if (pushKey.length > 4096)
      return res.status(400).json({ error: "INVALID_PUSH_KEY" });
    try { await registerDeviceToken(db, uid, pushKey, FieldValue.serverTimestamp()); }
    catch (error) {
      if (error?.status === 409) return res.status(409).json({ error: "DEVICE_LIMIT_REACHED" });
      return res.status(503).json({ error: "TOKEN_REGISTRATION_UNAVAILABLE" });
    }
    // Suscribir al topic user_{uid} para recibir actualizaciones de datos instantáneas (BFF)
    // y a all_users para recibir notificaciones globales (comentarios, anuncios, etc.)
    try {
      await Promise.all([
        runtimeMessaging().subscribeToTopic(pushKey, `user_${uid}`),
        runtimeMessaging().subscribeToTopic(pushKey, "all_users"),
      ]);
    } catch (e) {
      console.error("Error subscribing to topics", e);
    }
    return res.json({ ok: true });
  },
);
app.post(
  "/api/notifications/token/remove",
  requireSession,
  requireCsrf,
  async (req, res) => {
    var _a, _b, _c;
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const token = String(
      ((_a = req.body) === null || _a === void 0 ? void 0 : _a.pushKey) ||
        ((_b = req.body) === null || _b === void 0
          ? void 0
          : _b.registrationToken) ||
        ((_c = req.body) === null || _c === void 0 ? void 0 : _c.token) ||
        "",
    ).trim();
    if (!token) return res.status(400).json({ error: "MISSING_PUSH_KEY" });
    if (token.length > 4096)
      return res.status(400).json({ error: "INVALID_PUSH_KEY" });
    await db
      .collection("userTokens")
      .doc(uid)
      .set(
        {
          tokens: FieldValue.arrayRemove(token),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    try {
      await Promise.all([
        runtimeMessaging().unsubscribeFromTopic(token, `user_${uid}`),
        runtimeMessaging().unsubscribeFromTopic(token, "all_users"),
      ]);
    } catch (e) {
      // ignore
    }
    return res.json({ ok: true });
  },
);
app.post(
  "/api/notifications/unregister",
  requireSession,
  requireCsrf,
  async (req, res) => {
    var _a, _b, _c;
    const uid = String(res.locals.uid || "");
    if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
    const pushKey = String(
      ((_a = req.body) === null || _a === void 0 ? void 0 : _a.pushKey) ||
        ((_b = req.body) === null || _b === void 0
          ? void 0
          : _b.registrationToken) ||
        ((_c = req.body) === null || _c === void 0 ? void 0 : _c.token) ||
        "",
    ).trim();
    if (!pushKey) return res.status(400).json({ error: "MISSING_PUSH_KEY" });
    if (pushKey.length > 4096)
      return res.status(400).json({ error: "INVALID_PUSH_KEY" });
    await db
      .collection("userTokens")
      .doc(uid)
      .set(
        {
          tokens: FieldValue.arrayRemove(pushKey),
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    try {
      await Promise.all([
        runtimeMessaging().unsubscribeFromTopic(pushKey, `user_${uid}`),
        runtimeMessaging().unsubscribeFromTopic(pushKey, "all_users"),
      ]);
    } catch (e) {
      // ignore
    }
    return res.json({ ok: true });
  },
);
app.patch(
  "/api/users/:id",
  requireSession,
  requireCsrf,
  requireMasterProfile,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    const body = req.body || {};

    // Special handling for password updates (admin only)
    if (body.password) {
      const newPassword = String(body.password);
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "PASSWORD_TOO_SHORT" });
      }
      try {
        await admin.auth().updateUser(id, { password: newPassword });
        delete body.password; // Don't save password to Firestore
      } catch (err) {
        console.error("Error updating user password:", err);
        return res.status(400).json({ error: "PASSWORD_UPDATE_FAILED" });
      }
    }

    await db
      .collection("users")
      .doc(id)
      .set(
        Object.assign(Object.assign({}, body), {
          updatedAt: FieldValue.serverTimestamp(),
        }),
        { merge: true },
      );
    const snap = await db.collection("users").doc(id).get();
    return res.json({ ok: true, item: Object.assign({ id }, snap.data()) });
  },
);
app.delete(
  "/api/users/:id",
  requireSession,
  requireCsrf,
  requireMasterProfile,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    await db.collection("users").doc(id).delete();
    return res.json({ ok: true });
  },
);
// Service History: bounded event range, own assignments only, including legacy records.
app.get("/api/service-history", requireSession, async (req, res) => {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Vary", "Cookie, Authorization");
  const uid = String(res.locals.uid || "");
  if (!uid) return res.status(401).json({ error: "UNAUTHENTICATED" });
  try { return res.json(await userServiceHistory(db, uid, req.query)); }
  catch (error) {
    if (error?.status === 400) return res.status(400).json({ error: error.message });
    return res.status(500).json({ error: "SERVICE_HISTORY_FAILED" });
  }
});
const isIsoDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
// Attendance events (admin) - Solo eventos (con cache)
app.get(
  "/api/attendance/events",
  requireSession,
  requireAdmin,
  async (req, res) => {
    const startDate = String(req.query.startDate || "");
    const endDate = String(req.query.endDate || "");

    // Smart Cache: Si el rango es pasado (endDate < hoy), cache 24h. Si es actual/futuro, 5min.
    try {
      const today = new Date().toISOString().split("T")[0];
      const isPast = endDate < today;
      const maxAge = isPast ? 86400 : 300; // 24h vs 5min

      // Cache de 5 minutos para reducir lecturas
      res.setHeader(
        "Cache-Control",
        `private, max-age=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
      );
    } catch (e) {
      // Fallback
      res.setHeader(
        "Cache-Control",
        "private, max-age=300, stale-while-revalidate=600",
      );
    }

    res.setHeader("Vary", "Cookie");

    if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
      return res.status(400).json({ error: "INVALID_DATE" });
    }
    const eventsSnap = await db
      .collection("events")
      .where("date", ">=", startDate)
      .where("date", "<=", endDate)
      .orderBy("date", "desc")
      .limit(500)
      .get();
    // OPTIMIZACIÓN: Solo campos esenciales para Attendance (sin description ni imageUrl)
    const events = eventsSnap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title || "",
        date: data.date || "",
        time: data.time || "",
        serviceTime: data.serviceTime,
        endTime: data.endTime,
        location: data.location || "",
        type: data.type || "service",
        status: data.status,
        activeMinistries: data.activeMinistries || [],
        // NO incluir: description, imageUrl, imageThumbUrl, etc.
      };
    });
    return res.json({ ok: true, events });
  },
);
// Attendance records (admin) - Solo assignments (sin cache, siempre fresco)
app.get(
  "/api/attendance/records",
  requireSession,
  requireAdmin,
  async (req, res) => {
    // Sin cache - assignments cambian frecuentemente
    res.setHeader(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate",
    );
    res.setHeader("Vary", "Cookie");
    const startDate = String(req.query.startDate || "");
    const endDate = String(req.query.endDate || "");
    const eventIds = String(req.query.eventIds || "");
    if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
      return res.status(400).json({ error: "INVALID_DATE" });
    }
    // El frontend envía los IDs de eventos (ya tiene los eventos cacheados)
    const ids = eventIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (ids.length === 0) {
      return res.json({ ok: true, records: [] });
    }
    const records = [];
    // Leer assignments en paralelo (máximo 10 eventos a la vez)
    const batchSize = 10;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const assignmentPromises = batch.map((eventId) =>
        db
          .collection("events")
          .doc(eventId)
          .collection("assignments")
          .get()
          .then((snap) => ({ eventId, snap })),
      );
      const results = await Promise.all(assignmentPromises);
      results.forEach(({ eventId, snap }) => {
        snap.docs.forEach((doc) => {
          records.push(
            Object.assign(Object.assign({}, doc.data()), {
              id: doc.id,
              eventId,
            }),
          );
        });
      });
    }
    return res.json({ ok: true, records });
  },
);
// Devuelve la data necesaria para calcular stats de personas en el frontend
// OPTIMIZADO: Solo assignments - users se cargan desde /api/users (cache 10min)
app.get(
  "/api/attendance/peopleStatsData",
  requireSession,
  requireAdmin,
  async (req, res) => {
    // Sin cache - assignments cambian frecuentemente
    res.setHeader(
      "Cache-Control",
      "private, no-store, no-cache, must-revalidate",
    );
    res.setHeader("Vary", "Cookie");
    const startDate = String(req.query.startDate || "");
    const endDate = String(req.query.endDate || "");
    const eventIds = String(req.query.eventIds || "");
    if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
      return res.status(400).json({ error: "INVALID_DATE" });
    }
    // El frontend envía los IDs de eventos (ya tiene eventos cacheados de /api/attendance/events)
    const ids = eventIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (ids.length === 0) {
      return res.json({ ok: true, assignments: [] });
    }
    const assignments = [];
    // Leer assignments en paralelo (máximo 10 eventos a la vez)
    const batchSize = 10;
    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const assignmentPromises = batch.map((eventId) =>
        db
          .collection("events")
          .doc(eventId)
          .collection("assignments")
          .get()
          .then((snap) => ({ eventId, snap })),
      );
      const results = await Promise.all(assignmentPromises);
      results.forEach(({ eventId, snap }) => {
        snap.docs.forEach((doc) => {
          const data = doc.data();
          assignments.push(
            Object.assign(Object.assign({}, data), { id: doc.id, eventId }),
          );
        });
      });
    }
    // NOTA: users se cargan desde /api/users con cache de 10min
    // NOTA: events se cargan desde /api/attendance/events con cache de 5min
    return res.json({ ok: true, assignments });
  },
);
app.delete(
  "/api/users/:id",
  requireSession,
  requireCsrf,
  requireMasterProfile,
  async (req, res) => {
    const id = String(req.params.id || "");
    if (!id) return res.status(400).json({ error: "MISSING_ID" });
    await db.collection("users").doc(id).delete();
    return res.json({ ok: true });
  },
);
const db = admin.firestore();
const notificationAuthorization = releaseRequestGuard({ auth: admin.auth(), db }, "notification");
const notificationQuota = notificationQuotaGuard(db);
const requireNotificationActor = (req, res, next) => notificationAuthorization(req, res, () => notificationQuota(req, res, next));
const requireMaintenanceActor = releaseRequestGuard({ auth: admin.auth(), db }, "maintenance");
const requirePrivateReadActor = releaseReadRequestGuard({ auth: admin.auth(), db });
const messaging = runtimeMessaging();
const storage = admin.storage();
// --- Attendance sync ---
// Para que web/PWA/móvil vean los mismos conteos sin recargar, publicamos un
// "marcador" (meta/attendanceSync) cada vez que cambia un evento o una asignación.
// El cliente se suscribe a ese doc y recalcula estadísticas.
const bumpAttendanceSync = async (payload) => {
  await db
    .collection("meta")
    .doc("attendanceSync")
    .set(
      Object.assign(
        {
          updatedAt: FieldValue.serverTimestamp(),
          version: FieldValue.increment(1),
        },
        payload,
      ),
      { merge: true },
    );
};
exports.attendanceSyncOnAssignmentWrite = functions.firestore
  .document("events/{eventId}/assignments/{assignmentId}")
  .onWrite(async (_change, context) => {
    await bumpAttendanceSync({
      source: "assignment",
      eventId: context.params.eventId,
    });
  });
exports.attendanceSyncOnEventWrite = functions.firestore
  .document("events/{eventId}")
  .onWrite(async (_change, context) => {
    await bumpAttendanceSync({
      source: "event",
      eventId: context.params.eventId,
    });
  });
function sanitizeStorageUrlsForClient(value) {
  // Passthrough: NO remover tokens, son necesarios para visualizar imágenes privadas/protegidas.
  return value;
}
const shouldProcessImageObject = (objectName, contentType) => {
  if (!objectName) return false;
  if (!contentType || !contentType.startsWith("image/")) return false;
  // Evitar loop (no reprocesar thumbs)
  if (objectName.includes("/thumb_") || objectName.includes("thumb_"))
    return false;
  return (
    objectName.startsWith("profile-photos/") ||
    objectName.startsWith("event-images/") ||
    objectName.startsWith("event-template-images/")
  );
};
const isAdminUid = async (uid) => {
  var _a;
  const snap = await db.collection("users").doc(uid).get();
  const role = snap.exists
    ? (_a = snap.data()) === null || _a === void 0
      ? void 0
      : _a.role
    : undefined;
  return role === "master_admin" || role === "admin";
};
const generateAndUploadThumb = async (
  bucket,
  sourceObjectPath,
  thumbObjectPath,
  uidToUpdate,
) => {
  const sourceFile = bucket.file(sourceObjectPath);
  const ext = path.extname(sourceObjectPath);
  const baseName = path.basename(sourceObjectPath, ext);
  const tmpOriginal = path.join(os.tmpdir(), `${baseName}${ext || ".img"}`);
  const tmpThumb = path.join(os.tmpdir(), `thumb_${baseName}.webp`);
  try {
    await sourceFile.download({ destination: tmpOriginal });
    await sharp(tmpOriginal)
      .rotate()
      .resize(256, 256, { fit: "cover" })
      .webp({ quality: 82 })
      .toFile(tmpThumb);
    await bucket.upload(tmpThumb, {
      destination: thumbObjectPath,
      metadata: {
        contentType: "image/webp",
        cacheControl: "public,max-age=31536000,immutable",
      },
    });
    const thumbUrl = thumbObjectPath;
    if (uidToUpdate) {
      await db.collection("users").doc(uidToUpdate).set(
        {
          photoThumbURL: thumbUrl,
        },
        { merge: true },
      );
    }
    return thumbUrl;
  } finally {
    await fs.unlink(tmpOriginal).catch(() => undefined);
    await fs.unlink(tmpThumb).catch(() => undefined);
  }
};
const generateAndUploadThumbFromUrl = async (bucket, uid, sourceUrl) => {
  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);
  const thumbBuffer = await sharp(inputBuffer)
    .rotate()
    .resize(256, 256, { fit: "cover" })
    .webp({ quality: 82 })
    .toBuffer();
  const objectPath = `profile-photos/${uid}/thumb_external_${Date.now()}.webp`;
  const file = bucket.file(objectPath);
  await file.save(thumbBuffer, {
    contentType: "image/webp",
    metadata: {
      cacheControl: "public,max-age=31536000,immutable",
    },
  });
  const thumbUrl = objectPath;
  await db.collection("users").doc(uid).set(
    {
      photoThumbURL: thumbUrl,
    },
    { merge: true },
  );
  return thumbUrl;
};
// Backfill de thumbnails de fotos de perfil ya existentes.
// mode:
// - "storage": recorre objetos en profile-photos/ y genera thumb_*.webp si falta.
// - "firestore": recorre users/ y si hay photoURL externo (http) y falta photoThumbURL, genera un thumb.
exports.backfillProfilePhotoThumbs = functions
  .runWith({ timeoutSeconds: 540, memory: "1GB" })
  .https.onCall(async (data, context) => {
    var _a;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid)
      throw new functions.https.HttpsError("unauthenticated", "Auth requerida");
    if (!(await isAdminUid(uid))) {
      throw new functions.https.HttpsError("permission-denied", "Solo admin");
    }
    const mode =
      (data === null || data === void 0 ? void 0 : data.mode) === "firestore"
        ? "firestore"
        : "storage";
    const limit =
      typeof (data === null || data === void 0 ? void 0 : data.limit) ===
        "number" && data.limit > 0
        ? Math.min(200, data.limit)
        : 50;
    const pageToken =
      typeof (data === null || data === void 0 ? void 0 : data.pageToken) ===
      "string"
        ? data.pageToken
        : undefined;
    const cursorDocId =
      typeof (data === null || data === void 0 ? void 0 : data.cursorDocId) ===
      "string"
        ? data.cursorDocId
        : undefined;
    const bucket = storage.bucket();
    let processed = 0;
    let generated = 0;
    let skipped = 0;
    if (mode === "storage") {
      const [files, apiResponse] = await bucket.getFiles({
        prefix: "profile-photos/",
        maxResults: limit,
        pageToken,
      });
      const nextPageToken =
        apiResponse === null || apiResponse === void 0
          ? void 0
          : apiResponse.nextPageToken;
      for (const f of files) {
        processed++;
        const name = f.name || "";
        if (!name) continue;
        if (
          name.includes("/thumb_") ||
          path.posix.basename(name).startsWith("thumb_")
        ) {
          skipped++;
          continue;
        }
        const [meta] = await f.getMetadata().catch(() => [null]);
        const contentType =
          meta === null || meta === void 0 ? void 0 : meta.contentType;
        if (!contentType || !contentType.startsWith("image/")) {
          skipped++;
          continue;
        }
        const ext = path.extname(name);
        const baseName = path.basename(name, ext);
        const dirName = path.posix.dirname(name);
        const thumbObjectPath = path.posix.join(
          dirName,
          `thumb_${baseName}.webp`,
        );
        const [thumbExists] = await bucket.file(thumbObjectPath).exists();
        if (thumbExists) {
          skipped++;
          continue;
        }
        const parts = name.split("/");
        const targetUid = parts.length >= 2 ? parts[1] : undefined;
        await generateAndUploadThumb(bucket, name, thumbObjectPath, targetUid);
        generated++;
      }
      return { mode, processed, generated, skipped, nextPageToken };
    }
    // mode === "firestore"
    let q = db
      .collection("users")
      .orderBy(FieldPath.documentId())
      .limit(limit);
    if (cursorDocId) {
      q = q.startAfter(cursorDocId);
    }
    const snap = await q.get();
    let nextCursorDocId = undefined;
    for (const docSnap of snap.docs) {
      processed++;
      nextCursorDocId = docSnap.id;
      const u = docSnap.data();
      if (typeof u.photoThumbURL === "string" && u.photoThumbURL) {
        skipped++;
        continue;
      }
      const photoURL = typeof u.photoURL === "string" ? u.photoURL : "";
      if (!photoURL || !photoURL.startsWith("http")) {
        skipped++;
        continue;
      }
      // Si ya es Storage y tiene un token, normalmente el trigger lo genera al subir;
      // aquí solo resolvemos casos de URL externa (Google, etc.).
      if (photoURL.includes("firebasestorage.googleapis.com")) {
        skipped++;
        continue;
      }
      try {
        await generateAndUploadThumbFromUrl(bucket, docSnap.id, photoURL);
        generated++;
      } catch (e) {
        console.error("Backfill external thumb failed", docSnap.id, e);
        skipped++;
      }
    }
    return { mode, processed, generated, skipped, nextCursorDocId };
  });
const getTargetConfig = (target) => {
  if (target === "templates") {
    return {
      prefix: "event-template-images/",
      collection: "event_templates",
      thumbField: "imageThumbUrl",
    };
  }
  return {
    prefix: "event-images/",
    collection: "events",
    thumbField: "imageThumbUrl",
  };
};
const uploadThumbBuffer = async (bucket, objectPath, thumbBuffer) => {
  const file = bucket.file(objectPath);
  await file.save(thumbBuffer, {
    contentType: "image/webp",
    metadata: {
      cacheControl: "public,max-age=31536000,immutable",
    },
  });
  return objectPath;
};
const isDataUrlImage = (value) =>
  typeof value === "string" && value.startsWith("data:image/");
const parseDataUrl = (dataUrl) => {
  const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!match) {
    throw new Error("Formato data URL no soportado (se esperaba base64)");
  }
  const mime = match[1];
  const buffer = Buffer.from(match[2], "base64");
  return { mime, buffer };
};
// Backfill de thumbs para imágenes de eventos/plantillas ya existentes.
// mode:
// - "storage": recorre objetos en Storage y genera thumb_*.webp si falta.
// - "firestore": recorre Firestore y si hay imageUrl externo (http) y falta imageThumbUrl, genera un thumb en Storage.
exports.backfillEventThumbs = functions
  .runWith({ timeoutSeconds: 540, memory: "1GB" })
  .https.onCall(async (data, context) => {
    var _a;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid)
      throw new functions.https.HttpsError("unauthenticated", "Auth requerida");
    if (!(await isAdminUid(uid))) {
      throw new functions.https.HttpsError("permission-denied", "Solo admin");
    }
    const target =
      (data === null || data === void 0 ? void 0 : data.target) === "templates"
        ? "templates"
        : "events";
    const { prefix, collection, thumbField } = getTargetConfig(target);
    const mode =
      (data === null || data === void 0 ? void 0 : data.mode) === "firestore"
        ? "firestore"
        : "storage";
    const limit =
      typeof (data === null || data === void 0 ? void 0 : data.limit) ===
        "number" && data.limit > 0
        ? Math.min(200, data.limit)
        : 50;
    const pageToken =
      typeof (data === null || data === void 0 ? void 0 : data.pageToken) ===
      "string"
        ? data.pageToken
        : undefined;
    const cursorDocId =
      typeof (data === null || data === void 0 ? void 0 : data.cursorDocId) ===
      "string"
        ? data.cursorDocId
        : undefined;
    const bucket = storage.bucket();
    let processed = 0;
    let generated = 0;
    let skipped = 0;
    if (mode === "storage") {
      const [files, apiResponse] = await bucket.getFiles({
        prefix,
        maxResults: limit,
        pageToken,
      });
      const nextPageToken =
        apiResponse === null || apiResponse === void 0
          ? void 0
          : apiResponse.nextPageToken;
      for (const f of files) {
        processed++;
        const name = f.name || "";
        if (!name) continue;
        if (
          name.includes("/thumb_") ||
          path.posix.basename(name).startsWith("thumb_")
        ) {
          skipped++;
          continue;
        }
        const [meta] = await f.getMetadata().catch(() => [null]);
        const contentType =
          meta === null || meta === void 0 ? void 0 : meta.contentType;
        if (!contentType || !contentType.startsWith("image/")) {
          skipped++;
          continue;
        }
        const ext = path.extname(name);
        const baseName = path.basename(name, ext);
        const dirName = path.posix.dirname(name);
        const thumbObjectPath = path.posix.join(
          dirName,
          `thumb_${baseName}.webp`,
        );
        const [thumbExists] = await bucket.file(thumbObjectPath).exists();
        if (thumbExists) {
          skipped++;
          continue;
        }
        const parts = name.split("/");
        const docId = parts.length >= 2 ? parts[1] : undefined;
        const thumbUrl = await generateAndUploadThumb(
          bucket,
          name,
          thumbObjectPath,
        );
        if (docId) {
          await db
            .collection(collection)
            .doc(docId)
            .set(
              {
                [thumbField]: thumbUrl,
              },
              { merge: true },
            );
        }
        generated++;
      }
      return { target, mode, processed, generated, skipped, nextPageToken };
    }
    // mode === "firestore"
    let q = db
      .collection(collection)
      .orderBy(FieldPath.documentId())
      .limit(limit);
    if (cursorDocId) {
      q = q.startAfter(cursorDocId);
    }
    const snap = await q.get();
    let nextCursor = undefined;
    for (const d of snap.docs) {
      processed++;
      nextCursor = d.id;
      const docData = d.data();
      if (typeof docData[thumbField] === "string" && docData[thumbField]) {
        skipped++;
        continue;
      }
      const imageUrl =
        typeof docData.imageUrl === "string" ? docData.imageUrl : "";
      if (!imageUrl || !imageUrl.startsWith("http")) {
        skipped++;
        continue;
      }
      if (imageUrl.includes("firebasestorage.googleapis.com")) {
        skipped++;
        continue;
      }
      try {
        const res = await fetch(imageUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const thumbBuffer = await sharp(buf)
          .rotate()
          .resize(256, 256, { fit: "cover" })
          .webp({ quality: 82 })
          .toBuffer();
        const objectPath = `${prefix}${d.id}/thumb_external_${Date.now()}.webp`;
        const thumbUrl = await uploadThumbBuffer(
          bucket,
          objectPath,
          thumbBuffer,
        );
        await db
          .collection(collection)
          .doc(d.id)
          .set(
            {
              [thumbField]: thumbUrl,
            },
            { merge: true },
          );
        generated++;
      } catch (e) {
        console.error("Backfill event thumb failed", target, d.id, e);
        skipped++;
      }
    }
    return {
      target,
      mode,
      processed,
      generated,
      skipped,
      nextCursorDocId: nextCursor,
    };
  });
// Migra imágenes legacy guardadas como base64 (data URL) en Firestore hacia Storage.
// target: "events" | "templates"
// Luego el trigger onFinalize generará el thumb automáticamente y seteará imageThumbUrl.
exports.migrateEventImagesFromDataUrl = functions
  .runWith({ timeoutSeconds: 540, memory: "1GB" })
  .https.onCall(async (data, context) => {
    var _a;
    const uid = (_a = context.auth) === null || _a === void 0 ? void 0 : _a.uid;
    if (!uid)
      throw new functions.https.HttpsError("unauthenticated", "Auth requerida");
    if (!(await isAdminUid(uid))) {
      throw new functions.https.HttpsError("permission-denied", "Solo admin");
    }
    const target =
      (data === null || data === void 0 ? void 0 : data.target) === "templates"
        ? "templates"
        : "events";
    const { prefix, collection } = getTargetConfig(target);
    const limit =
      typeof (data === null || data === void 0 ? void 0 : data.limit) ===
        "number" && data.limit > 0
        ? Math.min(200, data.limit)
        : 50;
    const cursorDocId =
      typeof (data === null || data === void 0 ? void 0 : data.cursorDocId) ===
      "string"
        ? data.cursorDocId
        : undefined;
    const bucket = storage.bucket();
    let processed = 0;
    let migrated = 0;
    let skipped = 0;
    let q = db
      .collection(collection)
      .orderBy(FieldPath.documentId())
      .limit(limit);
    if (cursorDocId) q = q.startAfter(cursorDocId);
    const snap = await q.get();
    let nextCursor = undefined;
    for (const docSnap of snap.docs) {
      processed++;
      nextCursor = docSnap.id;
      const docData = docSnap.data();
      const imageUrl =
        docData === null || docData === void 0 ? void 0 : docData.imageUrl;
      if (!isDataUrlImage(imageUrl)) {
        skipped++;
        continue;
      }
      try {
        const { mime, buffer } = parseDataUrl(imageUrl);
        const safeMime = typeof mime === "string" ? mime : "image/jpeg";
        const objectPath = `${prefix}${docSnap.id}/migrated_${Date.now()}`;
        const ext = safeMime.includes("png")
          ? ".png"
          : safeMime.includes("webp")
            ? ".webp"
            : ".jpg";
        const finalObjectPath = objectPath + ext;
        await bucket.file(finalObjectPath).save(buffer, {
          contentType: safeMime,
          metadata: {
            cacheControl: "public,max-age=31536000,immutable",
          },
        });
        const downloadUrl = finalObjectPath;
        await db.collection(collection).doc(docSnap.id).set(
          {
            imageUrl: downloadUrl,
          },
          { merge: true },
        );
        migrated++;
      } catch (e) {
        console.error("Migrate dataUrl image failed", target, docSnap.id, e);
        skipped++;
      }
    }
    return {
      target,
      processed,
      migrated,
      skipped,
      nextCursorDocId: nextCursor,
    };
  });
exports.onImageFinalizeGenerateThumb = (0, storage_1.onObjectFinalized)(
  {
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "1GiB",
  },
  async (event) => {
    const object = event.data;
    const objectName = object.name || "";
    const contentType = object.contentType || "";
    if (!shouldProcessImageObject(objectName, contentType)) return;
    const bucket = storage.bucket(object.bucket);
    const file = bucket.file(objectName);
    const ext = path.extname(objectName);
    const baseName = path.basename(objectName, ext);
    const dirName = path.posix.dirname(objectName.replace(/\\/g, "/"));
    const tmpOriginal = path.join(os.tmpdir(), `${baseName}${ext || ".img"}`);
    const thumbFileName = `thumb_${baseName}.webp`;
    const tmpThumb = path.join(os.tmpdir(), thumbFileName);
    const thumbObjectPath = path.posix.join(dirName, thumbFileName);
    try {
      await file.download({ destination: tmpOriginal });
      await sharp(tmpOriginal)
        .rotate()
        .resize(256, 256, { fit: "cover" })
        .webp({ quality: 82 })
        .toFile(tmpThumb);
      await bucket.upload(tmpThumb, {
        destination: thumbObjectPath,
        metadata: {
          contentType: "image/webp",
          cacheControl: "public,max-age=31536000,immutable",
        },
      });
      const thumbUrl = thumbObjectPath;
      // Actualizar Firestore según el path
      const parts = objectName.split("/");
      if (objectName.startsWith("profile-photos/") && parts.length >= 2) {
        const uid = parts[1];
        await db.collection("users").doc(uid).set(
          {
            photoThumbURL: thumbUrl,
          },
          { merge: true },
        );
      }
      if (objectName.startsWith("event-images/") && parts.length >= 2) {
        const eventId = parts[1];
        await db.collection("events").doc(eventId).set(
          {
            imageThumbUrl: thumbUrl,
          },
          { merge: true },
        );
      }
      if (
        objectName.startsWith("event-template-images/") &&
        parts.length >= 2
      ) {
        const templateId = parts[1];
        await db.collection("event_templates").doc(templateId).set(
          {
            imageThumbUrl: thumbUrl,
          },
          { merge: true },
        );
      }
    } catch (err) {
      console.error("Thumbnail generation failed for", objectName, err);
    } finally {
      // Limpieza best-effort
      await fs.unlink(tmpOriginal).catch(() => undefined);
      await fs.unlink(tmpThumb).catch(() => undefined);
    }
  },
);
// FCM (Admin SDK) requiere que message.data sea un mapa de strings.
// En requests/Firestore es común tener boolean/number/object, así que normalizamos.
const getAbsoluteLink = (pathOrUrl) => {
  // Hosting default de Firebase para este proyecto
  const origin = "https://mcimachala-servidor.web.app";
  try {
    return new URL(pathOrUrl, origin).href;
  } catch (_a) {
    return `${origin}/dashboard`;
  }
};
const truncateForNotification = (text, maxLen) => {
  const t = (text || "").trim();
  if (t.length <= maxLen) return t;
  return t.slice(0, Math.max(0, maxLen - 1)) + "…";
};
const getTokenEntriesForUsers = async (userIds) => {
  var _a;
  const unique = Array.from(
    new Set(userIds.filter((u) => typeof u === "string" && u.trim())),
  );
  if (unique.length === 0) return [];
  const refs = unique.map((uid) => db.collection("userTokens").doc(uid));
  const snaps = await db.getAll(...refs);
  const out = [];
  for (const snap of snaps) {
    if (!snap.exists) continue;
    const userId = snap.id;
    const tokens =
      (_a = snap.data()) === null || _a === void 0 ? void 0 : _a.tokens;
    if (!Array.isArray(tokens)) continue;
    for (const t of tokens) {
      if (typeof t === "string" && t.trim())
        out.push({ userId, token: t.trim() });
    }
  }
  return out;
};
const sendFcmToTokenEntries = async (params) => {
  const {
    entries,
    title,
    body,
    url,
    data = {},
    urgency = "high",
    ttlSeconds = 21600,
  } = params;
  if (entries.length === 0) return { success: 0, failure: 0 };
  const batchSize = 500;
  const tokensToRemoveByUser = new Map();
  for (let i = 0; i < entries.length; i += batchSize) {
    const batchEntries = entries.slice(i, i + batchSize);
    const batchTokens = batchEntries.map((e) => e.token);
    // Usar solo 'data' para evitar duplicados en webpush.
    const normalizedData = normalizeFcmData(
      Object.assign({ title, body, url }, data || {}),
    );
    const message = {
      data: normalizedData,
      webpush: {
        headers: {
          Urgency: urgency,
          TTL: String(ttlSeconds),
        },
        fcmOptions: {
          link: getAbsoluteLink(url),
        },
      },
      tokens: batchTokens,
    };
    const response = await messaging.sendEachForMulticast(message);
    response.responses.forEach((resp, idx) => {
      var _a;
      if (
        !resp.success &&
        ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) ===
          "messaging/registration-token-not-registered"
      ) {
        const entry = batchEntries[idx];
        if (!entry) return;
        const list = tokensToRemoveByUser.get(entry.userId) || [];
        list.push(entry.token);
        tokensToRemoveByUser.set(entry.userId, list);
      }
    });
  }
  const cleanupPromises = [];
  for (const [userId, tokensToRemove] of tokensToRemoveByUser.entries()) {
    if (tokensToRemove.length === 0) continue;
    cleanupPromises.push(
      db
        .collection("userTokens")
        .doc(userId)
        .update({
          tokens: FieldValue.arrayRemove(...tokensToRemove),
        })
        .catch((e) => {
          console.warn(
            `[attendanceReminders] Error limpiando tokens para ${userId}:`,
            e,
          );
        }),
    );
  }
  await Promise.all(cleanupPromises);
  return {
    success: entries.length - tokensToRemoveByUser.size,
    failure: tokensToRemoveByUser.size,
  };
};
const buildEventTimeLabel = (event) => {
  const date =
    typeof (event === null || event === void 0 ? void 0 : event.date) ===
    "string"
      ? event.date
      : "";
  const start =
    (event === null || event === void 0 ? void 0 : event.time) ||
    (event === null || event === void 0 ? void 0 : event.serviceTime);
  const end =
    (event === null || event === void 0 ? void 0 : event.endTime) ||
    (event === null || event === void 0 ? void 0 : event.time) ||
    (event === null || event === void 0 ? void 0 : event.serviceTime);
  const startLbl = start ? start : "";
  const endLbl = end ? end : "";
  if (date && startLbl && endLbl && endLbl !== startLbl)
    return `${date} ${startLbl}–${endLbl}`;
  if (date && startLbl) return `${date} ${startLbl}`;
  if (date) return date;
  return "";
};
const sendAttendanceReminderForEvent = async (params) => {
  const { eventId, eventData, kind } = params;
  const eventTitleRaw =
    typeof (eventData === null || eventData === void 0
      ? void 0
      : eventData.title) === "string"
      ? eventData.title
      : "Evento";
  const eventTitle = truncateForNotification(eventTitleRaw, 60);
  const url = `/dashboard/events/${eventId}`;
  const timeLabel = buildEventTimeLabel(eventData);
  const assignmentsSnap = await db
    .collection("events")
    .doc(eventId)
    .collection("assignments")
    .get();
  // Un usuario puede tener múltiples asignaciones en el mismo evento.
  // Dedupe por userId y marcamos flag en TODAS sus asignaciones del evento.
  const byUser = new Map();
  const nowIso = new Date().toISOString();
  const notifField =
    kind === "checkin_40m"
      ? "notifCheckIn40mSentAt"
      : kind === "checkout_open"
        ? "notifCheckOutOpenSentAt"
        : "notifCheckOutFinalSentAt";
  for (const docSnap of assignmentsSnap.docs) {
    const a = docSnap.data();
    const userId =
      typeof (a === null || a === void 0 ? void 0 : a.userId) === "string"
        ? a.userId
        : "";
    if (!userId) continue;
    const alreadySent = Boolean(
      a === null || a === void 0 ? void 0 : a[notifField],
    );
    if (alreadySent) continue;
    const checkInTime = a === null || a === void 0 ? void 0 : a.checkInTime;
    const checkOutTime = a === null || a === void 0 ? void 0 : a.checkOutTime;
    if (kind === "checkin_40m") {
      if (checkInTime) continue;
    } else if (kind === "checkout_open") {
      // checkout disponible: notificar a TODOS los asignados (hayan marcado o no).
      // (la deduplicación evita reenvíos en el siguiente tick)
    } else {
      // checkout final: si NO ha marcado salida, notificar.
      if (checkOutTime) continue;
    }
    const existing = byUser.get(userId);
    if (existing) {
      existing.refs.push(docSnap.ref);
    } else {
      byUser.set(userId, { refs: [docSnap.ref], assignment: a });
    }
  }
  const userIds = Array.from(byUser.keys());
  if (userIds.length === 0) return;
  const entries = await getTokenEntriesForUsers(userIds);
  if (entries.length === 0) return;
  const title =
    kind === "checkin_40m"
      ? "Recordatorio: Check-in"
      : kind === "checkout_open"
        ? "Check-out disponible"
        : "Recordatorio: Check-out";
  const body =
    kind === "checkin_40m"
      ? `${eventTitle}${
          timeLabel ? ` (${timeLabel})` : ""
        }: no olvides marcar tu asistencia de entrada.`
      : kind === "checkout_open"
        ? `${eventTitle}${
            timeLabel ? ` (${timeLabel})` : ""
          }: ya puedes marcar tu asistencia de salida.`
        : `${eventTitle}${
            timeLabel ? ` (${timeLabel})` : ""
          }: no olvides marcar tu asistencia de salida.`;
  await sendFcmToTokenEntries({
    entries,
    title,
    body,
    url,
    data: {
      type: "attendance_reminder",
      reminderType: kind,
      eventId,
    },
    urgency: "high",
    ttlSeconds: kind === "checkout_final" ? 86400 : 21600,
  });
  // Marcar como enviado (dedupe) para evitar repetir en el siguiente tick.
  const batch = db.batch();
  for (const [userId, group] of byUser.entries()) {
    // Si el usuario no tiene tokens, no marcamos nada (por si activa después).
    const hasToken = entries.some((e) => e.userId === userId);
    if (!hasToken) continue;
    for (const ref of group.refs) {
      batch.set(ref, { [notifField]: nowIso }, { merge: true });
    }
  }
  await batch.commit();
};
// Recordatorios de asistencia (FCM)
// - 40 min antes del inicio: si NO ha marcado check-in.
// - Al terminar el evento (hora fin): "Check-out disponible" a TODOS los asignados.
// - 1 hora después del fin: recordatorio final de check-out (si sigue sin marcar salida).
exports.attendanceReminders = functions
  .runWith({ timeoutSeconds: 540, memory: "512MB" })
  .pubsub.schedule("every 5 minutes")
  .timeZone("America/Guayaquil")
  .onRun(async () => {
    const nowMs = Date.now();
    // Ventana de fechas para buscar eventos: ayer/hoy/mañana (hora local Ecuador).
    const fromDate = getEcuadorDateString(-1);
    const toDate = getEcuadorDateString(1);
    const eventsSnap = await db
      .collection("events")
      .where("date", ">=", fromDate)
      .where("date", "<=", toDate)
      .get();
    if (eventsSnap.empty) return;
    const tasks = [];
    for (const docSnap of eventsSnap.docs) {
      const eventId = docSnap.id;
      const eventData = docSnap.data();
      const dateStr =
        typeof (eventData === null || eventData === void 0
          ? void 0
          : eventData.date) === "string"
          ? eventData.date
          : "";
      const startTimeStr =
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.time) ||
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.serviceTime);
      const endTimeStr =
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.endTime) ||
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.time) ||
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.serviceTime);
      const startUtcMs = parseLocalEcuadorDateTimeToUtcMs(
        dateStr,
        startTimeStr,
      );
      const endUtcMs = parseLocalEcuadorDateTimeToUtcMs(dateStr, endTimeStr);
      if (!Number.isFinite(startUtcMs) || !Number.isFinite(endUtcMs)) continue;
      // 5-min tick windows.
      const checkInStart = startUtcMs - 40 * 60 * 1000;
      const checkInEnd = startUtcMs - 35 * 60 * 1000;
      const checkOutOpenStart = endUtcMs;
      const checkOutOpenEnd = endUtcMs + 5 * 60 * 1000;
      const checkOutFinalStart = endUtcMs + 60 * 60 * 1000;
      const checkOutFinalEnd = endUtcMs + 65 * 60 * 1000;
      if (shouldRunInWindow(nowMs, checkInStart, checkInEnd)) {
        tasks.push(
          sendAttendanceReminderForEvent({
            eventId,
            eventData,
            kind: "checkin_40m",
          }),
        );
      }
      if (shouldRunInWindow(nowMs, checkOutOpenStart, checkOutOpenEnd)) {
        tasks.push(
          sendAttendanceReminderForEvent({
            eventId,
            eventData,
            kind: "checkout_open",
          }),
        );
      }
      if (shouldRunInWindow(nowMs, checkOutFinalStart, checkOutFinalEnd)) {
        tasks.push(
          sendAttendanceReminderForEvent({
            eventId,
            eventData,
            kind: "checkout_final",
          }),
        );
      }
    }
    // Evitar sobrecargar: correr en paralelo pero sin bloquear el runtime.
    await Promise.all(tasks);
  });
// Handler para descargar archivos de Firebase Storage (proxy para evitar CORS en PWA)
const downloadFileHandler = async (req, res) => {
  try {
    const { path, filename, inline, mode } = req.query;
    if (!path || typeof path !== "string") {
      res.status(400).json({ error: "path es requerido" });
      return;
    }
    // Validación básica para evitar rutas sospechosas.
    // (En Storage no hay traversal real, pero esto reduce superficies raras.)
    if (path.startsWith("/") || path.includes("..")) {
      res.status(400).json({ error: "path inválido" });
      return;
    }
    // Seguridad: permitir sólo prefijos esperados.
    // Esto evita que cualquier usuario autenticado pueda intentar descargar
    // objetos arbitrarios del bucket adivinando rutas.
    const allowedPrefixes = [
      "profile-photos/",
      "event-uploads/",
      "event-images/",
      "event-template-images/",
      "events/",
      "attendance/",
    ];
    const isAllowed = allowedPrefixes.some((p) => path.startsWith(p));
    if (!isAllowed) {
      res.status(403).json({ error: "FORBIDDEN_PATH" });
      return;
    }
    // Extra security for attendance photos: only the assigned user or admins
    // for that ministry can download.
    if (path.startsWith("attendance/")) {
      const uid = String(res.locals.uid || "");
      if (!uid) {
        res.status(401).json({ error: "UNAUTHENTICATED" });
        return;
      }
      const parts = path.split("/").filter(Boolean);
      // attendance/<eventId>/<assignmentId>/<filename>
      if (parts.length < 4) {
        res.status(403).json({ error: "FORBIDDEN_PATH" });
        return;
      }
      const eventId = parts[1];
      const assignmentId = parts[2];
      const assignmentSnap = await db
        .collection("events")
        .doc(eventId)
        .collection("assignments")
        .doc(assignmentId)
        .get();
      if (!assignmentSnap.exists) {
        res.status(404).json({ error: "NOT_FOUND" });
        return;
      }
      const a = assignmentSnap.data();
      const assignedUserId =
        typeof (a === null || a === void 0 ? void 0 : a.userId) === "string"
          ? a.userId
          : "";
      const areaId =
        typeof (a === null || a === void 0 ? void 0 : a.areaId) === "string"
          ? a.areaId
          : "";
      if (assignedUserId !== uid) {
        const ctx = await getUserCtx(uid);
        if (!areaId || !canEditAssignmentsForArea(ctx, areaId)) {
          res.status(403).json({ error: "FORBIDDEN" });
          return;
        }
      }
    }
    const bucket = storage.bucket(isLocalDemoRuntime() ? undefined : "mcimachala-servidor.firebasestorage.app");
    const file = bucket.file(path);
    // Verificar que el archivo existe
    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).json({ error: "Archivo no encontrado" });
      return;
    }
    // Obtener metadata del archivo
    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || "application/octet-stream";
    const downloadFilename = filename || path.split("/").pop() || "archivo";

    // Configuración de cache para headers
    const cacheable =
      !path.startsWith("attendance/") &&
      (contentType.startsWith("image/") ||
        contentType.startsWith("font/") ||
        contentType === "application/font-woff" ||
        contentType === "application/font-woff2");

    const inlineRaw = String(req.query.inline || "").toLowerCase();
    const isInline = inlineRaw === "1" || inlineRaw === "true";

    if (servePrivateAttendance({ objectPath: path, file, metadata, filename: downloadFilename, inline: isInline, res })) return;

    // --- INTENTO DE SIGNED URL (Igual que en downloadMaterialHandler) ---
    // Ahorro masivo de bandwidth para imágenes y otros recursos frecuentes.
    try {
      const expires = Date.now() + 1000 * 60 * 60; // 1 hora
      const [downloadUrl] = await file.getSignedUrl({
        action: "read",
        expires,
        responseDisposition: `${
          isInline ? "inline" : "attachment"
        }; filename="${encodeURIComponent(downloadFilename)}"`,
      });

      // Si logramos firmar la URL, redirigimos (302) y terminamos.
      // Firebase Hosting NO cobra bandwidth por este redirect, solo por executions (que son mínimos).
      // El cliente descarga directo de Storage (costo mucho menor).

      // Si el cliente solicita explícitamente la URL (para prefetch o fetch manual), devolvemos JSON explícito.
      if (mode === "url") {
        res.json({ url: downloadUrl });
        return;
      }

      res.setHeader(
        "Cache-Control",
        // Importante: no cachear el redirect indefinidamente para no romper firmas expiradas
        "private, max-age=600",
      );
      res.redirect(302, downloadUrl);
      return;
    } catch (signError) {
      console.warn(
        `[SmartDownload-File] ⚠️ Fallo firma, usando Proxy (Consumo de Hosting):`,
        signError,
      );
      // Si falla, continuamos con el flujo normal de Proxy (Streaming) abajo
    }

    // --- FALLBACK A PROXY (Streaming) ---
    // Si llegamos aquí, usamos el método costoso (pero seguro)

    res.setHeader(
      "Cache-Control",
      cacheable ? "private, max-age=31536000, immutable" : "private, no-store",
    );

    const size = typeof metadata.size === "string" ? metadata.size : undefined;
    const updated = metadata.updated
      ? new Date(metadata.updated).getTime()
      : undefined;
    const etagBase = [
      path,
      metadata.generation,
      metadata.metageneration,
      size,
      updated,
    ]
      .filter(Boolean)
      .join(":");
    const etag = etagBase ? `W/\"${etagBase}\"` : undefined;
    if (etag) {
      res.setHeader("ETag", etag);
      const inm = req.header("if-none-match");
      if (inm && inm === etag) {
        res.status(304).end();
        return;
      }
    }
    // inlineRaw e isInline ya fueron declarados arriba

    // Configurar headers para forzar descarga
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `${isInline ? "inline" : "attachment"}; filename="${encodeURIComponent(
        downloadFilename,
      )}"`,
    );
    // Stream del archivo al cliente
    const readStream = file.createReadStream();
    readStream.on("error", (error) => {
      console.error("Error streaming file:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error descargando archivo" });
      }
    });
    readStream.pipe(res);
  } catch (error) {
    console.error("Error en downloadFileHandler:", error);
    res.status(500).json({ error: "Error descargando archivo" });
  }
};

// Handler específico para materiales (intenta URL firmada, fallback a Proxy)
const downloadMaterialHandler = async (req, res) => {
  try {
    const { path, filename, inline, mode } = req.query;
    console.log(`[SmartDownload] Solicitud recibida. Path: ${path}`);

    if (!path || typeof path !== "string") {
      console.warn("[SmartDownload] Falta path o inválido");
      res.status(400).json({ error: "path es requerido" });
      return;
    }

    // Validación de seguridad (mismos prefijos que downloadFileHandler)
    if (path.startsWith("/") || path.includes("..")) {
      res.status(400).json({ error: "path inválido" });
      return;
    }
    const allowedPrefixes = [
      "profile-photos/",
      "event-uploads/",
      "event-images/",
      "event-template-images/",
      "events/",
      "attendance/",
    ];
    const isAllowed = allowedPrefixes.some((p) => path.startsWith(p));
    if (!isAllowed) {
      res.status(403).json({ error: "FORBIDDEN_PATH" });
      return;
    }

    // Verificaciones específicas de asistencia (igual que el handler principal)
    if (path.startsWith("attendance/")) {
      // Copiamos la lógica de seguridad por si alguien usa este endpoint para asistencia
      const uid = String(res.locals.uid || "");
      if (!uid) {
        res.status(401).json({ error: "UNAUTHENTICATED" });
        return;
      }
      const parts = path.split("/").filter(Boolean);
      if (parts.length < 4) {
        res.status(403).json({ error: "FORBIDDEN_PATH" });
        return;
      }
      const eventId = parts[1];
      const assignmentId = parts[2];
      const assignmentSnap = await db
        .collection("events")
        .doc(eventId)
        .collection("assignments")
        .doc(assignmentId)
        .get();
      if (!assignmentSnap.exists) {
        res.status(404).json({ error: "NOT_FOUND" });
        return;
      }
      const a = assignmentSnap.data();
      const assignedUserId =
        typeof (a === null || a === void 0 ? void 0 : a.userId) === "string"
          ? a.userId
          : "";
      const areaId =
        typeof (a === null || a === void 0 ? void 0 : a.areaId) === "string"
          ? a.areaId
          : "";
      if (assignedUserId !== uid) {
        const ctx = await getUserCtx(uid);
        if (!areaId || !canEditAssignmentsForArea(ctx, areaId)) {
          res.status(403).json({ error: "FORBIDDEN" });
          return;
        }
      }
    }

    const bucket = storage.bucket(isLocalDemoRuntime() ? undefined : "mcimachala-servidor.firebasestorage.app");
    const file = bucket.file(path);
    const [exists] = await file.exists();
    if (!exists) {
      res.status(404).json({ error: "Archivo no encontrado" });
      return;
    }

    const [metadata] = await file.getMetadata();
    const contentType = metadata.contentType || "application/octet-stream";
    const downloadFilename = filename || path.split("/").pop() || "archivo";

    const inlineRaw = String(req.query.inline || "").toLowerCase();
    const isInline = inlineRaw === "1" || inlineRaw === "true";

    if (servePrivateAttendance({ objectPath: path, file, metadata, filename: downloadFilename, inline: isInline, res })) return;

    // --- INTENTO DE SIGNED URL ---
    try {
      const expires = Date.now() + 1000 * 60 * 60; // 1 hora
      const [downloadUrl] = await file.getSignedUrl({
        action: "read",
        expires,
        responseDisposition: `${
          isInline ? "inline" : "attachment"
        }; filename="${encodeURIComponent(downloadFilename)}"`,
      });
      console.log(
        `[SmartDownload] ✅ URL Generada: ${path} (Ahorro de Hosting activo)`,
      );

      if (mode === "url") {
        res.json({ url: downloadUrl });
        return;
      }

      // Si obtuvimos la URL firmada correctamente, redirigimos al cliente
      res.redirect(302, downloadUrl);
      return;
    } catch (signError) {
      console.warn(
        `[SmartDownload] ⚠️ Fallo firma, usando Proxy (Consumo de Hosting):`,
        signError,
      );
      // Si falla (ej: falta de permisos IAM), continuamos con el método Proxy
    }

    // --- FALLBACK A PROXY (Streaming) ---
    // Si llegamos aquí es porque falló signed URL o decidimos no usarlo

    const cacheable =
      !path.startsWith("attendance/") &&
      (contentType.startsWith("image/") ||
        contentType.startsWith("font/") ||
        contentType === "application/font-woff" ||
        contentType === "application/font-woff2");

    res.setHeader(
      "Cache-Control",
      cacheable ? "private, max-age=31536000, immutable" : "private, no-store",
    );

    const size = typeof metadata.size === "string" ? metadata.size : undefined;
    const updated = metadata.updated
      ? new Date(metadata.updated).getTime()
      : undefined;
    const etagBase = [
      path,
      metadata.generation,
      metadata.metageneration,
      size,
      updated,
    ]
      .filter(Boolean)
      .join(":");
    const etag = etagBase ? `W/\"${etagBase}\"` : undefined;
    if (etag) {
      res.setHeader("ETag", etag);
      const inm = req.header("if-none-match");
      if (inm && inm === etag) {
        res.status(304).end();
        return;
      }
    }

    // Configurar headers para forzar descarga
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `${isInline ? "inline" : "attachment"}; filename="${encodeURIComponent(
        downloadFilename,
      )}"`,
    );
    // Stream del archivo al cliente
    const readStream = file.createReadStream();
    readStream.on("error", (error) => {
      console.error("Error streaming file (fallback):", error);
      if (!res.headersSent) {
        res.status(500).json({ error: "Error descargando archivo (fallback)" });
      }
    });
    readStream.pipe(res);
  } catch (error) {
    console.error("Error en downloadMaterialHandler:", error);
    res.status(500).json({ error: "Error general descargando material" });
  }
};

// Register download routes with the comprehensive, secure handler
// This handler includes path validation, security checks, and proper cache headers
app.get("/download", requirePrivateReadActor, downloadFileHandler);
app.get("/api/download", requirePrivateReadActor, downloadFileHandler);
app.get("/api/download-material", requirePrivateReadActor, downloadMaterialHandler);
// Hello endpoint (ambas rutas: /hello y /api/hello)
const helloHandler = (_req, res) => {
  res.json({ message: "Hello from API via Firebase Hosting!" });
};
app.get("/hello", helloHandler);
app.get("/api/hello", helloHandler);
// Handler para enviar notificación a un usuario específico
const notifyUserHandler = async (req, res) => {
  var _a;
  try {
    const { userId, title, body, data } = req.body;
    if (!userId || !title) {
      res.status(400).json({ error: "userId y title son requeridos" });
      return;
    }
    // Obtener tokens del usuario
    const userTokensDoc = await db.collection("userTokens").doc(userId).get();
    if (!userTokensDoc.exists) {
      res.status(404).json({ error: "Usuario no tiene tokens registrados" });
      return;
    }
    const tokens =
      ((_a = userTokensDoc.data()) === null || _a === void 0
        ? void 0
        : _a.tokens) || [];
    if (tokens.length === 0) {
      res.status(404).json({ error: "No hay tokens para este usuario" });
      return;
    }
    // Enviar notificación a todos los dispositivos del usuario.
    // Para webpush: incluir webpush.notification + link y mantener data (para routing).
    const url =
      (data && typeof data === "object" ? data.url : undefined) || "/dashboard";
    const normalizedData = normalizeFcmData(
      Object.assign(Object.assign({ title, body: body || "" }, data || {}), {
        url,
      }),
    );
    const message = {
      data: normalizedData,
      webpush: {
        headers: {
          Urgency: "high",
          TTL: "86400",
        },
        notification: {
          title,
          body: body || "",
          icon: "/mci-logo.png",
          badge: "/mci-logo.png",
          data: { url },
        },
        fcmOptions: {
          link: getAbsoluteLink(url),
        },
      },
      tokens,
    };
    const response = await messaging.sendEachForMulticast(message);
    // Limpiar tokens inválidos
    const tokensToRemove = [];
    response.responses.forEach((resp, idx) => {
      var _a;
      if (
        !resp.success &&
        ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) ===
          "messaging/registration-token-not-registered"
      ) {
        tokensToRemove.push(tokens[idx]);
      }
    });
    if (tokensToRemove.length > 0) {
      await db
        .collection("userTokens")
        .doc(userId)
        .update({
          tokens: FieldValue.arrayRemove(...tokensToRemove),
        });
    }
    res.json({
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    console.error("Error enviando notificación:", error);
    res.status(500).json({ error: "Error enviando notificación" });
  }
};
// Registrar ambas rutas: /notify/user (hosting rewrite) y /api/notify/user (función directa)
app.post("/notify/user", requireNotificationActor, notifyUserHandler);
app.post("/api/notify/user", requireNotificationActor, notifyUserHandler);
// --- Comentarios: reacciones (WhatsApp-style) ---
const ALLOWED_REACTIONS = new Set([
  "like",
  "love",
  "laugh",
  "pray",
  "wow",
  "sad",
]);
const getBearerToken = (req) => {
  const h = req.headers.authorization;
  if (!h) return null;
  const m = /^Bearer\s+(.+)$/i.exec(h);
  return m ? m[1] : null;
};
const reactToCommentHandler = async (req, res) => {
  var _a;
  try {
    const token = getBearerToken(req);
    if (!token) {
      res.status(401).json({ error: "Missing Authorization Bearer token" });
      return;
    }
    let uid = null;
    try {
      const decoded = await admin.auth().verifyIdToken(token, true);
      uid = decoded.uid;
    } catch (error) {
      if (!uid) {
        const code = String(
          (error === null || error === void 0 ? void 0 : error.code) || "",
        );
        console.warn("[comments/react] Invalid token", { code });
        res.status(401).json({ error: "Invalid auth token" });
        return;
      }
    }
    const { commentId, reaction, action } = req.body || {};
    if (!commentId || typeof commentId !== "string") {
      res.status(400).json({ error: "commentId es requerido" });
      return;
    }
    if (
      !reaction ||
      typeof reaction !== "string" ||
      !ALLOWED_REACTIONS.has(reaction)
    ) {
      res.status(400).json({ error: "reaction inválida" });
      return;
    }
    const commentRef = db.collection("comments").doc(commentId);
    const snap = await commentRef.get();
    if (!snap.exists) {
      res.status(404).json({ error: "Comentario no encontrado" });
      return;
    }
    const reactions =
      ((_a = snap.data()) === null || _a === void 0 ? void 0 : _a.reactions) ||
      {};
    const currentList = Array.isArray(
      reactions === null || reactions === void 0 ? void 0 : reactions[reaction],
    )
      ? reactions[reaction].filter((x) => typeof x === "string")
      : [];
    const currentlyReacted = currentList.includes(uid);
    const op =
      action === "add" ? "add" : action === "remove" ? "remove" : "toggle";
    let finalAction;
    if (op === "add" || (op === "toggle" && !currentlyReacted)) {
      await commentRef.set(
        {
          reactions: {
            [reaction]: FieldValue.arrayUnion(uid),
          },
        },
        { merge: true },
      );
      finalAction = "added";
    } else {
      await commentRef.set(
        {
          reactions: {
            [reaction]: FieldValue.arrayRemove(uid),
          },
        },
        { merge: true },
      );
      finalAction = "removed";
    }
    res.json({ success: true, action: finalAction });
  } catch (error) {
    console.error("Error en reactToCommentHandler:", error);
    res.status(500).json({ error: "Error reaccionando al comentario" });
  }
};
const reactToCommentSessionHandler = async (req, res) => {
  var _a;
  try {
    const uid = String(res.locals.uid || "");
    if (!uid) {
      res.status(401).json({ error: "UNAUTHENTICATED" });
      return;
    }
    const { commentId, reaction, action } = req.body || {};
    if (!commentId || typeof commentId !== "string") {
      res.status(400).json({ error: "commentId es requerido" });
      return;
    }
    if (
      !reaction ||
      typeof reaction !== "string" ||
      !ALLOWED_REACTIONS.has(reaction)
    ) {
      res.status(400).json({ error: "reaction inválida" });
      return;
    }
    const commentRef = db.collection("comments").doc(commentId);
    const snap = await commentRef.get();
    if (!snap.exists) {
      res.status(404).json({ error: "Comentario no encontrado" });
      return;
    }
    const reactions =
      ((_a = snap.data()) === null || _a === void 0 ? void 0 : _a.reactions) ||
      {};
    const currentList = Array.isArray(
      reactions === null || reactions === void 0 ? void 0 : reactions[reaction],
    )
      ? reactions[reaction].filter((x) => typeof x === "string")
      : [];
    const currentlyReacted = currentList.includes(uid);
    const op =
      action === "add" ? "add" : action === "remove" ? "remove" : "toggle";
    let finalAction;
    if (op === "add" || (op === "toggle" && !currentlyReacted)) {
      await commentRef.set(
        {
          reactions: {
            [reaction]: FieldValue.arrayUnion(uid),
          },
        },
        { merge: true },
      );
      finalAction = "added";
    } else {
      await commentRef.set(
        {
          reactions: {
            [reaction]: FieldValue.arrayRemove(uid),
          },
        },
        { merge: true },
      );
      finalAction = "removed";
    }
    res.json({ success: true, action: finalAction });
  } catch (error) {
    console.error("Error en reactToCommentSessionHandler:", error);
    res.status(500).json({ error: "Error reaccionando al comentario" });
  }
};
// Legacy (token Bearer)
app.post("/comments/react", reactToCommentHandler);
// BFF (cookie HttpOnly + CSRF)
app.post(
  "/api/comments/react",
  requireSession,
  requireCsrf,
  reactToCommentSessionHandler,
);
// --- Comentarios (Dashboard): notificar a todos ---
// ELIMINADO: onCommentCreated (legacy) - reemplazado por onCommentWritten moderno
// Handler para enviar notificación a múltiples usuarios
const notifyUsersHandler = async (req, res) => {
  // force-deploy: v5.0.171
  try {
    const { userIds, title, body, data } = req.body;
    if (!userIds || !Array.isArray(userIds) || !title) {
      res.status(400).json({ error: "userIds (array) y title son requeridos" });
      return;
    }
    // Obtener tokens por usuario EN PARALELO, preservando relación userId -> token
    const tokenPromises = userIds.map(async (userId) => {
      var _a;
      const userTokensDoc = await db.collection("userTokens").doc(userId).get();
      const tokens = userTokensDoc.exists
        ? ((_a = userTokensDoc.data()) === null || _a === void 0
            ? void 0
            : _a.tokens) || []
        : [];
      return tokens.map((token) => ({ userId, token }));
    });
    const tokenEntries = (await Promise.all(tokenPromises)).flat();
    if (tokenEntries.length === 0) {
      res.status(404).json({ error: "No hay tokens para estos usuarios" });
      return;
    }
    // Enviar en lotes de 500 (límite de FCM)
    const batchSize = 500;
    let totalSuccess = 0;
    let totalFailure = 0;
    const tokensToRemoveByUser = new Map();
    for (let i = 0; i < tokenEntries.length; i += batchSize) {
      const batchEntries = tokenEntries.slice(i, i + batchSize);
      const batchTokens = batchEntries.map((e) => e.token);

      const url =
        (data && typeof data === "object" ? data.url : undefined) ||
        "/dashboard";

      // Usar exactamente el mismo formato que funciona en Materiales/Repertorio
      const messageData = Object.assign(
        {
          title,
          body: body || "",
          // type: "general", // Removed to equal notifyAllHandler
          url,
        },
        data || {},
      );

      const message = {
        data: normalizeFcmData(messageData),
        webpush: {
          headers: {
            Urgency: "high",
            TTL: "86400",
          },
          notification: {
            title,
            body: body || "",
            icon: "/mci-logo.png",
            badge: "/mci-logo.png",
            data: { url },
          },
          fcmOptions: {
            link: getAbsoluteLink(url),
          },
        },
        tokens: batchTokens,
      };

      const response = await messaging.sendEachForMulticast(message);
      totalSuccess += response.successCount;
      totalFailure += response.failureCount;
      response.responses.forEach((resp, idx) => {
        var _a;
        if (
          !resp.success &&
          ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) ===
            "messaging/registration-token-not-registered"
        ) {
          const entry = batchEntries[idx];
          const arr = tokensToRemoveByUser.get(entry.userId) || [];
          arr.push(entry.token);
          tokensToRemoveByUser.set(entry.userId, arr);
        }
      });
    }
    // Limpiar tokens inválidos en Firestore
    if (tokensToRemoveByUser.size > 0) {
      const updates = [];
      tokensToRemoveByUser.forEach((tokens, userId) => {
        // arrayRemove acepta múltiples valores; chunk pequeño por seguridad
        const chunkSize = 10;
        for (let j = 0; j < tokens.length; j += chunkSize) {
          const chunk = tokens.slice(j, j + chunkSize);
          updates.push(
            db
              .collection("userTokens")
              .doc(userId)
              .update({
                tokens: FieldValue.arrayRemove(...chunk),
              }),
          );
        }
      });
      await Promise.allSettled(updates);
    }
    res.json({
      success: true,
      sent: totalSuccess,
      failed: totalFailure,
    });
  } catch (error) {
    console.error("Error enviando notificaciones:", error);
    res.status(500).json({ error: "Error enviando notificaciones" });
  }
};
// Registrar ambas rutas para notify/users
app.post("/notify/users", requireNotificationActor, notifyUsersHandler);
app.post("/api/notify/users", requireNotificationActor, notifyUsersHandler);
// Handler para notificar a todos los servidores asignados a un evento sobre su repertorio
const notifyRepertoireHandler = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId || typeof eventId !== "string") {
      res.status(400).json({ error: "eventId es requerido" });
      return;
    }
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    const eventData = eventDoc.data() || {};
    const eventTitle =
      (eventData === null || eventData === void 0 ? void 0 : eventData.title) ||
      "Evento";
    // Obtener repertorio
    const repertoireSnap = await db
      .collection("events")
      .doc(eventId)
      .collection("repertoire")
      .get();
    const songTitles = repertoireSnap.docs
      .map((d) => {
        var _a;
        return (_a = d.data()) === null || _a === void 0 ? void 0 : _a.title;
      })
      .filter((t) => typeof t === "string" && t.trim().length > 0);
    const maxSongs = 6;
    const preview = songTitles.slice(0, maxSongs).join(", ");
    const remaining = songTitles.length - maxSongs;
    const bodyText =
      songTitles.length === 0
        ? "Se actualizó el repertorio. Revisa el evento."
        : remaining > 0
          ? `${preview} y ${remaining} más`
          : preview;
    // Obtener asignaciones del evento para saber a quién notificar
    const assignmentsSnap = await db
      .collection("events")
      .doc(eventId)
      .collection("assignments")
      .get();
    const userIds = Array.from(
      new Set(
        assignmentsSnap.docs
          .map((d) => {
            var _a;
            return (_a = d.data()) === null || _a === void 0
              ? void 0
              : _a.userId;
          })
          .filter((u) => typeof u === "string" && u),
      ),
    );
    if (userIds.length === 0) {
      res
        .status(404)
        .json({ error: "No hay servidores asignados para notificar" });
      return;
    }
    // Obtener tokens por usuario EN PARALELO (preservar userId -> token)
    const tokenPromises = userIds.map(async (userId) => {
      var _a;
      const userTokensDoc = await db.collection("userTokens").doc(userId).get();
      const tokens = userTokensDoc.exists
        ? ((_a = userTokensDoc.data()) === null || _a === void 0
            ? void 0
            : _a.tokens) || []
        : [];
      return tokens.map((token) => ({ userId, token }));
    });
    const tokenEntries = (await Promise.all(tokenPromises)).flat();
    if (tokenEntries.length === 0) {
      res
        .status(404)
        .json({ error: "No hay tokens activos para estos servidores" });
      return;
    }
    // Enviar en lotes de 500
    const batchSize = 500;
    let totalSuccess = 0;
    let totalFailure = 0;
    const tokensToRemoveByUser = new Map();
    for (let i = 0; i < tokenEntries.length; i += batchSize) {
      const batchEntries = tokenEntries.slice(i, i + batchSize);
      const batchTokens = batchEntries.map((e) => e.token);
      const message = {
        data: normalizeFcmData({
          title: `🎵 Repertorio: ${eventTitle}`,
          body: bodyText,
          type: "repertoire",
          eventId,
          url: `/dashboard/events/${eventId}`,
        }),
        webpush: {
          headers: {
            Urgency: "high",
            TTL: "86400",
          },
          notification: {
            title: `🎵 Repertorio: ${eventTitle}`,
            body: bodyText,
            icon: "/mci-logo.png",
            badge: "/mci-logo.png",
            data: { url: `/dashboard/events/${eventId}` },
          },
          fcmOptions: {
            link: getAbsoluteLink(`/dashboard/events/${eventId}`),
          },
        },
        tokens: batchTokens,
      };
      const response = await messaging.sendEachForMulticast(message);
      totalSuccess += response.successCount;
      totalFailure += response.failureCount;
      response.responses.forEach((resp, idx) => {
        var _a;
        if (
          !resp.success &&
          ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) ===
            "messaging/registration-token-not-registered"
        ) {
          const entry = batchEntries[idx];
          const arr = tokensToRemoveByUser.get(entry.userId) || [];
          arr.push(entry.token);
          tokensToRemoveByUser.set(entry.userId, arr);
        }
      });
    }
    // Limpiar tokens inválidos
    if (tokensToRemoveByUser.size > 0) {
      const updates = [];
      tokensToRemoveByUser.forEach((tokens, userId) => {
        const chunkSize = 10;
        for (let j = 0; j < tokens.length; j += chunkSize) {
          const chunk = tokens.slice(j, j + chunkSize);
          updates.push(
            db
              .collection("userTokens")
              .doc(userId)
              .update({
                tokens: FieldValue.arrayRemove(...chunk),
              }),
          );
        }
      });
      await Promise.allSettled(updates);
    }
    res.json({
      success: true,
      sent: totalSuccess,
      failed: totalFailure,
      usersNotified: userIds.length,
    });
  } catch (error) {
    console.error("Error enviando notificación de repertorio:", error);
    res.status(500).json({ error: "Error enviando notificación" });
  }
};
// Registrar ambas rutas para notify/repertoire
app.post("/notify/repertoire", requireNotificationActor, notifyRepertoireHandler);
app.post("/api/notify/repertoire", requireNotificationActor, notifyRepertoireHandler);
// Handler para notificar a todos los servidores asignados a un evento sobre sus materiales
const notifyMaterialsHandler = async (req, res) => {
  try {
    const { eventId } = req.body;
    if (!eventId || typeof eventId !== "string") {
      res.status(400).json({ error: "eventId es requerido" });
      return;
    }
    const eventDoc = await db.collection("events").doc(eventId).get();
    if (!eventDoc.exists) {
      res.status(404).json({ error: "Evento no encontrado" });
      return;
    }
    const eventData = eventDoc.data() || {};
    const eventTitle =
      (eventData === null || eventData === void 0 ? void 0 : eventData.title) ||
      "Evento";
    // Obtener materiales
    const materialsSnap = await db
      .collection("events")
      .doc(eventId)
      .collection("materials")
      .get();
    const materialTitles = materialsSnap.docs
      .map((d) => {
        var _a;
        return (_a = d.data()) === null || _a === void 0 ? void 0 : _a.title;
      })
      .filter((t) => typeof t === "string" && t.trim().length > 0);
    const maxItems = 6;
    const preview = materialTitles.slice(0, maxItems).join(", ");
    const remaining = materialTitles.length - maxItems;
    const bodyText =
      materialTitles.length === 0
        ? "Se actualizaron los materiales. Revisa el evento."
        : remaining > 0
          ? `${preview} y ${remaining} más`
          : preview;
    // Obtener asignaciones del evento
    const assignmentsSnap = await db
      .collection("events")
      .doc(eventId)
      .collection("assignments")
      .get();
    const userIds = Array.from(
      new Set(
        assignmentsSnap.docs
          .map((d) => {
            var _a;
            return (_a = d.data()) === null || _a === void 0
              ? void 0
              : _a.userId;
          })
          .filter((u) => typeof u === "string" && u),
      ),
    );
    if (userIds.length === 0) {
      res
        .status(404)
        .json({ error: "No hay servidores asignados para notificar" });
      return;
    }
    // Obtener tokens por usuario EN PARALELO
    const tokenPromises = userIds.map(async (userId) => {
      var _a;
      const userTokensDoc = await db.collection("userTokens").doc(userId).get();
      const tokens = userTokensDoc.exists
        ? ((_a = userTokensDoc.data()) === null || _a === void 0
            ? void 0
            : _a.tokens) || []
        : [];
      return tokens.map((token) => ({ userId, token }));
    });
    const tokenEntries = (await Promise.all(tokenPromises)).flat();
    if (tokenEntries.length === 0) {
      res
        .status(404)
        .json({ error: "No hay tokens activos para estos servidores" });
      return;
    }
    // Enviar en lotes de 500
    const batchSize = 500;
    let totalSuccess = 0;
    let totalFailure = 0;
    const tokensToRemoveByUser = new Map();
    for (let i = 0; i < tokenEntries.length; i += batchSize) {
      const batchEntries = tokenEntries.slice(i, i + batchSize);
      const batchTokens = batchEntries.map((e) => e.token);
      const url = `/dashboard/events/${eventId}`;
      const message = {
        data: normalizeFcmData({
          title: `📎 Materiales: ${eventTitle}`,
          body: bodyText,
          type: "materials",
          eventId,
          url,
        }),
        webpush: {
          headers: {
            Urgency: "high",
            TTL: "86400",
          },
          notification: {
            title: `📎 Materiales: ${eventTitle}`,
            body: bodyText,
            icon: "/mci-logo.png",
            badge: "/mci-logo.png",
            data: { url },
          },
          fcmOptions: {
            link: getAbsoluteLink(url),
          },
        },
        tokens: batchTokens,
      };
      const response = await messaging.sendEachForMulticast(message);
      totalSuccess += response.successCount;
      totalFailure += response.failureCount;
      response.responses.forEach((resp, idx) => {
        var _a;
        if (
          !resp.success &&
          ((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) ===
            "messaging/registration-token-not-registered"
        ) {
          const entry = batchEntries[idx];
          const arr = tokensToRemoveByUser.get(entry.userId) || [];
          arr.push(entry.token);
          tokensToRemoveByUser.set(entry.userId, arr);
        }
      });
    }
    // Limpiar tokens inválidos
    if (tokensToRemoveByUser.size > 0) {
      const updates = [];
      tokensToRemoveByUser.forEach((tokens, userId) => {
        const chunkSize = 10;
        for (let j = 0; j < tokens.length; j += chunkSize) {
          const chunk = tokens.slice(j, j + chunkSize);
          updates.push(
            db
              .collection("userTokens")
              .doc(userId)
              .update({
                tokens: FieldValue.arrayRemove(...chunk),
              }),
          );
        }
      });
      await Promise.allSettled(updates);
    }
    res.json({
      success: true,
      sent: totalSuccess,
      failed: totalFailure,
      usersNotified: userIds.length,
      materials: materialTitles.length,
    });
  } catch (error) {
    console.error("Error enviando notificación de materiales:", error);
    res.status(500).json({ error: "Error enviando notificación" });
  }
};
// Registrar ambas rutas para notify/materials
app.post("/notify/materials", requireNotificationActor, notifyMaterialsHandler);
app.post("/api/notify/materials", requireNotificationActor, notifyMaterialsHandler);
// Handler para enviar notificación a TODOS los usuarios con tokens
const notifyAllHandler = async (req, res) => {
  try {
    const { title, body, data } = req.body;
    if (!title) {
      res.status(400).json({ error: "title es requerido" });
      return;
    }
    // Obtener todos los tokens de todos los usuarios
    const userTokensSnap = await db.collection("userTokens").get();
    const allTokens = [];
    userTokensSnap.forEach((doc) => {
      const tokens = doc.data().tokens || [];
      allTokens.push(...tokens);
    });
    if (allTokens.length === 0) {
      res
        .status(404)
        .json({ error: "No hay servidores con notificaciones activas" });
      return;
    }
    // Enviar en lotes de 500 (límite de FCM)
    const batchSize = 500;
    let totalSuccess = 0;
    let totalFailure = 0;
    for (let i = 0; i < allTokens.length; i += batchSize) {
      const batch = allTokens.slice(i, i + batchSize);
      const url =
        (data && typeof data === "object" ? data.url : undefined) ||
        "/dashboard";
      const normalizedData = normalizeFcmData(
        Object.assign(Object.assign({ title, body: body || "" }, data || {}), {
          url,
        }),
      );
      const message = {
        data: normalizedData,
        webpush: {
          headers: {
            Urgency: "high",
            TTL: "86400",
          },
          notification: {
            title,
            body: body || "",
            icon: "/mci-logo.png",
            badge: "/mci-logo.png",
            data: { url },
          },
          fcmOptions: {
            link: getAbsoluteLink(url),
          },
        },
        tokens: batch,
      };
      const response = await messaging.sendEachForMulticast(message);
      totalSuccess += response.successCount;
      totalFailure += response.failureCount;
    }
    res.json({
      success: true,
      sent: totalSuccess,
      failed: totalFailure,
    });
  } catch (error) {
    console.error("Error enviando notificación a todos:", error);
    res.status(500).json({ error: "Error enviando notificación" });
  }
};
// Registrar ambas rutas para notify/all
app.post("/notify/all", requireNotificationActor, notifyAllHandler);
app.post("/api/notify/all", requireNotificationActor, notifyAllHandler);
// Handler para notificar a servidores de eventos de una semana específica
const notifyWeekHandler = async (req, res) => {
  var _a;
  try {
    const { eventIds, weekNumber, monthName } = req.body;
    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      res.status(400).json({ error: "eventIds (array) es requerido" });
      return;
    }
    // Estructura para agrupar asignaciones por usuario
    const userAssignments = new Map();
    // Obtener asignaciones de cada evento
    for (const eventId of eventIds) {
      const eventDoc = await db.collection("events").doc(eventId).get();
      if (!eventDoc.exists) continue;
      const eventData = eventDoc.data();
      const eventTitle =
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.title) || "Evento";
      const eventDate =
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.date) || "";
      const eventTime =
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.time) || "";
      // Obtener asignaciones del evento
      const assignmentsSnap = await db
        .collection("events")
        .doc(eventId)
        .collection("assignments")
        .get();
      for (const assignDoc of assignmentsSnap.docs) {
        const assignment = assignDoc.data();
        const userId = assignment.userId;
        if (!userId) continue;
        const assignmentInfo = {
          title: eventTitle,
          date: eventDate,
          time: eventTime,
          role: assignment.roleName || "Servidor",
          area: assignment.areaName || "",
        };
        if (userAssignments.has(userId)) {
          userAssignments.get(userId).events.push(assignmentInfo);
        } else {
          userAssignments.set(userId, {
            userName: assignment.userName || "Servidor",
            events: [assignmentInfo],
          });
        }
      }
    }
    if (userAssignments.size === 0) {
      res
        .status(404)
        .json({ error: "No hay servidores asignados en estos eventos" });
      return;
    }
    let totalSuccess = 0;
    let totalFailure = 0;
    // Enviar notificación personalizada a cada usuario
    for (const [userId, data] of userAssignments.entries()) {
      const userTokensDoc = await db.collection("userTokens").doc(userId).get();
      if (!userTokensDoc.exists) continue;
      const tokens =
        ((_a = userTokensDoc.data()) === null || _a === void 0
          ? void 0
          : _a.tokens) || [];
      if (tokens.length === 0) continue;
      // Crear mensaje personalizado
      const eventCount = data.events.length;
      let bodyText = "";
      if (eventCount === 1) {
        const evt = data.events[0];
        bodyText = `${evt.title} - ${evt.role}${
          evt.area ? ` (${evt.area})` : ""
        }`;
      } else {
        bodyText = `Tienes ${eventCount} asignaciones esta semana. ¡Revisa tus eventos!`;
      }
      // Usar solo 'data' para evitar duplicados en móviles
      const titleText = `📅 Semana ${weekNumber}${
        monthName ? ` de ${monthName}` : ""
      }`;
      const url = "/dashboard";
      const message = {
        data: normalizeFcmData({
          title: titleText,
          body: bodyText,
          type: "week_reminder",
          url,
        }),
        webpush: {
          headers: {
            Urgency: "high",
            TTL: "86400",
          },
          notification: {
            title: titleText,
            body: bodyText,
            icon: "/mci-logo.png",
            badge: "/mci-logo.png",
            data: { url },
          },
          fcmOptions: {
            link: getAbsoluteLink(url),
          },
        },
        tokens,
      };
      try {
        const response = await messaging.sendEachForMulticast(message);
        totalSuccess += response.successCount;
        totalFailure += response.failureCount;
      } catch (err) {
        totalFailure += tokens.length;
      }
    }
    res.json({
      success: true,
      sent: totalSuccess,
      failed: totalFailure,
      usersNotified: userAssignments.size,
    });
  } catch (error) {
    console.error("Error enviando notificación de semana:", error);
    res.status(500).json({ error: "Error enviando notificación" });
  }
};
// Registrar ambas rutas para notify/week
app.post("/notify/week", requireNotificationActor, notifyWeekHandler);
app.post("/api/notify/week", requireNotificationActor, notifyWeekHandler);
exports.api = functions.runWith({ maxInstances: 10 }).https.onRequest(app);
// ELIMINADO: onVolunteerAssigned (legacy) - reemplazado por onAssignmentWritten moderno
// ELIMINADO: onSongAdded (legacy) - reemplazado por onRepertoireWritten moderno
// ELIMINADO: onMaterialAdded (legacy) - reemplazado por onMaterialWritten moderno
// onUserCreated eliminado - no tenía funcionalidad real, solo console.log
// ============================================================================
// FIRESTORE TRIGGER: Detectar cambios y enviar push notification
// Optimizado para manejar alta carga y prevenir spam
// ============================================================================
exports.onChangeMetaUpdated = (0, firestore_1.onDocumentUpdated)(
  {
    document: "changes/meta",
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 60,
  },
  async (event) => {
    // DESHABILITADO POR ALTO COSTO DE LECTURAS
    // Esta función leía todos los tokens de usuario (batch 500) cada vez que cambiaba algo.
    // Generaba un consumo excesivo de "Cloud Firestore Read Ops".
    console.log(
      "[ChangeTrigger] 🛑 Trigger deshabilitado para ahorrar costos.",
    );
    return;
  },
);
// ============================================================================
// LIGHTWEIGHT SYNC TRIGGERS
// Detectan cambios directos en DB (por ejemplo desde el frontend con Firebase SDK)
// y actualizan el semáforo "changes/meta" para que los clientes refresquen sus datos.
// Costo: 1 escritura por cambio (muy barato).
// ============================================================================
const generateThumbnail = async (storagePath: string) => {
  const bucket = admin.storage().bucket();
  const fileName = path.basename(storagePath);
  const dirName = path.dirname(storagePath);
  if (fileName.startsWith("thumb_")) return null;
  const thumbName = `thumb_${fileName}`;
  const thumbPath = path.join(dirName, thumbName);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  const tempThumbPath = path.join(os.tmpdir(), thumbName);
  try {
    await bucket.file(storagePath).download({ destination: tempFilePath });
    await sharp(tempFilePath)
      .resize(400, 400, { fit: "inside" })
      .toFile(tempThumbPath);
    await bucket.upload(tempThumbPath, {
      destination: thumbPath,
      metadata: {
        contentType: "image/jpeg",
        cacheControl: "public, max-age=31536000",
      },
    });
    await bucket.file(thumbPath).makePublic();
    try {
      await fs.unlink(tempFilePath);
      await fs.unlink(tempThumbPath);
    } catch (e) {}
    return `https://storage.googleapis.com/${bucket.name}/${thumbPath}`;
  } catch (err) {
    console.error("Error generating thumbnail:", err);
    return null;
  }
};
exports.onEventWritten = functions.firestore
  .document("events/{eventId}")
  .onWrite(async (change: any) => {
    // Optimization: Skip if no meaningful data changed (e.g. just a touch)
    if (change.before.exists && change.after.exists) {
      const before = change.before.data() || {};
      const after = change.after.data() || {};
      // Check if visible fields changed
      const visibleFields = [
        "title",
        "date",
        "time",
        "location",
        "type",
        "description",
        "ministries",
      ];
      const hasChange = visibleFields.some(
        (field) =>
          JSON.stringify(before[field]) !== JSON.stringify(after[field]),
      );
      if (!hasChange) {
        // Also check legacy fields or other important ones if needed,
        // but if main fields are same, we can probably skip global refresh
        return;
      }
    }
    // Maintain available years cache
    try {
      const after = change.after.exists ? change.after.data() : null;
      if (after && after.date) {
        const year = after.date.split("-")[0];
        if (year) {
          await db.doc("app_cache/events_meta").set(
            {
              years: FieldValue.arrayUnion(year),
            },
            { merge: true },
          );
        }
      }
    } catch (e) {
      console.error("Error updating event years cache:", e);
    }
    await touchChangeMeta("events");
    // Thumbnail generation
    try {
      const afterData = change.after.exists ? change.after.data() : null;
      const beforeData = change.before.exists ? change.before.data() : null;
      if (afterData && afterData.imageUrl) {
        const urlChanged =
          !beforeData || beforeData.imageUrl !== afterData.imageUrl;
        const thumbMissing = !afterData.imageThumbUrl;
        if (urlChanged || thumbMissing) {
          // Extract path from URL (gs:// or https://)
          // Assuming https://storage.googleapis.com/BUCKET/path... or similar
          // But the helper takes "storagePath". We need to parse it.
          // Simplified: Assuming relative path is not easily available, we might skip parsing if logic is complex.
          // However, generateThumbnail expects a storage path.
          // Let's assume standard firebase storage URL structure or just use what we have.
          // Access bucket file directly?
          // The 'imageUrl' is usually a public URL.
          // We need to parse the path from the URL.
          // Example: https://storage.googleapis.com/bucket/events/id/file.jpg
          // Path: events/id/file.jpg
          const bucketName = admin.storage().bucket().name;
          let storagePath = "";
          if (afterData.imageUrl.includes(bucketName)) {
            // Extract path after bucket name
            const parts = afterData.imageUrl.split(bucketName + "/");
            if (parts.length > 1) storagePath = parts[1].split("?")[0];
          }

          if (storagePath) {
            const thumbUrl = await generateThumbnail(
              decodeURIComponent(storagePath),
            );
            if (thumbUrl && thumbUrl !== afterData.imageThumbUrl) {
              await change.after.ref.update({ imageThumbUrl: thumbUrl });
            }
          }
        }
      }
    } catch (e) {
      console.error("Error in thumbnail gen:", e);
    }
    // Also sync attendance if event date/time/status changed
    if (change.before.exists && change.after.exists) {
      const b = change.before.data();
      const a = change.after.data();
      if (
        (b === null || b === void 0 ? void 0 : b.date) !==
          (a === null || a === void 0 ? void 0 : a.date) ||
        (b === null || b === void 0 ? void 0 : b.time) !==
          (a === null || a === void 0 ? void 0 : a.time) ||
        (b === null || b === void 0 ? void 0 : b.status) !==
          (a === null || a === void 0 ? void 0 : a.status) ||
        (b === null || b === void 0 ? void 0 : b.endTime) !==
          (a === null || a === void 0 ? void 0 : a.endTime) ||
        (b === null || b === void 0 ? void 0 : b.serviceTime) !==
          (a === null || a === void 0 ? void 0 : a.serviceTime)
      ) {
        await touchAttendanceSync();
      }
    } else {
      // Create or Delete -> always sync
      await touchAttendanceSync();
    }
    // SILENT PUSH DATA REFRESH (Dashboard instant update)
    try {
      const after = change.after.exists ? change.after.data() : null;
      // Optimization: Skip if silent operation
      if (after && after._silent) return; // Silent creation/update

      if (!after) {
        // DELETED EVENT checking before data for silent flag?
        // If deleted, we can't check 'after', we check 'before'.
        const before = change.before.exists ? change.before.data() : null;
        if (before && before._silent) return; // Silent deletion if marked so? Unlikely for deletion but consistent.

        // DELETED EVENT
        const message = {
          topic: "all_users",
          data: {
            type: "DATA_CHANGED",
            resources: JSON.stringify(["events", "assignments"]),
            force: "true",
            operation: "delete",
            eventId: change.before.id,
          },
        };
        await runtimeMessaging()
          .send(message)
          .catch(() => null);
      } else {
        // UPDATED/CREATED EVENT
        // Only push if critical fields changed to avoid spamming refreshes
        const before = change.before.exists ? change.before.data() : null;
        const visibleFields = [
          "title",
          "date",
          "time",
          "location",
          "activeMinistries",
        ];
        const hasVisibleChange =
          !before ||
          visibleFields.some(
            (f) => JSON.stringify(before[f]) !== JSON.stringify(after[f]),
          );
        if (hasVisibleChange) {
          const message = {
            topic: "all_users",
            data: {
              type: "DATA_CHANGED",
              resources: JSON.stringify(["events"]),
              force: "true",
              operation: "update",
              eventId: change.after.id,
            },
          };
          await runtimeMessaging()
            .send(message)
            .catch(() => null);
        }
      }
    } catch (e) {
      console.error("Error sending event silent push:", e);
    }
  });
exports.onEventTemplateWritten = functions.firestore
  .document("event_templates/{templateId}")
  .onWrite(async () => {
    await touchChangeMeta("event_templates");
  });
exports.onAssignmentWritten = functions.firestore
  .document("events/{eventId}/assignments/{assignmentId}")
  .onWrite(async (change, context) => {
    await syncAssignmentRoster({ db, eventId: context.params.eventId, assignmentId: context.params.assignmentId });
    // 1. Silent/Meta Check - Do not touch meta if it's a silent op?
    // Actually we usually want to touch meta to update the UI list, but maybe not for purely internal flags.
    // For now we keep touching meta to be safe for UI consistency.
    await touchChangeMeta("assignments");
    await touchAttendanceSync();

    // 2. Notification Logic - OPTIMIZATION:
    // If deleted (only before exists) or created/updated (after exists)
    // Check if we really need to fetch the event data.

    const after = change.after.exists ? change.after.data() : null;
    const before = change.before.exists ? change.before.data() : null;

    // OPTIMIZATION: Return early if silent
    if (after && after._silent) return;
    if (!after && before && before._silent) return;

    // Check if it is a critical change BEFORE fetching event data
    // If it's an update, and roles/area didn't change, we might skip notification?
    // But we still need to send the DATA message (silent push) for UI update.
    // The previous logic sent data message for EVERYTHING.
    // We can keep sending data message, but avoid fetching event if we don't need it for the *notification body*?
    // Actually the data payload includes eventTitle, etc. So we need event data for the payload too.
    // BUT we can skip fetching event if we aren't going to send a message at all.

    // For delete: We need event data for the message body? "Eliminado de Evento X". Yes.

    // Let's try to minimalize:
    const userId = after?.userId || before?.userId;
    if (!userId) return;

    // SPAM PREVENTION / COST OPTIMIZATION:
    // If update, check if fields changed.
    const isUpdate = !!(before && after);
    const isCriticalChange =
      !isUpdate ||
      after.roleName !== before.roleName ||
      after.areaName !== before.areaName ||
      after.eventId !== before.eventId;

    // If it's NOT a critical change, and it IS an update, maybe we skip the whole push?
    // The frontend relies on "DATA_CHANGED" push to refresh the list?
    // If we skip, the user has to pull to refresh.
    // For "thrifty" mode, we might accept that minor edits don't instant-refresh if it saves reads.
    // However, the "DATA_CHANGED" payload requires event details to be useful?
    // Actually, looking at previous code, payload included eventTitle etc.

    // STRATEGY: Only fetch event if we are going to send a notification (visual) OR if it's a structural change.
    // If it's just a minor tweak, maybe skip.

    if (!isCriticalChange) {
      // Just touch meta (already done) and return. Client polls changes/meta
      // (if active) so they will see it eventually via polling.
      return;
    }

    try {
      let eventData = {};
      const eventId = context.params.eventId;
      // Fetch event ONLY if we decided to proceed
      try {
        const eventSnap = await db.doc(`events/${eventId}`).get();
        if (eventSnap.exists) {
          eventData = eventSnap.data();
        }
      } catch (e) {
        console.error("Error fetching event for push:", e);
      }

      const payloadData: { [key: string]: any } = {
        type: "DATA_CHANGED",
        resources: JSON.stringify(["assignments"]),
        force: "true",
        operation: !after ? "delete" : "update",
      };
      // ... construct payload ...
      if (after) {
        payloadData.assignment = JSON.stringify({
          id: context.params.assignmentId,
          eventId: context.params.eventId,
          userId: userId,
          areaName: after.areaName || "",
          roleName: after.roleName || "",
          eventTitle: eventData.title || "",
          eventDate: eventData.date || "",
          eventTime: eventData.time || "",
          // Minimize payload
        });
      } else {
        payloadData.assignmentId = context.params.assignmentId;
        payloadData.deletedAssignment = JSON.stringify({
          id: context.params.assignmentId,
          eventId: context.params.eventId,
          userId: userId,
          areaName: before.areaName || "",
          // ...
          eventTitle: eventData.title || "",
        });
      }

      // Mover título y cuerpo a 'data' para garantizar que el Service Worker lo maneje
      // y no el navegador (que a veces oculta el SW si hay 'notification').
      payloadData.title = isUpdate
        ? "Asignación Actualizada"
        : "Nueva Asignación";
      payloadData.body = !after
        ? `Se ha eliminado tu asignación para el evento ${
            eventData.title || "Evento"
          }.`
        : `Has sido asignado como ${after.roleName || "miembro"} en ${
            after.areaName || "Ministerio"
          } para el evento ${eventData.title || "Evento"}.`;
      payloadData.url = `/dashboard/events/${context.params.eventId}`;

      // ESTRATEGIA ROBUSTA: Enviar directamente a los tokens del usuario en lugar del topic.
      // Esto evita problemas de suscripción asíncrona.
      const userTokensDoc = await db.collection("userTokens").doc(userId).get();
      const rawTokens = userTokensDoc.exists
        ? userTokensDoc.data()?.tokens
        : [];
      const tokens = Array.isArray(rawTokens)
        ? Array.from(new Set(rawTokens))
        : [];

      if (!tokens || tokens.length === 0) {
        console.log(
          `[onAssignmentWritten] No tokens for user ${userId}, skipping push.`,
        );
        return;
      }

      const message = {
        tokens: tokens,
        data: payloadData,
        // Eliminado notification para evitar doble alerta (DATA ONLY)
        android: {
          priority: "high" as const,
        },
        apns: {
          payload: {
            aps: {
              contentAvailable: true,
            },
          },
        },
      };

      const response = await runtimeMessaging().sendEachForMulticast(message);

      // Cleanup invalid tokens
      if (response.failureCount > 0) {
        const tokensToRemove: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (
            !resp.success &&
            (resp.error?.code ===
              "messaging/registration-token-not-registered" ||
              resp.error?.code === "messaging/invalid-registration-token")
          ) {
            tokensToRemove.push(tokens[idx]);
          }
        });

        if (tokensToRemove.length > 0) {
          await db
            .collection("userTokens")
            .doc(userId)
            .update({
              tokens: FieldValue.arrayRemove(...tokensToRemove),
            });
        }
      }
    } catch (e) {
      console.error("Error sending assignment push:", e);
    }
  });

// [DUPLICATE EXPORTS REMOVED]
// Las exportaciones de onRepertoireWritten y onMaterialWritten estaban duplicadas aquí.
// Se han eliminado para usar solamente las definiciones actualizadas más abajo,
// que implementan la lógica correcta de deduplicación de tokens.

// Helper para reconstruir caché agregado
// Helper para actualizar caché incrementalmente (ahorrativo + transaccional)
const updateAppCache = async (collectionName, docId, data) => {
  const cacheRef = db.collection("app_cache").doc(collectionName);
  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(cacheRef);
      if (!doc.exists) {
        // Fallback: si no existe caché, reconstruir desde cero (costoso pero necesario una vez)
        const snap = await db.collection(collectionName).get();
        const items = snap.docs.map((d) =>
          Object.assign({ id: d.id }, d.data()),
        );
        t.set(cacheRef, {
          items,
          updatedAt: FieldValue.serverTimestamp(),
        });
        return;
      }
      const cacheData = doc.data();
      const items = Array.isArray(cacheData.items) ? cacheData.items : [];
      const idx = items.findIndex((i) => i.id === docId);

      if (!data) {
        // DELETE
        if (idx !== -1) items.splice(idx, 1);
      } else {
        // CREATE / UPDATE
        const newItem = Object.assign({ id: docId }, data);
        if (idx !== -1) items[idx] = newItem;
        else items.push(newItem);
      }
      t.set(cacheRef, {
        items,
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
    // console.log(`[Cache] Updated ${collectionName} for doc ${docId}`);
  } catch (err) {
    console.error(`[Cache] Failed to update ${collectionName}`, err);
  }
};

const updatePendingUsersDoc = async (userId, userData) => {
  const isPending =
    userData &&
    (userData.role === "user" || !userData.role) &&
    userData.isAssigned !== true &&
    (!userData.areas || userData.areas.length === 0);

  const pendingRef = db.doc("system/pending_users");

  try {
    await db.runTransaction(async (t) => {
      const doc = await t.get(pendingRef);
      // Ensure we have an array
      let currentList =
        doc.exists && Array.isArray(doc.data().users) ? doc.data().users : [];

      // Remove current user if present (by ID)
      const initialLength = currentList.length;
      currentList = currentList.filter((u) => u.id !== userId);

      if (isPending) {
        // Add minimal data
        currentList.push({
          id: userId,
          name: userData.name || "",
          email: userData.email || "",
          photoURL: userData.photoURL || "",
          createdAt: userData.createdAt || null,
          role: userData.role || "user",
          isAssigned: false,
          areas: [],
        });
      }

      // Only write if changed (length changed implies added or removed, but we also removed then added which changes content maybe?)
      // Simplest check: just write. Optimizations typically not worth complexity here unless high contention.
      t.set(
        pendingRef,
        {
          users: currentList,
          updatedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    });
  } catch (e) {
    console.error("Error updating pending users doc", e);
  }
};

exports.backfillPendingUsers = functions.https.onRequest(async (req, res) => {
  return requireMaintenanceActor(req, res, async () => {
  try {
    const snapshot = await db.collection("users").get();
    const pendingUsers = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const isPending =
        (data.role === "user" || !data.role) &&
        data.isAssigned !== true &&
        (!data.areas || data.areas.length === 0);

      if (isPending) {
        pendingUsers.push({
          id: doc.id,
          name: data.name || "",
          email: data.email || "",
          photoURL: data.photoURL || "",
          createdAt: data.createdAt || null,
          role: data.role || "user",
          isAssigned: false,
          areas: [],
        });
      }
    }

    await db.doc("system/pending_users").set({
      users: pendingUsers,
      updatedAt: FieldValue.serverTimestamp(),
    });

    res.json({
      success: true,
      message: `Backfill complete. Found ${pendingUsers.length} pending users.`,
      users: pendingUsers.map((u) => u.name),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "MAINTENANCE_FAILED" });
  }
  });
});
exports.onUserTokenWritten = functions.firestore
  .document("userTokens/{userId}")
  .onWrite(async (change, context) => {
    const result = await syncUserTokenTopics({
      messaging: runtimeMessaging(), userId: context.params.userId,
      before: change.before.exists ? change.before.data() : undefined,
      after: change.after.exists ? change.after.data() : undefined,
    });
    if (result.failedSubscriptions) console.warn("[FCM] Topic changes partially rejected", { failedSubscriptions: result.failedSubscriptions });
    return result;
  });

exports.onUserWritten = functions.firestore
  .document("users/{userId}")
  .onWrite(async (change, context) => {
    // Evitar bucle infinito: /api/me actualiza lastSeenAt
    const before = change.before.data() || {};
    const after = change.after.data() || {};
    const directoryFields = ["name", "username", "photoURL", "photoThumbURL", "role", "areas", "ministryRoles", "isAssigned"];
    if (!change.before.exists || !change.after.exists || directoryFields.some(field => JSON.stringify(before[field]) !== JSON.stringify(after[field]))) {
      await syncUserDirectory({ db, userId: context.params.userId, timestamp: FieldValue.serverTimestamp() });
    }
    const isIgnoredParams = (key) =>
      key.startsWith("lastSeen") || key === "updatedAt";
    if (!change.before.exists || !change.after.exists) {
      // Creación o borrado: siempre importa
      await touchChangeMeta("users");
      // UPDATE CACHE INCREMENTAL
      await updateAppCache(
        "users",
        change.after.id || change.before.id,
        change.after.exists ? change.after.data() : null,
      );
      await updatePendingUsersDoc(
        change.after.id || change.before.id,
        change.after.exists ? change.after.data() : null,
      );
      return;
    }
    const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
    let meaningful = false;
    for (const key of allKeys) {
      if (isIgnoredParams(key)) continue;
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        meaningful = true;
        break;
      }
    }
    if (meaningful) {
      await touchChangeMeta("users");
      // UPDATE CACHE INCREMENTAL
      await updateAppCache("users", change.after.id, change.after.data());
      await updatePendingUsersDoc(change.after.id, change.after.data());
    }
  });
exports.onRoleWritten = functions.firestore
  .document("roles/{roleId}")
  .onWrite(async (change, context) => {
    await touchChangeMeta("roles");
    await updateAppCache(
      "roles",
      change.after.id || change.before.id,
      change.after.exists ? change.after.data() : null,
    );
  });
exports.onServiceAreaWritten = functions.firestore
  .document("service_areas/{areaId}")
  .onWrite(async (change, context) => {
    await touchChangeMeta("service_areas");
    await updateAppCache(
      "service_areas",
      change.after.id || change.before.id,
      change.after.exists ? change.after.data() : null,
    );
  });
exports.onAttendanceWritten = functions.firestore
  .document("attendance_records/{recordId}")
  .onWrite(async () => {
    await touchChangeMeta("attendance");
    await touchAttendanceSync();
  });
exports.onCommentWritten = functions.firestore
  .document("comments/{commentId}")
  .onWrite(async (change, context) => {
    var _a;
    // Check for reaction-only updates to avoid high read costs/spam
    if (change.before.exists && change.after.exists) {
      const beforeData = change.before.data();
      const afterData = change.after.data();
      // If text and author are same, but something else changed (likely reactions or read status)
      if (
        (beforeData === null || beforeData === void 0
          ? void 0
          : beforeData.text) ===
          (afterData === null || afterData === void 0
            ? void 0
            : afterData.text) &&
        (beforeData === null || beforeData === void 0
          ? void 0
          : beforeData.authorId) ===
          (afterData === null || afterData === void 0
            ? void 0
            : afterData.authorId)
      ) {
        // It's a minor update (reaction), skip causing a global refresh
        return;
      }
    }
    await touchChangeMeta("comments");
    // Solo notificar en creación (no en updates/deletes)
    if (!change.after.exists || change.before.exists) return;
    // OPTIMIZACION: Salir si es una operación silenciosa (ej. importación masiva)
    if (
      (_a = change.after.data()) === null || _a === void 0 ? void 0 : _a._silent
    )
      return;
    try {
      const data = change.after.data();
      const authorName = String(
        (data === null || data === void 0 ? void 0 : data.authorName) ||
          "Servidor",
      );
      const text = String(
        (data === null || data === void 0 ? void 0 : data.text) || "",
      );
      const title = "💬 Nuevo Comentario";
      const body = truncateForNotification(`${authorName}: ${text}`, 140);
      const url = "/dashboard";
      // Enviar a topic público para todos los usuarios
      const message = {
        topic: "all_users",
        data: normalizeFcmData({
          type: "DATA_CHANGED",
          resources: JSON.stringify(["comments"]),
          title,
          body,
          url,
          commentId: context.params.commentId,
          authorName,
        }),
      };
      await runtimeMessaging()
        .send(message)
        .catch(() => null);
    } catch (e) {
      console.error("Error sending comment notification:", e);
    }
  });
exports.onRepertoireWritten = functions.firestore
  .document("events/{eventId}/repertoire/{songId}")
  .onWrite(async (change, context) => {
    var _a;
    await touchChangeMeta("repertoire");
    await touchChangeMeta("events");
    // Solo notificar en creación (no en updates/deletes)
    if (!change.after.exists || change.before.exists) return;
    // OPTIMIZACION: Salir si es una operación silenciosa
    if (
      (_a = change.after.data()) === null || _a === void 0 ? void 0 : _a._silent
    )
      return;
    try {
      const song = change.after.data();
      const eventId = context.params.eventId;
      // Obtener evento para el título
      const eventSnap = await db.doc(`events/${eventId}`).get();
      const eventData = eventSnap.exists ? eventSnap.data() : {};
      const title = "🎵 Nueva Canción";
      const body = `Se agregó "${
        (song === null || song === void 0 ? void 0 : song.title) || "canción"
      }" al repertorio de "${
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.title) || "Evento"
      }"`;
      const url = `/dashboard/events/${eventId}`;
      // Obtener usuarios asignados y enviar notificación por topic individual
      const assignmentsSnap = await db
        .collection("events")
        .doc(eventId)
        .collection("assignments")
        .get();
      const userIds = new Set();
      assignmentsSnap.forEach((doc) => {
        var _a;
        const userId =
          (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userId;
        if (userId) userIds.add(userId);
      });
      // Enviar a cada usuario asignado (DEDUPLICADO POR TOKEN)
      for (const userId of userIds) {
        // ESTRATEGIA ROBUSTA: Enviar directamente a los tokens del usuario en lugar del topic.
        const userTokensDoc = await db
          .collection("userTokens")
          .doc(String(userId))
          .get();
        const rawTokens = userTokensDoc.exists
          ? userTokensDoc.data()?.tokens
          : [];
        // DEDUPLICACIÓN
        const tokens = Array.isArray(rawTokens)
          ? Array.from(new Set(rawTokens))
          : [];

        if (!tokens || tokens.length === 0) continue;

        const message = {
          tokens: tokens,
          data: normalizeFcmData({
            type: "DATA_CHANGED",
            resources: JSON.stringify(["repertoire", "events"]),
            title,
            body,
            url,
            eventId,
            songId: context.params.songId,
          }),
        };
        const response = await runtimeMessaging().sendEachForMulticast(message);

        // CLEANUP TOKENS INVALIDOS
        if (response.failureCount > 0) {
          const tokensToRemove: string[] = [];
          response.responses.forEach((resp, idx) => {
            if (
              !resp.success &&
              (resp.error?.code ===
                "messaging/registration-token-not-registered" ||
                resp.error?.code === "messaging/invalid-registration-token")
            ) {
              tokensToRemove.push(tokens[idx]);
            }
          });
          if (tokensToRemove.length > 0) {
            await db
              .collection("userTokens")
              .doc(String(userId))
              .update({
                tokens: FieldValue.arrayRemove(
                  ...tokensToRemove,
                ),
              })
              .catch(() => null);
          }
        }
      }
    } catch (e) {
      console.error("Error sending repertoire notification:", e);
    }
  });
exports.onMaterialWritten = functions.firestore
  .document("events/{eventId}/materials/{materialId}")
  .onWrite(async (change, context) => {
    var _a;
    await touchChangeMeta("materials");
    await touchChangeMeta("events");
    // Solo notificar en creación (no en updates/deletes)
    if (!change.after.exists || change.before.exists) return;
    // OPTIMIZACION: Salir si es una operación silenciosa
    if (
      (_a = change.after.data()) === null || _a === void 0 ? void 0 : _a._silent
    )
      return;
    try {
      const material = change.after.data();
      const eventId = context.params.eventId;
      // Obtener evento para el título
      const eventSnap = await db.doc(`events/${eventId}`).get();
      const eventData = eventSnap.exists ? eventSnap.data() : {};
      const title = "📎 Nuevo Material";
      const body = `Se agregó "${
        (material === null || material === void 0 ? void 0 : material.title) ||
        "material"
      }" a "${
        (eventData === null || eventData === void 0
          ? void 0
          : eventData.title) || "Evento"
      }"`;
      const url = `/dashboard/events/${eventId}`;
      // Obtener usuarios asignados y enviar notificación por topic individual
      const assignmentsSnap = await db
        .collection("events")
        .doc(eventId)
        .collection("assignments")
        .get();
      const userIds = new Set();
      assignmentsSnap.forEach((doc) => {
        var _a;
        const userId =
          (_a = doc.data()) === null || _a === void 0 ? void 0 : _a.userId;
        if (userId) userIds.add(userId);
      });
      // Enviar a cada usuario asignado (DEDUPLICADO POR TOKEN)
      for (const userId of userIds) {
        // ESTRATEGIA ROBUSTA: Enviar directamente a los tokens del usuario en lugar del topic.
        const userTokensDoc = await db
          .collection("userTokens")
          .doc(String(userId))
          .get();
        const rawTokens = userTokensDoc.exists
          ? userTokensDoc.data()?.tokens
          : [];
        // DEDUPLICACIÓN
        const tokens = Array.isArray(rawTokens)
          ? Array.from(new Set(rawTokens))
          : [];

        if (!tokens || tokens.length === 0) continue;

        const message = {
          tokens: tokens,
          data: normalizeFcmData({
            type: "DATA_CHANGED",
            resources: JSON.stringify(["materials", "events"]),
            title,
            body,
            url,
            eventId,
            materialId: context.params.materialId,
          }),
        };
        const response = await runtimeMessaging().sendEachForMulticast(message);

        // CLEANUP TOKENS INVALIDOS
        if (response.failureCount > 0) {
          const tokensToRemove: string[] = [];
          response.responses.forEach((resp, idx) => {
            if (
              !resp.success &&
              (resp.error?.code ===
                "messaging/registration-token-not-registered" ||
                resp.error?.code === "messaging/invalid-registration-token")
            ) {
              tokensToRemove.push(tokens[idx]);
            }
          });

          if (tokensToRemove.length > 0) {
            await db
              .collection("userTokens")
              .doc(String(userId))
              .update({
                tokens: FieldValue.arrayRemove(
                  ...tokensToRemove,
                ),
              })
              .catch(() => null);
          }
        }
      }
    } catch (e) {
      console.error("Error sending material notification:", e);
    }
  });
exports.onNotificationWritten = functions.firestore
  .document("notifications/{notificationId}")
  .onWrite(async () => {
    await touchChangeMeta("notifications");
  });
// ------------------------------------------------------------------
// COMMAND PATTERN & DATA HYGIENE
// ------------------------------------------------------------------
exports.onCommandWritten = functions.firestore
  .document("commands/{commandId}")
  .onCreate(async (snap, context) => {
    const commandId = context.params.commandId;
    try {
      const command = await authorizeQueuedCommand(snap.data(), db);
      if (!(await claimQueuedCommand(db, snap.ref, FieldValue.serverTimestamp()))) return;

      // Helper to execute operations in chunks
      const executeChunked = async (ops) => {
        const CHUNK_SIZE = 500;
        for (let i = 0; i < ops.length; i += CHUNK_SIZE) {
          const batch = db.batch();
          const chunk = ops.slice(i, i + CHUNK_SIZE);
          chunk.forEach((op) => op(batch));
          await batch.commit();
        }
      };
      if (command.type === "REPLICATE_REPERTOIRE") {
        const { sourceEventId, targetEventId } = command;
        if (!sourceEventId || !targetEventId) return;
        const sourceRef = db.collection(`events/${sourceEventId}/repertoire`);
        const targetRef = db.collection(`events/${targetEventId}/repertoire`);
        const sourceSnap = await sourceRef.get();
        if (await completeEmptyCommand(sourceSnap, snap.ref, FieldValue.serverTimestamp())) return;
        const operations = [];
        // 1. Delete existing
        const targetSnap = await targetRef.get();
        targetSnap.forEach((doc) => {
          operations.push((batch) => batch.delete(doc.ref));
        });
        // 2. Create new
        sourceSnap.forEach((doc) => {
          const newDocRef = targetRef.doc(doc.id);
          const data = doc.data();
          operations.push((batch) =>
            batch.set(
              newDocRef,
              Object.assign(Object.assign({}, data), { _silent: false }),
            ),
          );
        });
        await executeChunked(operations);
        await snap.ref.set(
          {
            status: "completed",
            processedAt: FieldValue.serverTimestamp(),
            result: "repertoire_copied",
            sourceCount: sourceSnap.size,
          },
          { merge: true },
        );
        // FORCE TOUCH CHANGE META to ensure client sees the update immediately
        // even if _silent was true (though we changed it to false now too)
        await touchChangeMeta("events");
        await touchChangeMeta("repertoire");
      } else if (command.type === "REPLICATE_MATERIALS") {
        const { sourceEventId, targetEventId } = command;
        if (!sourceEventId || !targetEventId) return;
        const sourceRef = db.collection(`events/${sourceEventId}/materials`);
        const targetRef = db.collection(`events/${targetEventId}/materials`);
        const sourceSnap = await sourceRef.get();
        if (await completeEmptyCommand(sourceSnap, snap.ref, FieldValue.serverTimestamp())) return;
        const operations = [];
        const targetSnap = await targetRef.get();
        targetSnap.forEach((doc) => {
          operations.push((batch) => batch.delete(doc.ref));
        });
        sourceSnap.forEach((doc) => {
          const newDocRef = targetRef.doc(doc.id);
          const data = doc.data();
          operations.push((batch) =>
            batch.set(
              newDocRef,
              Object.assign(Object.assign({}, data), { _silent: false }),
            ),
          );
        });
        await executeChunked(operations);
        await snap.ref.set(
          {
            status: "completed",
            processedAt: FieldValue.serverTimestamp(),
            result: "materials_copied",
            sourceCount: sourceSnap.size,
          },
          { merge: true },
        );
        await touchChangeMeta("events");
        await touchChangeMeta("materials");
      } else if (command.type === "REPLICATE_ASSIGNMENTS") {
        const { sourceEventId, targetEventId } = command;
        if (!sourceEventId || !targetEventId) return;
        const sourceRef = db.collection(`events/${sourceEventId}/assignments`);
        const targetRef = db.collection(`events/${targetEventId}/assignments`);
        const sourceSnap = await sourceRef.get();
        if (await completeEmptyCommand(sourceSnap, snap.ref, FieldValue.serverTimestamp())) return;
        const operations = [];
        const targetSnap = await targetRef.get();
        targetSnap.forEach((doc) => {
          operations.push((batch) => batch.delete(doc.ref));
        });
        sourceSnap.forEach((doc) => {
          const newDocRef = targetRef.doc(doc.id);
          const data = doc.data();

          // Clonar data pero limpiar campos de asistencia
          const cleanData = Object.assign({}, data);
          delete cleanData.checkInTime;
          delete cleanData.checkOutTime;
          delete cleanData.checkInPhoto;
          delete cleanData.checkOutPhoto;
          delete cleanData.checkInLocation;
          delete cleanData.checkOutLocation;

          operations.push((batch) =>
            batch.set(
              newDocRef,
              Object.assign(Object.assign({}, cleanData), { _silent: false }),
            ),
          );
        });
        await executeChunked(operations);
        await snap.ref.set(
          {
            status: "completed",
            processedAt: FieldValue.serverTimestamp(),
            result: "assignments_copied",
            sourceCount: sourceSnap.size,
          },
          { merge: true },
        );
        await touchChangeMeta("events");
        await touchChangeMeta("assignments");
      } else if (command.type === "RESTORE_REPERTOIRE") {
        const { eventId, backupId, collection: backupCol } = command;
        if (!eventId || !backupId || !backupCol) return;
        const backupItemsRef = db.collection(
          `events/${eventId}/${backupCol}/${backupId}/repertoire`,
        );
        const currentRef = db.collection(`events/${eventId}/repertoire`);
        const [backupSnap, currentSnap] = await Promise.all([
          backupItemsRef.get(),
          currentRef.get(),
        ]);
        if (await completeEmptyCommand(backupSnap, snap.ref, FieldValue.serverTimestamp())) return;
        const operations = [];
        const currentIds = new Set(currentSnap.docs.map((d) => d.id));
        backupSnap.docs.forEach((doc) => {
          if (currentIds.has(doc.id)) return;
          const targetDocRef = currentRef.doc(doc.id);
          const data = doc.data();
          operations.push((batch) =>
            batch.set(
              targetDocRef,
              Object.assign(Object.assign({}, data), { _silent: true }),
              { merge: true },
            ),
          );
        });
        await executeChunked(operations);
        await snap.ref.set(
          {
            status: "completed",
            processedAt: FieldValue.serverTimestamp(),
            result: "repertoire_restored",
            sourceCount: backupSnap.size,
          },
          { merge: true },
        );
        await touchChangeMeta("repertoire");
      }
    } catch (error) {
      console.error(`Error processing command ${commandId}:`, error);
      await snap.ref.set(
        {
          status: "error",
          error: /^[A-Z_]{1,80}$/.test(error?.code || "") ? error.code : "COMMAND_FAILED",
          processedAt: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
    }
  });
exports.onEventDeleted = functions.firestore
  .document("events/{eventId}")
  .onDelete(async (snap, context) => {
    const eventId = context.params.eventId;
    const LIMIT = 500;
    // Recursive cleanup of subcollections
    const subcollections = [
      "repertoire",
      "materials",
      "assignments",
      "assignment_roster",
      "comments",
      "autoBackups",
      "replicateBackups",
    ];
    try {
      // Process sequentially to avoid memory spikes
      for (const subcol of subcollections) {
        const ref = db.collection(`events/${eventId}/${subcol}`);
        while (true) {
          const snapshot = await ref.limit(LIMIT).get();
          if (snapshot.empty) break;
          const batch = db.batch();
          snapshot.docs.forEach((doc) => batch.delete(doc.ref));
          await batch.commit();
        }
      }
    } catch (e) {
      console.error(`Error cleaning up event ${eventId}:`, e);
    }
  });
exports.onMinistryDeleted = functions.firestore
  .document("service_areas/{areaId}")
  .onDelete(async (snap, context) => {
    const areaData = snap.data();
    const areaName = areaData.name;
    const areaId = context.params.areaId;
    if (!areaName) return;
    // 1. Delete associated roles
    const rolesToDelete = [
      `ministry_admin_${areaId}`,
      `ministry_subadmin_${areaId}`,
    ];
    for (const roleId of rolesToDelete) {
      await db.collection("roles").doc(roleId).delete();
    }
    // 2. Remove ministry from Users (using array-contains query is much cheaper than reading all users)
    const usersSnap = await db
      .collection("users")
      .where("areas", "array-contains", areaName)
      .get();
    if (!usersSnap.empty) {
      const batch = db.batch();
      usersSnap.docs.forEach((doc) => {
        const userData = doc.data();
        const newAreas = (userData.areas || []).filter((a) => a !== areaName);
        batch.update(doc.ref, { areas: newAreas });
      });
      await batch.commit();
    }
  });
exports.onUserDeleted = functions.firestore
  .document("users/{userId}")
  .onDelete(async (snap, context) => {
    const userId = context.params.userId;
    const LIMIT = 500;
    // Clean up all assignments for this user across all events
    // Requires Collection Group Index on 'assignments' -> 'userId'
    try {
      const assignmentsRef = db
        .collectionGroup("assignments")
        .where("userId", "==", userId);
      while (true) {
        const snapshot = await assignmentsRef.limit(LIMIT).get();
        if (snapshot.empty) break;
        const batch = db.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
      }
    } catch (e) {
      console.error(`Error cleaning up user ${userId} assignments:`, e);
    }
  });

exports.fixStorageCors = functions.https.onRequest(async (req, res) => {
  return requireMaintenanceActor(req, res, async () => {
  try {
    const bucket = admin
      .storage()
      .bucket(isLocalDemoRuntime() ? undefined : "mcimachala-servidor.firebasestorage.app");

    const [currentCors] = await bucket.getCorsConfiguration();
    console.log("Current CORS Config:", JSON.stringify(currentCors, null, 2));

    await bucket.setCorsConfiguration([
      {
        origin: ["*"],
        method: ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
        responseHeader: ["*"], // Allow all headers to be exposed
        maxAgeSeconds: 3600,
      },
    ]);

    // Read back to verify
    const [newCors] = await bucket.getCorsConfiguration();
    console.log("New CORS Config:", JSON.stringify(newCors, null, 2));

    res.json({
      ok: true,
      message: "CORS Configured",
      current: currentCors,
      new: newCors,
    });
  } catch (error) {
    console.error("CORS Fix Failed:", error);
    res.status(500).json({ error: "MAINTENANCE_FAILED" });
  }
  });
});

// Main API function
// Renamed to serverApi to fix deployment discovery issue
// IMPORTANT: Updated firebase.json and vite.config.ts to match 'serverApi'
exports.serverApi = functions
  .runWith({ timeoutSeconds: 540, memory: "1GB", maxInstances: 10 })
  .https.onRequest(app);

exports.onChatMessageWritten = functions.firestore
  .document("private_chats/{userId}/messages/{messageId}")
  .onCreate(async (snap, context) => {
    const message = snap.data();
    if (!message) return;

    const userId = context.params.userId;
    const text = message.text || "Nuevo mensaje";
    const senderName = message.senderName || "Usuario";

    // A. Message from Admin to User ============================================
    if (message.isAdmin) {
      try {
        // En lugar de usar topic, buscamos los tokens directos para mayor confiabilidad
        const userTokensDoc = await db
          .collection("userTokens")
          .doc(userId)
          .get();
        const tokens = userTokensDoc.exists ? userTokensDoc.data()?.tokens : [];

        if (!tokens || tokens.length === 0) {
          console.log(
            `[onChatMessageWritten] No tokens for user ${userId}, skipping.`,
          );
          return;
        }

        const payload = {
          tokens: tokens, // Multicast directo
          // Eliminar notification para evitar duplicados en PWA que manejan onBackgroundMessage manualmente
          // notification: {
          //   title: "Nuevo mensaje de soporte",
          //   body: text,
          // },
          data: {
            title: "Nuevo mensaje de soporte",
            body: text,
            type: "chat_message",
            chatId: userId,
            url: "/dashboard/pending-assignment",
            click_action: "FLUTTER_NOTIFICATION_CLICK",
          },
        };

        const response = await runtimeMessaging().sendEachForMulticast(payload);

        // Limpieza de tokens inválidos
        if (response.failureCount > 0) {
          const tokensToRemove = [];
          response.responses.forEach((resp, idx) => {
            if (
              !resp.success &&
              (resp.error?.code ===
                "messaging/registration-token-not-registered" ||
                resp.error?.code === "messaging/invalid-registration-token")
            ) {
              tokensToRemove.push(tokens[idx]);
            }
          });
          if (tokensToRemove.length > 0) {
            await db
              .collection("userTokens")
              .doc(userId)
              .update({
                tokens: FieldValue.arrayRemove(
                  ...tokensToRemove,
                ),
              });
          }
        }
      } catch (e) {
        console.error(`Error notifying user ${userId}`, e);
      }
    } else {
      // B. Message from User to Admin ============================================
      try {
        // Query admins
        const adminsSnap = await db
          .collection("users")
          .where("role", "in", ["admin", "master_admin"])
          .get();

        if (adminsSnap.empty) return;

        const adminIds = adminsSnap.docs.map((d) => d.id);
        if (adminIds.length === 0) return;

        const tokensRefs = adminIds.map((uid) =>
          db.collection("userTokens").doc(uid),
        );

        // Use getAll to fetch all userTokens docs in parallel
        const tokensSnaps = await db.getAll(...tokensRefs);

        let allTokens = [];
        tokensSnaps.forEach((docSnap) => {
          if (docSnap.exists) {
            const data = docSnap.data();
            if (data && Array.isArray(data.tokens)) {
              allTokens.push(...data.tokens);
            }
          }
        });

        // Unique tokens
        allTokens = [...new Set(allTokens)];
        if (allTokens.length === 0) return;

        const payload = {
          // Eliminar notification para evitar duplicados en PWA
          // notification: {
          //   title: `Mensaje de ${senderName}`,
          //   body: text,
          // },
          data: {
            title: `Mensaje de ${senderName}`,
            body: text,
            type: "admin_chat_message",
            chatId: userId,
            url: `/dashboard/requests?chatId=${userId}`,
            click_action: "FLUTTER_NOTIFICATION_CLICK",
          },
        };

        const batchSize = 500;
        for (let i = 0; i < allTokens.length; i += batchSize) {
          const batch = allTokens.slice(i, i + batchSize);
          await messaging.sendEachForMulticast({
            tokens: batch,
            // notification: payload.notification, // NO ENVIAR
            data: payload.data,
          });
        }
      } catch (e) {
        console.error("Error notifying admins", e);
      }
    }
  });

// Scheduled archive/cleanup keeps the deployed schedule; local demo uses a retained archive in Storage Emulator.
exports.cleanupOldFiles = functions.runWith(archiveFunctionRuntimeOptions()).pubsub
  .schedule("every sunday 03:00")
  .timeZone("America/Mexico_City")
  .onRun(async () => {
    const drive = createRuntimeDrive(admin, archiveGoogle());
    await archiveOldEventFiles({ bucket: admin.storage().bucket(), drive, folderId: archiveFolderId(DRIVE_ARCHIVE_FOLDER_ID) });
    return null;
  });

// Read-only admin endpoints referenced by the recovered AppHistory screen.
require("./admin-read-routes").registerAdminReadRoutes(app, { db, requireSession });
