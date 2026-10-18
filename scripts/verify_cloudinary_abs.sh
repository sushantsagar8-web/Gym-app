#!/usr/bin/env bash
set -u
urls=(
"https://res.cloudinary.com/qvzram56/video/upload/v1786696721/Man-upper.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696720/obliques-left.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696720/Obliques_4.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696719/Obliques-5.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696718/Obliques_3.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696714/Man-full_abs.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696714/Full_abs_2.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696713/Full_abs_3.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696714/Man-obliques.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696713/Man-upper_abs.mp4"
"https://res.cloudinary.com/qvzram56/video/upload/v1786696711/Man-Obliques_2.mp4"
)
for url in "${urls[@]}"; do
  status=$(curl -L -s -o /dev/null -w '%{http_code}' --max-time 20 "$url")
  printf '%s\t%s\n' "$status" "$url"
done
