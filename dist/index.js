"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
const TelegramApi = require("node-telegram-bot-api");
const token = '7040925287:AAGYowHGX332D217rSR-HhKs6Eyide1kjL4';
const bot = new TelegramApi(token, { polling: true });
bot.on("photo", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;
    const chatId = msg.chat.id;
    try {
        const fileLink = yield bot.getFileLink(fileId);
        const response = yield axios_1.default.get(fileLink, { responseType: "arraybuffer" });
        const imageBuffer = Buffer.from(response.data);
        const localImagePath = node_path_1.default.join(__dirname, 'image.webp');
        yield (0, sharp_1.default)(imageBuffer).webp().toFile(localImagePath);
        yield bot.sendDocument(chatId, localImagePath, {
            caption: 'Here is your image',
            filename: 'image.webp'
        });
    }
    catch (error) {
        console.error('Ошибка при обработке изображения:', error);
        bot.sendMessage(chatId, 'Произошла ошибка при обработке изображения.');
    }
}));
