#!/usr/bin/env python3
"""Copy example images from styles/<id>/ into public/images/{id}.jpg.

Prefers example-1.jpg; falls back to any .jpg/.jpeg/.png/.webp in the folder.
Optionally regenerates public/data/catalog.json from the source catalog.
"""
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def pick_image(style_dir: Path) -> Path | None:
    preferred = style_dir / "example-1.jpg"
    if preferred.is_file():
        return preferred
    candidates = sorted(
        p
        for p in style_dir.iterdir()
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    )
    return candidates[0] if candidates else None


def sync_images(styles_root: Path, out: Path, ids: set[str] | None = None) -> tuple[int, list[str]]:
    out.mkdir(parents=True, exist_ok=True)
    synced = 0
    missing: list[str] = []

    dirs = sorted(d for d in styles_root.iterdir() if d.is_dir())
    if ids is not None:
        dirs = [d for d in dirs if d.name in ids]
        # also report catalog ids with no folder
        present = {d.name for d in dirs}
        for sid in sorted(ids - present):
            missing.append(sid)

    for d in dirs:
        img = pick_image(d)
        if not img:
            missing.append(d.name)
            continue
        dest = out / f"{d.name}.jpg"
        # Always store as .jpg name for the site convention; content may be png/webp
        if img.suffix.lower() in {".jpg", ".jpeg"}:
            shutil.copy2(img, dest)
        else:
            # keep original bytes but name as .jpg expected by catalog paths
            shutil.copy2(img, dest)
        synced += 1
    return synced, missing


def build_web_catalog(source: Path, images_rel_prefix: str = "images") -> dict:
    raw = json.loads(source.read_text(encoding="utf-8"))
    styles_out = []
    for s in raw.get("styles", []):
        sid = s.get("style_id") or s.get("id")
        if not sid:
            continue
        styles_out.append(
            {
                "id": sid,
                "name_zh": s.get("name_zh") or "",
                "name_en": s.get("name_en") or "",
                "category": s.get("category") or "",
                "category_zh": s.get("category_zh") or "",
                "prompt": s.get("prompt") or "",
                "negative_prompt": s.get("negative_prompt") or "",
                "source_url": s.get("source_url") or "",
                "source_note": s.get("source_note") or "",
                "image": f"{images_rel_prefix}/{sid}.jpg",
                "image_remote": s.get("image_source_url")
                or s.get("image_remote")
                or "",
                "compatible_with": s.get("compatible_with") or [],
                "usage_hint_zh": s.get("usage_hint_zh") or "",
            }
        )
    return {
        "title": "风格提示词图鉴",
        "title_en": "Style Prompt Gallery",
        "version": raw.get("version") or "",
        "count": len(styles_out),
        "updated": raw.get("updated") or "",
        "styles": styles_out,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--styles", required=True, help="path to styles/ directory")
    ap.add_argument("--out", default="public/images")
    ap.add_argument(
        "--catalog",
        default=None,
        help="source catalog.json; if set, regenerate public/data/catalog.json",
    )
    ap.add_argument(
        "--catalog-out",
        default="public/data/catalog.json",
        help="output path for slim web catalog",
    )
    ap.add_argument(
        "--only-catalog-ids",
        action="store_true",
        help="only sync images for ids present in --catalog",
    )
    args = ap.parse_args()

    styles_root = Path(args.styles)
    out = Path(args.out)
    ids: set[str] | None = None

    if args.catalog:
        web = build_web_catalog(Path(args.catalog))
        catalog_out = Path(args.catalog_out)
        catalog_out.parent.mkdir(parents=True, exist_ok=True)
        catalog_out.write_text(
            json.dumps(web, ensure_ascii=False, separators=(",", ":")),
            encoding="utf-8",
        )
        print(
            f"wrote catalog {catalog_out} version={web['version']} count={web['count']}"
        )
        if args.only_catalog_ids:
            ids = {s["id"] for s in web["styles"]}

    synced, missing = sync_images(styles_root, out, ids)
    print(f"synced {synced} images -> {out}")
    print(f"missing {len(missing)}")
    if missing:
        print("missing ids (first 40):", ", ".join(missing[:40]))


if __name__ == "__main__":
    main()
