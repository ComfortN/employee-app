var admin = require("firebase-admin");

var serviceAccount = require("../employee-management-cdc1d-firebase-adminsdk-rm8pl-890d28a8f2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports = admin;