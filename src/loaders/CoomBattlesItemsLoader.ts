import {AbstractItemsLoader} from "./AbstractItemsLoader.js";
import * as fs from "fs";
import {handCashConfig} from "../Settings.js";
import {Types} from "@handcash/handcash-connect";

type Params = {
    folderPath: string;
}

export class CoomBattlesItemsLoader extends AbstractItemsLoader {
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
        throw new Error('Method not implemented.');
    };

    async loadCatalog(): Promise<Types.CreateCollectionMetadata> {
        return {
            appId: handCashConfig.appId,
            title: 'Coom Battles Starter Packs',
            description: 'Champions of Otherworldly Magic 2nd Edition trading cards',
            bannerUrl: 'https://res.cloudinary.com/handcash-iae/image/upload/v1685260727/items/Banner_chhigc.jpg',
            itemsAnimationGifUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695185175/items/gif-for-gen2_2_bbvucv.gif',
            totalCollectionItems: 149,
            selectablePacks: [
                {
                    name: '10x Pack',
                    description: 'Includes 10 random card',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695156953/items/uis4qs9ynwbxy4skpswa.png',
                    price: 3.5,
                    units: 10,
                },
                {
                    name: '50x Pack',
                    description: 'Includes 50 random cards',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695156955/items/cegukohavxaio4n74pex.png',
                    price: 17.5,
                    units: 50,
                },
                {
                    name: '200x Pack',
                    description: 'Includes 200 random cards',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695156958/items/bfmasf0aj87wy6niqpdo.png',
                    price: 70,
                    units: 200,
                },
                {
                    name: '1000x Pack',
                    description: 'Includes 1000 random cards',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695156960/items/pifywq8qs42pvz9w2ekl.png',
                    price: 350,
                    units: 1000,
                }
            ],
        };
    }


    private loadItemFromRawItemData(itemData: any): Types.ItemsMetadataWithQuantity {
        return {
            item: {
                name: itemData['name'],
                user: itemData['user'] ? itemData['user'] : undefined,
                rarity: itemData['rarity'],
                attributes: this.getItemAttributes(itemData),
                mediaDetails: {
                    image: {
                        url: itemData['image'],
                        imageHighResUrl: itemData['cacheImage'],
                        contentType: 'image/png',
                    },
                },
                color: this.getColorFromElement(itemData['element']),
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
            {
                name: 'Champion Number',
                value: itemData['championNumber'],
                displayType: 'number',
            },
            {
                name: 'Evolutions',
                value: itemData['evolutions'],
                displayType: 'string',
            },
            {
                name: 'Skin',
                value: itemData['skin'],
                displayType: 'string',
            },
            {
                name: 'Element',
                value: itemData['element'],
                displayType: 'string',
            },
            {
                name: 'ManaCost',
                value: itemData['manaCost'],
                displayType: 'number',
            },
            {
                name: 'Health',
                value: itemData['health'],
                displayType: 'number',
            },
            {
                name: 'Attack',
                value: itemData['attack'],
                displayType: 'number',
            },
            {
                name: 'Ability',
                value: itemData['ability'],
                displayType: 'number',
            },
            {
                name: 'Rarity',
                value: itemData['rarity'],
                displayType: 'string',
            },
            {
                name: 'Total Quantity',
                displayType: 'number',
                value: itemData.totalQuantity
             }
        ];
    }

    private getColorFromElement(element: string): string {
        switch (element) {
            case 'Fire':
                return '#ed5025';
            case 'Water':
                return '#21bbea';
            case 'Air':
                return '#73c9ac';
            case 'Ice':
                return '#adeaf5';
            case 'Light':
                return '#f4a81b';
            case 'Dark':
                return '#a032ab';
            case 'Earth':
                return '#bf9078';
            case 'Normal':
                return '#828c98';
            case 'Nature':
                return '#40dc29';
            default:
                return '#FFFFFF';
        }
    }

    loadAirdropDestinations(): Promise<String[]> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/users.json`, 'utf8'));
        const users = data.map((item: any) => ({email: item.email, handle: item.handle}));
        return Promise.resolve(users.map((user: any) => user.handle));
    }
}
