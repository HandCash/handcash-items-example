import HandCashService from "./services/handcash/HandCashService.js";
import {cloudinaryConfig, handCashConfig} from "./Settings.js";
import CloudinaryImageService from "./services/image/CloudinaryImageService.js";
import {AbstractItemsLoader} from "./loaders/AbstractItemsLoader.js";
import {HandCashItemsLoader} from "./loaders/HandCashItemsLoader.js";
import {CoomBattlesItemsLoader} from "./loaders/CoomBattlesItemsLoader.js";
import {DummyItemsLoader} from "./loaders/DummyItemsLoader.js";
import {HandCashMinter, Environments, Types, HandCashConnect} from "@handcash/handcash-connect";
import fs from "node:fs";
import HandCashCloudAccount from "../../handcash-connect-sdk-js/dist/handcash_cloud_account.js";

export class ComponentsFactory {
    static getHandCashService(): HandCashService {
        return new HandCashService(handCashConfig);
    }

    static getImageService() {
        return new CloudinaryImageService(cloudinaryConfig);
    }

    static getItemsLoader(): AbstractItemsLoader {
        return new DummyItemsLoader({
            folderPath: './assets/dummy',
        });
        return new CoomBattlesItemsLoader({
            folderPath: './assets/coom',
        });
        return new DummyItemsLoader({
            folderPath: './assets/dummy',
        });
        return new HandCashItemsLoader({
            folderPath: './assets/handcash_test',
        });
    }

    static getHandCashMinter(): HandCashMinter {
        return HandCashMinter.fromAppCredentials({
            appId: handCashConfig.appId,
            authToken: handCashConfig.authToken,
            env: Environments.iae,
        });
    }

    static getHandCashAccount(): HandCashCloudAccount {
        return new HandCashConnect({
            appId: handCashConfig.appId,
            appSecret: handCashConfig.appSecret,
            env: Environments.iae,
        }).getAccountFromAuthToken(handCashConfig.authToken);
    }

    static loadCollectionDefinition() : Promise<Types.CollectionDefinition> {
        const jsonData = fs.readFileSync('./assets/example/info.json', 'utf8');
        return this.getHandCashMinter().loadMetadataFromJson(jsonData);
    }
}
