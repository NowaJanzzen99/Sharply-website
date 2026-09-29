"""
Turns the chosen logo render (band.png, white S on black) into a clean SVG path.

A generated image is never a logo file on its own: it is a picture of a logo,
soft at its edges and fixed at one size. This traces its outline and rebuilds
it as one filled path in a 100 by 100 box that stays sharp at any size.

The first version simplified the whole outline and then guessed at corners
from the simplified points, which left small nicks wherever a straight edge
met a curve. This one finds the corners on the raw outline first, at a scale
where a curve cannot pass for one: only the blade tips turn hard over a short
distance. Everything between two corners is then drawn as one smooth run.

Steps, all pure PIL and Python:
  1. Threshold the 2048px render into a solid mask.
  2. Follow the outline with Moore neighbour tracing, and smooth it lightly.
  3. Find the true corners: a large turn measured across 22 pixels either side.
  4. Between corners, simplify with Douglas-Peucker and draw Catmull-Rom
     curves through what is left, clamped at both ends so each run leaves and
     arrives at its corner in a straight line.
"""

import math
from PIL import Image, ImageFilter

SRC = "band.png"
SPAN = 22  # pixels either side when measuring a turn
CORNER_DEG = 62  # a turn sharper than this, over that span, is a real corner


def mask():
    im = Image.open(SRC).convert("L").filter(ImageFilter.MedianFilter(5))
    return im.point(lambda v: 255 if v > 128 else 0)


def trace(m):
    w, h = m.size
    px = m.load()
    inside = lambda x, y: 0 <= x < w and 0 <= y < h and px[x, y] > 0
    start = next((x, y) for y in range(h) for x in range(w) if px[x, y] > 0)
    dirs = [(-1, 0), (-1, -1), (0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1)]
    contour, cur, back = [start], start, 0
    for _ in range(200000):
        for i in range(8):
            d = (back + 1 + i) % 8
            nx, ny = cur[0] + dirs[d][0], cur[1] + dirs[d][1]
            if inside(nx, ny):
                back, cur = (d + 4) % 8, (nx, ny)
                break
        else:
            break
        if cur == start and len(contour) > 10:
            break
        contour.append(cur)
    return contour


def smooth(pts, k):
    n = len(pts)
    return [
        (
            sum(pts[(i + j) % n][0] for j in range(-k, k + 1)) / (2 * k + 1),
            sum(pts[(i + j) % n][1] for j in range(-k, k + 1)) / (2 * k + 1),
        )
        for i in range(n)
    ]


def turn_deg(a, b, c):
    v1 = (b[0] - a[0], b[1] - a[1])
    v2 = (c[0] - b[0], c[1] - b[1])
    return abs(math.degrees(math.atan2(v1[0] * v2[1] - v1[1] * v2[0], v1[0] * v2[0] + v1[1] * v2[1])))


def find_corners(pts):
    n = len(pts)
    turns = [turn_deg(pts[i - SPAN], pts[i], pts[(i + SPAN) % n]) for i in range(n)]
    corners, i = [], 0
    while i < n:
        if turns[i] > CORNER_DEG:
            j = i
            while j + 1 < n and turns[j + 1] > CORNER_DEG:
                j += 1
            corners.append(max(range(i, j + 1), key=lambda k: turns[k]))
            i = j + 1
        else:
            i += 1
    return corners


def dp(pts, eps):
    if len(pts) < 3:
        return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0] - a[0], b[1] - a[1]
    norm = math.hypot(dx, dy) or 1
    far, idx = 0, 0
    for i in range(1, len(pts) - 1):
        d = abs(dy * pts[i][0] - dx * pts[i][1] + b[0] * a[1] - b[1] * a[0]) / norm
        if d > far:
            far, idx = d, i
    if far > eps:
        return dp(pts[: idx + 1], eps)[:-1] + dp(pts[idx:], eps)
    return [a, b]


raw = smooth(trace(mask()), 3)
n = len(raw)
cs = find_corners(raw)
# Pin every corner to its true pixel position, not the smoothed one.
runs = []
for a, b in zip(cs, cs[1:] + [cs[0] + n]):
    seg = [raw[k % n] for k in range(a, b + 1)]
    runs.append(dp(seg, 0.9))

allpts = [p for run in runs for p in run]
xs = [p[0] for p in allpts]
ys = [p[1] for p in allpts]
w, h = max(xs) - min(xs), max(ys) - min(ys)
size = max(w, h) / 0.84  # an even eight per cent margin all round
x0, y0 = min(xs) - (size - w) / 2, min(ys) - (size - h) / 2
f = lambda p: ((p[0] - x0) / size * 100, (p[1] - y0) / size * 100)
fmt = lambda p: f"{p[0]:.2f} {p[1]:.2f}"

d = [f"M{fmt(f(runs[0][0]))}"]
for run in runs:
    q = [f(p) for p in run]
    if len(q) == 2:
        d.append(f"L{fmt(q[1])}")
        continue
    # Catmull-Rom through the run; the ends are doubled so the curve meets
    # each corner head on instead of swinging past it.
    ext = [q[0]] + q + [q[-1]]
    for i in range(1, len(ext) - 2):
        p0, p1, p2, p3 = ext[i - 1], ext[i], ext[i + 1], ext[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d.append(f"C{fmt(c1)} {fmt(c2)} {fmt(p2)}")
d.append("Z")
path = "".join(d)

open("mark.path.txt", "w").write(path)
open("mark.svg", "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#fff" d="{path}"/></svg>\n'
)
print("contour", n, "corners", len(cs), "runs", [len(r) for r in runs], "chars", len(path))
