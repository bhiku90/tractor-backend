const db = require("../config/firebase");

/** Returns the customers collection ref scoped to a firm. */
const col = (firmId) =>
  db.collection("firms").doc(firmId).collection("customers");

const Customer = {
  create: async (firmId, data) => {
    const docRef = await col(firmId).add({
      name: data.name,
      mobile: data.mobile,
      createdAt: new Date().toISOString(),
    });
    return { id: docRef.id, name: data.name, mobile: data.mobile };
  },

  getAll: async (firmId) => {
    const snapshot = await col(firmId).orderBy("name", "asc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  update: async (firmId, id, data) => {
    await col(firmId).doc(id).update({ name: data.name, mobile: data.mobile });
    return { id, name: data.name, mobile: data.mobile };
  },

  delete: async (firmId, id) => {
    await col(firmId).doc(id).delete();
  },

  findByMobile: async (firmId, mobile, excludeId = null) => {
    const snapshot = await col(firmId).where("mobile", "==", mobile).get();
    const docs = snapshot.docs.filter((d) => d.id !== excludeId);
    return docs.length > 0 ? { id: docs[0].id, ...docs[0].data() } : null;
  },
};

module.exports = Customer;
