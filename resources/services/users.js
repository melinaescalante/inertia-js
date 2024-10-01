import { db } from "./firebase";
import { doc, getDoc, updateDoc,setDoc} from "firebase/firestore";
/**
 * Funcion que en base al id de un usuario nos permite tarer el display name actualizado de cada usuario.
 * @param {id:string} dataUser
 * @returns { displayName: string}
 */
export async function getNameUser(id){
    try {
      const userRef = doc(db, 'users', id);
      const userSnapshot = await getDoc(userRef);
      const name = await userSnapshot.data().email
      return name

    } catch (error) {
      console.log("Documento no existente");
  
    }
  }