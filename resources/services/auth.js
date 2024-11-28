import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { getFileURL, uploadFile } from "./file-storage";

import { updateUserProfile, getUsersProfileById } from "./users";

let loginUser = {
  id: null,
  email: null,
  displayName: null,
  bio: null,
  genres: null,
  photoURL: null
}
if (localStorage.getItem('user')) {
  loginUser = JSON.parse(localStorage.getItem('user'))
}
let observers = []
onAuthStateChanged(auth, user => {
  if (user) {
    console.log(user)
    authBackend(user.uid);
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
          bio: userProfile.bio,
          genres: userProfile.genres
        })
      })
  } else {
    logoutBackend();
    updateLoginUser({
      id: null,
      email: null,
      displayName: null,
      bio: null,
      genres: null,
      photoURL: null
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
    console.log("New photo URL:", photoURL);
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

    console.log(user)
  } catch (error) {
    throw error;
  }
}

export async function signUp({ email, password, userName, fullname }) {
// export async function signUp({ email, password, userName }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//codigo funcional sin username correcto

    // await updateProfile(userCredential.user, { displayName: userName });

    await updateProfile(userCredential.user, { displayName: fullname });

    // const userData = {
    //   displayName: userName || "Usuario sin nombre", // 
    //   email: email,
    //   bio: null,
    //   genres: null,
    //   photoURL: null,
    // };
    const userData = {
      displayName: userName || "Usuario sin nombre", 
    username:userName,
      email: email,
      bio: null,
      genres: null,
      photoURL: null,
    };

    // Guardar los datos del usuario en Firestore
    await updateUserProfile(userCredential.user.uid, userData);

    updateLoginUser({
      id: userCredential.user.uid,
      email: userCredential.user.email,
      ...userData,
    });

  } catch (error) {
    console.error("Error en el registro del usuario:", error);
    throw error;
  }
}
export async function logout() {
  try {
    await signOut(auth)
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
