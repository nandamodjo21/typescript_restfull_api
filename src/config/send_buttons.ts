import {WAPresence} from "@whiskeysockets/baileys";
import {ulid} from "ulid";

export type MediaType = 'image' | 'document' | 'video' | 'audio';
type TypeButton = 'reply' | 'copy' | 'url' | 'call';


export class Options {
    delay?: number;
    presence?: WAPresence;
    quotedMessageId?: number;
    messageId?: string;
    externalAttributes?: any;
}

class OptionsMessage {
    options?: Options;
}

export class Metadata extends OptionsMessage {
    number?: string;
}
export class MediaMessage {
    mediatype?: MediaType;
    caption?: string;
    // for document
    fileName?: string;
    // url or base64
    media?: string | Buffer;
}
export class SendMediaDto extends Metadata {
    mediaMessage?: MediaMessage;
}

export class Button {
    type?: TypeButton;
    displayText?: string;
    id?: string;
    url?: string;
    copyCode?: string;
    phoneNumber?: string;

    constructor(props: Partial<Button>) {
        Object.assign(this, props);
        if (this.type === 'reply' && !this.id) {
            this.id = ulid();
        }
    }

    private readonly mapType = new Map<TypeButton, string>([
        ['reply', 'quick_reply'],
        ['copy', 'cta_copy'],
        ['url', 'cta_url'],
        ['call', 'cta_call'],
    ]);

    get typeButton(): string {
        return <string>this.mapType.get(<"reply" | "copy" | "url" | "call">this.type);
    }

    toJSONString(): string {
        const toString = (obj: any) => JSON.stringify(obj);

        const json = {
            call: () =>
                toString({ display_text: this.displayText, phone_number: this.phoneNumber }),
            reply: () => toString({ display_text: this.displayText, id: this.id }),
            copy: () => toString({ display_text: this.displayText, copy_code: this.copyCode }),
            url: () =>
                toString({
                    display_text: this.displayText,
                    url: this.url,
                    merchant_url: this.url,
                }),
        };

        // @ts-ignore
        return json[this.type]?.() || '';
    }

    validate(): null | Error | undefined {
        const errors = {
            reply: () => (this.id ? null : new Error('ID is required for reply buttons')),
            call: () =>
                this.phoneNumber ? null : new Error('Phone number is required for call buttons'),
            copy: () =>
                this.copyCode ? null : new Error('Copy code is required for copy buttons'),
            url: () => (this.url ? null : new Error('URL is required for URL buttons')),
        };

        // @ts-ignore
        return errors[this.type]?.();
    }
}


class ButtonsMessage {
    thumbnailUrl?: string;
    title?: string;
    description?: string;
    footer?: string;
    buttons: Button[];

    constructor(props: ButtonsMessage | undefined) {
        Object.assign(this, props);
        // @ts-ignore
        this.buttons = props.buttons.map((button) => new Button(button));
    }
}
export class SendButtonsDto extends Metadata {
    buttonsMessage: ButtonsMessage;

    constructor(props: Partial<SendButtonsDto>) {
        super();
        Object.assign(this, props);

        this.buttonsMessage = new ButtonsMessage(props.buttonsMessage);
    }
}