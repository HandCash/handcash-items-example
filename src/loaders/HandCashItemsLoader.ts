import {AbstractItemsLoader} from "./AbstractItemsLoader.js";
import * as fs from "fs";
import {CreateCatalogParameters} from "../services/handcash/Types.js";
import {handCashConfig} from "../Settings.js";
import {Types} from "@handcash/handcash-connect";


type Params = {
    folderPath: string;
}

export class HandCashItemsLoader extends AbstractItemsLoader {
    folderPath: string;

    constructor({folderPath}: Params) {
        super();
        this.folderPath = folderPath;
    }

    async loadItems(): Promise<Types.CreateItemMetadata[]> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/info.json`, 'utf8'));
        return await Promise.all(data.map((item: any) => this.loadItemFromRawItemData(item)));
    }

    async loadCollection(): Promise<Types.CreateCollectionMetadata> {
        return {
            name: 'HandCash Team Caricatures',
            description: 'A unique collection of caricatures of the HandCash team',
            mediaDetails: {
                image: {
                    url: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685141160/round-handcash-logo_cj47fp_xnteyo_oy3nbd.png',
                    contentType: 'image/png',
                },
            },
        }
    };

    private async loadItemFromRawItemData(itemData: any): Promise<Types.CreateItemMetadata> {
        return {
                name: itemData['name'],
                user: itemData['user'] ? itemData['user'] : undefined,
                rarity: itemData['rarity'],
                groupingValue: itemData['groupingValue'],
                attributes: this.getItemAttributes(itemData),
                mediaDetails: {
                    image: {
                        url: itemData['image'],
                        imageHighResUrl: itemData['cacheImage'],
                        contentType: itemData['contentType'],
                    },
                },
                color: this.getColorFromName(itemData['name']),
                quantity: itemData['quantity'],
            };
    }

    private async getContentType(url: string): Promise<string> {
        const response = await fetch(url, { method: 'HEAD' });
        return response.headers.get('content-type') || '';
    }

    private getItemAttributes(itemData: any): Types.ItemAttributeMetadata[] {
        return [
            {
                name: 'Edition',
                value: itemData['edition'].toString(),
                displayType: 'string',
            },
            {
                name: 'Generation',
                value: itemData['generation'].toString(),
                displayType: 'string',
            },
            {
                name: 'Country',
                value: itemData['country'].toString(),
                displayType: 'string',
            },
        ];
    }

    private getColorFromName(name: string): string {
        const colors = ['#ed5025', '#21bbea', '#73c9ac', '#adeaf5', '#f4a81b', '#bf9078', '#40dc29'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    }

    async loadCatalog(): Promise<CreateCatalogParameters> {
        return {
            appId: handCashConfig.appId,
            title: 'HandCash Team Caricatures',
            description: 'Get a unique caricature of the HandCash team. Catch\'em all!',
            bannerUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685139151/items/234trgsrdg_ouyxpu.png',
            itemsAnimationGifUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685260525/items/collection_optimized_ep77ze.gif',
            totalCollectionItems: 11,
            selectablePacks: [
                {
                    name: '1x Pack',
                    description: '1 legendary item guaranteed',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685139151/items/234trgsrdg_ouyxpu.png',
                    price: 0.02,
                    units: 1,
                },
                {
                    name: '3x Pack',
                    description: '1 legendary item guaranteed',
                    imageUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685139151/items/234trgsrdg_ouyxpu.png',
                    price: 0.05,
                    units: 3,
                }
            ],
        };
    }

    loadAirdropDestinations(): Promise<String[]> {
        return Promise.resolve([]);
    }
}
