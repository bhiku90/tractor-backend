const db = require('../config/firebase');

const Service = {
  create: async (data) => {
    const docRef = await db.collection('services').add({
      customerName: data.customerName,
      appliance: data.appliance,
      hours: parseFloat(data.hours),
      rate: parseFloat(data.rate),
      totalCost: parseFloat(data.hours) * parseFloat(data.rate),
      createdAt: new Date().toISOString()
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() };
  },

  getAll: async () => {
    const snapshot = await db.collection('services').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

module.exports = Service;