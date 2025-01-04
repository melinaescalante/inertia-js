
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, Timestamp, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

// TODO: Traer los mensajes de chat, optimizar la operación de escritura cacheando la
// referencia del documento de chat.
const privateChatCache = {

}
/**
 * Traemos de cache los mensajes
 * @param {String} senderId 
 * @param {String} receiverId 
 * @returns 
 */
function getCacheKey(senderId, receiverId) {
    return [senderId, receiverId].sort().join('_')
}
function putInCache(key, document) {
    privateChatCache[key] = document
}
function retrieveFromCache(key) {
    return privateChatCache[key] || null
}
async function privateChatDocument(senderId, receiverId) {
    const cacheKey = getCacheKey(senderId, receiverId)
    const cacheDoc = retrieveFromCache(cacheKey)
    if (cacheDoc) {

        return cacheDoc
    }
    // Necesitamos tener el documento de la conversación privada.
    // Empecemos por buscar a ver si ya existe.
    const chatRef = collection(db, 'private-chats');

    const chatQuery = query(chatRef, where('users', '==', {
        [senderId]: true,
        [receiverId]: true,
    }), limit(1));

    const chatSnapshot = await getDocs(chatQuery);
    let chatDoc;

    if (chatSnapshot.empty) {
        // Creamos el documento de la conversación privada entre estos usuarios.
        chatDoc = await addDoc(chatRef, {
            users: {
                [senderId]: true,
                [receiverId]: true,
            },
            userId: senderId,
            // last_modified: Timestamp.now()
        });
    } else {
        chatDoc = chatSnapshot.docs[0];
    }
    putInCache(cacheKey, chatDoc)
    return chatDoc
}
/**
 * 
 * @param {string} senderId 
 * @param {string} receiverId 
 * @param {string} text 
 */
export async function savePrivateChatMessage(senderId, receiverId, text) {

    const chatDoc = await privateChatDocument(senderId, receiverId)
    // Ahora que tenemos el documento, y especialmente su id, podemos grabar el mensaje en
    // la subcollection de messages del documento.
    const messagesRef = collection(db, `private-chats/${chatDoc.id}/messages`);

    await addDoc(messagesRef, {
        user_id: senderId,
        text,
        created_at: serverTimestamp(),
    });
    const chatDocRef = doc(db, 'private-chats', chatDoc.id);
    await updateDoc(chatDocRef, {
        last_modified: serverTimestamp(),
    });
}

/**
 * 
 * @param {String} senderId 
 * @param {String} receiverId 
 * @param {String} callback 
 */
export async function subscribeToPrivateChatMessages(senderId, receiverId, callback) {
    const chatDoc = await privateChatDocument(senderId, receiverId);
    const queryMessages = query(
        collection(db, `private-chats/${chatDoc.id}/messages`), orderBy('created_at'))
    onSnapshot(queryMessages, snapshot => {
        const messages = snapshot.docs.map(document => {
            return {
                id: document.id,
                user_id: document.data().user_id,
                text: document.data().text,
                created_at: document.data().created_at?.toDate()

            }
        }
        )
        callback(messages)
    })
}
/**
 * Devolvemos todos los chats activos del usuario
 * @param {String} idUser 
 * @returns {Array}
 */
export async function allChats(idUser) {
    let allChats = []
    const messagesRef = collection(db, `private-chats`);

    const chatQuery = query(
        messagesRef,
        where("users." + idUser, "==", true),
        // orderBy("last_modified",'desc')
    );

    const chatSnapshot = await getDocs(chatQuery);

    chatSnapshot.forEach(doc => {
        allChats.push(doc.data());
    });
    allChats.sort((a, b) => {
        const dateA = a.last_modified?.toMillis?.() 
        const dateB = b.last_modified?.toMillis?.() || 0;
        return dateB - dateA; 
    });
// console.log(allChats)
    return allChats;
}
