import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_hygiene_analysis_image():
    img = Image.new("RGB", (150, 150), color=(180, 180, 180))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    response = client.post(
        "/api/v1/hygiene/analyze",
        files={"file": ("kitchen.jpg", buf, "image/jpeg")},
        data={"environment_type": "commercial_kitchen"}
    )
    assert response.status_code == 200
    data = response.json()
    assert 0 <= data["overall_score"] <= 100
    assert "Grade" in data["inspection_tier"]
    assert len(data["observations"]) > 0
    assert "disclaimer" in data
