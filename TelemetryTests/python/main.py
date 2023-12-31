import gpmf
import gpxpy
# pip install git+https://github.com/zainulmustafa/pygpmf.git@main

def extractGpxV2(videoPath, gpxDir):
    link = videoPath
    stream = gpmf.io.extract_gpmf_stream(link, verbose=False)
    
    print(f"GPX EXTRACTED FOR {videoPath}")

    gps_blocks = gpmf.gps.extract_gps_blocks(stream)

    print(gps_blocks)

    gps_data = list(map(gpmf.gps.parse_gps_block, gps_blocks))
    # gps_data = list(map(gpmf.gps.parse_gps_block, gps_blocks)) if gps_blocks else []

    gpx = gpxpy.gpx.GPX()
    gpx_track = gpxpy.gpx.GPXTrack()
    gpx.tracks.append(gpx_track)
    gpx_track.segments.append(gpmf.gps.make_pgx_segment(gps_data))

    video_name = (videoPath.split("/")[-1]).split(".")[0]
    gpxPath = "out.gpx"

    with open(gpxPath, "w") as f:
        f.write(gpx.to_xml())

    return gpxPath

if __name__ == "__main__":
    # extractGpxV2("../big_data/video.MP4", "output.gpx")
    extractGpxV2("../data/hero5.mp4", "output.gpx")
