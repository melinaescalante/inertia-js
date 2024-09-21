import { db, storage} from './firebase'
import { collection, addDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
export async function uploadPost({text,serie,image, date}){
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