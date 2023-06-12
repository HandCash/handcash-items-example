import HandCashService from "./services/handcash/HandCashService.js";
import {cloudinaryConfig, handCashConfig} from "./Settings.js";
import CloudinaryImageService from "./services/image/CloudinaryImageService.js";
import {AbstractItemsLoader} from "./loaders/AbstractItemsLoader.js";
import {HandCashItemsLoader} from "./loaders/HandCashItemsLoader.js";
import {CoomBattlesItemsLoader} from "./loaders/CoomBattlesItemsLoader.js";
import {DummyItemsLoader} from "./loaders/DummyItemsLoader.js";

export class ComponentsFactory {
    static getHandCashService(): HandCashService {
        return new HandCashService(handCashConfig)
    }

    static getImageService() {
        return new CloudinaryImageService(cloudinaryConfig);
    }

    static getItemsLoader(): AbstractItemsLoader {
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
}
