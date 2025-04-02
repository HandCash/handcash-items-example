import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.log(cloudinary.config({
        cloud_name: 'hn8pdtayf',
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    }));
    const totalItems = 300;
    for (let i = 0; i < totalItems; i++) {
        const glbIndex = i.toFixed(0).padStart(3, '0');
        const pngIndex = (i + 1).toFixed(0).padStart(4, '0');
        console.log(`Uploading ${glbIndex} of ${totalItems}`);

        await uploadFile(`./assets/collectors_coin/glb/gold_object_${glbIndex}.glb`, glbIndex, 'glb');
        await uploadFile(`./assets/collectors_coin/images/abc${pngIndex}_trans.png`, glbIndex, 'png');
        console.log(`--------------------------------`);
    }
}

const uploadFile = async (filePath: string, index: string, format: string) => {
    const result = await cloudinary.uploader.upload(filePath, {
        public_id: `gold_object_${index}`,
        folder: 'collectors_coin',
        overwrite: true,
        resource_type: format === 'glb' ? 'raw' : 'image',
        format: format,
    });
    console.log(result.secure_url);
}

(async () => {
    try {
        await main();
    } catch (e) {
        console.error(e);
    }
})();
