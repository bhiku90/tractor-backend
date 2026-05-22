const db = require("../config/firebase");

const Driver = {
  create: async (data) => {
    const docRef = await db.collection("drivers").add({
      name: data.name,
      mobile: data.mobile || "",
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, name: data.name, mobile: data.mobile || "" };
  },

  getAll: async () => {
    const snapshot = await db
      .collection("drivers")
      .orderBy("name", "asc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  update: async (id, data) => {
    await db.collection("drivers").doc(id).update({
      name: data.name,
      mobile: data.mobile || "",
    });
    return { id, name: data.name, mobile: data.mobile || "" };
  },

  delete: async (id) => {
    await db.collection("drivers").doc(id).delete();
  },

  // ── Payments ──────────────────────────────────────────────────────────
  addPayment: async (driverId, data) => {
    const docRef = await db
      .collection("drivers")
      .doc(driverId)
      .collection("payments")
      .add({
        date: data.date || new Date().toISOString(),
        amount: parseFloat(data.amount) || 0,
        note: data.note || "",
        createdAt: new Date().toISOString(),
      });
    return { id: docRef.id, date: data.date, amount: parseFloat(data.amount) || 0, note: data.note || "" };
  },

  getPayments: async (driverId) => {
    const snapshot = await db
      .collection("drivers")
      .doc(driverId)
      .collection("payments")
      .orderBy("date", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  deletePayment: async (driverId, paymentId) => {
    await db
      .collection("drivers")
      .doc(driverId)
      .collection("payments")
      .doc(paymentId)
      .delete();
  },
};

module.exports = Driver;
