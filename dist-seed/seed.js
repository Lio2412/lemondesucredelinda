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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var bcryptjs_1 = __importDefault(require("bcryptjs")); // Importer bcryptjs
var mockCreationsData = [
    {
        id: "1",
        title: "Tarte aux fraises",
        imageUrl: "/images/recipes/tarte-citron-meringuee.jpg",
        createdAt: "2025-03-28T10:00:00Z",
        updatedAt: "2025-03-28T10:00:00Z",
        description: "Une tarte croustillante garnie de crème pâtissière et de fraises fraîches.",
    },
    {
        id: "2",
        title: "Macarons au chocolat",
        imageUrl: "/images/recipes/macarons-vanille.jpg",
        createdAt: "2025-04-15T14:30:00Z",
        updatedAt: "2025-04-15T14:30:00Z",
        description: "Des coques délicates et une ganache riche en chocolat.",
    },
    {
        id: "3",
        title: "Éclairs au café",
        imageUrl: "/images/recipes/eclair-cafe.jpg",
        createdAt: "2025-04-02T09:15:00Z",
        updatedAt: "2025-04-02T09:15:00Z",
        description: "Pâte à choux légère garnie d'une crème au café onctueuse.",
    },
    {
        id: "4",
        title: "Forêt Noire revisitée",
        imageUrl: "/images/recipes/gateau-chocolat.jpg",
        createdAt: "2025-03-10T18:00:00Z",
        updatedAt: "2025-03-10T18:00:00Z",
        description: "Un classique allemand avec une touche moderne.",
    },
];
// Importer les données mockées pour les recettes et articles si nécessaire
// import { mockRecipesData } from '../lib/data/recipes'; // Ajuster le chemin si nécessaire
// import { mockArticlesData } from '../lib/data/articles';
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, mockCreationsData_1, creationData, creation, adminEmail, plainPassword, saltRounds, hashedPassword, adminUser, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("D\u00E9but du seeding...");
                    // --- Seed Créations ---
                    console.log('Seeding Créations...');
                    _i = 0, mockCreationsData_1 = mockCreationsData;
                    _a.label = 1;
                case 1:
                    if (!(_i < mockCreationsData_1.length)) return [3 /*break*/, 4];
                    creationData = mockCreationsData_1[_i];
                    return [4 /*yield*/, prisma.creation.upsert({
                            where: { id: creationData.id }, // Utiliser un champ unique pour éviter les doublons si le seed est relancé
                            update: {
                                title: creationData.title,
                                description: creationData.description || '', // Assurer une valeur par défaut si description est vide
                                image: creationData.imageUrl, // Utiliser 'image' (Prisma) avec 'imageUrl' (données mock)
                                // Prisma gère la conversion string ISO -> DateTime
                                createdAt: creationData.createdAt,
                                updatedAt: creationData.updatedAt,
                                // category: creationData.category, // Ajouter si le modèle et les mocks ont une catégorie
                            },
                            create: {
                                id: creationData.id, // Fournir l'ID des mocks pour la cohérence
                                title: creationData.title,
                                description: creationData.description || '',
                                image: creationData.imageUrl, // Utiliser 'image' (Prisma) avec 'imageUrl' (données mock)
                                createdAt: creationData.createdAt,
                                updatedAt: creationData.updatedAt,
                                // category: creationData.category,
                            },
                        })];
                case 2:
                    creation = _a.sent();
                    console.log("Cr\u00E9ation cr\u00E9\u00E9e ou mise \u00E0 jour avec id: ".concat(creation.id));
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('Seeding Créations terminé.');
                    // --- Seed Recettes (Exemple, à adapter) ---
                    // console.log('Seeding Recettes...');
                    // for (const recipeData of mockRecipesData) {
                    //   const recipe = await prisma.recipe.upsert({
                    //     where: { id: recipeData.id },
                    //     update: {
                    //       title: recipeData.title,
                    //       // Adapter les champs: steps et ingredients sont String[] dans Prisma
                    //       steps: recipeData.steps, // Supposant que mockRecipesData.steps est déjà String[]
                    //       ingredients: recipeData.ingredients.map(ing => `${ing.quantity} ${ing.name}`), // Transformer les ingrédients en strings
                    //       image: recipeData.imageUrl,
                    //       createdAt: recipeData.createdAt, // Supposant que les mocks ont ces champs
                    //       updatedAt: recipeData.updatedAt,
                    //       // Ajouter les champs manquants: prepTime, cookTime, servings, etc.
                    //     },
                    //     create: {
                    //       id: recipeData.id,
                    //       title: recipeData.title,
                    //       steps: recipeData.steps,
                    //       ingredients: recipeData.ingredients.map(ing => `${ing.quantity} ${ing.name}`),
                    //       image: recipeData.imageUrl,
                    //       createdAt: recipeData.createdAt,
                    //       updatedAt: recipeData.updatedAt,
                    //       // Ajouter les champs manquants
                    //     },
                    //   });
                    //   console.log(`Recette créée ou mise à jour avec id: ${recipe.id}`);
                    // }
                    // console.log('Seeding Recettes terminé.');
                    // --- Seed Articles (Exemple, à adapter) ---
                    // console.log('Seeding Articles...');
                    // for (const articleData of mockArticlesData) {
                    //   const article = await prisma.article.upsert({
                    //     where: { id: articleData.id },
                    //     update: {
                    //       title: articleData.title,
                    //       content: articleData.content,
                    //       tags: articleData.tags || [], // Assurer que tags est un tableau
                    //       createdAt: articleData.createdAt, // Supposant que les mocks ont ces champs
                    //       updatedAt: articleData.updatedAt,
                    //       // Ajouter les champs manquants: imageUrl, author, etc.
                    //     },
                    //     create: {
                    //       id: articleData.id,
                    //       title: articleData.title,
                    //       content: articleData.content,
                    //       tags: articleData.tags || [],
                    //       createdAt: articleData.createdAt,
                    //       updatedAt: articleData.updatedAt,
                    //       // Ajouter les champs manquants
                    //     },
                    //   });
                    //   console.log(`Article créé ou mis à jour avec id: ${article.id}`);
                    // }
                    // console.log('Seeding Articles terminé.');
                    // --- Seed Admin User ---
                    console.log('Seeding Admin User...');
                    adminEmail = 'Lionel.callerame@gmail.com';
                    plainPassword = 'Liocal241290';
                    saltRounds = 10;
                    _a.label = 5;
                case 5:
                    _a.trys.push([5, 8, , 9]);
                    return [4 /*yield*/, bcryptjs_1.default.hash(plainPassword, saltRounds)];
                case 6:
                    hashedPassword = _a.sent();
                    console.log("Mot de passe hach\u00E9 pour ".concat(adminEmail, "."));
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: adminEmail },
                            update: {
                                // Mettre à jour le mot de passe si l'utilisateur existe déjà
                                password: hashedPassword,
                                role: 'admin', // S'assurer que le rôle est admin
                            },
                            create: {
                                email: adminEmail,
                                password: hashedPassword,
                                role: 'admin',
                                // Ajouter d'autres champs si nécessaire (ex: name)
                                // name: 'Lionel Callerame',
                            },
                        })];
                case 7:
                    adminUser = _a.sent();
                    console.log("Utilisateur admin cr\u00E9\u00E9 ou mis \u00E0 jour avec email: ".concat(adminUser.email));
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error("Erreur lors de la cr\u00E9ation/mise \u00E0 jour de l'utilisateur admin ".concat(adminEmail, ":"), error_1);
                    return [3 /*break*/, 9];
                case 9:
                    console.log('Seeding Admin User terminé.');
                    console.log("Seeding termin\u00E9.");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
