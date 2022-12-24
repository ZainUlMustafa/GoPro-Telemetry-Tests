var exec = require('child_process').exec

var url = 'https://firebasestorage.googleapis.com/v0/b/deeprowserverless.appspot.com/o/Survey-Videos%2Fhero5.mp4?alt=media&token=845f71e0-8bec-46d4-87f1-4e8a31975e1d'
var url2 = 'https://firebasestorage.googleapis.com/v0/b/deeprowserverless.appspot.com/o/Survey-Videos%2FDriving%20in%20Switzerland%206%20From%20Grindelwald%20to%20Lauterbrunnen%204K%2060fps.mp4?alt=media&token=9a3072cf-590d-4edf-82ad-22c5bc3b3c0a'

// ffprobe(url2).then((e) => console.log(e))


process.env.FFPROBE_PATH = require('@ffprobe-installer/ffprobe').path;
const ffprobe = require('ffprobe-client');

const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(require('@ffmpeg-installer/ffmpeg').path);

const goproTelemetry = require(`gopro-telemetry`);
const fs = require('fs');

const extractGPMF = async videoFile => {
    const ffData = await ffprobe(videoFile);

    for (let i = 0; i < ffData.streams.length; i++) {
        if (ffData.streams[i].codec_tag_string === 'gpmd') {
            return await extractGPMFAt(videoFile, i);
        }
    }
    return null;
};

const extractGPMFAt = async (videoFile, stream) => {
    let rawData = Buffer.alloc(0);
    await new Promise(resolve => {
        ffmpeg(videoFile)
            .outputOption('-y')
            .outputOptions('-codec copy')
            .outputOptions(`-map 0:${stream}`)
            .outputOption('-f rawvideo')
            .pipe()
            .on('data', chunk => {
                rawData = Buffer.concat([rawData, chunk]);
            }).on('end', resolve);
    });
    return rawData;
};

extractGPMF(url).then(e => {
    // console.log(extracted)
    const extracted = {
        rawData: e,
    }
    goproTelemetry(extracted, {}, telemetry => {
        fs.writeFileSync(`1.json`, JSON.stringify(telemetry));
        console.log('Telemetry saved as JSON');
    });
})