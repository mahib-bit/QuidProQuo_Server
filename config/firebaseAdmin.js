const { initializeApp, cert } = require('firebase-admin/app');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


//=========================Firebase Admin Initialization=========================

const firebaseAdmin = initializeApp({

    credential: cert(serviceAccount)

});


//=========================Export Firebase Admin=========================

module.exports = firebaseAdmin;