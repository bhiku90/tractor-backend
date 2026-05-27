const db = require("../config/firebase");

const Customer = {
  create: async (data) => {
    const docRef = await db.collection("customers").add({
      name: data.name,
      mobile: data.mobile,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, ...data };
  },

  getAll: async () => {
    const snapshot = await db
      .collection("customers")
      .orderBy("name", "asc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  update: async (id, data) => {
    await db.collection("customers").doc(id).update({
      name: data.name,
      mobile: data.mobile,
    });
    return { id, name: data.name, mobile: data.mobile };
  },

  delete: async (id) => {
    await db.collection("customers").doc(id).delete();
  },

  findByMobile: async (mobile, excludeId = null) => {
    const snapshot = await db
      .collection("customers")
      .where("mobile", "==", mobile)
      .get();
    const docs = snapshot.docs.filter((d) => d.id !== excludeId);
    return docs.length > 0 ? { id: docs[0].id, ...docs[0].data() } : null;
  },
};

module.exports = Customer;
