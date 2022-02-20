const { parallel, series } = require("gulp");
const yml = require("js-yaml");
const fs = require("fs");
const _ = require('lodash');
const {promisify} = require("util");


const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

function dota2CssProperty(value, index) {
    return {
        name: index,
        description: value.desc,
        references: [{
            url: `https://developer.valvesoftware.com/wiki/Dota_2_Workshop_Tools/Panorama/CSS_Properties#${index}`,
            name: "See Dota2 Wiki"
        }],
        syntax: value.syntax,
        status: value.status || "nonstandard",
    };
}

async function mkDistDir(){
    if(!fs.existsSync("./dist"))
    {
        await mkdir("./dist");
    }
}

async function resolveDota2CssObjs(properties = {}, pseudoClasses = {}, atDirectives = {}, pseudoElements = {}) {
    return {
        version: 1.1,
        properties:_.map(properties, dota2CssProperty),
        atDirectives,
        pseudoClasses,
        pseudoElements,
    };
}

async function buildDota2Css(){
    const properties = await readFile("src/css/properties.yml","utf-8");
    const cssContent = await resolveDota2CssObjs(yml.load(properties));
    await writeFile("./dist/css.css-data.json",JSON.stringify(cssContent), "utf-8");
}

exports.default = series(mkDistDir,parallel(buildDota2Css));
