export class ApiError extends Error {
    url: string;

    method: string;

    httpStatusCode: number;

    errorMessage?: string;
    info?: string;

    constructor(params: {
        method: string;
        url: string;
        httpStatusCode: number;
        errorMessage: string;
        info?: string;
        stack?: string;
    }) {
        super(params.errorMessage);
        this.method = params.method;
        this.url = params.url;
        this.httpStatusCode = params.httpStatusCode;
        this.errorMessage = params.errorMessage;
        this.info = params.info;
        this.stack = params.stack;
    }

    toString() {
        return JSON.stringify(this);
    }
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type QueryParams = Record<string, string>;
export type HttpBody = Record<string, unknown>;
export type RequestParams = {
    url: string;
    requestInit: RequestInit;
};
