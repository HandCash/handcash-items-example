import HandCashService from "./services/handcash/HandCashService.js";
import { handCashConfig } from "./Settings.js";
import { AbstractItemsLoader } from "./loaders/AbstractItemsLoader.js";
import { Environments, HandCashConnect, HandCashMinter } from "@handcash/handcash-connect";
import { CollectorCoinsItemsLoader } from "./loaders/CollectorCoinsItemsLoader.js";


export class ComponentsFactory {
    static getHandCashService(): HandCashService {
        return new HandCashService(handCashConfig);
    }

    static getItemsLoader(): AbstractItemsLoader {
        return new CollectorCoinsItemsLoader({
            folderPath: './assets/collectors_coin',
        });
    }

    static getHandCashMinter(): HandCashMinter {
        return HandCashMinter.fromAppCredentials({
            appId: handCashConfig.appId,
            authToken: handCashConfig.authToken,
            appSecret: handCashConfig.appSecret,
            env: Environments.prod,
        });
    }

    static getHandCashAccount(authToken?: string) {
        return new HandCashConnect({
            appId: handCashConfig.appId,
            appSecret:  handCashConfig.appSecret,
            env: Environments.prod,
        }).getAccountFromAuthToken(authToken ?? handCashConfig.authToken);
    }

    static getHandCashConnectInstance() {
        return new HandCashConnect({
            appId: handCashConfig.appId,
            appSecret: handCashConfig.appSecret,
            env: Environments.prod,
        });
    };
}
