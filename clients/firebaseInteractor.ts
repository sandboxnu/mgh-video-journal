import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDV3FObRh1ylPJkgowm1eXQw4XIykKkbDQ",
  authDomain: "mgh-video-journal.firebaseapp.com",
  projectId: "mgh-video-journal",
  storageBucket: "mgh-video-journal.appspot.com",
  messagingSenderId: "253050399833",
  appId: "1:253050399833:web:093bc484f3816d35fd9548",
  measurementId: "G-TVJY0CJ7CV",
};

if (firebase.apps.length == 0) {
  firebase.initializeApp(firebaseConfig);
}

export const signIn = async (email: string): Promise<void> => {
  await firebase.auth().signInAnonymously();
};

export const uploadFileToFirebase = async (
  name: string,
  fileURI: string
): Promise<void> => {
  let file = await fetch(fileURI);
  firebase
    .storage()
    .ref(`extra-check/${name}`)
    .put(await file.blob());
};

export const uploadJSONToFirebase = async (
  name: string,
  object: Object
): Promise<void> => {
  const json = JSON.stringify(object);
  const blob = new Blob([json], { type: "application/json" });
  await firebase.storage().ref(`extra-check/${name}`).put(blob);
};
