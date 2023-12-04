import {AbstractItemsLoader} from "./AbstractItemsLoader.js";
import * as fs from "fs";
import {CreateCatalogParameters} from "../services/handcash/Types.js";
import {handCashConfig} from "../Settings.js";
import {Types} from "@handcash/handcash-connect";

type Params = {
    folderPath: string;
}

export class MillionMintItemsLoader extends AbstractItemsLoader {
    folderPath: string;

    constructor({folderPath}: Params) {
        super();
        this.folderPath = folderPath;
    }

    async loadItems(): Promise<Types.CollectionDefinition> {
        return this.loadFromFile();
    }

    async loadCatalog(): Promise<CreateCatalogParameters> {
        return {
            appId: handCashConfig.appId,
            title: '100k Birbs',
            description: '100k Birbs',
            bannerUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685260727/items/Banner_chhigc.jpg',
            itemsAnimationGifUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1686453704/items/151_gif_ndvbqb_pqbmsf.gif',
            totalCollectionItems: 4,
            selectablePacks: [
                {
                    name: '1x Pack',
                    description: 'Includes 5 random card',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138930/items/1_gobyea.png',
                    price: .001,
                    units: 5,
                },
                {
                    name: '10x Pack',
                    description: 'Includes 25 random cards',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685138982/items/10_gv2jmo.png',
                    price: .002,
                    units: 25,
                },
                {
                    name: '25x Pack',
                    description: 'Includes 100 random cards',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1687358038/items/25-pack_syrigb.png',
                    price: .003,
                    units: 100,
                }
            ],
        };
    }

    private async loadFromFile(): Promise<Types.CollectionDefinition> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/info.json`, 'utf8'));
        const items = data.map((item: any) => this.loadItemFromRawItemData(item));
        return {
            items,
            collection: {
                name: 'Test million mint',
                description: '1,000,000 stick figures',
                mediaDetails: {
                    image: {
                        url:  `${this.folderPath}/images/1.png`,
                        contentType: 'image/jpeg',
                    },
                },
                totalQuantity: 1000000,
            }
        }
    }

    private loadItemFromRawItemData(itemData: any): Types.ItemsMetadataWithQuantity {
        return {
            item: {
                name: itemData['name'],
                rarity: itemData['rarity'],
                attributes: this.getItemAttributes(itemData),
                mediaDetails: {
                    image: {
                        url: `${this.folderPath}/images/${itemData['image']}`,
                        imageHighResUrl: `${itemData['cacheImage']}`,
                        contentType: 'image/png',
                    },
                },
            },
            quantity: itemData['totalQuantity'],
        };
    }

    private getItemAttributes(itemData: any): Types.ItemAttributeMetadata[] {
        return [
            {
                name: 'Edition',
                value: itemData['edition'],
                displayType: 'string',
            },
            {
                name: 'Generation',
                value: itemData['generation'],
                displayType: 'number',
            },
        ];
    }

    loadAirdropDestinations(): Promise<String[]> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/users.json`, 'utf8'));
        const users = data.map((item: any) => ({email: item.email, handle: item.handle}));
        return Promise.resolve(users.map((user: any) => user.handle));
    }
}