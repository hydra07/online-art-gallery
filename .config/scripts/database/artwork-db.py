import requests
import json
import random
import string
import time
import os
from urllib.parse import quote_plus
import argparse
from faker import Faker

# Khởi tạo Faker để tạo dữ liệu ngẫu nhiên
fake = Faker()

# Danh sách các danh mục có thể có
CATEGORIES = [
    "Nature", "Landscape", "Portrait", "Architecture", "Street Photography",
    "Travel", "Food", "Animals", "Wildlife", "Fashion", "Art", "Abstract",
    "Black and White", "Macro", "Night", "Urban", "Documentary", "Sports",
    "Underwater", "Aerial", "Vintage", "Minimalist", "Conceptual", "Still Life",
    "Cityscape", "Industrial", "Surreal", "Fine Art", "Photojournalism", "Wedding"
]

# Các trạng thái hợp lệ theo schema
STATUSES = ["available", "sold", "hidden", "selling"]

def generate_random_description(category_list):
    """Tạo mô tả ngẫu nhiên dựa trên danh mục, đảm bảo dài ít nhất 100 ký tự."""
    base_desc = fake.paragraph(nb_sentences=3)
    theme_desc = f"This artwork showcases the beauty of {', '.join(category_list)}. "
    technique_desc = f"The {random.choice(['composition', 'lighting', 'perspective', 'color palette', 'texture'])} creates a {random.choice(['dramatic', 'peaceful', 'vibrant', 'moody', 'surreal', 'minimalist'])} atmosphere. "
    details_desc = fake.paragraph(nb_sentences=2)

    full_desc = theme_desc + technique_desc + base_desc + " " + details_desc

    # Đảm bảo đủ 100 ký tự
    while len(full_desc) < 100:
        full_desc += " " + fake.sentence()

    # Đảm bảo không vượt quá 5000 ký tự
    if len(full_desc) > 5000:
        full_desc = full_desc[:4990] + "..."

    return full_desc

def generate_random_title():
    """Tạo tiêu đề ngẫu nhiên."""
    patterns = [
        lambda: f"The {fake.word()} of {fake.word()}",
        lambda: f"{fake.word().capitalize()} {fake.word()}",
        lambda: f"{random.choice(['Dreaming of', 'Lost in', 'Beyond', 'Echoes of', 'Whispers of'])} {fake.word().capitalize()}",
        lambda: f"{random.choice(['Morning', 'Evening', 'Summer', 'Winter', 'Spring', 'Autumn'])} {fake.word()}",
        lambda: f"{fake.word().capitalize()} {random.choice(['Light', 'Shadow', 'Dreams', 'Memories', 'Reflections'])}"
    ]

    title = random.choice(patterns)()
    # Đảm bảo độ dài phù hợp
    if len(title) > 255:
        title = title[:255]
    return title

def generate_random_dimensions():
    """Tạo kích thước ngẫu nhiên trong giới hạn hợp lệ."""
    width = random.randint(800, 4000)
    height = random.randint(600, 3000)

    # Đảm bảo tỷ lệ hợp lý
    if random.choice([True, False]):
        # Landscape
        if width < height:
            width, height = height, width
    else:
        # Portrait
        if width > height:
            width, height = height, width

    return {"width": width, "height": height}

def generate_random_price(status):
    """Tạo giá ngẫu nhiên phù hợp với trạng thái."""
    if status == "selling":
        return round(random.uniform(10, 500), 2)
    else:
        if random.random() < 0.8:  # 80% chance for free
            return 0
        else:
            return round(random.uniform(0.1, 1000), 2)

def get_random_categories():
    """Lấy danh sách danh mục ngẫu nhiên không trùng lặp."""
    num_categories = random.randint(1, 5)
    return random.sample(CATEGORIES, num_categories)

def fetch_image_from_unsplash(query, width, height):
    """Tải ảnh từ Unsplash theo kích thước và truy vấn cụ thể."""
    try:
        # Sử dụng trực tiếp dịch vụ random của Unsplash
        image_url = f"https://source.unsplash.com/random/{width}x{height}"

        # Không thêm query vào URL vì có thể gây lỗi với một số ký tự đặc biệt
        # Nếu muốn thêm query vào, hãy đảm bảo nó được mã hóa đúng:
        # image_url = f"https://source.unsplash.com/random/{width}x{height}/?{quote_plus(query)}"

        response = requests.get(image_url, allow_redirects=True, timeout=10)

        if response.status_code == 200:
            return response.url

        # Thử phương pháp khác nếu cách trên không hoạt động
        fallback_url = f"https://picsum.photos/{width}/{height}"
        fallback_response = requests.get(fallback_url, allow_redirects=True, timeout=10)

        if fallback_response.status_code == 200:
            return fallback_response.url

        return None
    except Exception as e:
        print(f"Error fetching image: {e}")
        # Sử dụng Lorem Picsum làm phương án dự phòng
        try:
            fallback_url = f"https://picsum.photos/{width}/{height}"
            response = requests.get(fallback_url, allow_redirects=True, timeout=10)
            if response.status_code == 200:
                return response.url
        except Exception as fallback_error:
            print(f"Error with fallback image source: {fallback_error}")

        return None

def generate_artwork_data():
    """Tạo dữ liệu nghệ thuật ngẫu nhiên theo schema."""
    # Tạo danh mục ngẫu nhiên
    categories = get_random_categories()

    # Tạo trạng thái ngẫu nhiên
    status = random.choice(STATUSES)

    # Tạo kích thước ngẫu nhiên
    dimensions = generate_random_dimensions()

    # Tạo dữ liệu
    artwork = {
        "title": generate_random_title(),
        "description": generate_random_description(categories),
        "category": categories,
        "dimensions": dimensions,
        "status": status,
        "price": generate_random_price(status)
    }

    return artwork

def save_to_file(data, filename):
    """Lưu dữ liệu vào file JSON."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved {len(data)} items to {filename}")

def send_to_api(artwork, api_url, jwt_token=None):
    """Send data to API."""
    try:
        headers = {'Content-Type': 'application/json'}
        if jwt_token:
            headers['Authorization'] = f'Bearer {jwt_token}'

        response = requests.post(api_url, json=artwork, headers=headers)

        if response.status_code == 200 or response.status_code == 201:
            print(f"Successfully sent artwork: {artwork['title']}")
            return True
        else:
            print(f"Failed to send artwork. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"Error sending to API: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Generate random artwork data with images from Unsplash')
    parser.add_argument('--count', type=int, default=10, help='Number of artworks to generate')
    parser.add_argument('--output', type=str, default='artworks.json', help='Output JSON file')
    parser.add_argument('--api', type=str, default='http://localhost:5000/api/artwork', help='API endpoint to send data')
    parser.add_argument('--send', action='store_true', help='Send data to API endpoint')
    parser.add_argument('--retry', type=int, default=3, help='Number of retries for image fetching')
    parser.add_argument('--jwt', type=str, default=None, help='JWT token for API authentication')
    args = parser.parse_args()

    successful_artworks = []
    failed_count = 0

    for i in range(args.count):
        print(f"Generating artwork {i+1}/{args.count}...")

        # Tạo dữ liệu nghệ thuật
        artwork = generate_artwork_data()

        # Tạo truy vấn từ tiêu đề và danh mục
        query = f"{artwork['title']} {' '.join(artwork['category'])}"

        # Thử lấy ảnh với số lần thử lại
        image_url = None
        for attempt in range(args.retry):
            if attempt > 0:
                print(f"Retry attempt {attempt}/{args.retry}...")
#                 time.sleep(2)  # Chờ lâu hơn giữa các lần thử lại

            image_url = fetch_image_from_unsplash(
                query,
                artwork['dimensions']['width'],
                artwork['dimensions']['height']
            )

            if image_url:
                break

        if image_url:
            artwork['url'] = image_url
            print(f"Got image: {image_url}")

            # Kiểm tra xem có gửi đến API không
            if args.send:
                success = send_to_api(artwork, args.api, args.jwt)
                if success:
                    successful_artworks.append(artwork)
                else:
                    failed_count += 1
            else:
                successful_artworks.append(artwork)
        else:
            print("Failed to get image after all retries, skipping this artwork")
            failed_count += 1

        # Tạm dừng để tránh quá nhiều request
#         time.sleep(1)

    # Lưu kết quả vào file
    if successful_artworks:
        save_to_file(successful_artworks, args.output)
    else:
        print("No successful artworks to save.")

    print(f"\nSummary:")
    print(f"- Successfully generated: {len(successful_artworks)}")
    print(f"- Failed: {failed_count}")

    if args.send:
        print(f"- Sent to API: {len(successful_artworks)}")

if __name__ == "__main__":
    main()