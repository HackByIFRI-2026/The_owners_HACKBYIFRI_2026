from PIL import Image
import sys

def crop_transparent(image_path):
    print(f"Processing {image_path}")
    img = Image.open(image_path)
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Get bounding box of non-transparent content
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        img_cropped.save(image_path)
        print(f"Cropped and saved {image_path}")
    else:
        print("Image is entirely transparent or bounding box not found.")

if __name__ == '__main__':
    crop_transparent('c:\\Users\\Lucio\\Downloads\\The_owners_HACK2026\\The_owners_HACKBYIFRI_2026\\frontend\\public\\logo-1.png')
