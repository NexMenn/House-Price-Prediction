import pandas as pd
from app.schemas.prediction import PredictionRequest

NUMERIC_FEATURES = ["carpet_area_sqft", "floor_num", "Bathroom", "Balcony"]
CATEGORICAL_FEATURES = ["location_grouped", "Furnishing", "Transaction", "Ownership", "facing"]


def request_to_dataframe(payload: PredictionRequest, known_locations: set[str]) -> pd.DataFrame:
    location_grouped = payload.location if payload.location in known_locations else "other"

    row = {
        "carpet_area_sqft": payload.carpet_area_sqft,
        "floor_num": payload.floor_num,
        "Bathroom": payload.bathroom,
        "Balcony": payload.balcony,
        "location_grouped": location_grouped,
        "Furnishing": payload.furnishing,
        "Transaction": payload.transaction,
        "Ownership": payload.ownership,
        "facing": payload.facing,
    }
    return pd.DataFrame([row], columns=NUMERIC_FEATURES + CATEGORICAL_FEATURES)