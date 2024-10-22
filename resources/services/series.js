import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function addSerieToWatch(idUser, idSerie, nameSerie) {
    try {
        const toWatchDocument = doc(db, `users/${idUser}/series/toWatch`);
        const toWatchSnapshot = await getDoc(toWatchDocument);

        if (toWatchSnapshot.exists()) {
            // Si el documento 'toWatch' ya existe
            const currentsToWatch = toWatchSnapshot.data().toWatch || [];
            
            // Verificar si la serie ya está en el array
            const exists = currentsToWatch.some(serie => {
                return Object.keys(serie)[0] === idSerie.toString();
            });

            if (!exists) {
                // Agregar la nueva serie al array
                const newSerie = { [idSerie]: nameSerie };
                currentsToWatch.push(newSerie);

                // Actualizar el documento con la nueva lista
                await updateDoc(toWatchDocument, {
                    toWatch: currentsToWatch
                });
            }
        }        

    } catch (error) {
        console.error("Error al agregar la serie:", error);
    }
}

export async function allSeriesToWatch(idUser){
    try {
        const seriesToWatchRef = doc(db, `users/${idUser}/series/toWatch`);
        const seriesToWatchSnapshot = await getDoc(seriesToWatchRef);
        const seriesToWatchObtained = await seriesToWatchSnapshot.data().toWatch||[]
        // for (const serie of seriesToWatchObtained) {
        //   const idSerie= Object.keys(serie)[0];
        //   const newSerie = { [idSerie]: serie[idSerie] };
        //   seriesToWatchObtained.push(newSerie);
          
          
          
        // }
        seriesToWatchObtained.reverse()
        console.log(seriesToWatchObtained)
        return seriesToWatchObtained;
        
    } catch (error) {
        console.error(error)
    }


}