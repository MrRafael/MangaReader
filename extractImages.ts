import extract from "extract-zip";
import fs from "fs";
import { steps } from "./const";

function makePath(path: string, fileName: string, prefixFileName: string = '') {
    return `${path}\\${prefixFileName + fileName}`;
}

async function extractFile(source: string, target: string) {
    try {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target);
        }

        await extract(source, { dir: target });
    } catch (err) {
        console.log(err);
    }
}

//Get a path with .cbz files and return paths with images and a Prefix EXTRACTED- as status on the path
export default async function extractFiles(dirToSearch: string) {
    console.log('Extracting files');
    
    const regexCBZ = /.*\.cbz$/;
    const allFiles = fs
        .readdirSync(dirToSearch)
        .filter((file: string) => RegExp(regexCBZ).exec(file));


    const filesAlreadyProcessed = fs
        .readdirSync(dirToSearch)
        .filter((file: string) => steps.some(step => file.startsWith(step)));

    const filesProcessedWithoutPreFix = filesAlreadyProcessed.map(file => {
        let fileWithOutStep = file;
        for (const step of steps) {
            fileWithOutStep = fileWithOutStep.replace(step, '');
        }

        return fileWithOutStep;
    });

    const filesToProcess = allFiles.filter((file: string) => !filesProcessedWithoutPreFix.includes(file.substring(0, file.lastIndexOf('.'))))

    console.log('Files to extract: ', filesToProcess.length);

    for (let fileToProcess of filesToProcess) {
        let name = fileToProcess.substring(0, fileToProcess.lastIndexOf('.'));
        let targetDir = makePath(dirToSearch, name, steps[0]);
        await extractFile(makePath(dirToSearch, fileToProcess), targetDir);
    }

    return fs
        .readdirSync(dirToSearch)
        .filter((file: string) => file.startsWith(steps[0]))
}
