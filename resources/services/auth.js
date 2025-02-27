import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { getFileURL, uploadFile } from "./file-storage";

import { updateUserProfile, getUsersProfileById } from "./users";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { singWatchedSeries } from "./series";
let loginUser = {
  id: null,
  email: null,
  displayName: null,
  username: null,
  bio: null,
  genres: null,
  photoURL: null,
  lastSeriesWatched:  null,
  seriesToWatch: null,

  following: null,

}
if (localStorage.getItem('user')) {
  loginUser = JSON.parse(localStorage.getItem('user'))
}
if (localStorage.getItem('people')) {
  loginUser.following = JSON.parse(localStorage.getItem('people'))
} 
if (localStorage.getItem('ids_series_watching')) {
  loginUser.lastSeriesWatched = JSON.parse(localStorage.getItem('ids_series_watching'))
} 
if (localStorage.getItem('ids_series_wishlist')) {
  loginUser.seriesToWatch = JSON.parse(localStorage.getItem('ids_series_wishlist'))
} 
let observers = []
onAuthStateChanged(auth, user => {
  if (user) {
    authBackend(user.uid);
    singWatchedSeries
    (user.uid);

    updateLoginUser({
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    })
    getUsersProfileById(user.uid, user.email, user.displayName)
      .then(userProfile => {
        updateLoginUser({
          ...loginUser,
          username: userProfile.username,
          bio: userProfile.bio,
          genres: userProfile.genres,

        })
      })
  } else {
    logoutBackend();
    updateLoginUser({
      id: null,
      email: null,
      displayName: null,
      username: null,
      bio: null,
      genres: null,
      photoURL: null,
      lastSeriesWatched: null,
      seriesToWatch:null,
      following: null,
    })
    localStorage.removeItem("user")
  }
  //Se cambiaron datos del login user

})

export async function editMyProfilePhoto(photo) {
  try {
    const filePath = `users/${loginUser.id}/mifotodeperfil`;
    await uploadFile(filePath, photo);

    const photoURL = await getFileURL(filePath);
    const promiseAuth = updateProfile(auth.currentUser, { photoURL });

    const promiseFirestore = updateUserProfile(loginUser.id, { photoURL });

    await Promise.all([promiseAuth, promiseFirestore]);
    updateLoginUser({ photoURL });
  } catch (error) {
    console.log("Error updating photo URL:", error);
  }
}

/**
 *
 * @param {{displayName: string, bio: string}}DataProfile
 * @returns {Promise<null>}
 */
export async function editProfile({ displayName, bio, genres }) {

  try {
    const promiseAuth = updateProfile(auth.currentUser, { displayName })
    const promiseProfile = await updateUserProfile(loginUser.id, { displayName, bio, genres })
    await Promise.all([promiseAuth, promiseProfile])
    updateLoginUser({
      ...loginUser,
      displayName,
      bio,
      genres: genres
    })
  } catch (error) {
    console.log(error)
  }
}

async function authBackend(id) {
  try {
    const response = await fetch('/asignarAuth', {
      method: 'post',
      body: JSON.stringify({ id, _token: document.body.dataset.csrf }),
      headers: {
        "Content-Type": 'application/json',
        "X-Requested-With": 'XMLHttpRequest',
      },
      credentials: "include",
    });
    const json = await response.json();
    return json.success;
  } catch (error) {
    console.error('Error al notificar al backend de la autenticación.');
  }
}

async function logoutBackend() {
  try {
    const response = await fetch('/cerrarSesion', {
      method: 'post',
      body: JSON.stringify({ _token: document.body.dataset.csrf }),
      headers: {
        "Content-Type": 'application/json',
        "X-Requested-With": 'XMLHttpRequest',
      },
      credentials: "include",
    });
    const json = await response.json();
    return json.success;
  } catch (error) {
    console.error('Error al notificar al backend de la autenticación.');
  }
}

export async function login({ email, password }) {
  // 1.Instancia de Autenticacion
  // 2.Email
  // 3.Password
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
}
export async function isUsernameUnique(username) {
  try {
    const usersCollectionRef = collection(db, `users`);
    const q = query(usersCollectionRef, where('username', '==', username))
    const userSnapshot = await getDocs(q);
    return userSnapshot.empty ? true : false

  } catch (error) {
    console.error(error)
  }
}
export async function signUp({ email, password, userName, fullname }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    //codigo funcional sin username correcto

    await updateProfile(userCredential.user, { displayName: fullname });

    const userData = {
      displayName: userName || "Usuario sin nombre",
      username: userName,
      email: email,
      bio: null,
      seriesToWatch: null,
      lastSeriesWatched: null,
      genres: null,
      photoURL: null,
    };

    // // Guardar los datos del usuario en Firestore
    await updateUserProfile(userCredential.user.uid, userData);

    updateLoginUser({
      id: userCredential.user.uid,
      email: userCredential.user.email,
      ...userData,
    });

  } catch (error) {

    throw error;
  }
}
export async function logout() {
  try {
    await signOut(auth)
    localStorage.clear()
    // loginUser.lastSeriesWatched=null
    // loginUser.seriesToWatch=null
  } catch (error) {
    throw error;
  }
}

/**
 *
 * @param {Function} callback
 */
export function suscribeToAuthChanged(callback) {
  observers.push(callback)
  notify(callback)
  return () => {
    observers = observers.filter(obs => obs !== callback);
  }
}
/**
 * Ejecuta el callback pasándole una copia de los datos del usuario
 * autenticado.
 *
 * @param {Function} callback
 */
export async function notify(callback) {
  callback({ ...loginUser })
}
export async function notifyAll() {
  observers.forEach(callback => notify(callback))
}
export async function updateLoginUser(newData) {
  loginUser = {
    ...loginUser,
    ...newData
  }
  localStorage.setItem('user', JSON.stringify(loginUser))
  notifyAll()
}
