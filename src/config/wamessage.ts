import {MediaMessage, SendButtonsDto} from "./connectwa";
import {generateWAMessageFromContent, prepareWAMessageMedia, proto, WASocket} from "@whiskeysockets/baileys";
import {isURL} from "class-validator";
import {Readable} from "node:stream";
import MediaType = proto.ContextInfo.ExternalAdReplyInfo.MediaType;
import axios from "axios";
import mime from "mime-types";
import {ulid} from "ulid";
import {sock} from "../utils/star_sock";

export class WaMessage {
    private client: WASocket;
    constructor(client: WASocket) {
        this.client = client;
    }
    private async prepareWaMessage(mediaMessage: MediaMessage & { mimeType?: string }) {
        try {
            const prepareMedia = await prepareWAMessageMedia(
                {
                    mediaMessage: isURL(mediaMessage.media as string)
                        ? { url: mediaMessage.media } : (mediaMessage.media as Buffer),
                } as any,
                {
                    upload: this.client.waUploadToServer
                }
            );

            const mediaType = mediaMessage.mediatype + 'message';

            if (mediaMessage.mediatype === 'document' && !mediaMessage.fileName) {
                const regex = new RegExp(/.*\/(.+?)\./);
                const arrayMatch = regex.exec(mediaMessage.media as string);
                mediaMessage.fileName = arrayMatch![1];
            }
            let mimetype: string | boolean;
            if (typeof mediaMessage.media === 'string' && isURL(mediaMessage.media)) {
                mimetype = mime.lookup(mediaMessage.media);
                if (!mimetype) {
                    const head = await axios.head(mediaMessage.media as string);
                    mimetype = head.headers['content-type'];
                }
            } else {
                mimetype = mime.lookup(mediaMessage.fileName!);
            }


            return generateWAMessageFromContent(
                '',
                { [mediaType]: { ...prepareMedia } },
                { userJid: '6285340440971@s.whatsapp.net' },
            );
        } catch (e) {
            // Handle error
        }
    }
     async sendButton(data:SendButtonsDto, jid:string){
        const generate = await (async () => {
            if (data.buttonsMessage?.thumbnailUrl) {
                return await this.prepareWaMessage({
                    mediatype: 'image',
                    media: "https://example.com/image.jpg",
                });
            }
        })();

        const message: proto.IMessage = {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2,
                    },
                    interactiveMessage: {
                        body: {
                            text: (() => {
                                let t = '*' + data.buttonsMessage.title + '*';
                                if (data.buttonsMessage?.description) {
                                    t += '\n\n';
                                    t += data.buttonsMessage.description;
                                    t += '\n';
                                }
                                return t;
                            })(),
                        },
                        footer: {
                            text: data.buttonsMessage?.footer,
                        },
                        header: (() => {
                            if (generate?.message?.imageMessage) {
                                return {
                                    hasMediaAttachment: !!generate.message.imageMessage,
                                    imageMessage: generate.message.imageMessage,
                                };
                            }
                        })(),
                        nativeFlowMessage: {
                            buttons: data.buttonsMessage.buttons.map((value) => {
                                return {
                                    name: value.typeButton,
                                    buttonParamsJson: value.toJSONString(),
                                };
                            }),
                            messageParamsJson: JSON.stringify({
                                from: 'api',
                                templateId: ulid(Date.now()),
                            }),
                        },
                    },
                },
            },
        };

        sock.sendMessage(jid, {text: message});
    }
}
