import HandCashService from "./services/handcash/HandCashService.js";
import {AbstractItemsLoader} from "./loaders/AbstractItemsLoader.js";
import { HandCashItemsLoader } from "./loaders/HandCashItemsLoader.js";
import {HandCashMinter, Environments, Types, HandCashConnect} from "@handcash/handcash-connect";
import {cloudinaryConfig, handCashConfig} from "./Settings.js";
 import CloudinaryImageService from "./services/image/CloudinaryImageService.js";

export class ComponentsFactory {
    static getHandCashService(): HandCashService {
        return new HandCashService(handCashConfig);
    }

    static getItemsLoader(): AbstractItemsLoader {
        // 11 NFT example
        return new HandCashItemsLoader({
            folderPath: './assets/handcash_test',
        });
    }

    static getImageService() {
        return new CloudinaryImageService(cloudinaryConfig);
    }

    static getHandCashMinter(): HandCashMinter {
        return HandCashMinter.fromAppCredentials({
            appId: handCashConfig.appId,
            authToken: handCashConfig.authToken,
            env: Environments.prod,
        });
    }

    static getHandCashAccount() {
        return new HandCashConnect({
            appId: handCashConfig.appId,
            appSecret: handCashConfig.appSecret,
            env: Environments.prod,
        }).getAccountFromAuthToken(handCashConfig.authToken);
    }
}
