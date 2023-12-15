import {PrivateKey} from 'bsv-wasm';
import {nanoid} from 'nanoid';
import {Catalog, CreateCatalogParameters, CreateItemsOrder} from "./Types.js";
import {ApiError, HttpBody, HttpMethod, QueryParams, RequestParams} from "../Types.js";

type Params = {
    authToken?: string;
    appId: string;
    baseApiEndpoint: string;
};

export default class HandCashService {
    privateKey: PrivateKey | undefined;

    appId: string;

    baseApiEndpoint: string;

    constructor({authToken, appId, baseApiEndpoint}: Params) {
        if (authToken) {
            try {
                this.privateKey = PrivateKey.from_hex(authToken);
            } catch (err) {
                throw Error('Invalid authToken');
            }
        }
        if (!appId) {
            throw Error('Missing appId');
        }
        this.appId = appId;
        this.baseApiEndpoint = baseApiEndpoint;
    }

    getRequestParams(
        method: HttpMethod,
        endpoint: string,
        body: HttpBody = {},
        queryParameters: QueryParams = {}
    ): RequestParams {
        const timestamp = new Date().toISOString();
        const nonce = nanoid();
        const serializedBody = JSON.stringify(body) === '{}' ? '' : JSON.stringify(body);
        const encodedEndpoint = HandCashService.getEncodedEndpoint(endpoint, queryParameters);
        const headers: Record<string, string> = {
            'app-id': this.appId,
        };
        if (this.privateKey) {
            const publicKey = this.privateKey.to_public_key();
            headers['oauth-publickey'] = publicKey.to_hex();
            headers['oauth-timestamp'] = timestamp.toString();
            headers['oauth-nonce'] = nonce;
            headers['oauth-signature'] = HandCashService.getRequestSignature(
                method,
                encodedEndpoint,
                serializedBody,
                timestamp,
                this.privateKey,
                nonce
            );
        }
        const params: RequestParams = {
            url: this.baseApiEndpoint + encodedEndpoint,
            requestInit: {
                method: method as string,
                headers,
            }
        };
        if (serializedBody.length > 0) {
            params.requestInit.body = serializedBody;
        }
        return params;
    }

    static getEncodedEndpoint(endpoint: string, queryParameters: QueryParams) {
        const searchParams = new URLSearchParams(queryParameters);
        return endpoint + (searchParams.size > 0 ? '?' + searchParams.toString() : '');
    }

    static getRequestSignature(
        method: HttpMethod,
        endpoint: string,
        serializedBody: string | undefined,
        timestamp: string,
        privateKey: PrivateKey,
        nonce: string
    ): string {
        const signaturePayload = HandCashService.getRequestSignaturePayload(
            method,
            endpoint,
            serializedBody,
            timestamp,
            nonce
        );
        return privateKey.sign_message(Buffer.from(signaturePayload)).to_der_hex();
    }

    static getRequestSignaturePayload(
        method: HttpMethod,
        endpoint: string,
        serializedBody: string | undefined,
        timestamp: string,
        nonce: string
    ) {
        return `${method}\n${endpoint}\n${timestamp}\n${serializedBody}${nonce ? `\n${nonce}` : ''}`;
    }

    async getCreateItemsOrder(orderId: string) {
        const requestParameters = this.getRequestParams('GET', `/v3/itemCreationOrder/${orderId}`);
        return HandCashService.handleRequest<CreateItemsOrder>(requestParameters, new Error().stack);
    }

    async createCatalog(params: CreateCatalogParameters) {
        const requestParameters = this.getRequestParams('POST', `/v3/itemCatalog`, params);
        return HandCashService.handleRequest<Catalog>(requestParameters, new Error().stack);
    }

    async getCatalog(id: string) {
        const requestParameters = this.getRequestParams('GET', `/v3/itemCatalog/${id}`);
        return HandCashService.handleRequest<Catalog>(requestParameters, new Error().stack);
    }

    async addItemsCatalog(params: { itemOrigins: string[]; itemCatalogId: string; }) {
        const requestParameters = this.getRequestParams('POST', `/v3/itemCatalog/add`, params);
        return HandCashService.handleRequest<Catalog>(requestParameters, new Error().stack);
    }

    static async handleRequest<T>(requestParameters: RequestParams, stack: string | undefined): Promise<T> {
        const response = await fetch(requestParameters.url, requestParameters.requestInit);
        if (response.ok) {
            return (await response.json()) as T;
        }
        throw await HandCashService.handleApiError({request: requestParameters, response, stack});
    }

    static async handleApiError(result: {
        stack?: string;
        request: RequestParams;
        response?: Response;
    }) {
        if (!result.response || !result.response.status) {
            return new Error(JSON.stringify(result));
        }
        if (result.response.headers.get('content-type') !== 'application/json') {
            const errorMessage = await result.response.text();
            return new ApiError({
                method: result.request.requestInit.method as string,
                url: result.request.url,
                httpStatusCode: result.response.status,
                errorMessage: errorMessage,
                stack: result.stack,
            });
        }
        const data = await result.response.json();
        return new ApiError({
            method: result.request.requestInit.method as string,
            url: result.request.url,
            httpStatusCode: result.response.status,
            errorMessage: data.message,
            info: data.info,
            stack: result.stack,
        });
    }
}
