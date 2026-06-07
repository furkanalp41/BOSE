#!/usr/bin/env bash
# ============================================================
# package_delivery.sh — assemble delivery/ and BOSE_Final_Submission.zip.
#   Includes: web dist builds, Flutter APK, all rubric *.md docs,
#             docker-compose.yml, README.md.
#   Excludes: ALL .env files and the security/ incident docs.
#   Runs a secret audit before zipping.
# Run AFTER build_all.sh.
# ============================================================
set -uo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
DEL="$ROOT/delivery"; ZIP="$ROOT/BOSE_Final_Submission.zip"
FRONTENDS=(Furkan-Alp-Gunay Cem-Karaca Salih-Arda-Katircioglu Enes-Coban Yakup-Efe-Celebi)

echo "== reset delivery/ =="
rm -rf "$DEL" "$ZIP"
mkdir -p "$DEL/web" "$DEL/mobile" "$DEL/docs"

echo "== web dist builds =="
for d in "${FRONTENDS[@]}"; do
  src="$ROOT/$d/frontend/dist"
  if [ -f "$src/index.html" ]; then
    cp -r "$src" "$DEL/web/$d"; echo "  + web/$d ($(du -sh "$DEL/web/$d" | cut -f1))"
  else
    echo "  ! web/$d: dist MISSING — run build_all.sh first"
  fi
done

echo "== mobile APK =="
APK="$ROOT/mobile/build/app/outputs/flutter-apk/app-release.apk"
if [ -f "$APK" ]; then
  cp "$APK" "$DEL/mobile/BOSE-release.apk"; echo "  + mobile/BOSE-release.apk ($(du -h "$DEL/mobile/BOSE-release.apk" | cut -f1))"
else
  echo "  ! APK MISSING — build it as a non-root user (build_all.sh), then re-run this script"
fi

echo "== rubric docs (all *.md except security/ + build dirs) =="
while IFS= read -r f; do
  rel="${f#"$ROOT"/}"
  mkdir -p "$DEL/docs/$(dirname "$rel")"
  cp "$f" "$DEL/docs/$rel"
done < <(find "$ROOT" -type f -name '*.md' \
  -not -path '*/node_modules/*' -not -path '*/dist/*' -not -path '*/build/*' \
  -not -path '*/.git/*' -not -path "$DEL/*" -not -path '*/security/*')
echo "  + $(find "$DEL/docs" -name '*.md' | wc -l | tr -d ' ') markdown files"

echo "== compose + readme =="
cp "$ROOT/docker-compose.yml" "$DEL/docker-compose.yml" && echo "  + docker-compose.yml"
cp "$ROOT/README.md" "$DEL/README.md" && echo "  + README.md"

echo
echo "== SECURITY SWEEP =="
# (1) Hard guarantee: zero real .env files in the package.
mapfile -t STRAY < <(find "$DEL" -name '*.env' ! -name '*.env.example' 2>/dev/null)
if [ "${#STRAY[@]}" -gt 0 ]; then
  echo "  !! removing ${#STRAY[@]} stray .env file(s):"; printf '     %s\n' "${STRAY[@]}"; rm -f "${STRAY[@]}"
fi
echo "  .env files remaining in delivery/: $(find "$DEL" -name '*.env' ! -name '*.env.example' | wc -l | tr -d ' ')"
# (2) Scan for PRODUCTION secret markers (leaked Render DSN / cloud keys).
#     The local docker-compose bose:bose + local JWT are intentional, not secrets.
HITS=$(grep -rInE 'sslmode=require|render\.com|amazonaws\.com|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}' "$DEL" 2>/dev/null || true)
if [ -n "$HITS" ]; then
  echo "  !! review these production-secret markers before sending:"; echo "$HITS" | sed 's/^/     /'
else
  echo "  ✅ no production-secret markers (Render DSN / cloud keys) found"
fi
echo "  note: docker-compose.yml intentionally carries LOCAL dev creds (bose:bose) — safe to ship."

echo
echo "== zip =="
( cd "$ROOT" && zip -r -q "$ZIP" delivery )
echo "✅ $ZIP ($(du -h "$ZIP" | cut -f1))"
echo
echo "== delivery/ tree (top levels) =="
find "$DEL" -maxdepth 2 -mindepth 1 | sort | sed "s#$DEL#  delivery#"
