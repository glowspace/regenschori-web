// /plugins/firebase.js
import firebase from 'firebase/app';
import 'firebase/auth';
import Vue from 'vue';

var firebaseConfig = {
    apiKey: 'AIzaSyC3jFunEGoCxoGdmp6wPfy8sJikU5Dxvwc',
    authDomain: 'proscholycz.firebaseapp.com',
    databaseURL: 'https://proscholycz.firebaseio.com',
    projectId: 'proscholycz',
    storageBucket: 'proscholycz.appspot.com',
    messagingSenderId: '1053312555544',
    appId: '1:1053312555544:web:dc55041abb9e3790f1c16d',
    measurementId: 'G-862RGQNMEW'
};

let app = null;
if (!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig);
}

// to be accessed in .Vue files via   this.$auth
Vue.prototype.$auth = firebase.auth();

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();
