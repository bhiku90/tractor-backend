const db = require('../config/firebase');

const Customer = {
  create: async (data) => {
    const docRef = await db.collection('customers').add({
      name: data.name,
      mobile: data.mobile,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  },

  getAll: async () => {
    const snapshot = await db.collection('customers').orderBy('name', 'asc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

module.exports = Customer;