import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, getDocs, query, where, onSnapshot, limit, Timestamp } from "firebase/firestore";
/**
 * Funcion que en base al id de un usuario nos permite tarer el display name actualizado de cada usuario.
 * @param {String} id
 * @returns { String}
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
 * Funcion que en base al id de un usuario nos permite las series del usuario actualmente viendo, y las que están en un rango menor a 3 meses .
 * @param {String} id
 * @returns { Array}
 */
export async function getLastSeriesWatched(id) {
  try {
    // Fecha maxima (hoy)
    const today = new Date();
    const endDate = Timestamp.fromDate(today);

    // Calcular la fecha de hace 3 meses
    let fiveMonthsAgo = new Date();
    fiveMonthsAgo.setMonth(today.getMonth() - 3);
    const startDate = Timestamp.fromDate(fiveMonthsAgo);


    const userRef = doc(db, 'users', id);
    const seriesWatchingRef = doc(userRef, "series", "watching");
    const userSnapshot =await getDoc(seriesWatchingRef);
    const seriesValues=Object.values(userSnapshot.data())
    const test= seriesValues.filter(serie=>{
      const lastModifiedMillis = serie.last_modified.toMillis(); 
      const startMillis = startDate.toMillis();
      const endMillis = endDate.toMillis();
      return  lastModifiedMillis >= startMillis && lastModifiedMillis <= endMillis;
    }).map((serie)=>serie.id)
   
    // console.log(test)
    localStorage.setItem("ids_series_watching", JSON.stringify(test))

    return seriesValues
  } catch (error) {
    console.log("Documento no existente", error);

  }
}

/**
 * 
 * @param {string} id 
 * @param {{displayName: string, bio: string, career: string, photoURL: string}} data
 * @returns {Promise}
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
/**
 * Traemos email del usuario según id
 * @param {String} id 
 * @returns {String}
 */
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
/**
 * Traemos foto de perfil de usuario según id
 * @param {String} id 
 * @returns {String}
 */
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
/**
 * Traeemos un nombre de usuario según id
 * @param {String} id 
 * @returns {String}
 */
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
        username: profileDocument.data().username,
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

/**
 * Traemos resultados por coincidencias de display name
 * @param {String} searchTerm 
 * @param {Function} callback 
 * @returns {Function} callback
 */
export async function getUsers(searchTerm, callback) {
  try {
    const usersRef = collection(db, "users");

    if (searchTerm) {
      const q = query(usersRef,
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff')
      );
      // const q = query(usersRef, where('username', '>=', searchTerm), where('username', '<=', searchTerm + '\uf8ff'));

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
/**
 * Seguimos a un usuario
 * @param {String} idUserAuth 
 * @param {String} idFollow 
 * @returns {Promise}
 */
export async function addFollow(idUserAuth, idFollow) {
  const followingCollectionRef = collection(db, `users/${idUserAuth}/following`);
  const followingQuery = query(followingCollectionRef, where('following', '==', {
    // [idUserAuth]: true,
    [idFollow]: true,
  }), limit(1));
  const followSnapshot = await getDocs(followingQuery);
  if (followSnapshot.empty) {
    await addDoc(followingCollectionRef, {
      following: {
        [idFollow]: true,
        // [idUserAuth]: true
      }
    });
  } else {
    return

  }
}
/**
 * Retornamos la cantidad de usuarios seguidos
 * @param {String} idUser 
 * @returns {Array}
 */
export async function allFollowing(idUser) {
  let allFriends = []

  const friendsCollectionRef = collection(db, `users/${idUser}/following`);

  const friendQuery = query(
    friendsCollectionRef,
    where("following." + idUser, "==", true)
  );
  const friendsSnapshot = await getDocs(friendsCollectionRef);

  friendsSnapshot.forEach(doc => {
    allFriends.push(doc.data());
  });
  const followingIds = allFriends.map((item) => {
    const followingId = Object.keys(item.following);
    return followingId[0]; 
  });

  localStorage.setItem("people", JSON.stringify(followingIds))
  return allFriends;
}

/**
 * Consultamos si un usuario es seguido por otro
 * @param {String} idUserAuth 
 * @param {String} idUser2 
 * @returns {Boolean}
 */
export async function isFollowed(idUserAuth, idUser2) {
  try {
    const followingCollectionRef = collection(db, `users/${idUserAuth}/following`);
    const followingQuery = query(followingCollectionRef, where(`following`, "==", {
      // [idUserAuth]: true,
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
