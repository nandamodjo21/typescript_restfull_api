import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion, generateWAMessageFromContent, prepareWAMessageMedia,
    proto,
    useMultiFileAuthState
} from "@whiskeysockets/baileys";
import {Boom} from "@hapi/boom";
import mime from "mime";
import {ResponseError} from "../error/response_error";
import e from "express";
import {MediaMessage} from "../config/send_buttons";
import {isURL} from "class-validator";

export let sock: any;

export async function startBot() {
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(`using WA v${version}, isLatest: ${isLatest}`);
    const { state, saveCreds } = await useMultiFileAuthState('./sessions/auth_info');

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
    });

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', (update: { connection: any; lastDisconnect: any; }) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                startBot();
            } else {
                console.log('Kamu telah logout');
            }
        } else if (connection === 'open') {
            console.log('WhatsApp bot siap digunakan!');
        }
    });

    sock.ev.on('messages.upsert', async (m: { messages: any[]; }) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const fromMe = msg.key.fromMe;
        const messageContent = msg.message.conversation || '';
        console.log('Pesan diterima:', messageContent);


    });
}

// Fungsi untuk mengirim pesan tombol tanpa media
// private async const prepareMediaMessage = (mediaMessage: MediaMessage & {mimetype?:string}) => {
//     try {
//         const prepareMedia = await prepareWAMessageMedia(undefined, undefined
//
//         );
//
//         const mediaType = mediaMessage.mediatype + 'Message';
//
//         // Menentukan nama file jika media adalah dokumen
//         if (mediaMessage.mediatype === 'document' && !mediaMessage.fileName) {
//             const regex = new RegExp(/.*\/(.+?)\./);
//             const arrayMatch = regex.exec(mediaMessage.media as string);
//             mediaMessage.fileName = arrayMatch ? arrayMatch[1] : 'default_name';
//         }
//
//         // Menentukan MIME type
//         let mimetype: string | boolean;
//         if (typeof mediaMessage.media === 'string' && isURL(mediaMessage.media)) {
//             mimetype = mime.lookup(mediaMessage.media);
//             if (!mimetype) {
//                 const head = await axios.head(mediaMessage.media as string);
//                 mimetype = head.headers['content-type'];
//             }
//         } else {
//             mimetype = mime.lookup(mediaMessage.fileName);
//         }
//
//         prepareMedia[mediaType].caption = mediaMessage?.caption;
//         prepareMedia[mediaType].mimetype = mediaMessage?.mimetype || mimetype;
//         prepareMedia[mediaType].fileName = mediaMessage.fileName;
//
//         return generateWAMessageFromContent(
//             '',
//             { [mediaType]: { ...prepareMedia[mediaType] } },
//             { userJid: this.instance.ownerJid },
//         );
//     } catch (error) {
//         throw new ResponseError(404,`${error}`);
//     }
// };
//
//
// public async const buttonsMessage(data: SendButtonsDto) {
//     const generate = await (async () => {
//         if (data.buttonsMessage?.thumbnailUrl) {
//             return await this.prepareMediaMessage({
//                 mediatype: 'image',
//                 media: data.buttonsMessage.thumbnailUrl,
//             });
//         }
//     })();
//
//     const message: proto.IMessage = {
//         viewOnceMessage: {
//             message: {
//                 messageContextInfo: {
//                     deviceListMetadata: {},
//                     deviceListMetadataVersion: 2,
//                 },
//                 interactiveMessage: {
//                     body: {
//                         text: (() => {
//                             let t = '*' + data.buttonsMessage.title + '*';
//                             if (data.buttonsMessage?.description) {
//                                 t += '\n\n' + data.buttonsMessage.description + '\n';
//                             }
//                             return t;
//                         })(),
//                     },
//                     footer: {
//                         text: data.buttonsMessage?.footer,
//                     },
//                     header: (() => {
//                         if (generate?.message?.imageMessage) {
//                             return {
//                                 hasMediaAttachment: true,
//                                 imageMessage: generate.message.imageMessage,
//                             };
//                         }
//                     })(),
//                     nativeFlowMessage: {
//                         buttons: data.buttonsMessage.buttons.map((value) => ({
//                             name: value.typeButton,
//                             buttonParamsJson: value.toJSONString(),
//                         })),
//                         messageParamsJson: JSON.stringify({
//                             from: 'api',
//                             templateId: ulid(Date.now()),
//                         }),
//                     },
//                 },
//             },
//         },
//     };
//
// }



