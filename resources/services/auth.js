import { signInWithEmailAndPassword, createUserWithEmailAndPassword, applyActionCode, onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth } from "./firebase";
import { updateUserProfile, getUsersProfileById } from "./users";

let loginUser = {
  id: null,
  email: null,
  displayName: null,
  bio: null,
  genres: null
}
let observers = []
if (localStorage.getItem('user')) {
  loginUser = JSON.parse(localStorage.getItem('user'))
}
onAuthStateChanged(auth, user => {
  if (user) {
    updateLoginUser({
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
    })
    getUsersProfileById(user.uid, user.email)
      .then(userProfile => {
        updateLoginUser({
          ...loginUser,
          bio: userProfile.bio,
          genres: userProfile.genres
        })
      })
  } else {
    updateLoginUser({
      id: null,
      email: null,
      displayName: null,
      bio: null,
      genres: null
    })
    localStorage.removeItem("user")
  }
  //Se cambiaron datos del login user

})
/**
 * 
 * @param {{displayName: string, bio: string}}DataProfile
 * @returns {Promise<null>}
 */
export async function editProfile({ displayName, bio, genres }) {

  try {
    await updateProfile(auth.currentUser, { displayName })
    await updateUserProfile(loginUser.id, { displayName, bio, genres })
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

export async function signUp({ email, password }) {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
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
