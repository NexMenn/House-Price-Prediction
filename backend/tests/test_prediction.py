from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app

def test_health():
    with patch("app.services.inference.model_service.predict", return_value=2.5):
        client = TestClient(app)
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


def test_predict_happy_path():
    payload = {
        "location": "Andheri West, Mumbai",
        "carpet_area_sqft": 950,
        "floor_num": 6,
        "bathroom": 2,
        "balcony": 1,
        "furnishing": "Semi-Furnished",
        "transaction": "Resale",
        "ownership": "Freehold",
        "facing": "East",
    }

    with patch("app.services.inference.model_service.predict", return_value=2.5):
        client = TestClient(app)
        response = client.post("/predict", json=payload)
        assert response.status_code == 200
        assert "predicted_price" in response.json()


def test_predict_invalid_input():
    payload = {
        "location": "Andheri West, Mumbai",
        "carpet_area_sqft": "not-a-number",
    }

    with patch("app.services.inference.model_service.predict", return_value=2.5):
        client = TestClient(app)
        response = client.post("/predict", json=payload)
        assert response.status_code == 422