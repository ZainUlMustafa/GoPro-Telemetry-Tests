// RUN VIA DOCKER COMPOSE: docker compose -f docker-compose.yaml up

const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const filePath = args[0];
const fileName = path.basename(filePath)
console.log(`Processing ${fileName}`)
if (fs.existsSync(filePath)) {
    // './samples/GX010115.MP4'
    const file = fs.readFileSync(filePath);

    gpmfExtract(file)
        .then(extracted => {
            console.log(extracted)
            goproTelemetry(extracted, {}, telemetry => {
                fs.writeFileSync(`${fileName}.json`, JSON.stringify(telemetry));
                console.log('Telemetry saved as JSON');
            });
        })
        .catch(error => console.error(error));
} else {
    console.log("File not found!")
}