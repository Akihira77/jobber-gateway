"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRoutes = void 0;
const auth_controller_1 = require("../controllers/auth.controller");
const express_1 = __importDefault(require("express"));
class SearchRoutes {
    constructor() {
        this.router = express_1.default.Router();
        this.contoller = new auth_controller_1.AuthController();
    }
    routes() {
        this.router.get("/auth/search/gig/:from/:size/:type", this.contoller.getGigsQuerySearch);
        this.router.get("/auth/search/gig/:id", this.contoller.getGigById);
        return this.router;
    }
}
exports.searchRoutes = new SearchRoutes();
//# sourceMappingURL=search.route.js.map