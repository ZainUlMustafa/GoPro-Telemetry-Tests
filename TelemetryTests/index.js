const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');

const file = fs.readFileSync('./samples/sample.mp4');

gpmfExtract(file)
    .then(extracted => {
        goproTelemetry(extracted, {}, telemetry => {
            fs.writeFileSync('output_path.json', JSON.stringify(telemetry));
            console.log('Telemetry saved as JSON');
        });
    })
    .catch(error => console.error(error));