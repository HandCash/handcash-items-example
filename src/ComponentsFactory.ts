import HandCashService from "./services/handcash/HandCashService.js";
import {cloudinaryConfig, handCashConfig} from "./Settings.js";
import CloudinaryImageService from "./services/image/CloudinaryImageService.js";
import {AbstractItemsLoader} from "./loaders/AbstractItemsLoader.js";
import {HandCashItemsLoader} from "./loaders/HandCashItemsLoader.js";
import {CoomBattlesItemsLoader} from "./loaders/CoomBattlesItemsLoader.js";
import {DummyItemsLoader} from "./loaders/DummyItemsLoader.js";
import {HandCashMinter, Environments, Types, HandCashConnect} from "@handcash/handcash-connect";
import { MillionMintItemsLoader } from "./loaders/MillionTestItemLoader.js";
import fs from "node:fs";

export class ComponentsFactory {
    static getHandCashService(): HandCashService {
        return new HandCashService(handCashConfig);
    }

    static getImageService() {
        return new CloudinaryImageService(cloudinaryConfig);
    }

    static getItemsLoader(): AbstractItemsLoader {
        return new MillionMintItemsLoader({
            folderPath: './assets/million',
        })
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

    static getHandCashAccount() {
        return new HandCashConnect({
            appId: handCashConfig.appId,
            appSecret: handCashConfig.appSecret,
            env: Environments.iae,
        }).getAccountFromAuthToken(handCashConfig.authToken);
    }

    // static loadCollectionDefinition() : Promise<Types.CollectionDefinition> {
    //     const jsonData = fs.readFileSync('./assets/example/info.json', 'utf8');
    //     return this.getHandCashMinter().loadMetadataFromJson(jsonData);
    // }

    static loadCollectionDefinition() : Promise<Types.CollectionDefinition> {
        const itemsLoader = this.getItemsLoader();
        return itemsLoader.loadItems();
    };
}
