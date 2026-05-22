const db = require("../config/firebase");

const Work = {
  // Internal helper — calculates fields based on category
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
      // farming (default — backward compatible)
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

  create: async (customerId, data) => {
    const category = data.category || "farming";
    const calcFields = Work._calc(category, data);

    const docData = {
      category,
      workName:
        data.workName ||
        (category === "trailer"
          ? "Trailer"
          : category === "thresher"
            ? "Thresher"
            : "Farming"),
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      ...calcFields,
    };

    const docRef = await db
      .collection("customers")
      .doc(customerId)
      .collection("works")
      .add(docData);

    return {
      id: docRef.id,
      finalAmount: calcFields.finalAmount,
      balanceDue: calcFields.balanceDue,
    };
  },

  getByCustomer: async (customerId) => {
    const snapshot = await db
      .collection("customers")
      .doc(customerId)
      .collection("works")
      .orderBy("date", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  update: async (customerId, workId, data) => {
    const category = data.category || "farming";
    const calcFields = Work._calc(category, data);

    const updateData = {
      category,
      workName:
        data.workName ||
        (category === "trailer"
          ? "Trailer"
          : category === "thresher"
            ? "Thresher"
            : "Farming"),
      description: data.description || "",
      date: data.date || new Date().toISOString(),
      ...calcFields,
    };

    await db
      .collection("customers")
      .doc(customerId)
      .collection("works")
      .doc(workId)
      .update(updateData);

    return {
      finalAmount: calcFields.finalAmount,
      balanceDue: calcFields.balanceDue,
    };
  },

  delete: async (customerId, workId) => {
    await db
      .collection("customers")
      .doc(customerId)
      .collection("works")
      .doc(workId)
      .delete();
  },

  togglePaidStatus: async (customerId, workId, status) => {
    await db
      .collection("customers")
      .doc(customerId)
      .collection("works")
      .doc(workId)
      .update({ isPaid: status });
  },
};

module.exports = Work;
