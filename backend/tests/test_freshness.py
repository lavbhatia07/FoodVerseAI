import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_freshness_analysis():
    img = Image.new("RGB", (100, 100), color=(50, 180, 50))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    response = client.post(
        "/api/v1/freshness/analyze",
        files={"file": ("spinach.jpg", buf, "image/jpeg")},
        data={
            "category": "Produce",
            "storage_location": "refrigerator",
            "days_stored": 2
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert 0.0 <= data["freshness_score"] <= 100.0
    assert len(data["observed_indicators"]) > 0
    assert "safety_disclaimer" in data
    assert "SCIENTIFIC SAFETY GUARDRAIL" in data["safety_disclaimer"]


def test_freshness_rejects_missing_file():
    response = client.post("/api/v1/freshness/analyze", data={"category": "Produce"})
    assert response.status_code == 422  # Validation error
