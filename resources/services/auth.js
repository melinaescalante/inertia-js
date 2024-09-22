import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";


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
