import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_food_nutrition_lookup():
    response = client.get("/api/v1/food/nutrition?item_name=avocado_toast&portion_grams=150")
    assert response.status_code == 200
    data = response.json()
    assert "nutrition" in data
    assert data["portion"]["grams"] == 150.0
    assert data["nutrition"]["calories"] > 0


def test_food_recognize_text_query():
    response = client.post("/api/v1/food/recognize", data={"query": "Grilled Salmon", "portion_grams": 170})
    assert response.status_code == 200
    data = response.json()
    assert len(data["recognized_items"]) > 0
    assert "Salmon" in data["top_prediction"]["name"]
    assert data["nutrition"]["protein_g"] > 20
    assert "disclaimer" in data


def test_food_recognize_image_upload():
    # Create test image in memory
    img = Image.new("RGB", (100, 100), color=(200, 50, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    response = client.post(
        "/api/v1/food/recognize",
        files={"file": ("test_food.jpg", buf, "image/jpeg")},
        data={"portion_grams": 120}
    )
    assert response.status_code == 200
    data = response.json()
    assert "top_prediction" in data
    assert data["portion"]["grams"] == 120.0
    assert "disclaimer" in data


def test_food_recognize_invalid_empty():
    response = client.post("/api/v1/food/recognize", data={})
    assert response.status_code == 400
