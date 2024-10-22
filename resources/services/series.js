import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc, collection } from "firebase/firestore";

export async function addSerieToWatch(idUser, idSerie) {
    try {
        // Verificar los valores que recibimos
        console.log("idUser:", idUser);
        console.log("idSerie:", idSerie);

        // Verificar que los valores existan y sean correctos
        if (!idUser || !idSerie) {
            throw new Error("idUser o idSerie no son válidos");
        }

        // Crear una referencia al documento del usuario en la colección 'users'
        const userDocRef = setDoc(db, 'users', 'to_watch');

        // Crear una referencia a la subcolección 'series' dentro del documento del usuario
        const serieCollectionRef = collection(userDocRef, 'series');

        // Crear una referencia al documento de la serie dentro de la subcolección 'series'
        const serieDocRef = doc(serieCollectionRef, idSerie);

        // Verificar si el documento ya existe
        const serieDocument = await getDoc(serieDocRef);
        
        if (serieDocument.exists()) {
            console.log("La serie ya está en la lista.");
        } else {
            // Si no existe, agregar la serie
            await setDoc(serieDocRef, {
                idUser,
                idSerie,
                created_at: serverTimestamp()
            });
            console.log("Serie agregada exitosamente.");
        }
    } catch (error) {
        console.error("Error al agregar la serie:", error);
    }
}