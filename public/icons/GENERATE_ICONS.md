# PWA Icon Generation Instructions

## Missing Icons

The manifest.json requires these PWA icons:
- `icon-192x192.png` - For Android devices
- `icon-512x512.png` - For high-res displays

## Quick Solution

### Option 1: Use PWA Asset Generator (Recommended)

1. Install: `npm install -g pwa-asset-generator`
2. Run from frontend directory:
   ```bash
   npx pwa-asset-generator ../app/icon.svg ./public/icons -m ./public/manifest.json
   ```

### Option 2: Online Tool

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload `app/icon.svg`
3. Download generated icons
4. Place in `public/icons/`

### Option 3: Manual (ImageMagick)

```bash
# From frontend/app directory
convert icon.svg -resize 192x192 ../public/icons/icon-192x192.png
convert icon.svg -resize 512x512 ../public/icons/icon-512x512.png
```

## What These Icons Do

- **192x192**: Shown when user adds app to Android home screen
- **512x512**: Used for splash screens and high-DPI displays

After generating, your PWA will be fully installable!
