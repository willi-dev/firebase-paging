import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyDdPKeAue0qqpDMj7sbqGY9IgRolAe_FkI",
  authDomain: "willicv-8d052.firebaseapp.com",
  databaseURL: "https://willicv-8d052.firebaseio.com",
  projectId: "willicv-8d052",
  storageBucket: "willicv-8d052.appspot.com",
  messagingSenderId: "323654850234"
}

const firebaseConfig = firebase.initializeApp(config);
const auth = firebase.auth();

export {
  firebaseConfig, auth
}