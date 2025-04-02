import {AbstractItemsLoader} from "./AbstractItemsLoader.js";
import * as fs from "fs";
import {CreateCatalogParameters} from "../services/handcash/Types.js";
import {handCashConfig} from "../Settings.js";
import {Types} from "@handcash/handcash-connect";


type Params = {
    folderPath: string;
}

export class HalloweenItemsLoader extends AbstractItemsLoader {
    folderPath: string;

    constructor({folderPath}: Params) {
        super();
        this.folderPath = folderPath;
    }

    async loadItems(): Promise<Types.CreateItemMetadata[]> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/info.json`, 'utf8'));
        return [
            {
                name: 'Dark JackO’Lantern',
                user: undefined,
                rarity: 'Mythic',
                attributes: [
                    {
                        name: 'Edition',
                        value: 'Halloween',
                        displayType: 'string',
                    },
                ],
                mediaDetails: {
                    image: {
                        url: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1730303995/7ffa34b14f853e0d007d87284fae9b64.png',
                        contentType: 'image/png',
                    },
                    multimedia: {
                        url: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1730303858/3e9ec7f87d31c19fb6389b1298d681c2.glb',
                        contentType: 'application/glb',
                    }
                },
                quantity: 1,
            },
        ];
    }

    async loadCollection(): Promise<Types.CreateCollectionMetadata> {
        return {
            name: 'Holiday Collection',
            description: 'Special collection with unique items.',
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
        const header = lines.shift()?.split(',');

        if (!header || header.length !== 2) {
            throw Error('CSV file format is incorrect.');
        }

        return lines.map((line) => {
            const [userId, userAlias] = line.split(',');
            return userId;
        });
    }

    async loadAirdropDestinations(): Promise<String[]> {
        const previousUserIds = await this.loadUserIdsFromFile('active-users.csv');
        const newUserIds = await this.loadUserIdsFromFile('active-users-new.csv');
        return newUserIds.filter((userId) => !previousUserIds.includes(userId));
    }
}
