"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosService = void 0;
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
class AxiosService {
    constructor(baseUrl, serviceName) {
        this.axios = this.axiosCreateInstance(baseUrl, serviceName);
    }
    axiosCreateInstance(baseUrl, serviceName) {
        let gatewaytoken = "";
        if (serviceName) {
            gatewaytoken = jsonwebtoken_1.default.sign({ id: serviceName }, config_1.GATEWAY_JWT_TOKEN, {
                issuer: "Jobber Auth",
                algorithm: "HS512",
                expiresIn: "1d"
            });
        }
        const instance = axios_1.default.create({
            baseURL: baseUrl,
            headers: {
                "Content-Type": "application/json",
                "X-Request-From": serviceName,
                Accept: "application/json",
                gatewaytoken
            },
            withCredentials: true
        });
        return instance;
    }
}
exports.AxiosService = AxiosService;
//# sourceMappingURL=axios.js.map