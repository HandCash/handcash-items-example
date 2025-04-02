import {handCashConfig} from "../../Settings.js";
import {HD, Mnemonic} from '@bsv/sdk'

async function main() {
    const mnemonic = Mnemonic.fromString('oven express radar notice casino leader kidney blame bird window enter resource');
    console.log(mnemonic.mnemonic);
    const hdWallet = HD.fromSeed(mnemonic.toSeed());
    const walletExtendedPublicKey = hdWallet.toPublic().toString();
    console.log(walletExtendedPublicKey);
    const alias = 'test00001';
    const depositInfo = await createWallet({walletExtendedPublicKey, alias});
    console.log(depositInfo, null, 2);
}

async function createWallet(params: { walletExtendedPublicKey: string; alias: string }) {
    const response = await fetch('http://localhost:3000/v1/waas/account/selfCustodial', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'app-id': handCashConfig.appId,
            'app-secret': handCashConfig.appSecret,
        },
        body: JSON.stringify(params),
    });
    if (!response.ok) {
        console.error(await response.json());
        throw new Error('Failed to create wallet');
    } else {
        return response.json();
    }
}


(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e)
    }
})();
