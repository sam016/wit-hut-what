"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const application_1 = require("./application");
exports.OrgErm = application_1.OrgErm;
async function main(options = {}) {
    const app = new application_1.OrgErm(options);
    await app.boot();
    await app.start();
    const url = app.restServer.url;
    console.log(`Server is running at ${url}`);
    console.log(`Checkout swagger at ${url}/explorer`);
    return app;
}
exports.main = main;
//# sourceMappingURL=index.js.map