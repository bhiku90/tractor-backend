const db = require("../config/firebase");

const Firm = {
  /** Create a new firm. Firestore auto-generates the firmId. */
  create: async (data) => {
    const docRef = await db.collection("firms").add({
      firmNameEn:       data.firmNameEn || "",
      firmNameMr:       data.firmNameMr || "",
      customWorkTypes:  [],
      createdAt:        new Date().toISOString(),
    });
    return { firmId: docRef.id, firmNameEn: data.firmNameEn, firmNameMr: data.firmNameMr };
  },

  /** Read a firm document. Returns null when not found. */
  get: async (firmId) => {
    const snap = await db.collection("firms").doc(firmId).get();
    if (!snap.exists) return null;
    return { firmId: snap.id, ...snap.data() };
  },

  /** Merge-update firm fields (name, customWorkTypes, …). */
  update: async (firmId, data) => {
    await db.collection("firms").doc(firmId).set(
      { ...data, updatedAt: new Date().toISOString() },
      { merge: true },
    );
  },

  addWorkType: async (firmId, workType) => {
    const snap = await db.collection("firms").doc(firmId).get();
    const current = snap.exists ? (snap.data().customWorkTypes || []) : [];
    const updated = [...current, workType];
    await db.collection("firms").doc(firmId).set(
      { customWorkTypes: updated, updatedAt: new Date().toISOString() },
      { merge: true },
    );
    return updated;
  },

  deleteWorkType: async (firmId, value) => {
    const snap = await db.collection("firms").doc(firmId).get();
    const current = snap.exists ? (snap.data().customWorkTypes || []) : [];
    const updated = current.filter((w) => w.value !== value);
    await db.collection("firms").doc(firmId).set(
      { customWorkTypes: updated, updatedAt: new Date().toISOString() },
      { merge: true },
    );
    return updated;
  },
};

module.exports = Firm;
