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
      const name = await userSnapshot.data().displayName?userSnapshot.data().displayName:userSnapshot.data().email
      return name

    } catch (error) {
      console.log("Documento no existente");
  
    }
  }

  /**
 *Actualizamos los datos del usuario.
 *Su nombre, biografía y carrera.
 * @param {{id:string}} Id
 * @param {{displayName:string, carrer:string}} DatosUsuario
 * @returns {}
 */
export async function updateUserProfile(id, { displayName, bio }) {
    
  const profileRef = doc(db, 'users', id);

  await updateDoc(profileRef, {
      displayName,
      bio,

  });
}
/**
 * Traemos la informacion del usuario para su vista de perfil, ya sea el logueado o uno de la comunidad ya registrado
 * @param {{id:string, email:string}} data
 * @returns {{id: string, email: string, displayName: string, bio: string, career: string}|{email: string, bio: string, career: string}}
 */
export async function getUsersProfileById(id,email) {
  try {
      
      const profileRef = doc(db, `/users/${id}`)
      const profileDocument = await getDoc(profileRef)
      if (profileDocument.exists()) {
          return {
              id: profileDocument.id,
              email: profileDocument.data().email,
              displayName: profileDocument.data().displayName,
              bio: profileDocument.data().bio,
          }
          
      } else  {
  
          await setDoc(doc(db, 'users', id), {
            email: email,
            bio:null,
          
          });
          return { id, email, bio: null}; 
      }
  } catch (error) {
   console.log('Hubo un error al traer el perfil', error)   
  }

}