# Men’s Abs Media Batch

This batch contains **11 vertically formatted MP4 clips** supplied for the men’s abs workout library. The files are referenced by verified Cloudinary delivery URLs in the typed content records in `shared/men-abs-content.ts`.

| Uploaded file | Mapped exercise | Focus | Prescription | Duration | Delivery URL |
|---|---|---|---:|---:|
| `Fullabs2.mp4` | Reverse crunch | Full/lower abs | 20 reps | 7.833 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696714/Full_abs_2.mp4) |
| `Fullabs3.mp4` | Leg lift | Full abs | 10 reps | 7.833 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696713/Full_abs_3.mp4) |
| `Man-fullabs.mp4` | Reverse crunch variation | Full/lower abs | 20 reps | 6.300 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696714/Man-full_abs.mp4) |
| `Man-Obliques2.mp4` | Side plank hip lift — right | Obliques | 15 reps | 4.633 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696711/Man-Obliques_2.mp4) |
| `Man-obliques.mp4` | Bicycle crunch | Obliques | 20 reps | 5.066 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696714/Man-obliques.mp4) |
| `Man-upperabs.mp4` | Toe touch | Upper/middle abs | 30 reps | 6.133 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696713/Man-upper_abs.mp4) |
| `Man-upper.mp4` | Crunch | Upper/full abs | 30 reps | 6.567 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696721/Man-upper.mp4) |
| `Obliques-5.mp4` | Oblique V-up — right | Obliques | 15 reps | 5.100 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696719/Obliques-5.mp4) |
| `Obliques3.mp4` | Russian twist | Obliques | 40 reps | 5.067 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696718/Obliques_3.mp4) |
| `Obliques4.mp4` | Bicycle crunch variation | Obliques | 30 reps | 5.066 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696720/Obliques_4.mp4) |
| `obliques-left.mp4` | Oblique V-up — left | Obliques | 15 reps | 5.766 s | [Cloudinary](https://res.cloudinary.com/qvzram56/video/upload/v1786696720/obliques-left.mp4) |

The analyzer labels are treated as **content-review suggestions**, not medical or coaching approval. The records use `status: review`, `professionalReviewStatus: not-reviewed`, and `licenseStatus: pending` until ownership or licensing is confirmed. The women’s abs batch should be added under a separate audience and media-batch identifier rather than merged into these records.

Before production release, these local asset references should be migrated to a managed video CDN or private object-storage system. The app’s typed media schema already supports remote URIs, thumbnails, MIME types, duration, rights holder, license reference, attribution, and expiry metadata.
