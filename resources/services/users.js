import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, getDocs, query, where, onSnapshot } from "firebase/firestore";
/**
 * Funcion que en base al id de un usuario nos permite tarer el display name actualizado de cada usuario.
 * @param {id:string} dataUser
 * @returns { displayName: string}
 */
export async function getNameUser(id) {
  try {
    const userRef = doc(db, 'users', id);
    const userSnapshot = await getDoc(userRef);
    const name = await userSnapshot.data().displayName ? userSnapshot.data().displayName : userSnapshot.data().email
    return name
  } catch (error) {
    console.log("Documento no existente");

  }
}

/**
*Actualizamos los datos del usuario.
*Su nombre, biografía y géneros favoritos.
* @param {{id:string}} Id
* @param {{displayName:string, carrer:string}} DatosUsuario
* @returns {}
*/
export async function updateUserProfile(id, { displayName, bio, genres }) {

  const profileRef = doc(db, 'users', id);

  await updateDoc(profileRef, {
    displayName,
    bio,
    genres

  });
}
export async function getEmailUser(id) {
  try {

    const profileRef = doc(db, `/users/${id}`)
    const profileDocument = await getDoc(profileRef)
    if (profileDocument.exists()) {
      return profileDocument.data().email

    }
  } catch (error) {
    console.log('Hubo un error al traer el perfil', error)
  }
}
export async function getUserName(id) {
  try {

    const profileRef = doc(db, `/users/${id}`)
    const profileDocument = await getDoc(profileRef)
    if (profileDocument.exists()) {
      return profileDocument.data().displayName

    }
  } catch (error) {
    console.log('Hubo un error al traer el perfil', error)
  }
}
/**
 * Traemos la informacion del usuario para su vista de perfil, ya sea el logueado o uno de la comunidad ya registrado
 * @param {{id:string, email:string}} data
 * @returns {{id: string, email: string, displayName: string, bio: string, career: string}|{email: string, bio: string, career: string}}
 */
export async function getUsersProfileById(id, email,displayName) {
  try {

    const profileRef = doc(db, `/users/${id}`)

    const profileDocument = await getDoc(profileRef)
    if (profileDocument.exists()) {

      const profileSubcollection = collection(db, `users/${id}/series`);
 
      return {
        id: profileDocument.id,
        email: profileDocument.data().email,
        displayName: profileDocument.data().displayName,
        bio: profileDocument.data().bio,
        genres: profileDocument.data().genres
      }

    } else {

      await setDoc(doc(db, 'users', id), {
        email: email,
        displayName:displayName,
        bio: null,
        genres: null

      });
      return { id, email, bio: null,displayName };
    }
  } catch (error) {
    console.log('Hubo un error al traer el perfil', error)
  }

}

export async function getUsers(searchTerm,callback) {
  try {
    const usersRef = collection(db, "users");
    // const users = [];

    if (searchTerm) {
      const q = query(usersRef, where('displayName', '>=', searchTerm), where('displayName', '<=', searchTerm + '\uf8ff'));
      // const querySnapshot = await getDocs(q);
      onSnapshot(q , snapshot => {
        const users = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                bio: doc.data().bio,
                displayName: doc.data().displayName,
                genres: doc.data().genres,
            }
        });
        callback(users);
    });

    }

    // return users;
  } catch (error) {
    console.log('Hubo un error al traer el perfil', error);

  }
}
