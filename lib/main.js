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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const Constants_1 = __importDefault(require("./utils/Constants"));
const FileService_1 = require("./services/FileService");
const execute_1 = require("./utils/execute");
const TypescriptAxiosPublisher_1 = __importDefault(require("./publishers/TypescriptAxiosPublisher"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        core.notice(Constants_1.default.SCHEMA_FILE_PATH);
        const schemaFile = yield FileService_1.FileService.readYML(Constants_1.default.SCHEMA_FILE_PATH);
        const deploymentNames = Object.keys(schemaFile['x-deploy']);
        const deploymentValues = Object.values(schemaFile['x-deploy']);
        core.notice(`Found ${deploymentNames.length} deployments`);
        core.notice(`Deployments: ${deploymentNames.join(', ')}`);
        core.notice('Installing OpenAPI Generator CLI');
        yield (0, execute_1.execute)('npm install @openapitools/openapi-generator-cli -g');
        yield (0, execute_1.execute)(`openapi-generator-cli validate -i ${Constants_1.default.SCHEMA_FILE_PATH}`);
        deploymentNames.forEach((name) => __awaiter(this, void 0, void 0, function* () {
            switch (name) {
                case 'typescript-case':
                    core.notice('Found Typescript Axios deployment');
                    const dep = schemaFile['x-deploy']['typescript-axios'];
                    core.notice(`Typescript axios package name: ${dep.name}`);
                    yield TypescriptAxiosPublisher_1.default.publish(dep.name);
                    break;
                default:
                    core.error(`Unknown deployment: ${name}`);
                    break;
            }
        }));
    });
}
main()
    .then(() => core.notice('Deployment complete'))
    .catch(err => core.setFailed(err.message));
