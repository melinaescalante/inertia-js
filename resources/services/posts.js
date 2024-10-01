import { db, storage } from './firebase'
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc, getDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getNameUser } from './users';

export async function uploadPost({ text, serie, image, date,userid }) {
  const postRef = collection(db, 'posts-public')
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
  // const fileInput = image
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
export async function readPosts(callback) {
  const postsRef = collection(db, 'posts-public')
  const postQuery = query(postsRef, orderBy("created_at", "desc"));

  onSnapshot(postQuery, async (snapshot) => {
    const posts = [];
    for (const doc of snapshot.docs) {
      const post = {
        id: doc.id,
        // username:doc.data().username,
        serie: doc.data().serie,
        text: doc.data().text,
        image: doc.data().image,
        date: doc.data().date,
        likes: doc.data().likes,
        comments:doc.data().comments,
        shares: doc.data().shares,
        user: await getNameUser(doc.data().userid),
      };
      posts.push(post);
      console.log(post)
    }
    callback(posts)
  })
  
}
export async function like(id, operador) {
  try {

    const postRef = doc(db, 'posts-public', id);
    const postSnapshot = await getDoc(postRef);
    console.log(postSnapshot)
    if (postSnapshot) {
      const currentLikes = postSnapshot.data().likes;
      let result
      if (operador == 'plus') {

        result = Number(currentLikes) + 1
      } else {
        result = Number(currentLikes) - 1

      }
      await updateDoc(postRef, {
        likes: result
      });
      console.log("Like añadido correctamente.");
    }
  } catch (error) {
    console.log("Documento no existente");

  }

}
export async function comment(id, comment,iduser) {
  try {

    const postRef = doc(db, 'posts-public', id);
    const postSnapshot = await getDoc(postRef);
    console.log(postSnapshot)
    if (postSnapshot) {
      const currentComments = postSnapshot.data().comments || [];
      const newComment = { [iduser]: comment };
      // Agregar el nuevo comentario al array
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
    const commentsObtained= await postSnapshot.data().comments
    const updatedComments = [];

    for (const comment of commentsObtained) {
      const iduser = Object.keys(comment)[0];
      const email = await getNameUser(iduser);
      const newComment = { [email]: comment[iduser] };
      updatedComments.push(newComment);
    }
    //Asi traemos lo ultimo comentarios
    updatedComments.reverse()
    return updatedComments;
    
  } catch (error) {
    console.log("Documento no existente");

  }

}