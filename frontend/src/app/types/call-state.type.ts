
export const enum FetchingState {
    EMPTY = 'EMPTY',
    LOADING = 'LOADING',
    LOADED = 'LOADED',
    ERROR = 'ERROR',
}

export interface IErrorState {
    errorMsg: string;
}

export type CallState = FetchingState | IErrorState;
