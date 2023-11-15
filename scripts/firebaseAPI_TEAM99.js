//----------------------------------------
//  Your web app's Firebase configuration
//----------------------------------------
var firebaseConfig = {

    apiKey: "AIzaSyBpZY5rT4U2ZzKsXsIVn5-s9r5C1azmvbk",
    authDomain: "bby05-330cd.firebaseapp.com",
    projectId: "bby05-330cd",
    storageBucket: "bby05-330cd.appspot.com",
    messagingSenderId: "874068680663",
    appId: "1:874068680663:web:014334e78533b3639c7592",
    measurementId: "G-SXFVFYLHTS"

};

//--------------------------------------------
// initialize the Firebase app
// initialize Firestore database if using it
//--------------------------------------------
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();    // Creates new database for us. "db".
const storage = firebase.storage();