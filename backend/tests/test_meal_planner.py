from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_meal_plan_generation_with_allergen_exclusion():
    response = client.post(
        "/api/v1/meals/generate",
        json={
            "duration_days": 7,
            "diet_pattern": "Mediterranean",
            "allergens_to_avoid": ["Dairy", "Fish"],
            "target_daily_calories": 2100,
            "meals_per_day": 3,
            "include_snacks": True
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["days"]) == 7
    assert len(data["shopping_list"]) > 0

    # Verify strict allergen exclusion: No Dairy or Fish in meals
    for day in data["days"]:
        for meal in day["meals"]:
            for ing in meal["ingredients"]:
                assert "yogurt" not in ing.lower()
                assert "salmon" not in ing.lower()
                assert "feta" not in ing.lower()


def test_meal_plan_retrieval_and_deletion():
    # Generate a 1-day plan
    gen_res = client.post(
        "/api/v1/meals/generate",
        json={
            "duration_days": 1,
            "diet_pattern": "Vegan",
            "allergens_to_avoid": ["Eggs", "Dairy"],
            "target_daily_calories": 1800
        }
    )
    plan_id = gen_res.json()["id"]

    # Retrieve
    get_res = client.get(f"/api/v1/meals/{plan_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == plan_id

    # Delete
    del_res = client.delete(f"/api/v1/meals/{plan_id}")
    assert del_res.status_code == 200
    assert del_res.json()["status"] == "deleted"
