# MangaReader
This project reads a manga using GPT-4 model.  
From a file .cbz its possible to get a output from OpenAI with the description of the manga.

### Requirements
It's necessary to have [node](https://nodejs.org/en) installed.  
It's necessary to create a account on [OpenAi](https://openai.com/) and [Cloudinary](https://cloudinary.com/).

### How to run it
- Clone this repo: ```git clone https://github.com/MrRafael/MangaReader.git```
- Go to the repo folder: ```cd MangaReader```
- Install the packages: ```npm i```
- Create a file ```.env``` with the api key from OpenAi and Cloudinary, you can check the file ```.env.template``` for the keys you need.  
  You can change the field **PROMPT** looking for a better description of the manga, in my tests the prompt on file ```.env.template``` got the better result.
- Run the reader: ```npm run start {{path/folderWith.cbz}}```

As result of it you going to have this:

From: 
```
\FolderWith.cbz
    manga1.cbz
    manga2.cbz
```
To:

```
\FolderWith.cbz
    \READ-manga1
        01.jpg
        02.jpg
        03.jpg
        ...
        78.jpg
        uploads.json
        gptOutput.txt
    \READ-manga2
        01.jpg
        02.jpg
        03.jpg
        ...
        52.jpg
        uploads.json
        gptOutput.txt
    manga1.cbz
    manga2.cbz
```
### Environment
This script has been tested only on Windows

### Notes
This script consumes the the model **gpt-4-turbo**, there is a limit of how many tokens you can spend/access in a minute, one manga with about 50 images use something about 40k tokens, the limit of the **gpt-4-turbo** on tier 1 is 300k, so if you run this script with a lot of mangas to read in just one shot may it's going to exceed the limit. Take a o look on OpenAI doc about it. [Rate Limit](https://platform.openai.com/docs/guides/rate-limits?context=tier-free).
