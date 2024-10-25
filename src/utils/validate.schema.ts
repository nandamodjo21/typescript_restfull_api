import {ulid} from "ulid";
import {JSONSchema7, JSONSchema7Definition} from "json-schema";
import {isNotEmpty} from "class-validator";

const numberDefinition: JSONSchema7Definition = {
    type: 'string',
    pattern: '^\\d+[\\.@\\w-]+',
    description: 'Invalid format',
};
const optionsSchema: JSONSchema7 = {
    properties: {
        delay: {
            type: 'integer',
            description: 'Enter a value in milliseconds',
        },
        presence: {
            type: 'string',
            enum: ['unavailable', 'available', 'composing', 'recording', 'paused'],
        },
        quotedMessageId: { type: 'integer', description: 'Enter the message id' },
        messageId: { type: 'string', description: 'Set your own id for the message.' },
    },
};
export const buttonsMessageSchema: JSONSchema7 = {
    $id: ulid(),
    type: 'object',
    properties: {
        number: { ...numberDefinition },
        options: { ...optionsSchema },
        buttonsMessage: {
            type: 'object',
            properties: {
                thumbnailUrl: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                footer: { type: 'string' },
                buttons: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            type: {
                                type: 'string',
                                enum: ['reply', 'copy', 'url', 'call'],
                            },
                            displayText: { type: 'string' },
                            id: { type: 'string' },
                            url: { type: 'string' },
                            phoneNumber: { type: 'string' },
                        },
                        required: ['type', 'displayText'],
                        // ...isNotEmpty('id', 'url', 'phoneNumber'),
                    },
                },
            },
            required: ['title', 'buttons'],
            // ...isNotEmpty('thumbnailUrl', 'footer', 'description'),
        },
    },
    required: ['number', 'buttonsMessage'],
};