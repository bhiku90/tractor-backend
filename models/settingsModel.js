const db = require("../config/firebase");

const REF = db.collection("settings").doc("app");

const Settings = {
  /** Read the single app-settings document. Returns {} if it doesn't exist yet. */
  get: async () => {
    const snap = await REF.get();
    return snap.exists ? snap.data() : {};
  },

  /** Merge-update the document (creates it if absent). */
  set: async (data) => {
    await REF.set({ ...data, updatedAt: new Date().toISOString() }, { merge: true });
  },

  /** Append one work-type object to the customWorkTypes array. */
  addWorkType: async (workType) => {
    const snap = await REF.get();
    const current = snap.exists ? snap.data().customWorkTypes || [] : [];
    const updated = [...current, workType];
    await REF.set({ customWorkTypes: updated, updatedAt: new Date().toISOString() }, { merge: true });
    return updated;
  },

  /** Remove a work-type by its value key. */
  deleteWorkType: async (value) => {
    const snap = await REF.get();
    const current = snap.exists ? snap.data().customWorkTypes || [] : [];
    const updated = current.filter((w) => w.value !== value);
    await REF.set({ customWorkTypes: updated, updatedAt: new Date().toISOString() }, { merge: true });
    return updated;
  },
};

module.exports = Settings;
