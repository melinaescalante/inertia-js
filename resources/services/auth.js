import { signInWithEmailAndPassword, createUserWithEmailAndPassword, applyActionCode,onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
let loginUser = {
  id: null,
  email: null,
  displayName: null,
  
}
let observers = []
onAuthStateChanged(auth, async user => {
  if (user) {
    loginUser = {
      id: user.uid,
      email: user.email,
      displayName: user.displayName
    }
   
    // getUsersProfileById(user.uid, user.email)
    //   .then(userProfile => {
    //     console.log(user.uid, user.email)
    //     loginUser = {
    //       ...loginUser,
    //       // bio: userProfile.bio,
    //       // carrer: userProfile.carrer,
    //       // fullyLoaded: true
    //     }
        notifyAll();
      // })
  } else {
    loginUser = {
      id: null,
      email: null,
      displayName: null,
      // bio: null,
      // career: null,
      // fullyLoaded: false,
    }
  }
  //Se cambiaron datos del login user
  notifyAll()
})
export async function login({ email, password }) {
  // 1.Instancia de Autenticacion
  // 2.Email
  // 3.Password
  try {
    const user= await signInWithEmailAndPassword(auth, email, password);
 
    console.log(user)
  } catch (error) {
    throw error;
  }
}

export async function signUp({email,password}){
  try {
    const user= await createUserWithEmailAndPassword(auth, email, password);
 
    console.log(user)
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
export async function suscribeToAuthChanged(callback) {
  observers.push(callback)
  notify(callback)
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



