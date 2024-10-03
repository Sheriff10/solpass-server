"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This is where the points and quest type definition is set
 */
var Category;
(function (Category) {
    Category["Socials"] = "socials";
    Category["GovernmentID"] = "Government id";
})(Category || (Category = {}));
const quests = [
    {
        name: "GITHUB",
        projectId: "",
        points: 8,
        category: Category.Socials,
        message: "Github Verification",
    },
    {
        name: "GOOGLE",
        projectId: "f9f383fd-32d9-4c54-942f-5e9fda349762",
        points: 7.5,
        category: Category.Socials,
        message: "Google Verification",
    },
    {
        name: "BINANCE",
        projectId: "",
        points: 7.5,
        category: Category.GovernmentID,
        message: "",
    },
    {
        name: "UBERID",
        projectId: "",
        points: 17.5,
        category: Category.GovernmentID, // Assign a value from the Category enum
        message: "",
    },
    {
        name: "FACEBOOK",
        projectId: "3ba2ac77-2bc4-4858-921f-e4e563371644",
        points: 10.5,
        category: Category.GovernmentID, // Assign a value from the Category enum
        message: "Facebook verification",
    },
];
exports.default = quests;
