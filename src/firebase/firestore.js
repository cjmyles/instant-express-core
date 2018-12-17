import admin from 'firebase-admin';

export default config => {
  const db = admin.firestore();
  const settings = { /* your settings... */ timestampsInSnapshots: true };
  db.settings(settings);
  return db;
};
