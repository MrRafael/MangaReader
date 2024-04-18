import extractFiles from "./extractImages";
import { readImages } from "./openai";
import uploadImages from "./upload";

async function main() {
    //Get the path with mangas
    const path = process.argv[2];

    if (!path) {
        console.error("It's necessary to inform the path of the mangas");
        process.exit(1);
    } else {
        // Extract images
        const filesExtracted = await extractFiles(path)

        // Upload images and get links
        const pathsToRead = await uploadImages(path, filesExtracted)

        // use GPT
        readImages(path, pathsToRead)
    }
}

main();
