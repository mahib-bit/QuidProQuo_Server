const { initializeApp, cert } = require('firebase-admin/app');

const serviceAccount = require('../firebasekey.json');


//=========================Firebase Admin Initialization=========================

const firebaseAdmin = initializeApp({

    credential: cert(serviceAccount)

});


//=========================Export Firebase Admin=========================

module.exports = firebaseAdmin;