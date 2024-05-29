"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const http_status_codes_1 = require("http-status-codes");
class Health {
    health(_req, res) {
        res.status(http_status_codes_1.StatusCodes.OK).send("API Gateway service is healthy and OK.");
    }
}
exports.Health = Health;
//# sourceMappingURL=health.js.map