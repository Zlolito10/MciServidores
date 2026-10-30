import { E as collection, I as query, K as where, w as getDocs, H as onSnapshot } from '../vendor/vendor-firebase-BjYbfC3F.js';
import { firebaseAuth } from '../firebase/client.js';
import { assignmentScope, assignmentScopeKey, assignmentView, createAssignmentReader, projectAssignmentRoster } from './assignment-privacy.js';
const scope = (profile) => assignmentScope(firebaseAuth.currentUser?.uid, profile);
const reader = createAssignmentReader({ collection, query, where, getDocs, onSnapshot }, scope);
export const trackedAssignmentCollection = reader.collection;
export const trackedAssignmentQuery = reader.query;
export const trackedAssignmentWhere = reader.where;
export const readScopedAssignments = reader.getDocs;
export const watchScopedAssignments = reader.onSnapshot;
export const assignmentPrivacyKey = (profile) => assignmentScopeKey(scope(profile));
export const assignmentManagedAreas = (profile) => scope(profile).areaIds;
export const prepareAssignmentView = (rows, profile, users, areas) => assignmentView(rows, assignmentScope(firebaseAuth.currentUser?.uid || profile?.uid, profile), users, areas);
export function watchAssignmentView(source, profile, next, error) {
  reader.register(source);
  let roster = [], full = [], closed = false;
  const emit = () => { if (!closed) next([...new Map([...roster, ...full].map((row) => [row.id, row])).values()]); };
  const stopRoster = onSnapshot(collection(source.parent, 'assignment_roster'), (snapshot) => { roster = snapshot.docs.map((doc) => ({ ...projectAssignmentRoster({ ...doc.data(), id: doc.id }), attendanceVisible: false })); emit(); }, error);
  const stopFull = reader.onSnapshot(source, profile, (snapshot) => { full = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id, attendanceVisible: true })); emit(); }, error);
  return () => { closed = true; stopRoster(); stopFull(); };
}
