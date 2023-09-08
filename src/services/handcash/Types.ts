export type Many<E> = {
    items: E[];
};

export type File = {
    url: string;
    contentType: string;
}

export type MediaDetails = {
    image: File;
    multimedia?: File;
}

export type ItemAttribute = {
    name: string;
    value: any;
    displayType: 'string' | 'number' | 'date' | 'boostPercentage' | 'boostNumber';
}

export type CreateItemsCollectionItem = {
    id?: string;
    name: string;
    description?: string;
    rarity?: string;
    user?: {
        alias: string;
        displayName: string;
        profilePictureUrl: string;
    }
    color?: string;
    attributes: ItemAttribute[];
    mediaDetails: MediaDetails;
    origin?: string;
}

export type CreateItemsCollection = {
    name: string;
    description?: string;
    mediaDetails?: MediaDetails;
    totalQuantity: number;
}

export type OrderType = 'collectionItem' | 'collection';

export type NewCreateItemsOrder = {
    items: CreateItemsCollectionItem[] | CreateItemsCollection[];
    itemCreationOrderType: OrderType;
    referencedCollection?: string;
}

export type CreateItemsOrder = {
    id: string;
    type: 'collectionItem' | 'collection';
    status: 'preparing' | 'pendingPayment' | 'pendingInscriptions' | 'completed';
    mintCostInUSD: number;
    collectionOrdinalId?: string;
    items: CreateItemsCollectionItem[];
    app?: string,
    referencedCollection: string;
    payment?: {
        paymentRequestId: string;
        paymentRequestUrl: string;
        transactionId: string;
        isConfirmed: boolean;
    }
    pendingInscriptions: number;
}

export type CreateCatalogParameters = {
    appId: string;
    title: string;
    description: string;
    bannerUrl: string;
    itemsAnimationGifUrl: string;
    totalCollectionItems: number;
    selectablePacks: {
        units: number;
        price: number;
        name: string;
        description: string;
        imageUrl: string;
    }[];
}

export type Catalog = {
    id: string;
    isAvailable: boolean;
    user: string;
    app: string;
    instrumentCurrencyCode: string;
    denominationCurrencyCode: string;
    selectablePacks: {
        paymentRequestUrl: string;
        paymentRequestTemplate: string;
        units: number;
        price: number;
        name: string;
        description: string;
        imageUrl: string;
        isAvailable: boolean;
    }[];
    title: string;
    bannerUrl: string;
    description: string;
    startDate: Date;
    depositTransfers: string[];
}

export type Item = {
    origin: string;
    name: string;
    description: string;
    imageUrl: string;
    multimediaUrl: string;
    multimediaType: string;
    rarity: string;
    color: string;
    attributes: {
        name: string;
        value: string;
        displayType: string;
    }[];
    collection: {
        description: string;
        app: {
            id: string;
            name: string;
            iconUrl: string;
        };
        origin: string;
        name: string;
        imageUrl: string;
        totalQuantity: string;
        isHandcashCreated: boolean;
        isVerified: boolean;
    };
    user: {
        alias: string;
        displayName: string;
        profilePictureUrl: string;
    };
    app: {
        id: string;
        name: string;
        iconUrl: string;
    };
    isHandcashCreated: boolean;
    isVerified: boolean;
};

