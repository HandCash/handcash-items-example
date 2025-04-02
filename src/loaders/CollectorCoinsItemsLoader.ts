import { AbstractItemsLoader } from "./AbstractItemsLoader.js";
import * as fs from "fs";
import { CreateCatalogParameters } from "../services/handcash/Types.js";
import { handCashConfig } from "../Settings.js";
import { Types } from "@handcash/handcash-connect";


type Params = {
    folderPath: string;
}

export class CollectorCoinsItemsLoader extends AbstractItemsLoader {
    folderPath: string;

    constructor({ folderPath }: Params) {
        super();
        this.folderPath = folderPath;
    }

    async loadItems(): Promise<Types.CreateItemMetadata[]> {
        const totalItems = 270;
        const items = Array(totalItems).fill(0).map((_, i) => {
            const index = (i + 30).toFixed(0).padStart(3, '0');
            return {
                name: `Otherworldly TCG 2025`,
                user: undefined,
                rarity: 'Mythic',
                attributes: [
                    {
                        name: 'Edition',
                        value: 'Partnership',
                        displayType: 'string',
                    },
                    {
                        name: 'Number',
                        value: `#${index}`,
                        displayType: 'string',
                    },
                ],
                mediaDetails: {
                    image: {
                        url: `https://res.cloudinary.com/hn8pdtayf/image/upload/v1740651015/collectors_coin/gold_object_${index}.png`,
                        contentType: 'image/png',
                    },
                    multimedia: {
                        url: `https://res.cloudinary.com/hn8pdtayf/raw/upload/collectors_coin/gold_object_${index}.glb`,
                        contentType: 'application/glb',
                    }
                },
                quantity: 1,
            }
        });
        return items;
    }

    async loadCollection(): Promise<Types.CreateCollectionMetadata> {
        return {
            name: 'HandCash Play',
            description: 'Have fun with these items!',
            totalQuantity: 1,
            mediaDetails: {
                image: {
                    url: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685141160/round-handcash-logo_cj47fp_xnteyo_oy3nbd.png',
                    contentType: 'image/png',
                },
            },
        }
    };

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

    async loadUserIdsFromFile(fileName: string): Promise<String[]> {
        const data = fs.readFileSync(`${this.folderPath}/${fileName}`, 'utf8');
        const lines = data.trim().split('\n');
        const header = lines.shift();

        if (!header) {
            throw Error('CSV file format is incorrect.');
        }

        return lines;
    }

    async loadAirdropDestinations(): Promise<String[]> {
        return await this.loadUserIdsFromFile('coin_owners.csv');
    }
}
