#!/usr/bin/env python3
"""
Build script for The Nesbitt Codex.

Concatenates the sources in src/ into a single self-contained index.html
with no external dependencies — no CDN, no build toolchain, no runtime
framework. Everything (CSS, data, logic, SVG) ships in one file so the
page works offline and from a bare file:// path.

Usage:  python3 build.py
"""

from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"

HTML_PARTS = ["part1_head.html", "part2_body.html"]
JS_PARTS = ["data_a.js", "data_b.js", "app.js"]


def build() -> str:
    html = "".join((SRC / p).read_text(encoding="utf-8") for p in HTML_PARTS)
    js = "\n".join((SRC / p).read_text(encoding="utf-8") for p in JS_PARTS)
    return f"{html}<script>\n{js}\n</script>\n</body>\n</html>\n"


if __name__ == "__main__":
    out = ROOT / "index.html"
    doc = build()
    out.write_text(doc, encoding="utf-8")
    print(f"built {out.relative_to(ROOT)} — {len(doc):,} bytes")
