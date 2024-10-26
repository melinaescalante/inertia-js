import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function addSerieToWatch(idUser, idSerie, nameSerie) {
    try {
        const userDocRef = doc(db, "users", idUser);
        const toWatchDocRef = doc(userDocRef, "series", "toWatch");
        const toWatchSnapshot = await getDoc(toWatchDocRef);

        if (toWatchSnapshot.exists()) {
            const currentsToWatch = toWatchSnapshot.data().seriesData || [];
            const exists = currentsToWatch.some(serie => {
                return Object.keys(serie)[0] === idSerie.toString();
            });
            console.log(exists)

            if (exists) {
                let currentsToWatchFilter = currentsToWatch.filter(serie => {
                    return Object.keys(serie)[0] !== idSerie.toString();
                });
                await updateDoc(toWatchDocRef, {
                    seriesData: currentsToWatchFilter
                });
                return
            }
            const newSerie = { [idSerie]: nameSerie };
            currentsToWatch.push(newSerie);
            await updateDoc(toWatchDocRef, {
                seriesData: currentsToWatch
            });

        }
        else {
            const newSerie = { [idSerie]: nameSerie };
            await setDoc(toWatchDocRef, { seriesData: [newSerie] });
            return

        }
    } catch (error) {
        console.error("Error al agregar la serie:", error);
    }
}

export async function allSeriesToWatch(idUser) {
    try {
        const seriesToWatchRef = doc(db, `users/${idUser}/series/toWatch`);
        const seriesToWatchSnapshot = await getDoc(seriesToWatchRef);
        const seriesToWatchObtained = await seriesToWatchSnapshot.data().seriesData || []
        // seriesToWatchObtained.reverse()
        return seriesToWatchObtained;
    } catch (error) {
        console.error(error)
    }
}
export async function isStarted(idUser, idSerie) {

    try {
        const seriesWatchingRef = doc(db, `users/${idUser}/series/watching`);
        const watchedSnapshot = await getDoc(seriesWatchingRef);
        if (watchedSnapshot.exists()) {
            const data = watchedSnapshot.data()
            if (data[idSerie]) {
                console.log(data[idSerie])
                return true
            } else {
                return false
            }
        }
        return false

    } catch (error) {
        console.error(error)
    }
}
export async function allSeriesWatching(idUser) {

    try {
        const seriesWatchingRef = doc(db, `users/${idUser}/series/watching`);
        const watchedSnapshot = await getDoc(seriesWatchingRef);
        if (watchedSnapshot.exists()) {
            let seriesWatching = watchedSnapshot.data()
            seriesWatching=[seriesWatching]
            console.log(seriesWatching)
            return seriesWatching


        }else {
            return false
        }
        } catch (error) {
            console.error(error)
        }
    }

export async function startSerie(idUser, idSerie, nameSerie) {
        const userDocRef = doc(db, "users", idUser);
        const toWatchDocRef = doc(userDocRef, `series/watching`);
        const toWatchSnapshot = await getDoc(toWatchDocRef);
        // const newSerie = { ['currentltWatching']: 1 };
        const newSerie = { ['current']: 1 };
        await setDoc(toWatchDocRef, {
            [idSerie]: newSerie
        });

        // if (toWatchSnapshot.exists()) {
        //     const currentsToWatch = toWatchSnapshot.data().seriesData || [];
        //     const exists = currentsToWatch.some(serie => {
        //         return Object.keys(serie)[0] === idSerie.toString();
        //     });
        //     console.log(exists)

        //     if (exists) {
        //         let currentsToWatchFilter = currentsToWatch.filter(serie => {
        //             return Object.keys(serie)[0] !== idSerie.toString();
        //         });
        //         await updateDoc(toWatchDocRef, {
        //             seriesData: currentsToWatchFilter
        //         });
        //         return
        //     }
        //     const newSerie = { [idSerie]: nameSerie };
        //     currentsToWatch.push(newSerie);
        //     await updateDoc(toWatchDocRef, {
        //         seriesData: currentsToWatch
        //     });

        // } 
        // else {
        // const newSerie = { [idSerie]: nameSerie };

    }
// }