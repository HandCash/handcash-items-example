import express from 'express';
import bodyParser from 'body-parser';
import {ComponentsFactory} from "../ComponentsFactory.js";
import { itemListingPaymentCompletedHandler, itemsTransferredEventHandler, itemsCreatedEventHandler}  from './eventHandlers/handlers.js';
import { Types } from '@handcash/handcash-connect';

const handCashConnectInstance = ComponentsFactory.getHandCashConnectInstance();

const app = express();
app.use(bodyParser.json());

const consumeEvent = async (req: express.Request, res: express.Response) => {
    const signature = req.headers['handcash-signature'];
    const body = req.body;
    const payload = handCashConnectInstance.getWebhookEvent(signature, body);
    switch (payload.event) {
        case 'item_listing_payment_completed':
            await itemListingPaymentCompletedHandler(payload as Types.ItemListingPaymentCompletedEventPayload);
            break;
        case 'items_transferred':
            await itemsTransferredEventHandler(payload as Types.ItemsTransferredEventPayload);
            break;
        case 'item_creation_order_completed':
            await itemsCreatedEventHandler(payload as Types.ItemCreationEventPayload);
            break;
        default:
            console.log(`Unknown payload event: ${payload.event}`);
            break;
    }
    res.status(200).send('Event consumed successfully');
};

app.post('/', consumeEvent);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
