import os
import json

import pytesseract
from PIL import Image

print("👀 Read environment variables")
INPUT_FILE = os.environ['INPUT_FILE']
OUTPUT_FILE = os.environ['OUTPUT_FILE']

def detect_text(path):

    img = Image.open(path)
    img = img.convert('RGB')

    #this converts img to black-and-white
    pix = img.load()
    for y in range(img.size[1]):
        for x in range(img.size[0]):
            if pix[x, y][0] < 102 or pix[x, y][1] < 102 or pix[x, y][2] < 102:
                pix[x, y] = (0, 0, 0, 255)
            else:
                pix[x, y] = (255, 255, 255, 255)

    text = pytesseract.image_to_string(img).replace('\n', ' ').replace('\r', '').replace('  ', ' ')

    if not text:
        return ''

    return text

print("📝 Applying OCR at image...")

result_str = json.dumps(detect_text(INPUT_FILE))
print("📃 Result: " + result_str)

# output result
print("🖊  Write result...")
f = open(OUTPUT_FILE, "w")
f.write("{\"imageOcr\": " + str(result_str) + "}")
f.close()

print("🚀 success")
