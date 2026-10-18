#!/usr/bin/env bash
set -u
out=/home/ubuntu/fitpath-india/abs_video_analysis
mkdir -p "$out"
for file in /home/ubuntu/upload/*.mp4; do
  base=$(basename "$file" .mp4)
  manus-analyze-video "$file" "Identify the primary exercise or movement demonstrated, target abdominal region if apparent (full abs, upper abs, obliques, lower abs, or unclear), whether the clip appears to show repetitions or a timed hold, and any visible form or safety notes. Do not infer a precise exercise name if the movement is ambiguous; list it as review-needed." > "$out/$base.txt" 2>&1 || printf 'Analysis failed for %s\n' "$file" > "$out/$base.txt"
done
