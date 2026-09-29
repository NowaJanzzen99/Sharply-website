"""
The Sharply mark, constructed rather than traced.

Tracing a render always leaves a trace of the render: nicks where a straight
meets a curve, corners that are almost but not quite where they belong. A
logo should be built from a few decided numbers, so this draws it from its
geometry, with proportions measured off the approved render (band.png):

  - one band of constant thickness T
  - two bowls, each a pair of concentric arcs (outer and inner) around its own
    centre, the two centres placed point-symmetrically about the middle
  - a horizontal middle bar joining the bowls
  - top and bottom bars leaving the bowls at the same slope ALPHA
  - each bar ends in a blade: cut at CUT degrees, so the outer edge runs on to
    a point and the inner edge stops short

The whole mark is point-symmetric about (50, 50): the lower half is the upper
half turned half a circle, which is why it reads as calm despite the points.
Output is one filled path in a 100 by 100 box.
"""

import math

T = 13.6        # band thickness
R = 10.1        # centreline radius of each bowl
BAR = 22.0      # length of the straight middle bar
ALPHA = 19.0    # slope of the top and bottom bars, degrees
CUT = 62.0      # angle of the blade cut, degrees from horizontal
TOP = 8.0       # y of the upper point (the lower one mirrors it)

a = math.radians(ALPHA)
b = math.radians(CUT)
Ro, Ri = R + T / 2, R - T / 2

C = (50 - BAR / 2, 50 - R)       # centre of the upper left bowl
rot = lambda p: (100 - p[0], 100 - p[1])  # the half turn about the middle
C2 = rot(C)


def add(p, v, s=1.0):
    return (p[0] + v[0] * s, p[1] + v[1] * s)


# Where the top bar meets the left bowl, on the outer and inner arc.
radial = (-math.sin(a), -math.cos(a))
T_out = add(C, radial, Ro)
T_in = add(C, radial, Ri)
along = (math.cos(a), -math.sin(a))  # up the top bar, towards its point

# The point: the outer edge runs on until it reaches y = TOP.
tip = add(T_out, along, (T_out[1] - TOP) / math.sin(a))

# The cut drops from the point towards the lower left at CUT degrees and stops
# on the inner edge. Solve tip + u*cut = T_in + s*along.
cut = (-math.cos(b), math.sin(b))
det = cut[0] * (-along[1]) - cut[1] * (-along[0])
rx, ry = T_in[0] - tip[0], T_in[1] - tip[1]
u = (rx * (-along[1]) - ry * (-along[0])) / det
K = add(tip, cut, u)

f = lambda p: f"{p[0]:.3f} {p[1]:.3f}"
arc = lambda r, sweep, p: f"A{r:.3f} {r:.3f} 0 0 {sweep} {f(p)}"

d = "".join(
    [
        f"M{f(tip)}",
        f"L{f(T_out)}",
        arc(Ro, 0, (C[0], C[1] + Ro)),           # round the outside of the left bowl
        f"L{f((C2[0], C2[1] - Ri))}",            # under the middle bar
        arc(Ri, 1, rot(T_in)),                   # round the inside of the right bowl
        f"L{f(rot(K))}",                         # down the bottom bar
        f"L{f(rot(tip))}",                       # the lower point
        f"L{f(rot(T_out))}",                     # back up the outer edge
        arc(Ro, 0, (C2[0], C2[1] - Ro)),         # round the outside of the right bowl
        f"L{f((C[0], C[1] + Ri))}",              # over the middle bar
        arc(Ri, 1, T_in),                        # round the inside of the left bowl
        f"L{f(K)}",                              # up the top bar
        "Z",                                     # and back along the cut to the point
    ]
)

open("mark.path.txt", "w").write(d)
open("mark.svg", "w").write(
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="#fff" d="{d}"/></svg>\n'
)
print(d)
print("tip", tip, "cut ends", K)
