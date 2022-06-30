var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');


if (!fs.existsSync(path.join(__dirname, 'config.yaml'))) {
    fs.writeFileSync(path.join(__dirname, 'config.yaml'), '', 'utf8');
}

var Config = yaml.load(fs.readFileSync(path.join(__dirname, 'config.yaml'), 'utf8'));

function GetConfig(ConfigPath) {
    var ReturnConfig = Config;
    var Path = ConfigPath.split('.');
    for (var i = 0; i < Path.length; i++) {
        ReturnConfig = ReturnConfig[Path[i]];
    }
    if(ReturnConfig == undefined) {
        console.log('Config not found: ' + ConfigPath);
    }
    return ReturnConfig;
}

function SetConfig(ConfigPath, Value) {
    var k = Config;
    var steps = ConfigPath.split('.');
    var last = steps.pop();
    steps.forEach(e => (k[e] = k[e] || {}) && (k = k[e]));
    k[last] = Value;
    SaveConfig();
}

function SaveConfig(){
    fs.writeFileSync(path.join(__dirname, 'config.yaml'), yaml.dump(Config), 'utf8');
}

module.exports = {
    GetConfig: GetConfig,
    SetConfig: SetConfig,
    SaveConfig: SaveConfig
}
