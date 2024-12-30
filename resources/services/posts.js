import { db, storage } from './firebase'
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc, getDoc, where, deleteDoc, getDocs, limit, startAfter, Timestamp } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getNameUser, getPhotoURL, getUserName, sortArrayFromLocalStorage } from './users';
/**
 * 
 * @param {{text:String, serie:String, image:String, userid:String,}}
 * @returns {Promise} 
 */
export async function uploadPost({ text, serie, idSerie, image, userid }) {
    const postRef = collection(db, 'posts-public')
    await addDoc(postRef, {
        text,
        serie,
        idSerie,
        image,
        userid,
        likes: [],
        created_at: serverTimestamp()
    });
}

/**
 * Cargamos los últimos 4 posteos
 * @param {String} idUser 
 * @param {Function} callback 
 * @returns {Function}
 */
export function fetchPosts(idUser, seriesCurrent, callback) {
    try {
// console.log(seriesCurrent)
        const queryPost = query(
            collection(db, 'posts-public'),
            where('idSerie', 'in', seriesCurrent),
            orderBy('created_at', 'desc'),
            limit(4)
        );
        //Usamos onsnapshot para ver los cambios como likes y comentarios
        const unsubscribe = onSnapshot(queryPost, async (snapshot) => {

            const posts = snapshot.docs.map(async (post) => {
                const like = await isLiked(post.id, idUser);
                return {
                    id: post.id,
                    photoURL: await getPhotoURL(post.data().userid),
                    serie: post.data().serie,
                    idSerie: post.data().idSerie,

                    text: post.data().text,
                    image: post.data().image,
                    likes: post.data().likes || [],
                    comments: post.data().comments || [],
                    shares: post.data().shares,
                    user: await getUserName(post.data().userid),
                    userid: post.data().userid,
                    liked: like,
                    created_at: post.data().created_at,
                };
            });
            const postsData = await Promise.all(posts);
            callback(postsData);
        });
        return unsubscribe;
    } catch (error) {
        if (seriesCurrent) {
            callback(false); 
            return () => { };


        }
        console.log(error)
        callback([]);
        return () => { };

    }
}
/**
 * Cargamos los últimos 4 posteos de mis seguidos
 * @param {String} idUser 
 * @param {Function} callback 
 * @returns {Function}
 */
export function fetchPostsFollowed(idUser, following, callback) {
    try {

        const queryPost = query(
            collection(db, 'posts-public'),
            where('userid', 'in', following),
            orderBy('created_at', 'desc'),
            limit(4)
        );
        //Usamos onsnapshot para ver los cambios como likes y comentarios
        const unsubscribe = onSnapshot(queryPost, async (snapshot) => {
            const posts = snapshot.docs.map(async (post) => {
                const like = await isLiked(post.id, idUser);
                return {
                    id: post.id,
                    photoURL: await getPhotoURL(post.data().userid),
                    serie: post.data().serie,
                    idSerie: post.data().idSerie,

                    text: post.data().text,
                    image: post.data().image,
                    likes: post.data().likes || [],
                    comments: post.data().comments || [],
                    shares: post.data().shares,
                    user: await getUserName(post.data().userid),
                    userid: post.data().userid,
                    liked: like,
                    created_at: post.data().created_at,
                };
            });
            const postsData = await Promise.all(posts);
            callback(postsData);
        });
        return unsubscribe;
    } catch (error) {
        if (following) {
            callback(false); 
            return () => { };


        }
        console.log(error)
        callback([]);
        return () => { };

    }
}
/**
 * 
 * @param {Timestamp} created_at 
 * @returns {Promise}
 */
export async function fetchPostsFollowedFrom(following, created_at) {
    const posts = await getDocs(
        query(
            collection(db, 'posts-public'),
            where('userid', 'in', following),

            orderBy('created_at', 'desc'),
            limit(4),
            startAfter(created_at),
        )
    );
    const promises = posts.docs.map(async post => {
        return {
            id: post.id,
            photoURL: await getPhotoURL(post.data().userid),
            serie: post.data().serie,
            idSerie: post.data().idSerie,

            text: post.data().text,
            image: post.data().image,
            likes: post.data().likes || [],
            comments: post.data().comments,
            shares: post.data().shares,
            user: await getUserName(post.data().userid),
            userid: post.data().userid,
            liked: like,
            created_at: post.data().created_at,
        }
    });
    return await Promise.all(promises)
}
/**
 * 
 * @param {Timestamp} created_at 
 * @returns {Promise}
 */
export async function fetchPostsFrom(seriesCurrent, created_at) {
    const posts = await getDocs(
        query(
            collection(db, 'posts-public'),
            where('idSerie', 'in', seriesCurrent),

            orderBy('created_at', 'desc'),
            limit(4),
            startAfter(created_at),
        )
    );
    const promises = posts.docs.map(async post => {
        return {
            id: post.id,
            photoURL: await getPhotoURL(post.data().userid),
            serie: post.data().serie,
            idSerie: post.data().idSerie,

            text: post.data().text,
            image: post.data().image,
            likes: post.data().likes || [],
            comments: post.data().comments,
            shares: post.data().shares,
            user: await getUserName(post.data().userid),
            userid: post.data().userid,
            liked: like,
            created_at: post.data().created_at,
        }
    });
    return await Promise.all(promises)
}
/**
 * 
 * @param {String} image 
 * @returns {String} downloadUrl
 */
export async function uploadPhoto(image) {
    try {
        const storageRefe = storageRef(storage, `posts/${image.name}`);
        await uploadBytes(storageRefe, image);
        const downloadURL = await getDownloadURL(storageRefe);
        return downloadURL
    } catch (error) {
        console.error('Error al subir la imagen:', error);
    }
}

/**
*Traemos una publicacion en especifico, mediante su id.
* @param {Function} callback
* @param {String} id
* @returns {Promise}
*/
export async function readPostsById(callback, id, userid) {
    const postRef = doc(db, "posts-public", id);

    onSnapshot(postRef, async (postSnapshot) => {
        if (postSnapshot.exists()) {
            const like = await isLiked(postSnapshot.id, userid);
            const postFound = {
                id: postSnapshot.id,
                serie: postSnapshot.data().serie,
                idSerie: postSnapshot.data().idSerie,
                text: postSnapshot.data().text,
                image: postSnapshot.data().image,
                photoURL: await getPhotoURL(postSnapshot.data().userid),
                user: await getUserName(postSnapshot.data().userid),
                likes: postSnapshot.data().likes,
                comments: postSnapshot.data().comments,
                shares: postSnapshot.data().shares,
                userid: postSnapshot.data().userid,
                liked: like,
                created_at: postSnapshot.data().created_at

            };

            callback(postFound);
        }
    });
}
/**
*Traemos los posteos de un usuario específico, mediante su id.
* @param {callback:function, userid: string} 
* @returns {Promise}
*/
export async function readPostsByUser(callback, userid) {
    const postQuery = query(
        collection(db, "posts-public"),
        where("userid", "==", userid),
        orderBy("created_at", "desc")
    );

    onSnapshot(postQuery, async (snapshot) => {

        const posts = [];

        const promises = snapshot.docs.map(async (doc) => {
            const like = await isLiked(doc.id, userid);
            const post = {
                id: doc.id,
                serie: doc.data().serie,
                idSerie: doc.data().idSerie,
                text: doc.data().text,
                image: doc.data().image,
                user: await getUserName(doc.data().userid),
                likes: doc.data().likes,
                userid: doc.data().userid,
                comments: doc.data().comments,
                shares: doc.data().shares,
                liked: like,
                created_at: doc.data().created_at,
            };
            posts.push(post);
        });
        await Promise.all(promises);

        callback(posts);
    });
}
/**
 * Funcion que consulta si el usuario le ha dado like a la publicacion y así colorea el ícono
 * @param {String} id 
 * @param {String} userid 
 * @returns {Boolean}
 */
export async function isLiked(id, userid) {
    const postRef = doc(db, 'posts-public', id);
    const postSnapshot = await getDoc(postRef);
    const currentLikes = postSnapshot.data().likes || [];
    const userFound = currentLikes.find(user => {
        return Object.keys(user)[0] === userid;
    });
    return userFound ? true : false;
}
/**
 * Permite darle likes a las publicaciones y almacenar en firebase
 * @param {String} id 
 * @param {String} operador 
 * @param {String} userid 
 * @returns {Promise}
 */
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
            }
        }
    } catch (error) {
        console.log("Documento no existente");

    }

}

/**
 * Permite comentar en las publicaciones
 * @param {String} id 
 * @param {String} comment 
 * @param {String} iduser 
 * @returns {Promise}
 */
export async function comment(id, comment, iduser) {
    try {

        const postRef = doc(db, 'posts-public', id);
        const postSnapshot = await getDoc(postRef);
        if (postSnapshot) {
            const currentComments = postSnapshot.data().comments || [];
            const newComment = { [iduser]: comment ,['created_at']:Timestamp.now()};
            currentComments.push(newComment);

            await updateDoc(postRef, {
                comments: currentComments
            });

        } else {
            console.log("El post no existe.");
        }
    } catch (error) {
        console.log("Error al agregar el comentario:", error);
    }
}
/**
 * Traemos comentarios de cada publicación
 * @param {Function} callback 
 * @param {String} id 
 * @returns {Function}
 */
export async function getComments(callback, id) {
    try {
        const postRef = doc(db, 'posts-public', id);
        onSnapshot(postRef, async (snapshot) => {
            const commentsData = snapshot.data()?.comments;
            if (commentsData) {
                let commentsArray = [];
                const promises = commentsData.map(async (comment) => {
                    const userName = await getUserName(Object.keys(comment)[0]);
                    const commentInfo = Object.values(comment)[0];
                    console.log(commentsData)
                    const commentFull = {
                        userName,
                        userId: Object.keys(comment)[0],
                        commentInfo,
                        created_at:comment.created_at
                        
                    };
                    console.log(commentFull)
                    commentsArray.push(commentFull)
                });
                await Promise.all(promises);
                commentsArray.reverse();

                callback(commentsArray);
            }
        });
    } catch (error) {
        console.log(error);
    }
}
/**
 * Permite eliminar posteos
 * @param {String} id 
 * @returns {Promise}
 */
export async function deletePost(id) {
    try {

        const postRef = doc(db, "posts-public", id);
        await deleteDoc(postRef);
    } catch (error) {
        console.log(error)
    }

}
