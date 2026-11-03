# usage: python3 traillock.py still.png clean.png in.mp4 out.mp4 [period_s] [t0] [push]
# Locks the approved still's light trail over a clean-plate (trail-free) locked-camera animation.
#  - trail = signed difference between the approved still and its clean plate (exact colour/shape)
#  - people that move in front of the trail hide it (motion vs clean plate, smoothed over time)
#  - only motion on the trail: one soft light pulse drifting left->right every `period_s` (4 bars @129bpm)
#  - t0: global ad time of the clip's first frame, so the pulse stays continuous across cuts
#  - push: optional slow digital push-in (e.g. 0.06 = 6% over the clip) for the aerials
#  - track: 1 = follow camera drift (homography from clean plate to each frame) so the trail stays glued to the scene
import sys, subprocess, numpy as np
from PIL import Image, ImageFilter
still, clean, vin, vout = sys.argv[1:5]
P = float(sys.argv[5]) if len(sys.argv) > 5 else 7.44
T0 = float(sys.argv[6]) if len(sys.argv) > 6 else 0.0
PUSH = float(sys.argv[7]) if len(sys.argv) > 7 else 0.0
TRACK = len(sys.argv) > 8 and sys.argv[8] == '1'
if TRACK:
    import cv2
W, H = 1920, 1080
A = np.asarray(Image.open(still).convert('RGB').resize((W, H), Image.LANCZOS), np.float32)
B = np.asarray(Image.open(clean).convert('RGB').resize((W, H), Image.LANCZOS), np.float32)
D = A - B
m = np.clip((np.abs(D).max(2) - 8) / 25, 0, 1)
m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2)), np.float32) / 255
T = D * m[..., None]
lum = np.abs(T).max(2); xs = np.arange(W)[None, :] / W
n = int(subprocess.run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', vin], capture_output=True, text=True).stdout.strip() or 145)
pr = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-i', vin, '-vf', f'scale={W}:{H}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
pw = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '24', '-i', '-',
                       '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', vout], stdin=subprocess.PIPE)
ema = None; i = 0
if TRACK:
    sc = 0.5
    det = cv2.SIFT_create(3000)
    g0 = cv2.cvtColor(cv2.resize(B.astype(np.uint8), None, fx=sc, fy=sc), cv2.COLOR_RGB2GRAY)
    k0, d0 = det.detectAndCompute(g0, (cv2.resize(m, None, fx=sc, fy=sc) < 0.05).astype(np.uint8) * 255)
    mt = cv2.BFMatcher(cv2.NORM_L2)
    S = np.diag([1 / sc, 1 / sc, 1]); Si = np.linalg.inv(S); Hs = np.eye(3)
B0, T0a, lum0 = B, T, lum
while True:
    buf = pr.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    F = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
    if TRACK:
        g1 = cv2.cvtColor(cv2.resize(F.astype(np.uint8), None, fx=sc, fy=sc), cv2.COLOR_RGB2GRAY)
        k1, d1 = det.detectAndCompute(g1, None)
        good = [a for a, b in mt.knnMatch(d0, d1, k=2) if a.distance < 0.75 * b.distance]
        if len(good) > 30:
            Hm, _ = cv2.findHomography(np.float32([k0[a.queryIdx].pt for a in good]), np.float32([k1[a.trainIdx].pt for a in good]), cv2.RANSAC, 2.0)
            if Hm is not None: Hs = 0.5 * Hs + 0.5 * (S @ Hm @ Si) if i else S @ Hm @ Si
        T = cv2.warpPerspective(T0a, Hs, (W, H), flags=cv2.INTER_LINEAR)
        B = cv2.warpPerspective(B0, Hs, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        lum = np.abs(T).max(2)
    mv = np.abs(F - B).mean(2)
    mv = np.asarray(Image.fromarray(np.clip((mv - 18) * 8, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5)), np.float32) / 255
    mv = mv * (lum > 4)
    ema = mv if ema is None else ema * 0.8 + mv * 0.2
    t = T0 + i / 24
    ph = (t / P) % 1.0 * 1.6 - 0.3
    g = 0.96 + 0.16 * np.exp(-((xs - ph) ** 2) / (2 * 0.16 ** 2)) + 0.04 * np.sin(2 * np.pi * t / (P * 2))
    out = np.clip(F + T * g[..., None] * (1 - ema[..., None]), 0, 255).astype(np.uint8)
    if PUSH:
        s = 1 + PUSH * (i / max(n - 1, 1)) ** 1.0
        im = Image.fromarray(out); w2, h2 = W / s, H / s
        out = np.asarray(im.resize((W, H), Image.BICUBIC, box=((W - w2) / 2, (H - h2) / 2, (W + w2) / 2, (H + h2) / 2)))
    pw.stdin.write(out.tobytes()); i += 1
pw.stdin.close(); pw.wait(); print('frames', i)
