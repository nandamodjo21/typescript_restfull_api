// import makeWASocket, {
//   DisconnectReason,
//   fetchLatestBaileysVersion,
//   generateWAMessageContent,
//   generateWAMessageFromContent,
//   proto,
//   useMultiFileAuthState,
// } from "@whiskeysockets/baileys";
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
  //   const { version, isLatest } = await fetchLatestBaileysVersion();
  //   console.log(`using WA v${version}, isLatest: ${isLatest}`);
  const { state, saveCreds } = await useMultiFileAuthState(
    "./sessions/auth_info"
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
          startBot();
          console.log("Kamu telah logout");
        }
      } else if (connection === "open") {
        console.log("WhatsApp bot siap digunakan!");
      }
    }
  );

  sock.ev.on("messages.upsert", async (m: { messages: any[] }) => {
    const mes = m.messages[0];
    if (!mes.message) return;
    const group = mes.key.group;
    console.log(group);
    const fromMe = mes.key.fromMe;
    if (fromMe) return;
    const messageContent = mes.message.conversation || "";
    // if (fromMe) return;
    if (messageContent === "tes") {
    }
  });

  sock.ev.on("messages.upsert", async (m: any) => {
    const incomingMessage = m.messages[0];
    if (incomingMessage?.key.fromMe) return;

    const remoteJid = incomingMessage.key.remoteJid;
    const messagesContent = incomingMessage.message.conversation;
    if (messagesContent === "list") {
      const listMessage = proto.Message.ListMessage.create({
        title: "Pilihan Produk",
        description: "Silakan pilih salah satu produk.",
        buttonText: "Pilih",
        listType: proto.Message.ListMessage.ListType.SINGLE_SELECT,
        sections: [
          proto.Message.ListMessage.Section.create({
            title: "Kategori 1",
            rows: [
              proto.Message.ListMessage.Row.create({
                title: "Produk A",
                description: "Deskripsi A",
                rowId: "prod_a",
              }),
              proto.Message.ListMessage.Row.create({
                title: "Produk B",
                description: "Deskripsi B",
                rowId: "prod_b",
              }),
            ],
          }),
          proto.Message.ListMessage.Section.create({
            title: "Kategori 2",
            rows: [
              proto.Message.ListMessage.Row.create({
                title: "Produk C",
                description: "Deskripsi C",
                rowId: "prod_c",
              }),
              proto.Message.ListMessage.Row.create({
                title: "Produk D",
                description: "Deskripsi D",
                rowId: "prod_d",
              }),
            ],
          }),
        ],
        footerText: "Terima kasih telah berbelanja!",
      });

      const msg = generateWAMessageFromContent(
        remoteJid,
        { listMessage: listMessage },
        {
          userJid: sock.user.id,
        }
      );

      try {
        await sock.sendMessage(remoteJid, msg.message);
        console.log("Pesan ListMessage berhasil dikirim");
      } catch (error) {
        console.error("Gagal mengirim pesan ListMessage:", error);
      }
    }
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
            id: "id5",
            listType: proto.Message.ListMessage.ListType.SINGLE_SELECT,
            list: [
              proto.Message.ListMessage.Row.create({
                title: "Produk A",
                description: "Deskripsi A",
                rowId: "prod_a",
              }),
            ],
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
}
