"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const health_1 = require("../controllers/health");
const express_1 = __importDefault(require("express"));
class HealthRoutes {
    constructor() {
        this.router = express_1.default.Router();
    }
    routes() {
        this.router.get("/gateway-health", health_1.Health.prototype.health);
        return this.router;
    }
}
exports.healthRoutes = new HealthRoutes();
//# sourceMappingURL=health.route.js.map