import requests

# Demo data ban đầu
demo = [
    {
        "id": "1",
        "title": "Sunset",
        "description": "A beautiful over the ocean",
        "category": ["Landscape", "Nature"],
        "dimensions": {"width": 100, "height": 80},
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
                "type": "main",
                "order": 1
            }
        ],
        "status": "Available",
        "price": 5000000,
        "createdAt": "2024-01-01",
        "updatedAt": "2024-01-01",
        "viewCount": 150
    },
    {
        "id": "2",
        "title": "Mountain View",
        "description": "Majestic mountain peaks at sunrise",
        "category": ["Landscape", "Nature"],
        "dimensions": {"width": 120, "height": 90},
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9",
                "type": "main",
                "order": 1
            }
        ],
        "status": "Sold",
        "price": 7500000,
        "createdAt": "2024-01-02",
        "updatedAt": "2024-01-02",
        "viewCount": 200
    },
    {
        "id": "3",
        "title": "Abstract Thoughts",
        "description": "An abstract of modern life",
        "category": ["Abstract", "Modern"],
        "dimensions": {"width": 80, "height": 100},
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3",
                "type": "main",
                "order": 1
            }
        ],
        "status": "Hidden",
        "price": 1000000,
        "createdAt": "2024-01-03",
        "updatedAt": "2024-01-03",
        "viewCount": 75
    },
    {
        "id": "4",
        "title": "Urban Dreams",
        "description": "A cityscape at twilight",
        "category": ["Urban", "Architecture"],
        "dimensions": {"width": 150, "height": 100},
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb",
                "type": "main",
                "order": 1
            }
        ],
        "status": "Available",
        "price": 850000,
        "createdAt": "2024-01-04",
        "updatedAt": "2024-01-04",
        "viewCount": 180
    },
    {
        "id": "5",
        "title": "Floral Symphony",
        "description": "Vibrant garden flowers in bloom",
        "category": ["Nature", "Still Life"],
        "dimensions": {"width": 90, "height": 90},
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
                "type": "main",
                "order": 1
            }
        ],
        "status": "Available",
        "price": 6000000,
        "createdAt": "2024-01-05",
        "updatedAt": "2024-01-05",
        "viewCount": 120
    },
    {
        "id": "6",
        "title": "Desert Whispers",
        "description": "Minimalist desert landscape at dawn",
        "category": ["Landscape", "Minimalist"],
        "dimensions": {"width": 120, "height": 80},
        "images": [
            {
                "url": "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
                "type": "main",
                "order": 1
            }
        ],
        "status": "Selling",
        "price": 900000,
        "createdAt": "2024-01-06",
        "updatedAt": "2024-01-06",
        "viewCount": 95
    }
]

def ensure_description(desc: str) -> str:
    """
    Đảm bảo mô tả có ít nhất 100 ký tự.
    Nếu ngắn hơn, tự động thêm text bổ sung.
    """
    desc = desc.strip()
    if len(desc) < 100:
        filler = " This artwork is a beautiful piece of art that inspires and captivates the viewer with its depth and emotion."
        while len(desc) < 100:
            desc += filler
    return desc

def transform_artwork(artwork: dict) -> dict:
    """
    Chuyển đổi dữ liệu ban đầu thành payload theo định dạng:
    {
      "title": "Sunset demo",
      "description": "A beautiful sunset over the mountains, with a clear sky and a lake in the foreground. The colors are warm and inviting.",
      "category": ["Nature", "Landscape"],
      "dimensions": { "width": 1920, "height": 1080 },
      "url": "http://example.com/sunset.jpg",
      "status": "available",
      "price": 0
    }
    và đảm bảo tuân thủ các ràng buộc của schema.
    """
    # Title: thêm " demo" nếu chưa có
    title = artwork.get("title", "").strip()
    if "demo" not in title.lower():
        title += " demo"

    # Description: đảm bảo đủ 100 ký tự
    description = ensure_description(artwork.get("description", ""))

    # Category: loại bỏ khoảng trắng thừa và loại bỏ duplicate (không phân biệt chữ hoa thường)
    categories = artwork.get("category", [])
    seen = set()
    cat_list = []
    for cat in categories:
        cat_clean = cat.strip()
        if cat_clean and cat_clean.lower() not in seen:
            seen.add(cat_clean.lower())
            cat_list.append(cat_clean)
    if not cat_list:
        cat_list = ["Uncategorized"]

    # Dimensions: nếu thiếu thì mặc định dùng 1920x1080
    dimensions = artwork.get("dimensions", {})
    width = dimensions.get("width", 1920)
    height = dimensions.get("height", 1080)
    dimensions = {"width": width, "height": height}

    # URL: lấy từ ảnh đầu tiên, nếu không có thì dùng placeholder
    images = artwork.get("images", [])
    url = images[0].get("url", "http://example.com/placeholder.jpg") if images else "http://example.com/placeholder.jpg"

    # Status: chuyển về chữ thường và kiểm tra hợp lệ (available, sold, hidden, selling)
    status = artwork.get("status", "").strip().lower()
    if status not in ["available", "sold", "hidden", "selling"]:
        status = "available"

    # Price: điều chỉnh theo schema (min: 0, max: 1,000,000)
    price = artwork.get("price", 0)
    try:
        price = float(price)
    except (ValueError, TypeError):
        price = 0
    if price < 0:
        price = 0
    if price > 1_000_000:
        price = 1_000_000
    # Nếu status là "selling", price phải lớn hơn 0 (nếu không, đặt minimal là 1)
    if status == "selling" and price <= 0:
        price = 1

    payload = {
        "title": title,
        "description": description,
        "category": cat_list,
        "dimensions": dimensions,
        "url": url,
        "status": status,
        "price": price
    }
    return payload

# URL endpoint backend (điều chỉnh cho phù hợp)
endpoint = "http://localhost:5000/api/artwork"

def seed_artworks():
    for artwork in demo:
        payload = transform_artwork(artwork)
        response = requests.post(endpoint, json=payload)
        if response.status_code in (200, 201):
            print(f"Artwork '{payload['title']}' added successfully!")
        else:
            print(f"Failed to add artwork '{payload['title']}'. Status code: {response.status_code}")
            print("Response:", response.text)

if __name__ == "__main__":
    seed_artworks()
