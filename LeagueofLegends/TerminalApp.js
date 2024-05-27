"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline-sync"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-MengranHao1998/main/champions.json`);
        const champion = yield response.json();
        do {
            console.log("Welcome to the JSON data viewer!");
            console.log(" ");
            console.log("1. View all data");
            console.log("2. Filter by ID");
            console.log("3. Exit");
            console.log(" ");
            let answer = readline.question('Please enter your choice: ');
            if (answer === '1') {
                for (let i = 0; i < champion.length; i++) {
                    console.log(champion[i]);
                }
            }
            else if (answer === '2') {
                for (let i = 0; i < champion.length; i++) {
                    let championid = champion[i].id;
                    console.log(championid);
                }
                let answer2 = readline.question('Please enter the ID you want to filter by: ');
                for (let j = 0; j < champion.length; j++) {
                    if (answer2) {
                        let filterid = champion.filter(champion => champion.id === answer2);
                        console.log(filterid);
                        break;
                    }
                    else {
                        console.log(`Id ${answer2} does not exists`);
                        break;
                    }
                }
            }
            else if (answer === '3') {
                break;
            }
            else {
                console.log("This id doesn't exist please try again");
                console.log(" ");
            }
        } while (true);
    });
}
main();
