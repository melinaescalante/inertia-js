import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, getDocs, query, where, onSnapshot, limit } from "firebase/firestore";
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
 * 
 * @param {string} id 
 * @param {{displayName: string, bio: string, career: string, photoURL: string}} data
 */
export async function updateUserProfile(id, data) {
  const profileRef = doc(db, `/users/${id}`);

  try {
    const docSnapshot = await getDoc(profileRef);
    if (docSnapshot.exists()) {
      await updateDoc(profileRef, {
        ...data,
      });
    } else {
      await setDoc(profileRef, {
        ...data,
      });
    }
  } catch (error) {
    console.error("Error actualizando el perfil:", error);
  }
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
export async function getPhotoURL(id) {
  try {

    const profileRef = doc(db, `/users/${id}`)
    const profileDocument = await getDoc(profileRef)
    if (profileDocument.exists()) {
      return profileDocument.data().photoURL

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
 * @param {id:string, email:string} data
 * @returns {id: string, email: string, displayName: string, bio: string, career: string}|{email: string, bio: string, career: string}
 */
export async function getUsersProfileById(id, email, displayName) {
  try {
    const profileRef = doc(db, `/users/${id}`);
    const profileDocument = await getDoc(profileRef);
    if (profileDocument.exists()) {
      return {
        id: profileDocument.id,
        email: profileDocument.data().email,
        displayName: profileDocument.data().displayName,
        bio: profileDocument.data().bio,
        genres: profileDocument.data().genres,
        photoURL: profileDocument.data().photoURL,
      };
    } else {

      await setDoc(profileRef, {
        email: email,
        displayName: displayName,
        bio: null,
        genres: null,
        photoURL: null
      });
      return { id, email, displayName, bio: null, genres: null, photoURL: null };
    }
  } catch (error) {
    console.log("Hubo un error al traer el perfil", error);
  }
}


export async function getUsers(searchTerm, callback) {
  try {
    const usersRef = collection(db, "users");
    // const users = [];

    if (searchTerm) {
      const q = query(usersRef, where('displayName', '>=', searchTerm), where('displayName', '<=', searchTerm + '\uf8ff'));

      onSnapshot(q, snapshot => {
        const users = snapshot.docs.map(doc => {
          return {
            id: doc.id,
            bio: doc.data().bio,
            displayName: doc.data().displayName,
            genres: doc.data().genres,
            photoURL: doc.data().photoURL
          }
        });
        callback(users);
      });

    }

  } catch (error) {
    console.log('Hubo un error al traer el perfil', error);

  }
}
export async function addFollow(idUserAuth, idFollow) {
  const followingCollectionRef = collection(db, `users/${idUserAuth}/following`);
  const followingQuery = query(followingCollectionRef, where('following', '==', {
    [idUserAuth]: true,
    [idFollow]: true,
  }), limit(1));
  const followSnapshot = await getDocs(followingQuery);
  if (followSnapshot.empty) {
    await addDoc(followingCollectionRef, {
      following: {
        [idFollow]: true,
        [idUserAuth]: true
      }
    });
  } else {
    return

  }
}
export async function allFollowing(idUser) {
  let allFriends = []

  const friendsCollectionRef = collection(db, `users/${idUser}/following`);

  const friendQuery = query(
    friendsCollectionRef,
    where("following." + idUser, "==", true)
  );
  const friendsSnapshot = await getDocs(friendQuery);

  friendsSnapshot.forEach(doc => {
    allFriends.push(doc.data());
  });
  return allFriends;
}


export async function isFollowed(idUserAuth, idUser2) {
  try {
    const followingCollectionRef = collection(db, `users/${idUserAuth}/following`);
    const followingQuery = query(followingCollectionRef, where(`following`, "==", {
      [idUserAuth]: true,
      [idUser2]: true
    }));
    const followingSnapshot = await getDocs(followingQuery);
    if (!followingSnapshot.empty) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log("Error verificando si está seguido", error);
    return false;
  }
}
