import {AbstractItemsLoader} from "./AbstractItemsLoader.js";
import * as fs from "fs";
import {CreateItemParameters} from "./Types.js";
import {CreateCatalogParameters, CreateUnlimitedCatalogParameters, CreateItemsCollectionItem} from "../services/handcash/Types.js";
import {handCashConfig} from "../Settings.js";
import {Types} from "@handcash/handcash-connect";
import pLimit from "p-limit";

type Params = {
    folderPath: string;
}

export class MonsterLoader extends AbstractItemsLoader {
    folderPath: string;
    imageService?: any;

    constructor({folderPath}: Params, imageService?: any) {
        super();
        this.folderPath = folderPath;
        this.imageService = imageService;
    }

    async loadItems(): Promise<Types.CollectionDefinition> {
        return this.loadFromFile();
    }

    async loadUnlimitedCatalog(collectionId: string): Promise<CreateUnlimitedCatalogParameters> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/info.json`, 'utf8'));
        let items = data.map((item: any) => this.loadItemFromRawItemData(item));
        items = await this.uploadItemImages(items, this.imageService);
        return {
            appId: handCashConfig.appId,
            title: 'Celestia Booster Pack',
            description: 'Celestia Booster Pack',
            bannerUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1699463747/items/q1q0dqz5afeukao75zwz.png',
            itemsAnimationGifUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695185175/items/gif-for-gen2_2_bbvucv.gif',
            collectionId: collectionId,
            selectablePacks: [
                {
                    name: '10x Pack',
                    description: 'Includes 10 random card',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695156953/items/uis4qs9ynwbxy4skpswa.png',
                    price: 0.002,
                    units: 10,
                },
                {
                    name: '50x Pack',
                    description: 'Includes 50 random cards',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695156955/items/cegukohavxaio4n74pex.png',
                    price: 0.002,
                    units: 50,
                },
                {
                    name: '200x Pack',
                    description: 'Includes 200 random cards',
                    imageUrl: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1695156958/items/bfmasf0aj87wy6niqpdo.png',
                    price: 0.002,
                    units: 200,
                },
            ],
            items,
        }
    }

    async loadCatalog(): Promise<CreateCatalogParameters> {
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

    private async uploadItemImages(items: CreateItemsCollectionItem[], imageService: any): Promise<CreateItemsCollectionItem[]> {
        const limit = pLimit(5);
        const uploadPromises = items.map(item =>
          limit(async () => {
            const imageUrl = item.mediaDetails.image.url;
            if (imageUrl && !imageUrl.includes("https://res.cloudinary.com")) {
              const { imageUrl: newImageUrl } = await imageService.uploadImage(imageUrl);
              item.mediaDetails.image.url = newImageUrl;
              const highResUrl = item.mediaDetails.image.imageHighResUrl;
              if (highResUrl && !imageUrl.includes("https://res.cloudinary.com") ) {
                const { imageUrl: newHighResUrl } = await imageService.uploadImage(highResUrl);
                item.mediaDetails.image.imageHighResUrl = newHighResUrl;
              }
            }
      
            return item;
          })
        );
        const updatedItems = await Promise.all(uploadPromises);
        return updatedItems;
      }

    private async loadFromFile(): Promise<Types.CollectionDefinition> {
        const data = JSON.parse(fs.readFileSync(`${this.folderPath}/info.json`, 'utf8'));
        const items = data.map((item: any) => this.loadItemFromRawItemData(item));
        return {
            items,
            collection: {
                name: 'Champions TCG - Generation 2',
                description: '149 champions and 14 new abilities',
                mediaDetails: {
                    image: {
                        url: 'https://res.cloudinary.com/hn8pdtayf/image/upload/v1686129013/items/Final_Icon_t9fo6m_cqt3s9_ags7cl.png',
                        contentType: 'image/png',
                    },
                },
                totalQuantity: items.reduce((total: number, item: CreateItemParameters) => total + item.quantity, 0),
            }
        }
    }

    private loadItemFromRawItemData(itemData: any): Types.ItemsMetadataWithQuantity {
        return {
            name: itemData['name'],
            rarity: itemData['rarity'],
            attributes: this.getItemAttributes(itemData),
            mediaDetails: {
                image: {
                    url: `${this.folderPath}/images/${itemData['image']}`,
                    imageHighResUrl: itemData['cacheImage'] ? `${this.folderPath}/images/${itemData['cacheImage']}` : undefined,
                    contentType: 'image/png',
                },
            },
            color: this.getColorFromElement(itemData['element']),
            likelihood: itemData['likelihood'],
        };
    }

    private getItemAttributes(itemData: any): Types.ItemAttributeMetadata[] {
        return [
            {
                name: 'Element',
                value: itemData['element'],
                displayType: 'string',
            },
            {
                name: 'Ability',
                value: itemData['ability'],
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
                name: 'Rarity',
                value: itemData['rarity'],
                displayType: 'string',
            },
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
