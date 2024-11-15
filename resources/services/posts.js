import { db, storage } from './firebase'
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc, getDoc, where, deleteDoc, getDocs, limit, startAfter } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getNameUser, getPhotoURL } from './users';

export async function uploadPost({ text, serie, image, userid }) {
    const postRef = collection(db, 'posts-public')
    await addDoc(postRef, {
        text,
        serie,
        image,
        userid,
        likes: [],
        created_at: serverTimestamp()
    });
}
export function fetchPosts(idUser, callback) {
    try {
        // Configura la consulta inicial
        const queryPost = query(
            collection(db, 'posts-public'),
            orderBy('created_at', 'desc'),
            limit(4)
        );

        // Usar onSnapshot para escuchar los cambios en tiempo real
        const unsubscribe = onSnapshot(queryPost, async (snapshot) => {
            const posts = snapshot.docs.map(async (post) => {
                const like = await isLike(post.id, idUser);
                console.log(post.data().comments?.length)
                return {
                    id: post.id,
                    photoURL: await getPhotoURL(post.data().userid),
                    serie: post.data().serie,
                    text: post.data().text,
                    image: post.data().image,
                    likes: post.data().likes || [],
                    comments: post.data().comments || [],
                    shares: post.data().shares,
                    user: await getNameUser(post.data().userid),
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
        console.log(error);
    }
}


export async function fetchPostsFrom(created_at) {
    const posts = await getDocs(
        query(
            collection(db, 'posts-public'),
            orderBy('created_at', 'desc'),
            limit(4),
            startAfter(created_at),
        )
    );
    const promises= posts.docs.map(async post => {
        console.log(post.data())
        return {
            id: post.id,
            photoURL: await getPhotoURL(post.data().userid),
            serie: post.data().serie,
            text: post.data().text,
            image: post.data().image,
            likes: post.data().likes || [],
            comments: post.data().comments,
            shares: post.data().shares,
            user: await getNameUser(post.data().userid),
            userid: post.data().userid,
            liked: like,
            created_at: post.data().created_at,
        }
    });
    return await Promise.all(promises) 
}
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
*Traemos uTodas las publicaciones.
* @param {callback:function} data
* @returns {{Promise}}
*/
// export async function readPosts(callback, userid) {
//     const postsRef = collection(db, 'posts-public')
//     const postQuery = query(postsRef, orderBy("created_at", "desc"));
//     onSnapshot(postQuery, async (snapshot) => {
//         const posts = [];
//         for (const doc of snapshot.docs) {
//             const like = await isLike(doc.id, userid)
//             const post = {
//                 id: doc.id,
//                 photoURL: await getPhotoURL(doc.data().userid),
//                 serie: doc.data().serie,
//                 text: doc.data().text,
//                 image: doc.data().image,
//                 likes: doc.data().likes || [],
//                 comments: doc.data().comments,
//                 shares: doc.data().shares,
//                 user: await getNameUser(doc.data().userid),
//                 userid: doc.data().userid,
//                 liked: like,
//                 created_at: doc.data().created_at
//             };
//             posts.push(post);
//         }
//         callback(posts)

//     })

// }
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

                user: await getNameUser(postSnapshot.data().userid),
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
* @param {{callback:function, userid: string}} data
* @returns {{Promise}}
*/
export async function readPostsByUser(callback, userid) {
    const postQuery = query(collection(db, "posts-public"), where("userid", "==", userid));

    onSnapshot(postQuery, async (snapshot) => {
        const posts = [];

        const promises = snapshot.docs.map(async (doc) => {
            const like = await isLike(doc.id, userid);
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
                created_at: doc.data().created_at,
            };
            posts.push(post);
        });

        await Promise.all(promises);

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
export async function getComments(callback, id) {
    try {
        const postRef = doc(db, 'posts-public', id);
        onSnapshot(postRef, async (snapshot) => {
            const commentsData = snapshot.data()?.comments;
            if (commentsData) {
                let commentsArray = [];
                const promises = commentsData.map(async (comment) => {
                    const userName = await getNameUser(Object.keys(comment)[0]);
                    const commentInfo = Object.values(comment)[0];
                    const commentFull = {
                        userName,
                        userId: Object.keys(comment)[0],
                        commentInfo,

                    };
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

export async function deletePost(id) {
    try {

        const postRef = doc(db, "posts-public", id);
        await deleteDoc(postRef);
    } catch (error) {
        console.log(error)
    }

}
