import { MessageBoxButtons } from './message-box-buttons.enum';
import { MessageBoxResult } from './message-box-result.enum';

export class MessageBoxModel {
    constructor(
        public title: string,
        public message: string,
        public buttons: MessageBoxButtons,
        public resultCallback?: (result: MessageBoxResult) => void) {
    }
}
