importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyD2d3okp9JxPohM4Xbmu-Oi1HBeIEuqBUk",
    authDomain: "smart-device-dashboard-b1ea0.firebaseapp.com",
    projectId: "smart-device-dashboard-b1ea0",
    storageBucket: "smart-device-dashboard-b1ea0.firebasestorage.app",
    messagingSenderId: "146660949506",
    appId: "1:146660949506:web:f6000362c8ea0a413ff11b",
    measurementId: "G-949MRTPQCC"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/assets/icons/icon-128x128.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
