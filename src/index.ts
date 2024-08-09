import path from "node:path";
import sharp from "sharp";
import axios from "axios";
import * as fs from "node:fs";

const TelegramApi = require("node-telegram-bot-api");

const token = '7040925287:AAGYowHGX332D217rSR-HhKs6Eyide1kjL4';

const bot = new TelegramApi(token, {polling: true});


bot.on("photo", async (msg: any)  => {
        const photo = msg.photo[msg.photo.length - 1];
        const fileId = photo.file_id;
        const chatId = msg.chat.id;


        try {
            const fileLink = await bot.getFileLink(fileId);

            const response = await axios.get(fileLink, {responseType: "arraybuffer"});
            const imageBuffer = Buffer.from(response.data);


            const localImagePath = path.join(__dirname, 'image.webp');
            await sharp(imageBuffer).webp().toFile(localImagePath);


            await bot.sendDocument(chatId, localImagePath, {
                caption: 'Here is your image',
                filename: 'image.webp'
                });


         } catch (error) {
            console.error('Ошибка при обработке изображения:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при обработке изображения.');
        }

})

