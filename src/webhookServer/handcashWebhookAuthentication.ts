import express from 'express';
import dotenv from "dotenv";
import crypto from 'crypto';
import {Types} from "@handcash/handcash-connect";

dotenv.config();
const appSecret = process.env.HANDCASH_APP_SECRET || '';


const handcashWebhookAuthentication = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const signature = req.headers['handcash-signature'] as string;
    const body: Types.WebhookPayload = req.body;
    const fiveMinutesAgo = new Date(new Date().getTime() - (5 * 60000));
    if (new Date(body.created) < fiveMinutesAgo) {
        return res.status(401).send('Timestamp is too old');
    }
    const hmac = crypto.createHmac('sha256', appSecret);
    hmac.update(JSON.stringify(body));
    const generatedSignature = hmac.digest('hex');
    if (generatedSignature !== signature) {
        return res.status(401).send('Invalid signature');
    }
    next();
};

export default handcashWebhookAuthentication;