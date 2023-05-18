import firebase from "firebase/compat/app";
require('firebase/compat/auth');
require("firebase/compat/database");
require('firebase/compat/storage');

const firebaseConfig = {
    apiKey: "AIzaSyCpzLvJcN1K9PbTVfaIljUbJT1i2UHC2gA",
    authDomain: "famwico.firebaseapp.com",
    projectId: "famwico",
    storageBucket: "famwico.appspot.com",
    messagingSenderId: "886127684203",
    appId: "1:886127684203:web:b15d77c8892dd18f4f5f2e",
    measurementId: "G-N103T1QHD9",
    databaseURL: "https://famwico-default-rtdb.firebaseio.com/"
  };

  firebase.initializeApp(firebaseConfig); 
  const auth = firebase.auth();
  const db=firebase.database();
  const storage=firebase.storage();

  export {auth,storage};
  export default db; 