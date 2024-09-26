import { db, storage } from './firebase'
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc, getDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
export async function uploadPost({ text, serie, image, date }) {
  const postRef = collection(db, 'posts-public')
  await addDoc(postRef, {
    text,
    serie,
    image,
    date,
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
  const postQuery = query(postsRef, orderBy("created_at"));
  // const snapshot = await getDocs(postsRef)
  onSnapshot(postQuery, snapshot => {
    const posts = snapshot.docs.map(doc => {
      return {
        id: doc.id,
        serie: doc.data().serie,
        text: doc.data().text,
        image: doc.data().image,
        date: doc.data().date,
        likes: doc.data().likes,
        comments: doc.data().comments,
        shares: doc.data().shares
      }
    })
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
export async function comment(id, comment) {
  try {

    const postRef = doc(db, 'posts-public', id);
    const postSnapshot = await getDoc(postRef);
    console.log(postSnapshot)
    if (postSnapshot) {
      const currentComments = postSnapshot.data().comments;

      if (currentComments) {

        await currentComments.push(comment)
      }

      await updateDoc(postRef, {
        comments: currentComments
      });
    }
  } catch (error) {
    console.log("No se ha podido comentar correctamente");

  }

}

export async function getComments(id) {
  try {
    const postRef = doc(db, 'posts-public', id);
    const postSnapshot = await getDoc(postRef);
    const commentsObtained= await postSnapshot.data().comments
    return commentsObtained
    
    
  } catch (error) {
    console.log("Documento no existente");

  }

}