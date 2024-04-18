import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import pLimit from "p-limit";
import { steps } from './const';

const uploadParallelLimitTier = pLimit(10); //Free tier is 10

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const imageExtension = ['jpg'];
const regexExtension = /(?:\.([^.]+))?$/;

export default async function uploadImages(path: string, folders: string[]) {
    console.log('Uploading files.');
    console.log('Files to upload: ', folders.length);
    
    const folderPaths = folders.map(folder => `${path}\\${folder}`)
    for (const path of folderPaths) {
        let imagesToUpload = fs
            .readdirSync(path)
            .filter((file: string) => {
                const match = regexExtension.exec(file);
                const extension = match?.[1] ? match[1] : '';

                return imageExtension.includes(extension);
            });

        const uploadingImages = imagesToUpload.map((image) => {
            return uploadParallelLimitTier(async () => {
                const result = await cloudinary.uploader.upload(`${path}\\${image}`);
                return result;
            })
        });

        let uploads = await Promise.all(uploadingImages);

        try {
            fs.writeFileSync(`${path}\\uploads.json`, JSON.stringify(uploads, null, 2));
            const renamedPath = path.replace(steps[0], steps[1]);
            fs.renameSync(path, renamedPath)
            console.log('File created!');
        } catch (err) {
            console.error('Error to create file:', err);
        }
    }

    return fs
        .readdirSync(path)
        .filter((file: string) => file.startsWith(steps[1]))
}