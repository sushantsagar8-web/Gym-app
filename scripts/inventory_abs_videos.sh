#!/usr/bin/env bash
set -euo pipefail
printf 'filename\tbytes\tduration_seconds\twidth\theight\tfps\n'
for file in /home/ubuntu/upload/*.mp4; do
  base=$(basename "$file")
  bytes=$(stat -c '%s' "$file")
  probe=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of csv=p=0 "$file" 2>/dev/null || true)
  printf '%s\t%s\t%s\n' "$base" "$bytes" "$probe"
done
