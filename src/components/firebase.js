import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDdnWo2Eg_yo6DoYsrm3h4kMQBCPHeJ6us",
    authDomain: "autosphere-bda4f.firebaseapp.com",
    projectId: "autosphere-bda4f",
    storageBucket: "autosphere-bda4f.appspot.com",
    messagingSenderId: "163382579391",
    appId: "1:163382579391:web:1d94e874975d91e9b0760a",
    measurementId: "G-GYS6FL31PY"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export { storage };