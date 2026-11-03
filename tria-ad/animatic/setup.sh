# Rebuilds the render workspace (fonts, logo, Figma end-card art, MediaPipe, VO, music).
set -e; mkdir -p ~/tria3/assets ~/tria3/frames ~/tria3/audio && cd ~/tria3
A=assets; G=https://fonts.gstatic.com/s
[ -s $A/lexend.woff2 ] || curl -sfL -o $A/lexend.woff2 $G/lexenddeca/v25/K2F1fZFYk-dHSE0UPPuwQ5qnJy8.woff2
[ -s $A/manrope.woff2 ] || curl -sfL -o $A/manrope.woff2 $G/manrope/v23/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFN_C-bk.woff2
[ -s $A/selfie_multiclass.tflite ] || curl -sfL -o $A/selfie_multiclass.tflite https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite
[ -s $A/end_visual.png ] || curl -sfL -o $A/end_visual.png "https://www.figma.com/api/mcp/asset/77f7b619-ef24-409f-8b83-1e895395165c.png" || true
[ -s $A/end_logo.svg ] || curl -sfL -o $A/end_logo.svg "https://www.figma.com/api/mcp/asset/714f754c-fc22-453d-9857-4ca812cb92d8/ed1e2.svg" || true
[ -s $A/end_vec1.svg ] || curl -sfL -o $A/end_vec1.svg "https://www.figma.com/api/mcp/asset/714f754c-fc22-453d-9857-4ca812cb92d8/bd37a.svg" || true
[ -d node_modules/@mediapipe/tasks-vision ] || (export npm_config_cache=$HOME/.npmcache; npm init -y >/dev/null 2>&1; npm install --silent @mediapipe/tasks-vision@0.10.14)
B=https://d8j0ntlcm91z4.cloudfront.net/user_3GyayZ7xholEzgFsWzZA6PnJEyy/hf_20261101_
cd audio
[ -s vo1.mp3 ] || curl -sfL -o vo1.mp3 ${B}030247_c9c8b148-0361-4837-9419-34892648622b.mp3
[ -s vo2.mp3 ] || curl -sfL -o vo2.mp3 ${B}030247_019ee059-9324-408b-9c13-510849002957.mp3
[ -s vo3.mp3 ] || curl -sfL -o vo3.mp3 ${B}030247_ded0d92b-e4db-467f-b7c0-558f0b77a328.mp3
[ -s vo4.mp3 ] || curl -sfL -o vo4.mp3 ${B}030247_ac9295cc-95b5-463a-8041-b7eb54e27641.mp3
[ -s vo5.mp3 ] || curl -sfL -o vo5.mp3 ${B}031334_a545a115-0543-4c8d-a4ce-d1d5dd345ad9.mp3
[ -s vo6.mp3 ] || curl -sfL -o vo6.mp3 ${B}031334_f3af89a4-61cc-4edf-a9ad-f11d61d79b8e.mp3
[ -s sonatema.wav ] || curl -sfL -A "TriaAdBuild/1.0" -o sonatema.wav "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sonatema_-_Inspiration.wav"
cd ..; ls -la assets audio | grep -v total
