#!/usr/bin/env bash
# ============================================================
# build_all.sh — Production build orchestrator for BOSE.
#   * Builds all 5 web frontends (vite -> dist/)
#   * Builds the Flutter mobile APK (release)
#   * Verifies each output exists and is populated
# Run as your NORMAL user (not root) — Flutter refuses to build as root.
# ============================================================
set -uo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

FRONTENDS=(Furkan-Alp-Gunay Cem-Karaca Salih-Arda-Katircioglu Enes-Coban Yakup-Efe-Celebi)
APK_PATH="$ROOT/mobile/build/app/outputs/flutter-apk/app-release.apk"
declare -A WEB
WEBFAILS=0

echo "############ [1/2] WEB FRONTENDS ############"
for d in "${FRONTENDS[@]}"; do
  fe="$ROOT/$d/frontend"
  echo "---- $d/frontend ----"
  if [ ! -f "$fe/package.json" ]; then
    echo "  [SKIP] no package.json"; WEB[$d]="SKIP"; WEBFAILS=$((WEBFAILS+1)); continue
  fi
  ( cd "$fe" && npm install --no-audit --no-fund && npm run build ) > "$fe/build.log" 2>&1
  rc=$?
  if [ $rc -eq 0 ] && [ -f "$fe/dist/index.html" ]; then
    echo "  [OK] dist/ built ($(du -sh "$fe/dist" | cut -f1), index.html present)"
    WEB[$d]="OK $(du -sh "$fe/dist" | cut -f1)"
  else
    echo "  [FAIL] rc=$rc, dist/index.html missing — tail of build.log:"
    tail -n 8 "$fe/build.log" | sed 's/^/      /'
    WEB[$d]="FAIL"; WEBFAILS=$((WEBFAILS+1))
  fi
done

echo
echo "############ [2/2] FLUTTER MOBILE APK ############"
if ! command -v flutter >/dev/null 2>&1; then
  echo "  [SKIP] flutter not installed"; APK="SKIP(no flutter)"
elif [ "$(id -u)" = "0" ]; then
  echo "  [SKIP] running as ROOT — Flutter refuses to build as root."
  echo "         Re-run this script as your normal user to produce the APK."
  APK="SKIP(root)"
else
  ( cd "$ROOT/mobile" && flutter pub get && flutter build apk --release ) > "$ROOT/mobile/build.log" 2>&1
  rc=$?
  if [ $rc -eq 0 ] && [ -f "$APK_PATH" ]; then
    echo "  [OK] APK ($(du -h "$APK_PATH" | cut -f1)): $APK_PATH"; APK="OK $(du -h "$APK_PATH" | cut -f1)"
  else
    echo "  [FAIL] rc=$rc — tail of mobile/build.log:"; tail -n 12 "$ROOT/mobile/build.log" | sed 's/^/      /'; APK="FAIL"
  fi
fi

echo
echo "############ BUILD SUMMARY ############"
for d in "${FRONTENDS[@]}"; do printf "  %-28s %s\n" "$d (web)" "${WEB[$d]:-?}"; done
printf "  %-28s %s\n" "mobile (apk)" "$APK"
echo
if [ $WEBFAILS -eq 0 ]; then echo "✅ all web builds OK"; else echo "⚠️  $WEBFAILS web build(s) failed"; fi
case "$APK" in OK*) : ;; SKIP*) echo "ℹ️  APK skipped — run as non-root user to generate it." ;; *) echo "⚠️  APK build failed." ;; esac
exit $WEBFAILS
