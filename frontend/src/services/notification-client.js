// New recovery wiring; all notification requests stay on the current application origin.
import { firebaseAuth } from '../firebase/client.js';
import { bffFetch, isBffEnabled } from '../app/runtime.jsx';
import { createNotificationRequest, requireFirebaseUid } from './authenticated-request.js';

export const sendNotification = createNotificationRequest({ auth: firebaseAuth, requestJson: bffFetch, allowSession: isBffEnabled });
export const getCommandAuthor = () => requireFirebaseUid(firebaseAuth);
