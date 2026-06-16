import os
from PIL import Image

# Source image path
source_path = r"C:\Users\kmuru\.gemini\antigravity-ide\brain\767adbef-f665-4636-9915-8a124ac5c511\codelens_app_icon_1781461641492.png"
output_dir = r"d:\Codelens\public"

# Create output dir if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Open the source image
img = Image.open(source_path)

# List of sizes to generate
sizes = {
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "apple-touch-icon.png": (180, 180),
    "android-chrome-192x192.png": (192, 192),
    "android-chrome-512x512.png": (512, 512),
}

# Generate PNGs
for filename, size in sizes.items():
    resized_img = img.resize(size, Image.Resampling.LANCZOS)
    resized_img.save(os.path.join(output_dir, filename), "PNG")
    print(f"Generated {filename} ({size[0]}x{size[1]})")

# Generate favicon.ico (32x32)
favicon_ico = img.resize((32, 32), Image.Resampling.LANCZOS)
favicon_ico.save(os.path.join(output_dir, "favicon.ico"), format="ICO", sizes=[(32, 32)])
print("Generated favicon.ico (32x32)")

# Generate og-image.png (1200x630) for social sharing preview
# Crop/resize to fit 1200x630 nicely
og_img = Image.new("RGBA", (1200, 630), (2, 2, 10, 255)) # deep background
# Resize source icon to fit inside og-image
icon_size = (360, 360)
resized_icon = img.resize(icon_size, Image.Resampling.LANCZOS)
# Paste icon in the center of the og-image
paste_x = (1200 - icon_size[0]) // 2
paste_y = (630 - icon_size[1]) // 2
og_img.paste(resized_icon, (paste_x, paste_y), mask=resized_icon.convert("RGBA").split()[3] if resized_icon.mode == "RGBA" else None)
og_img.save(os.path.join(output_dir, "og-image.png"), "PNG")
print("Generated og-image.png (1200x630)")
