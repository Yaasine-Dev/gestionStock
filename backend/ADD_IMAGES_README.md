# 🖼️ Adding Fake Product Images

## Quick Start

### Add Images to All Products
```bash
cd Backend
python add_fake_images.py
```

### Remove All Images (Cleanup)
```bash
cd Backend
python add_fake_images.py --remove
```

## What This Does

The script will:
1. ✅ Connect to your database
2. ✅ Find all products
3. ✅ Assign a fake image URL from Unsplash to each product
4. ✅ Save changes to database

## Image Sources

The script uses high-quality product images from Unsplash:
- Headphones, watches, laptops
- Keyboards, mice, cameras
- Bags, shoes, accessories
- And more!

## Example Output

```
============================================================
🖼️  FAKE PRODUCT IMAGES MANAGER
============================================================

📸 Adding fake images to products...
📦 Found 15 products
🖼️  Adding fake images...

✅ Updated: Laptop Dell -> https://images.unsplash.com/photo-...
✅ Updated: Mouse Logitech -> https://images.unsplash.com/photo-...
✅ Updated: Keyboard Mechanical -> https://images.unsplash.com/photo-...

✨ Successfully updated 15 products with fake images!
🎉 You can now see product images in your application!

============================================================
✅ Done!
============================================================
```

## Verify Images

After running the script:
1. Refresh your frontend application
2. Go to Products page
3. Go to Stock page and click the eye icon 👁️
4. You should see product images!

## Notes

- Images are from Unsplash (free to use)
- Images are assigned cyclically if you have more products than images
- The `image_url` field already exists in your database
- Images will show in:
  - Product details modal
  - Stock details modal
  - Product cards (if implemented)

## Troubleshooting

If images don't show:
1. Check your internet connection (images are hosted online)
2. Verify the script ran successfully
3. Check browser console for errors
4. Try refreshing the page (Ctrl+F5)
