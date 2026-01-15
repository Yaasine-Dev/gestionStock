"""
Script to add fake product images to the database for testing
Run this script from the Backend directory: python add_fake_images.py
"""

from database import SessionLocal
from models import Product
from sqlalchemy import text

# Fake product images from placeholder services
FAKE_IMAGES = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",  # Headphones
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",  # Watch
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",  # Sunglasses
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",  # Smart Watch
    "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400",  # Perfume
    "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400",  # Camera
    "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=400",  # Laptop
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400",  # Mouse
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400",  # Keyboard
    "https://images.unsplash.com/photo-1572635196184-84e35138cf62?w=400",  # Bag
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",  # Shoes
    "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=400",  # Backpack
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",  # Phone
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",  # MacBook
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",  # Headset
    "https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=400",  # Wallet
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400",  # Smartwatch
    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400",  # Laptop
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",  # Speaker
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",  # Headphones
]

def add_fake_images():
    """Add fake images to all products in the database"""
    db = SessionLocal()
    
    try:
        # Get all products
        products = db.query(Product).all()
        
        if not products:
            print("❌ No products found in database!")
            return
        
        print(f"📦 Found {len(products)} products")
        print("🖼️  Adding fake images...\n")
        
        updated_count = 0
        
        for i, product in enumerate(products):
            # Assign image cyclically from the fake images list
            image_url = FAKE_IMAGES[i % len(FAKE_IMAGES)]
            product.image_url = image_url
            updated_count += 1
            print(f"✅ Updated: {product.name} -> {image_url}")
        
        # Commit all changes
        db.commit()
        
        print(f"\n✨ Successfully updated {updated_count} products with fake images!")
        print("🎉 You can now see product images in your application!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

def remove_all_images():
    """Remove all images from products (cleanup function)"""
    db = SessionLocal()
    
    try:
        products = db.query(Product).all()
        
        for product in products:
            product.image_url = None
        
        db.commit()
        print(f"✅ Removed images from {len(products)} products")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    print("=" * 60)
    print("🖼️  FAKE PRODUCT IMAGES MANAGER")
    print("=" * 60)
    print()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--remove":
        print("🗑️  Removing all images...")
        remove_all_images()
    else:
        print("📸 Adding fake images to products...")
        add_fake_images()
    
    print()
    print("=" * 60)
    print("✅ Done!")
    print("=" * 60)
