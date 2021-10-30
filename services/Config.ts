import * as toml from "@ltd/j-toml";
const fs = require("fs");

const configFile = fs.readFileSync('./config/config.toml', 'utf-8');
const config = toml.parse(configFile, '\n');

export function getAgoraeConfig() : any {
    return config;
}