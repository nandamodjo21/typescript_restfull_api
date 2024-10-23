// import makeWASocket, { DisconnectReason, proto } from '@adiwajshing/baileys';
// import {useMultiFileAuthState} from "@whiskeysockets/baileys";
// import { Boom } from '@hapi/boom';
//
// const { state, saveState } = useMultiFileAuthState('./auth_info.json');
//
// async function startBot() {
//     const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
//
//     const sock = makeWASocket({
//         auth: state,
//         printQRInTerminal: true,
//     });
//
//     // Tangani pembaruan state
//     sock.ev.on('creds.update', saveCreds);
//     sock.ev.on('messages.upsert', async (m) => {
//         const msg = m.messages[0];
//         if (!msg.message) return;
//
//         const from = msg.key.remoteJid;
//         const messageContent = msg.message.conversation || '';
//
//         if (messageContent.toLowerCase() === 'menu') {
//             await sendButtonTemplate(sock, from);
//         }
//     });
//
//     sock.ev.on('connection.update', (update) => {
//         const { connection, lastDisconnect } = update;
//         if (connection === 'close') {
//             const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
//             if (shouldReconnect) {
//                 startBot();
//             }
//         } else if (connection === 'open') {
//             console.log('WhatsApp bot siap digunakan!');
//         }
//     });
//
//     sock.ev.on('messages.upsert', async (m) => {
//         const msg = m.messages[0];
//         if (!msg.message) return;
//
//         const from = msg.key.remoteJid;
//
//         if (msg.message.buttonsResponseMessage) {
//             const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;
//             if (buttonId === 'id1') {
//                 await sock.sendMessage(from, { text: 'Kamu memilih Opsi 1!' });
//             } else if (buttonId === 'id2') {
//                 await sock.sendMessage(from, { text: 'Kamu memilih Opsi 2!' });
//             } else if (buttonId === 'id3') {
//                 await sock.sendMessage(from, { text: 'Kamu memilih Opsi 3!' });
//             }
//         }
//     });
// }
//
// async function sendButtonTemplate(sock: any, jid: string | null | undefined) {
//     if (!jid) return;
//
//     const buttons = [
//         { buttonId: 'id1', buttonText: { displayText: 'Opsi 1' }, type: 1 },
//         { buttonId: 'id2', buttonText: { displayText: 'Opsi 2' }, type: 1 },
//         { buttonId: 'id3', buttonText: { displayText: 'Opsi 3' }, type: 1 },
//     ];
//
//     const buttonMessage = {
//         text: 'Pilih salah satu opsi:',
//         buttons: buttons,
//         headerType: 1,
//     };
//
//     await sock.sendMessage(jid, buttonMessage as unknown as proto.Message);
// }
//
// startBot();
