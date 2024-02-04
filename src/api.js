import { createHash } from 'node:crypto'
import dotenv from "dotenv"
dotenv.config();

const publicKey = process.env.PUBKEY
const privateKey = process.env.PRIVKEY
/**
 * Récupère les données de l'endpoint en utilisant les identifiants
 * particuliers developer.marvels.com
 * @param url l'end-point
 * @return {Promise<json>}
 */
export const getData = async (url) => {
    const ts = new Date().getTime()
    const hash = await getHash(publicKey,privateKey,ts)
    const req = url+"?"+ new URLSearchParams({
        ts:ts,
        apikey:publicKey,
        hash:hash
        });
    const response = await fetch(req);
    const body = await response.json();
    const marvelChar = body.data.results;
    const thumbnailMarvelChar = [];
    const thumbnailNotAvailable = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available';
    for(let i = 0; i < marvelChar.length; i++) {
        if(marvelChar[i].hasOwnProperty("thumbnail")) {
            if (marvelChar[i].thumbnail.path !== thumbnailNotAvailable) {
                thumbnailMarvelChar.push(marvelChar[i])
            }
        }
    }
    return thumbnailMarvelChar.map(char => ({
        name: char.name,
        imageUrl: char.thumbnail.path+"/portrait_xlarge."+char.thumbnail.extension
    }));
}

/**
 * Calcul la valeur md5 dans l'ordre : timestamp+privateKey+publicKey
 * cf documentation developer.marvels.com
 * @param publicKey
 * @param privateKey
 * @param timestamp
 * @return {Promise<ArrayBuffer>} en hexadecimal
 */
export const getHash = async (publicKey, privateKey, timestamp) => {
    return createHash('md5').update(timestamp+privateKey+publicKey).digest("hex");
}