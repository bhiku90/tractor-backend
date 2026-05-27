const db = require("../config/firebase");

/** Returns the works sub-collection ref scoped to a firm + customer. */
const col = (firmId, customerId) =>
  db
    .collection("firms")
    .doc(firmId)
    .collection("customers")
    .doc(customerId)
    .collection("works");

const Work = {
  _calc: (category, data) => {
    const advancedPaid = parseFloat(data.advancedPaid) || 0;
    let finalAmount = 0;
    let extra = {};

    if (category === "trailer") {
      const trips = parseFloat(data.trips) || 0;
      const ratePerTrip = parseFloat(data.ratePerTrip) || 0;
      finalAmount = parseFloat((trips * ratePerTrip).toFixed(2));
      extra = { trips, ratePerTrip };
    } else if (category === "thresher") {
      const sacks = parseFloat(data.sacks) || 0;
      const ratePerSack = parseFloat(data.ratePerSack) || 0;
      finalAmount = parseFloat((sacks * ratePerSack).toFixed(2));
      extra = { sacks, ratePerSack };
    } else {
      const acres = parseFloat(data.acres) || 0;
      const gunthas = parseFloat(data.gunthas) || 0;
      const totalArea = acres + gunthas / 40;
      const charges = parseFloat(data.charges) || 0;
      finalAmount = parseFloat((totalArea * charges).toFixed(2));
      extra = { acres, gunthas, area: totalArea, charges };
    }

    const balanceDue = parseFloat((finalAmount - advancedPaid).toFixed(2));
    return {
      ...extra,
      finalAmount,
      advancedPaid,
      balanceDue,
      isPaid: data.isPaid === true || balanceDue <= 0,
    };
  },

  create: async (firmId, customerId, data) => {
    const category = data.category || "farming";
    const calcFields = Work._calc(category, data);
    const docData = {
      category,
      workName: data.workName || category,
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      ...calcFields,
    };
    const docRef = await col(firmId, customerId).add(docData);
    return {
      id: docRef.id,
      finalAmount: calcFields.finalAmount,
      balanceDue: calcFields.balanceDue,
    };
  },

  getByCustomer: async (firmId, customerId) => {
    const snapshot = await col(firmId, customerId)
      .orderBy("date", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  update: async (firmId, customerId, workId, data) => {
    const category = data.category || "farming";
    const calcFields = Work._calc(category, data);
    const updateData = {
      category,
      workName: data.workName || category,
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      ...calcFields,
    };
    await col(firmId, customerId).doc(workId).update(updateData);
    return {
      finalAmount: calcFields.finalAmount,
      balanceDue: calcFields.balanceDue,
    };
  },

  delete: async (firmId, customerId, workId) => {
    await col(firmId, customerId).doc(workId).delete();
  },

  togglePaidStatus: async (firmId, customerId, workId, status) => {
    await col(firmId, customerId).doc(workId).update({ isPaid: status });
  },
};

module.exports = Work;
