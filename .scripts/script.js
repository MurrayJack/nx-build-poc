const fs = require("fs")

console.log("Manifest script running");

const package = require("../package.json");
const minVersion = package["min-srw-version"]

// load the original one
let data = {
    date: (new Date()).toISOString(),
    apps: [],
    versions: [],
}

if (fs.existsSync("./dist/manifest.json")) {
    const json = fs.readFileSync("./dist/manifest.json", 'utf8')
    data = JSON.parse(json)
}

// loop thru the dis/apps folder to get
const folders = fs.readdirSync("./dist/apps", {folders: true})

folders.forEach(app => {
    console.log(app)
    
    const main = fs.readdirSync(`./dist/apps/${app}`).filter(e => e.startsWith("main.") && e.endsWith(".js"))[0]
    const polyfill = fs.readdirSync(`./dist/apps/${app}`).filter(e => e.startsWith("polyfills.") && e.endsWith(".js"))[0]

    // add the app, if we don't already have one
    if (!data.apps.some(e => e === app)) {
        data.apps.push(app)
    }
    
    if (!data.versions.some(e => e === minVersion)) {
        data.versions.push(minVersion)
    }
    
    // add the main and the polly fill to this version number
    data[minVersion] = {
       [app]: {
            main,
            polyfill
       }
    }

});

fs.writeFileSync("./dist/manifest.json", JSON.stringify(data, undefined, 2))

console.log(JSON.stringify(data, undefined, 2))

console.log("Manifest script: Complete");