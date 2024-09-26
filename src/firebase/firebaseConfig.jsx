


import firebase from 'firebase/compat/app';

import 'firebase/compat/firestore';
import 'firebase/compat/storage';


import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'


const app = firebase.initializeApp({

    apiKey: "AIzaSyCjqookaK8rIjkwvFhLp4mLULO_BQ6-GBM",
    authDomain: "realcontrol-31b06.firebaseapp.com",
    projectId: "realcontrol-31b06",
    storageBucket: "realcontrol-31b06.appspot.com",
    messagingSenderId: "630118428029",
    appId: "1:630118428029:web:c27e90db601c10cb54b014"
  
});


export const firestoreDB  = getFirestore(app)
export const storageDocs = getStorage(app)
