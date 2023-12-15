import {Types} from "@handcash/handcash-connect";
import pLimit from 'p-limit';

import {CreateCatalogParameters} from "../services/handcash/Types.js";
export abstract class AbstractItemsLoader {
    abstract loadItems(): Promise<Types.CreateItemMetadata[]>;

    abstract loadCollection(): Promise<Types.CreateCollectionMetadata>;

    abstract loadCatalog(): Promise<CreateCatalogParameters>;

    abstract loadAirdropDestinations(): Promise<String[]>;

    async uploadItemImages(imageService: any, items: Types.CreateItemMetadata[]): Promise<Types.CreateItemMetadata[]> {
        const limit = pLimit(5);
        const uploadPromises = items.map(item => limit(() => this.uploadItemImage(imageService, item)));
        return Promise.all(uploadPromises);
    }
    
    async uploadItemImage(imageService: any, item: Types.CreateItemMetadata): Promise<Types.CreateItemMetadata> {
        if(item.mediaDetails.image.url && item.mediaDetails.image.url.indexOf('http') !== 0) {
            item.mediaDetails.image.url = await imageService.uploadImage(item.mediaDetails.image.url);
        }
        if(item.mediaDetails.image.imageHighResUrl && item.mediaDetails.image.imageHighResUrl.indexOf('http') !== 0) {
            item.mediaDetails.image.imageHighResUrl = await imageService.uploadImage(item.mediaDetails.image.imageHighResUrl);
        }
        return item
    }
}
