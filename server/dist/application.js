"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boot_1 = require("@loopback/boot");
const rest_explorer_1 = require("@loopback/rest-explorer");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const service_proxy_1 = require("@loopback/service-proxy");
const authentication_1 = require("@loopback/authentication");
const path_1 = __importDefault(require("path"));
const authentication_2 = require("./components/authentication");
const sequence_1 = require("./sequence");
class OrgErm extends boot_1.BootMixin(service_proxy_1.ServiceMixin(repository_1.RepositoryMixin(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        // Set up the custom sequence
        this.sequence(sequence_1.MySequence);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        this.bindValues();
        this.bindComponents();
        // authentication
        authentication_1.registerAuthenticationStrategy(this, authentication_2.JWTAuthenticationStrategy);
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
    bindValues() {
        // Customize @loopback/rest-explorer configuration here
        this.bind(rest_explorer_1.RestExplorerBindings.CONFIG).to({
            path: '/explorer',
        });
    }
    bindComponents() {
        this.component(rest_explorer_1.RestExplorerComponent);
        this.component(authentication_1.AuthenticationComponent);
    }
}
exports.OrgErm = OrgErm;
//# sourceMappingURL=application.js.map