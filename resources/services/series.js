import { error } from "laravel-mix/src/Log";
import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

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
            seriesWatching = [seriesWatching]
            return seriesWatching
        } else {
            return false
        }
    } catch (error) {
        console.error(error)
    }
}

export async function startSerie(idUser, idSerie, idSeason) {
    const userDocRef = doc(db, "users", idUser);
    const toWatchDocRef = doc(userDocRef, `series/watching`);
    const toWatchSnapshot = await getDoc(toWatchDocRef);

    const newAddSerie = {
        ['current']: 1,
        ['currentSeason']: 1,
        ['currentIdSeason']: idSeason

    };
    if (toWatchSnapshot.exists()) {
        const currentsWatching = toWatchSnapshot.data();
        await updateDoc(toWatchDocRef, {
            [idSerie]: {
                ...newAddSerie,
            }
        });
        return
    }
    else {
        await setDoc(toWatchDocRef, {
            [idSerie]: {
                ...newAddSerie,
            }
        });

    }
}
async function verifyChapter(idSeason, temporada, capitulo) {
    try {
        const response = await fetch(`https://api.tvmaze.com/seasons/${idSeason}/episodes`);
        const episodes = await response.json();
        const episodeExists = episodes.find(episode => {
            return episode.season === temporada && episode.number === capitulo + 1;
        });
        if (response.status !== 200) {
            throw new Error("Error al obtener los episodios");
        }
        console.log(await episodeExists)
        return episodeExists;
    } catch (error) {
        console.error("Error verificando el capítulo:", error);
        return false;
    }
}

async function verifySeason(idSerie, temporada) {
    // Lógica para verificar si existe una temporada usando la API
    const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
    const seasons = await response.json();
    const seasonExists = seasons.find(season => {
        console.log(season.id)
        return season.number === temporada + 1
    });
    console.log(await seasonExists.id)
    if (response.status !== 200) {
        throw new Error("Error al obtener los episodios");
    }
    const nextSeasonId=seasonExists.id
    return {seasonExists,nextSeasonId};

}
export async function currentInformation(idUser, idSerie) {
    const userDocRef = doc(db, "users", idUser);
    const currentEpisodeRef = doc(userDocRef, `series/watching`);
    const currentEpisodeSnapshot = await getDoc(currentEpisodeRef);
    if (currentEpisodeSnapshot.exists()) {
        const data = currentEpisodeSnapshot.data();
        const seriesData = data[idSerie];

        if (seriesData) {
            const currentEpisode = seriesData.current
            const currentSeason = seriesData.currentSeason
            const currentIdSeason = seriesData.currentIdSeason
            console.log(currentEpisode, currentSeason)
            return { currentEpisode, currentSeason, currentIdSeason }
        }
    } else {
        console.log("No se encontró la información del episodio actual.");
    }


}
export async function nextEpisode(idUser, idSerie, idSeason, temporada, capitulo) {
    const userDocRef = doc(db, "users", idUser);
    const toWatchDocRef = doc(userDocRef, `series/watching`);
    const toWatchSnapshot = await getDoc(toWatchDocRef);
    const prueba = await verifyChapter(idSeason, temporada, capitulo)
    console.log(await prueba)
    // return
    if (prueba !== false && prueba !== undefined) {

        if (toWatchSnapshot.exists()) {
            const data = toWatchSnapshot.data();
            if (data[idSerie]?.current !== undefined) {

                let watching = data[idSerie].current + 1;
                await updateDoc(toWatchDocRef, {
                    [`${idSerie}.current`]: watching
                });
            } else {
                return false
            }
            return 'episode'
        }
        else {
            console.log('no se puede pasar de capitulo', error)
        }
    } else {
        let seasons
        const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
        if (response.status == 200) {
            seasons = await response.json();
            console.log(seasons)
        }
        const {seasonExists:season,nextSeasonId:idCurrentSeason} = await verifySeason(idSerie, temporada)
        console.log(season,idCurrentSeason)
        if (season) {
            if (toWatchSnapshot.exists()) {
                const data = toWatchSnapshot.data();
                if (data[idSerie]?.currentSeason !== undefined) {
                    let watchingSeason = data[idSerie].currentSeason + 1;
                    
                    await updateDoc(toWatchDocRef, {
                        [idSerie]: {
                            current: 1,
                            currentSeason: watchingSeason,
                            currentIdSeason: idCurrentSeason,
                        }
                    });
                } else {
                    return false
                }
                return 'season'
            }

        }
    }
}