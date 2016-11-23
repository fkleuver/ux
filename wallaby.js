"use strict";
const path = require("path");
const project = require("./package.json");

const files = [
    { pattern: "node_modules/bluebird/js/browser/bluebird.js", instrument: false },
    { pattern: "node_modules/requirejs/require.js", instrument: false },
    { pattern: "typings/**/*.d.ts", load: false, instrument: false },
    { pattern: "src/**/*.html", load: false },
    { pattern: "src/**/*.ts", load: false },
    { pattern: "!src/**/*.spec.ts", load: false },
    { pattern: "test/setup.ts", load: false }
];
const tests = [
    { pattern: "src/**/*.spec.ts", load: false },
    { pattern: "test/**/*.spec.ts", load: false }
];
let deps = [];
for (let dep in project.jspm.dependencies) {
    if (dep.startsWith("aurelia")) {
        deps.push(dep);
    }
}
for (let dep in project.devDependencies) {
    if (dep.startsWith("aurelia")) {
        deps.push(dep);
    }
}
const packages = deps.reduce((prev, curr) => {
    let moduleName = curr;
    let moduleMain = curr;
    let modulePath = "node_modules/".concat(moduleName).concat("/dist/amd");

    const mName = JSON.stringify(moduleName);
    const mPath = JSON.stringify(modulePath);
    const mMain = JSON.stringify(moduleMain);

    return `${prev}{ name: ${mName}, location: ${mPath}, main: ${mMain} },`;
}, "");

module.exports = () => {

    return {

        debug: true,

        env: {
            type: "browser",
            kind: "electron",
            runner: "node_modules/electron/dist/electron.exe",
            options: { width: 1920, height: 1080 }
        },

        files: files,

        tests: tests,

        middleware: (app, express) => {
            app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
        },

        setup: ((w) => {
            w.delayStart();

            requirejs.config({
                baseUrl: "/",

                paths: {
                    "text": "node_modules/text/text"
                },

                packages: [
                    // packages
                ]
            });

            require(["test/setup.js"].concat(w.tests), () => {
                w.start();
            });
        }).toString().replace("// packages", packages)
    };
};