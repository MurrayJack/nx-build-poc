const fs = require("fs")

console.log("Manifest script running");

const package = require("../package.json");
const minVersion = package["min-srw-version"];

// get out of jail
if (!fs.existsSync("./dist", {folders: true})) {
    console.log("nothing todo")
    return;
}

if (!fs.existsSync("./dist/apps", {folders: true})) {
    console.log("nothing todo")
    return;
}

const getPreviousData = () => {
    let data = {
        date: (new Date()).toISOString(),
        apps: [],
        versions: [],
    }
    
    if (fs.existsSync("./dist/manifest.json")) {
        const json = fs.readFileSync("./dist/manifest.json", 'utf8')
        data = JSON.parse(json)
    }    

    return data;
}

const saveVersionJSON = (data) => {
    fs.writeFileSync("./dist/manifest.json", JSON.stringify(data, undefined, 2))
}

(() => {
    // load the original one
    const data = getPreviousData();

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
        
        // add the version
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

    saveVersionJSON(data);
    console.log(JSON.stringify(data, undefined, 2))
})()


console.log("Manifest script: Complete");