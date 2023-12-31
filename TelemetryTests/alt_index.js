
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

const filename = './big_data/video'
extractGPMF(`${filename}.MP4`).then(e => {
    // console.log(extracted)
    const extracted = {
        rawData: e,
    }
    goproTelemetry(extracted, {}, telemetry => {
        fs.writeFileSync(`${filename}.json`, JSON.stringify(telemetry, null, 4));
        console.log('Telemetry saved as JSON');
    });
})

// extractGPMF(`https://firebasestorage.googleapis.com/v0/b/deeprowserverless.appspot.com/o/Projects%2Fpr4lAvyr5kWUmkYveFsPV0I%2FGH010555.MP4?alt=media&token=58f7043a-56e7-4393-90fa-b617b265bd02`).then(e => {
//     // console.log(extracted)
//     const extracted = {
//         rawData: e,
//     }
//     goproTelemetry(extracted, {}, telemetry => {
//         fs.writeFileSync(`online.json`, JSON.stringify(telemetry));
//         console.log('Telemetry saved as JSON');
//     });
// })
