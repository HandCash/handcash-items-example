import express from 'express';
import {ComponentsFactory} from "../ComponentsFactory.js";
const handCashConnectInstance = ComponentsFactory.getHandCashConnectInstance();

const handCashWebhookAuthentication = (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        handCashConnectInstance.validateWebhookAuthentication(req);
    } catch (e : any) {
        console.log(e)
        res.status(401).send(e.message);
    };
    next();
};

export default handCashWebhookAuthentication;