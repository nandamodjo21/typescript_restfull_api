
const {
  DisconnectReason,
  makeWASocket,
  useMultiFileAuthState,
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent,
} = require("@whiskeysockets/baileys");
import { Boom } from "@hapi/boom";
import { ulid } from "ulid";
export let sock: any;

export async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(
    "./sessions/sessions_whatsapp"
  );

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveCreds);
  sock.ev.on(
    "connection.update",
    (update: { connection: any; lastDisconnect: any }) => {
      const { connection, lastDisconnect } = update;
      if (connection === "close") {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;
        if (shouldReconnect) {
          startBot();
        } else {
          console.log("Kamu telah logout");
        }
      } else if (connection === "open") {
        console.log("WhatsApp bot siap digunakan!");
      }
    }
  );



  sock.ev.on("messages.upsert", async (m: any) => {
    const incomingMessage = m.messages[0];
    if (incomingMessage?.key.fromMe) return;

    const remoteJid = incomingMessage.key.remoteJid;
    const messagesContent = incomingMessage.message.conversation;
    const name = incomingMessage.message.conversation.name;
    console.log(`nama ${name}`)
    const key = {
      remoteJid:remoteJid,
      id: 'AHASHH123123AHGA', // id of the message you want to read
      participant: sock.user.id // the ID of the user that sent the  message (undefined for individual chats)
    }
    await sock.readMessages([key])
    if (messagesContent === "button") {
      const imageUrl =
        "https://w7.pngwing.com/pngs/781/186/png-transparent-android-software-development-rooting-android-fictional-character-material-mobile-phones.png";
      const generate = async (type: any, url: string) => {
        const generated = await generateWAMessageContent(
          {
            [type]: { url },
          },
          {
            upload: sock.waUploadToServer,
          }
        );
        return generated[`${type}Message`];
      };

      //section List----------------------------

      const listSections = [
        {
          title:"Minuman",
          rows:[
            {
              header:'Captikus',
              title:'Bakar Manyala',
              description:'ini cap tikus sangat ampuh untuk membuat anda terbang',
              id:'1'
            },
            {
              header:'Pinaraci',
              title:'ini section 1/2',
              description:'ini desc section 1/2',
              id:'2'
            }
          ]
        },
        {
          // title:"section 2",
          rows:[
            {
              header:'ini header section 2',
              title:'ini section 2',
              description:'ini desc section 2',
              id:'1'
            },
            {
              header:'ini header section 2/2',
              title:'ini section 2/2',
              description:'ini desc section 2/2',
              id:'2'
            }
          ]
        }
      ];

      //section List----------------------------



      // Button ----------------------------

      const buttons = [
        {
          name: "cta_call",
          buttonParamsJson: JSON.stringify({
            display_text: "VCS",
            id: "id1",
            phone_number: "6285340440971",
          }),
        },
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "copy",
            id: "id2",
            copy_code: "halo",
          }),
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "balas babi",
            id: "id3",
          }),
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "link bokep",
            id: "id4",
            url: "https://www.youtube.com/@teamrrq",
          }),
        },
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "PILIH",
            sections:listSections
          }),
        },
      ];

      const interactiveMessage = {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: "INFO NONGKI DULU",
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "PILIH JO:",
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "KONTOL BAPAK KAU PECAH",
                hasMediaAttachment: true,
                imageMessage: await generate("image", imageUrl),
              }),
              nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: buttons,
                  messageParamsJson: JSON.stringify({
                    from: "api",
                    templateId: ulid(Date.now()),
                  }),
                }),
            }),
          },
        },
      };

      const msg = generateWAMessageFromContent(remoteJid, interactiveMessage, {
        userJid: sock.user.id,
      });

      try {
        await sock.relayMessage(remoteJid, msg.message, {
          messageId: msg.key.id,
        });
        console.log("Pesan balasan dengan tombol berhasil dikirim");
      } catch (error) {
        console.error("Gagal mengirim pesan balasan:", error);
      }
    }
  });


  sock.ev.on("messages.upsert",async (m:any)=>{
    const incomingMessage = m.messages[0];
    if (incomingMessage?.key.fromMe) return;

    const remoteJid = incomingMessage.key.remoteJid;
    const messagesContent = incomingMessage.message.conversation;
    if (messagesContent === 'ok'){


      const listSections = [
        {
          rows:[
            {
              title:'Captikus',
              description:'ini cap tikus sangat ampuh untuk membuat anda terbang',
              id:'1'
            },
            {

              title:'Pinaraci',
              description:'ini lumayan lah untuk ngefly dikit',
              id:'2'
            },
            {

              title:'Bohito',
              description:'minuman the best. recommended lah pokoknya',
              id:'3'
            },
            {

              title:'Komix',
              description:'ini lumayan lah buat terbang seharian',
              id:'4'
            }
          ]
        },
        // {
        //   // title:"section 2",
        //   rows:[
        //     {
        //       header:'ini header section 2',
        //       title:'ini section 2',
        //       description:'ini desc section 2',
        //       id:'1'
        //     },
        //     {
        //       header:'ini header section 2/2',
        //       title:'ini section 2/2',
        //       description:'ini desc section 2/2',
        //       id:'2'
        //     }
        //   ]
        // }
      ];

      const buttons = [
        {
          name: "cta_call",
          buttonParamsJson: JSON.stringify({
            display_text: "VCS",
            id: "id1",
            phone_number: "6285340440971",
          }),
        },
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "copy",
            id: "id2",
            copy_code: "halo",
          }),
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "balas babi",
            id: "id3",
          }),
        },
        {
          name: "cta_url",
          buttonParamsJson: JSON.stringify({
            display_text: "link bokep",
            id: "id4",
            url: "https://www.youtube.com/@teamrrq",
          }),
        },
        {
          name: "single_select",
          buttonParamsJson: JSON.stringify({
            title: "PILIH",
            sections:listSections
          }),
        },
      ];


      const invasiMessage = {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: "INFO NONGKI DULU",
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "PILIH JO:",
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "KONTOL BAPAK KAU PECAH",
              }),
              nativeFlowMessage:
                  proto.Message.InteractiveMessage.NativeFlowMessage.create({
                    buttons: buttons,
                    messageParamsJson: JSON.stringify({
                      from: "api",
                      templateId: ulid(Date.now()),
                    }),
                  }),
            }),
          },
        },
      };

      const msg = generateWAMessageFromContent(remoteJid, invasiMessage, {
        userJid: sock.user.id,
      });

      try {
        await sock.relayMessage(remoteJid, msg.message, {
          messageId: msg.key.id,
        });
        console.log("Pesan balasan dengan tombol berhasil dikirim");
      } catch (error) {
        console.error("Gagal mengirim pesan balasan:", error);
      }
    }
  });
}
