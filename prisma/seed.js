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
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../src/config/logger"));
const encryption_1 = require("../src/utils/encryption");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.default.info('Seeding database...');
        try {
            const admin = yield prisma.user.findFirst({
                where: { email: 'admin@farmflow.com' },
            });
            if (admin) {
                yield prisma.user.delete({
                    where: { id: admin.id },
                });
            }
            yield prisma.user.create({
                data: {
                    name: 'Admin',
                    email: 'admin@farmflow.com',
                    role: 'ADMIN',
                    password: yield (0, encryption_1.encryptPassword)('Admin123'),
                },
            });
            const farmer = yield prisma.user.findFirst({
                where: { email: 'gatera@example.com' },
            });
            if (farmer) {
                yield prisma.user.delete({
                    where: { id: farmer.id },
                });
            }
            yield prisma.user.create({
                data: {
                    name: 'Edmond Gatera',
                    email: 'gatera@example.com',
                    role: 'USER',
                    password: yield (0, encryption_1.encryptPassword)('Gatera123'),
                },
            });
            const agro = yield prisma.user.findFirst({
                where: { email: 'john12@farmflow.com' },
            });
            if (agro) {
                yield prisma.user.delete({
                    where: { id: agro.id },
                });
            }
            yield prisma.user.create({
                data: {
                    name: 'John Kabera',
                    email: 'john12@farmflow.com',
                    role: 'STORE',
                    password: yield (0, encryption_1.encryptPassword)('John123'),
                },
            });
            logger_1.default.info('Seeding completed!');
        }
        catch (error) {
            logger_1.default.error(error);
        }
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
