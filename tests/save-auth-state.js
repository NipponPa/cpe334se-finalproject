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
Object.defineProperty(exports, "__esModule", { value: true });
var test_1 = require("@playwright/test");
var fs = require("fs");
var path = require("path");
var AUTH_FILE_NAME = 'google-auth.json';
var AUTH_FILE_PATH = path.join(__dirname, 'auth-states', AUTH_FILE_NAME);
function saveAuthStateManually() {
    return __awaiter(this, void 0, void 0, function () {
        var authDir, browser, context, page, readline, rl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authDir = path.join(__dirname, 'auth-states');
                    if (!fs.existsSync(authDir)) {
                        fs.mkdirSync(authDir, { recursive: true });
                    }
                    return [4 /*yield*/, test_1.chromium.launch({ headless: false })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newContext()];
                case 2:
                    context = _a.sent();
                    return [4 /*yield*/, context.newPage()];
                case 3:
                    page = _a.sent();
                    console.log('Navigating to login page...');
                    return [4 /*yield*/, page.goto('http://localhost:3000/login')];
                case 4:
                    _a.sent();
                    console.log('Please manually complete Google authentication in the opened browser.');
                    console.log('After successful login and redirection to your app, press Enter in this terminal to save the authentication state.');
                    readline = require('readline');
                    rl = readline.createInterface({
                        input: process.stdin,
                        output: process.stdout
                    });
                    return [4 /*yield*/, new Promise(function (resolve) { return rl.question('Press Enter when authenticated: ', resolve); })];
                case 5:
                    _a.sent();
                    // Save the authentication state
                    return [4 /*yield*/, context.storageState({ path: AUTH_FILE_PATH })];
                case 6:
                    // Save the authentication state
                    _a.sent();
                    console.log("Authentication state saved to ".concat(AUTH_FILE_PATH));
                    return [4 /*yield*/, browser.close()];
                case 7:
                    _a.sent();
                    rl.close();
                    return [2 /*return*/];
            }
        });
    });
}
saveAuthStateManually();
