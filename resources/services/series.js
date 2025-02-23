import { db } from "./firebase";
import { doc, getDoc, updateDoc, setDoc, deleteField, FieldValue, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import { getLastSeriesToWatch, getLastSeriesWatched, getNameUser, getUsername, getUserName } from "./users";

/**
 * Agregamos serie a nuestra lista para ver
 * @param {String} idUser 
 * @param {Number} idSerie 
 * @param {String} nameSerie 
 * @returns {Promise}
 */
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

            if (exists) {
                let currentsToWatchFilter = currentsToWatch.filter(serie => {
                    return Object.keys(serie)[0] !== idSerie.toString();
                });
                await updateDoc(toWatchDocRef, {
                    seriesData: currentsToWatchFilter
                });
                const localSeries = JSON.parse(localStorage.getItem('ids_series_wishlist'))
                deleteIdFromStorage(idSerie, localSeries, "ids_series_wishlist")
                return
            }
            const newSerie = { [idSerie]: nameSerie };
            currentsToWatch.push(newSerie);
            await updateDoc(toWatchDocRef, {
                seriesData: currentsToWatch
            });

            getLastSeriesToWatch(idUser)
        }
        else {
            const newSerie = { [idSerie]: nameSerie };
            await setDoc(toWatchDocRef, { seriesData: [newSerie] });
            getLastSeriesToWatch(idUser)

            return

        }
    } catch (error) {
        console.error("Error al agregar la serie:", error);
    }
}
/**
 * Devolvemos las series que el usuario tiene en su lista para ver
 * @param {String} idUser 
 * @returns {Array}
 */
export async function allSeriesToWatch(idUser) {
    try {
        const seriesToWatchRef = doc(db, `users/${idUser}/series/toWatch`);
        const seriesToWatchSnapshot = await getDoc(seriesToWatchRef);
        const seriesToWatchObtained = await seriesToWatchSnapshot.data()?.seriesData || []

        return seriesToWatchObtained.reverse();
    } catch (error) {
        console.error(error)
    }
}
/**
 * Preguntamos si el usuario esta viendo esta serie para saber si marcar como viendo o no
 * @param {String} idUser 
 * @param {Number} idSerie 
 * @returns {Boolean}
 */
export async function isStarted(idUser, idSerie) {

    try {
        const seriesWatchingRef = doc(db, `users/${idUser}/series/watching`);
        const watchingSnapshot = await getDoc(seriesWatchingRef);
        if (watchingSnapshot.exists()) {
            const data = watchingSnapshot.data()
            if (data[idSerie]) {
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
/**
 * Devolvemos todas las series que el usuario esta viendo en el momento
 * @param {String} idUser 
 * @returns {Array | false}
 */
export async function allSeriesWatching(idUser) {
    try {
        const seriesWatchingRef = doc(db, `users/${idUser}/series/watching`);
        const watchedSnapshot = await getDoc(seriesWatchingRef);

        if (watchedSnapshot.exists()) {
            let seriesWatching = watchedSnapshot.data()
            if (seriesWatching && Object.keys(seriesWatching).length > 0) {

                return [seriesWatching];  // seriesWatching
            } else {
                return false;
            }
        } else {
            return false
        }
    } catch (error) {
        console.error(error)
    }
}
export function deleteIdFromStorage(id, arrayLocal, nameArray) {
    try {

        const index = arrayLocal.indexOf(id)
        arrayLocal.splice(index, 1)
        localStorage.setItem(nameArray, JSON.stringify(arrayLocal))

    } catch (error) {
        console.log('no se ha eliminado')
    }
}
/**
 * Empezamos a ver una serie nueva
 * @param {String} idUser 
 * @param {Number} idSerie 
 * @param {Number} idSeason 
 * @returns {Promise}
 */
export async function startSerie(idUser, idSerie, idSeason, urlImage) {
    const userDocRef = doc(db, "users", idUser);
    const toWatchDocRef = doc(userDocRef, `series/watching`);
    const toWatchSnapshot = await getDoc(toWatchDocRef);

    const newAddSerie = {
        ['current']: 1,
        ['currentSeason']: 1,
        ['currentIdSeason']: idSeason,
        ['created_at']: Timestamp.now(), ['last_modified']: Timestamp.now(),
        ["id"]: idSerie,
        ["urlImage"]: urlImage

    };
    if (toWatchSnapshot.exists()) {
        const currentsWatching = toWatchSnapshot.data();
        const exists = Object.keys(currentsWatching).some(serie => {
            return serie === idSerie.toString();

        });
        //Elimino serie si ya esta en el documento
        if (exists) {
            await updateDoc(toWatchDocRef, {
                [idSerie]: deleteField()
            });
            const localSeries = JSON.parse(localStorage.getItem('ids_series_watching'))
            deleteIdFromStorage(idSerie, localSeries, "ids_series_watching")
            //Eliminamos serie del storage
            return
        }

        await updateDoc(toWatchDocRef, {
            [idSerie]: {
                ...newAddSerie,
            }
        });
        getLastSeriesWatched(idUser)

        return
    }
    else {
        await setDoc(toWatchDocRef, {
            [idSerie]: {
                ...newAddSerie,
            }
        });
        getLastSeriesWatched(idUser)

    }

}/**
 * Verificamos si hay un capítulo luego del actualmente mirando
 * @param {Number} idSeason 
 * @param {Number} temporada 
 * @param {Number} capitulo 
 * @returns {Boolean}
 */
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
        return episodeExists;
    } catch (error) {
        console.error("Error verificando el capítulo:", error);
        return false;
    }
}
/**Verificamos si existe un capitulo anterior al actualmente viendo
 * @returns {Boolean}
 */
async function verifyChapterBefore(idSeason, temporada, capitulo) {
    try {
        const response = await fetch(`https://api.tvmaze.com/seasons/${idSeason}/episodes`);
        const episodes = await response.json();
        const episodeExists = episodes.find(episode => {
            return episode.season === temporada && episode.number === capitulo - 1;
        });
        if (response.status !== 200) {
            throw new Error("Error al obtener los episodios");
        }
        return episodeExists;
    } catch (error) {
        console.error("Error verificando el capítulo anterior:", error);
        return false;
    }
}
/**
 * Verificamos si hay un capítulo luego del actualmente mirando, en otra temporada
 * @param {Number} idSerie 
 * @param {Number} temporada 
 * @returns {{seasonExists:Boolean, nextSeasonId:Number}}
 */
async function verifySeason(idSerie, temporada) {
    const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
    const seasons = await response.json();
    const seasonExists = seasons.find(season => {
        return season.number === temporada + 1
    });
    if (response.status !== 200) {
        throw new Error("Error al obtener los episodios");
    }
    if (seasonExists) {
        const nextSeasonId = seasonExists.id
        return { seasonExists, nextSeasonId };
    } else {
        false
    }

}
/**
 * Verificamos si hay un capítulo antes del actualmente mirando, en la temporada anterior
 * @param {Number} idSerie 
 * @param {Number} temporada 
 * @returns {{seasonExists:Boolean, nextSeasonId:Number}|boolean}
 */
async function verifySeasonBefore(idSerie, temporada) {
    const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
    const seasons = await response.json();
    const seasonExists = seasons.find(season => {
        return season.number === temporada - 1
    });
    if (response.status !== 200) {
        throw new Error("Error al obtener los episodios");
    }
    if (seasonExists) {
        const beforeSeasonId = seasonExists.id
        const lastEpisode = seasonExists.episodeOrder
        return { seasonExists, beforeSeasonId, lastEpisode };
    } else {
        false
    }

}
/**
 * Devuelve informacion de serie actualmente viendo
 * @param {String} idUser 
 * @param {Number} idSerie 
 * @returns {{currentEpisode:Number, currentSeason:Number, currentIdSeason:Number}}
 */
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
            return { currentEpisode, currentSeason, currentIdSeason }
        }
    } else {
        console.log("No se encontró la información del episodio actual.");
    }


}
/**
 * 
 * @param {String} idUser 
 * @param {Number} idSerie 
 * @param {Number} idSeason 
 * @param {Number} temporada 
 * @param {Number} capitulo 
 * @param {String} nameSerie 
 * @returns 
 */
export async function nextEpisode(idUser, idSerie, idSeason, temporada, capitulo, nameSerie) {
    const userDocRef = doc(db, "users", idUser);
    const toWatchDocRef = doc(userDocRef, `series/watching`);
    const toWatchSnapshot = await getDoc(toWatchDocRef);
    const thereIsNextEpisode = await verifyChapter(idSeason, temporada, capitulo)
    debugger
    if (thereIsNextEpisode !== false && thereIsNextEpisode !== undefined) {

        if (toWatchSnapshot.exists()) {
            const data = toWatchSnapshot.data();
            if (data[idSerie]?.current !== undefined) {
                let watching = data[idSerie].current + 1;
                await updateDoc(toWatchDocRef, {
                    [`${idSerie}.current`]: watching,
                    [`${idSerie}.last_modified`]: Timestamp.now()
                });
            } else {

                return false
            }
            return 'episode'
        }

    } else {
        let season, idCurrentSeason;
        try {
            const result = await verifySeason(idSerie, temporada);
            if (result) {
                season = result.seasonExists;
                idCurrentSeason = result.nextSeasonId;
            } else {
                const data = toWatchSnapshot.data();
                if (data[idSerie] !== undefined) {
                    await addSerieEnded(idUser, idSerie, nameSerie, data[idSerie].created_at, data[idSerie].urlImage)
                    await updateDoc(toWatchDocRef, {
                        [idSerie]: deleteField()
                    });

                    return 'endSeason';
                } else {
                    return false;
                }

            }
        } catch (error) {
            console.error('Error en verifySeason:', error);
            return 'endSeason';

        }

        let seasons
        const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
        if (response.status == 200) {
            seasons = await response.json();

        }

        if (season) {
            if (toWatchSnapshot.exists()) {
                const data = toWatchSnapshot.data();
                if (data[idSerie]?.currentSeason !== undefined) {

                    let watchingSeason = data[idSerie].currentSeason + 1;

                    await updateDoc(toWatchDocRef, {
                        [idSerie]: {
                            id: idSerie,
                            current: 1,
                            currentSeason: watchingSeason,
                            currentIdSeason: idCurrentSeason,
                            created_at: data[idSerie].created_at,
                            last_modified: Timestamp.now(),

                            urlImage: data[idSerie].urlImage
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
export async function singWatchedSeries(id) {
    try {
        const series = await allSeriesWatched(id)
        const response = await fetch('/asignarSeriesVistas', {
            method: 'post',
            body: JSON.stringify({ series, _token: document.body.dataset.csrf, }),
            headers: {
                "Content-Type": 'application/json',
                "X-Requested-With": 'XMLHttpRequest',
            },
            credentials: "include",
        });
        const json = await response.json();
        return json.success;
    } catch (error) {
        console.error('Error al notificar series vistas.');
    }
}
/**
 * 
 * @param {*} idUser 
 * @returns 
 */
export async function backEpisode(idUser, idSerie, idSeason, temporada, capitulo, nameSerie) {
    try {
        const userDocRef = doc(db, "users", idUser);
        const watchingDocRef = doc(userDocRef, `series/watching`);
        const watchingSnapshot = await getDoc(watchingDocRef);
        const thereIsBackEpisode = await verifyChapterBefore(idSeason, temporada, capitulo)
        if (thereIsBackEpisode !== false && thereIsBackEpisode !== undefined) {

            if (watchingSnapshot.exists()) {
                const data = watchingSnapshot.data();
                if (data[idSerie]?.current !== undefined) {
                    let watching = data[idSerie].current - 1;
                    await updateDoc(watchingDocRef, {
                        [`${idSerie}.current`]: watching,
                        [`${idSerie}.last_modified`]: Timestamp.now()
                    });
                } else {

                    return false
                }
                return 'episode before'
            }

        } else {
            let season, idCurrentSeason, beforeEpisode;
            try {
                const result = await verifySeasonBefore(idSerie, temporada);
                if (result) {
                    season = result.seasonExists;
                    idCurrentSeason = result.beforeSeasonId;
                    beforeEpisode = result.lastEpisode;

                } else {
                    const data = watchingSnapshot.data();
                    if (data[idSerie] !== undefined) {
                        // await addSerieEnded(idUser, idSerie, nameSerie, data[idSerie].created_at, data[idSerie].urlImage)
                        await updateDoc(watchingDocRef, {
                            [idSerie]: deleteField()
                        });

                        return 'remove';
                    } else {
                        return false;
                    }

                }
            } catch (error) {
                console.error('Error en verifySeason:', error);
                return false;
            }
            let seasons
            const response = await fetch(`https://api.tvmaze.com/shows/${idSerie}/seasons`);
            if (response.status == 200) {
                seasons = await response.json();
            }
            if (season) {
                if (watchingSnapshot.exists()) {
                    const data = watchingSnapshot.data();
                    if (data[idSerie]?.currentSeason !== undefined) {

                        let watchingSeason = data[idSerie].currentSeason - 1;

                        await updateDoc(watchingDocRef, {
                            [idSerie]: {
                                id: idSerie,
                                current: beforeEpisode,
                                currentSeason: watchingSeason,
                                currentIdSeason: idCurrentSeason,
                                created_at: data[idSerie].created_at,
                                last_modified: Timestamp.now(),

                                urlImage: data[idSerie].urlImage
                            }
                        });
                    } else {
                        return false
                    }
                    return 'season before'
                }
            }
        }
    } catch (error) {
        console.error(error)
    }
}
/**
 * Guardar puntuación en serie vista
 */
export async function rateSerie(rate, idUser, idSerie) {
    try {
        const userDocRef = doc(db, "users", idUser);
        const watchedDocRef = doc(userDocRef, "series/watched");
        const watchedSnapshot = await getDoc(watchedDocRef);
        if (!watchedSnapshot.exists()) {
            console.error("No se encontró el documento de series vistas.");
            return;
        }
        const watchedData = watchedSnapshot.data(); // Obtener datos del documento
        const seriesArray = watchedData?.watched || []; // Array de series
        const serieIndex = seriesArray.findIndex(show => {
            return show.idSerie === idSerie

        });
        if (serieIndex === -1) {
            console.error("La serie no está en la lista de vistas.");
            return;
        }
        seriesArray[serieIndex] = {
            ...seriesArray[serieIndex],
            rate: rate
        };

        await updateDoc(watchedDocRef, { watched: seriesArray });
    } catch (error) {

    }
}
export async function addSerieEnded(idUser, idSerie, nameSerie, created, urlImage) {
    const userDocRef = doc(db, "users", idUser);
    const watchedDocRef = doc(userDocRef, `series/watched`);
    const watchedSnapshot = await getDoc(watchedDocRef);

    const newWatchedSerie = {
        ['ended_at']: Timestamp.now(), ['created_at']: created, ['nameSerie']: nameSerie, ['idSerie']: idSerie,
        ['urlImage']: urlImage,
        ['rate']: null
    };
    if (watchedSnapshot.exists()) {

        // Si spamea el botón, no permite que se agregue más de una vez.
        let foundSerie = watchedSnapshot.data().watched.find(serie => serie.idSerie === idSerie);
        if (foundSerie) {
            return;
        }

        const alreadyWatched = watchedSnapshot.data().watched || [];

        alreadyWatched.push(newWatchedSerie);

        await updateDoc(watchedDocRef, {
            watched: alreadyWatched
        });
    } else {

        await setDoc(watchedDocRef, { watched: [newWatchedSerie] });
    }
    getLastSeriesWatched(idUser)
}

/**
 * 
 * @param {String} idUser 
 * @returns {Promise}
 */
export function allSeriesWatched(idUser) {
    const seriesWatchedRef = doc(db, `users/${idUser}/series/watched`);
    return getDoc(seriesWatchedRef)
        .then(seriesWatchedSnapshot => {
            if (seriesWatchedSnapshot.exists()) {
                let seriesWatchedObtained = seriesWatchedSnapshot.data().watched || [];
                return seriesWatchedObtained.reverse();
            } else {
                return false;
            }
        })
        .catch(error => {
            console.error(error);
            // return Promise.reject(error); // Propagar el error si es necesario
        });
}

/**
 * Dejamos comentarios para una determinada serie
 * @param {String} comment 
 * @param {String} idUser 
 * @param {Number} idSerie 
 */
export async function addCommentToSerie(comment, idUser, idSerie) {
    try {
        let currentComments
        const seriesInfoRef = doc(db, 'series', String(idSerie));
        const seriesInfoSnapshot = await getDoc(seriesInfoRef);
        const newComment = {
            userId: idUser,
            comment: comment,
            created_at: Timestamp.now()
        }
        if (seriesInfoSnapshot.exists()) {
            currentComments = seriesInfoSnapshot.data().comments || [];
            currentComments.push(newComment)
            await updateDoc(seriesInfoRef, { comments: currentComments })
        } else {
            currentComments = []
            currentComments.push(newComment)
            await setDoc(seriesInfoRef, {
                comments: currentComments
            })
        }
    } catch (error) {
        console.log(error)
    }
}

/**
 * Traemos todos los comentarios que haya por serie
 * @param {Function} callback 
 * @param {Number} idSerie 
 * @returns {Function}
 */
export async function bringCommentsFromSeries(callback, idSerie) {
    const seriesInfoRef = doc(db, 'series', String(idSerie));
    onSnapshot(seriesInfoRef, async (snapshot) => {
        const commentsData = snapshot.data()?.comments;
        if (commentsData) {
            let commentsArray = [];
            const promises = commentsData.map(async (comment) => {
                const userName = await getUsername(comment.userId);
                const commentInfo = comment.comment;
                const commentFull = {
                    userName:userName,
                    userId: comment.userId,
                    commentInfo,
                    created_at: comment.created_at
                };
                commentsArray.push(commentFull)
            });
            await Promise.all(promises);

            callback(commentsArray);
        }
    });
}