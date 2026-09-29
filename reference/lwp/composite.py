"""
Puts real screenshots of liveweddingpaintings.nl onto generated device scenes.

The scenes were generated with every screen a flat chroma green, so the model
only ever paints the room, never the website. This finds each green screen,
works out its four corners, bends the real screenshot onto it with a proper
perspective transform, and keys it in with a soft edge. The text on screen is
the site's own pixels, which is the whole point: a generated screen invents
letters, and a portfolio that misspells its own client is worse than none.

Pure PIL, no numpy: the 8x8 solve for the perspective is done by hand.
"""

from PIL import Image, ImageChops, ImageDraw, ImageFilter

GREEN_MIN = 30  # green has to beat red and blue by this much to count


def green_alpha(scene):
    """How green each pixel is, as a soft 0-255 mask."""
    r, g, b = scene.convert("RGB").split()
    excess = ImageChops.subtract(g, ImageChops.lighter(r, b))
    return excess.point(lambda v: 0 if v < GREEN_MIN else min(255, (v - GREEN_MIN) * 3))


def components(alpha, scale=2):
    """Pixel sets of the separate green regions, largest first."""
    small = alpha.resize((alpha.width // scale, alpha.height // scale))
    w, h = small.size
    px = small.load()
    seen = [[False] * w for _ in range(h)]
    regions = []
    for y in range(h):
        for x in range(w):
            if px[x, y] < 128 or seen[y][x]:
                continue
            stack = [(x, y)]
            seen[y][x] = True
            pts = []
            while stack:
                cx, cy = stack.pop()
                pts.append((cx, cy))
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if 0 <= nx < w and 0 <= ny < h and not seen[ny][nx] and px[nx, ny] >= 128:
                        seen[ny][nx] = True
                        stack.append((nx, ny))
            if len(pts) > 400:
                regions.append(pts)
    regions.sort(key=len, reverse=True)
    return [[(x * scale, y * scale) for x, y in pts] for pts in regions]


def corners(points, grow=0.012):
    """Four corners of a (slightly perspective) quad from its pixels."""
    tl = min(points, key=lambda p: p[0] + p[1])
    br = max(points, key=lambda p: p[0] + p[1])
    tr = max(points, key=lambda p: p[0] - p[1])
    bl = max(points, key=lambda p: p[1] - p[0])
    quad = [tl, tr, br, bl]
    # Nudge outwards, so the rounded corners of a phone screen are still covered.
    cx = sum(p[0] for p in quad) / 4
    cy = sum(p[1] for p in quad) / 4
    return [(cx + (x - cx) * (1 + grow), cy + (y - cy) * (1 + grow)) for x, y in quad]


def solve(a, b):
    """Gaussian elimination, enough for one 8x8 system."""
    n = len(b)
    m = [row[:] + [b[i]] for i, row in enumerate(a)]
    for col in range(n):
        piv = max(range(col, n), key=lambda r: abs(m[r][col]))
        m[col], m[piv] = m[piv], m[col]
        for r in range(n):
            if r != col:
                f = m[r][col] / m[col][col]
                for c in range(col, n + 1):
                    m[r][c] -= f * m[col][c]
    return [m[i][n] / m[i][i] for i in range(n)]


def perspective_coeffs(dst, src):
    """Coefficients mapping output (dst quad) back onto the input (src quad)."""
    a, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        a.append([x, y, 1, 0, 0, 0, -u * x, -u * y])
        a.append([0, 0, 0, x, y, 1, -v * x, -v * y])
        b += [u, v]
    return solve(a, b)


def place(scene, shot, pts, alpha, others=()):
    quad = corners(pts)
    tl, tr, br, bl = quad
    width = ((tr[0] - tl[0]) + (br[0] - bl[0])) / 2
    height = ((bl[1] - tl[1]) + (br[1] - tr[1])) / 2

    # A screen standing behind another one shows only part of itself. Fitting
    # the picture to the visible sliver would squeeze the page into it, so the
    # whole screen is reconstructed from its height and the picture's own
    # proportions, and the mask below shows only the part that is really there.
    expected = height * (shot.width / shot.height)
    if width < expected * 0.97 and others:
        grow = expected - width
        mine = sum(p[0] for p in pts) / len(pts)
        theirs = sum(sum(q[0] for q in o) / len(o) for o in others) / len(others)
        if theirs > mine:  # the other screen stands to the right, so this one is cut there
            tr = (tr[0] + grow, tr[1])
            br = (br[0] + grow, br[1])
        else:
            tl = (tl[0] - grow, tl[1])
            bl = (bl[0] - grow, bl[1])
        quad = [tl, tr, br, bl]
        width = expected

    # Crop the screenshot to the screen's shape, anchored at the top of the page.
    want = width / height
    sw, sh = shot.size
    if sw / sh > want:
        new_w = int(sh * want)
        shot = shot.crop(((sw - new_w) // 2, 0, (sw - new_w) // 2 + new_w, sh))
    else:
        shot = shot.crop((0, 0, sw, int(sw / want)))
    sw, sh = shot.size
    coeffs = perspective_coeffs(quad, [(0, 0), (sw, 0), (sw, sh), (0, sh)])
    warped = shot.convert("RGB").transform(scene.size, Image.PERSPECTIVE, coeffs, Image.BICUBIC)

    # Only this screen's green, and only its own shape. Using the bounding box
    # here let one phone's picture spill across the other, because two screens
    # standing side by side have boxes that overlap even when the screens do not.
    own = Image.new("L", scene.size, 0)
    draw = ImageDraw.Draw(own)
    for x, y in pts:
        draw.rectangle((x, y, x + 4, y + 4), fill=255)
    own = own.filter(ImageFilter.MaxFilter(5))
    local = ImageChops.multiply(alpha, own).filter(ImageFilter.GaussianBlur(0.6))

    out = Image.composite(warped, scene.convert("RGB"), local)
    # A faint sheen, so it reads as a screen behind glass and not a sticker.
    sheen = Image.linear_gradient("L").rotate(-35, expand=True).resize(scene.size)
    sheen = sheen.point(lambda v: int(v * 0.05))
    white = Image.new("RGB", scene.size, (255, 255, 255))
    return Image.composite(white, out, ImageChops.multiply(sheen, local))


def despill(img):
    """Pulls leftover green out of anti-aliased screen edges."""
    r, g, b = img.split()
    ceiling = ImageChops.lighter(r, b).point(lambda v: min(255, int(v * 1.0) + 2))
    return Image.merge("RGB", (r, ImageChops.darker(g, ceiling), b))


def run(scene_path, shots, out_path):
    scene = Image.open(scene_path).convert("RGB")
    alpha = green_alpha(scene)
    regions = components(alpha)[: len(shots)]
    regions.sort(key=lambda pts: min(p[0] for p in pts))
    result = scene
    for i, (pts, shot_path) in enumerate(zip(regions, shots)):
        others = [r for j, r in enumerate(regions) if j != i]
        result = place(result, Image.open(shot_path), pts, alpha, others)
    result = despill(result)
    result.save(out_path, quality=90, method=6)
    print("wrote", out_path, result.size, "screens:", len(regions))


if __name__ == "__main__":
    run("scene-laptop.png", ["d-hero.png", "m-hero.png"], "lwp-devices.webp")
    run("scene-phones.png", ["m-boeken.png", "m-formaten.png"], "lwp-phones.webp")
