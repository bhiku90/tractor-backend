const db = require('../config/firebase');

const Work = {
  create: async (customerId, data) => {
    const finalAmount = parseFloat(data.area) * parseFloat(data.charges);
    const docRef = await db.collection('customers').doc(customerId).collection('works').add({
      workName: data.workName,
      area: parseFloat(data.area),
      charges: parseFloat(data.charges),
      finalAmount: finalAmount,
      isPaid: data.isPaid === true,
      date: new Date().toISOString()
    });
    return { id: docRef.id, finalAmount };
  },

  getByCustomer: async (customerId) => {
    const snapshot = await db.collection('customers').doc(customerId).collection('works').orderBy('date', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },
  togglePaidStatus: async (customerId, workId, status) => {
    await db.collection('customers').doc(customerId)
            .collection('works').doc(workId).update({ isPaid: status });
  }
};

module.exports = Work;