export class AlertInfo {
    id?: string;
    type: AlertInfoType = AlertInfoType.Info;
    message?: string;
    autoClose: boolean = true;
    keepAfterRouteChange?: boolean = false;
    fade: boolean = false;

    constructor(init?: Partial<AlertInfo>) {
        Object.assign(this, init);
    }
}

export enum AlertInfoType {
    Success,
    Error,
    Info,
    Warning
}
