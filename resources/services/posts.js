import { db, storage } from './firebase'
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc, getDoc, where } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getNameUser } from './users';
import { login } from './auth';

export async function uploadPost({ text, serie, image, date, userid }) {
  const postRef = collection(db, 'posts-public')

  if (image == undefined) {
    image = null
  }

  await addDoc(postRef, {
    text,
    serie,
    image,
    date,
    userid,
    created_at: serverTimestamp()
  });
}

export async function uploadPhoto(image) {
  try {
    const storageRefe = storageRef(storage, `posts/${image.name}`);
    await uploadBytes(storageRefe, image);
    // Obtén la URL de descarga
    const downloadURL = await getDownloadURL(storageRefe);
    // Agrega la URL y los datos asociados a la colección 'fotos' en Firestore
    return downloadURL
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
}
/**
*Traemos uTodas las publicaciones.
* @param {callback:function} data
* @returns {{Promise}}
*/
export async function readPosts(callback, userid) {
  const postsRef = collection(db, 'posts-public')
  const postQuery = query(postsRef, orderBy("created_at", "desc"));
  console.log(userid, 'id')
  onSnapshot(postQuery, async (snapshot) => {
    const posts = [];
    for (const doc of snapshot.docs) {
      const like = await isLike(doc.id, userid)
      const post = {
        id: doc.id,
        // username:doc.data().username,
        serie: doc.data().serie,
        text: doc.data().text,
        image: doc.data().image,
        date: doc.data().date,
        likes: doc.data().likes,
        comments: doc.data().comments,
        shares: doc.data().shares,
        user: await getNameUser(doc.data().userid),
        userid: doc.data().userid,
        liked: like,
        created_at:doc.data().created_at
      };
      posts.push(post);
      console.log(post)
    }
    callback(posts)

  })

}
/**
*Traemos una publicacion en especifico, mediante su id.
* @param {{callback:function, id: string}} data
* @returns {{Promise}}
*/

export async function readPostsById(callback, id, userid) {
  const postRef = doc(db, "posts-public", id);

  onSnapshot(postRef, async (postSnapshot) => {
    if (postSnapshot.exists()) {
      const like = await isLike(postSnapshot.id, userid);
      const postFound = {
        id: postSnapshot.id,
        serie: postSnapshot.data().serie,
        text: postSnapshot.data().text,
        image: postSnapshot.data().image,
        date: postSnapshot.data().date,
        user: await getNameUser(postSnapshot.data().userid),
        likes: postSnapshot.data().likes,
        comments: postSnapshot.data().comments,
        shares: postSnapshot.data().shares,
        userid: postSnapshot.data().userid,
        liked: like,
        created_at:postSnapshot.data().created_at

      };

      callback(postFound);
    }
  });
}
/**
*Traemos los posteos de un usuario específico, mediante su id.
* @param {{callback:function, userid: string}} data
* @returns {{Promise}}
*/
export async function readPostsByUser(callback, userid) {
  const postQuery = query(collection(db, "posts-public"), where("userid", "==", userid));
  onSnapshot(postQuery, async (snapshot) => {
    const posts = [];
    //Utilizo este metodo para poder llamar a la funcion de getnameuser, sino me devolvia promesas con el return en conjunto al map
    for (const doc of snapshot.docs) {
      const like = await isLike(doc.id, userid)
      const post = {
        id: doc.id,
        serie: doc.data().serie,
        text: doc.data().text,
        image: doc.data().image,
        date: doc.data().date,
        user: await getNameUser(doc.data().userid),
        likes: doc.data().likes,
        userid: doc.data().userid,

        comments: doc.data().comments,
        shares: doc.data().shares,
        liked: like,
        created_at:doc.data().created_at
      };
      posts.push(post);

    }

    callback(posts);
  });
}

export async function isLike(id, userid) {
  const postRef = doc(db, 'posts-public', id);
  const postSnapshot = await getDoc(postRef);
  const currentLikes = postSnapshot.data().likes || [];
  const userFound = currentLikes.find(user => {
    return Object.keys(user)[0] === userid;
  });
  if (userFound) {
    return true;
  } else {
    return false;
  }
}
export async function like(id, operador, userid) {
  try {

    const postRef = doc(db, 'posts-public', id);
    const postSnapshot = await getDoc(postRef);
    if (postSnapshot) {
      const currentLikes = postSnapshot.data().likes || [];
      if (operador === 'plus') {
        const newLike = { [userid]: userid };
        currentLikes.push(newLike);

        await updateDoc(postRef, {
          likes: currentLikes
        });

      }
      else if (operador === 'less') {
        const newArray = currentLikes.filter(user => {
          const userIdKey = Object.keys(user)[0];
          return userIdKey !== userid;
        });

        await updateDoc(postRef, {
          likes: newArray
        });
        console.log("Menos.", newArray);
      }
    }
  } catch (error) {
    console.log("Documento no existente");

  }

}
export async function comment(id, comment, iduser) {
  try {

    const postRef = doc(db, 'posts-public', id);
    const postSnapshot = await getDoc(postRef);
    if (postSnapshot) {
      const currentComments = postSnapshot.data().comments || [];
      const newComment = { [iduser]: comment };
      currentComments.push(newComment);

      await updateDoc(postRef, {
        comments: currentComments
      });

      console.log("Comentario agregado exitosamente.");
    } else {
      console.log("El post no existe.");
    }
  } catch (error) {
    console.log("Error al agregar el comentario:", error);
  }
}

export async function getComments(id) {
  try {
    const postRef = doc(db, 'posts-public', id);
    const postSnapshot = await getDoc(postRef);
    const commentsObtained = await postSnapshot.data().comments
    const updatedComments = [];

    for (const comment of commentsObtained) {
      const iduser = Object.keys(comment)[0];
      // const email = await getNameUser(iduser);
      const newComment = { [iduser]: comment[iduser] };
      updatedComments.push(newComment);
    }
    //Asi traemos lo ultimo comentarios
    updatedComments.reverse()
    return updatedComments;

  } catch (error) {
    console.log("Documento no existente");

  }

}