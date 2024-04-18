import fs from 'fs';
import OpenAI from 'openai';
import { steps } from './const';

const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });
const promptCommand = "aqui estão algumas imagens de um capítulo de mangá. me conte a historia que está acontecendo, inclua expressões, ações e dialogos."

export async function readImages(path: string, folders: string[]) {
    console.log('Reading images');
    const foldersToRead = folders.map(folder => `${path}\\${folder}`);
    console.log('Folders to read: ', foldersToRead.length);
    

    for (const folderToRead of foldersToRead) {
        const imagesToRead = JSON.parse(fs.readFileSync(`${folderToRead}\\uploads.json`, 'utf-8'))

        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: promptCommand },
                        ...imagesToRead.map((image: {secure_url:string}) => ({
                            type: "image_url",
                            image_url: {url: image.secure_url}
                        }))
                    ],
                },
            ],
        });

        try {
            fs.writeFileSync(`${folderToRead}\\gptOutput.txt`, JSON.stringify(response.choices, null, 2));
            const renamedPath = folderToRead.replace(steps[1], steps[2]);
            fs.renameSync(folderToRead, renamedPath)
            console.log('File created!');
        } catch (err) {
            console.error('Error to create file:', err);
        }

        
    }
}
