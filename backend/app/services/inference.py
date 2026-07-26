import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from app.core.config import get_settings


class ModelService:
    def __init__(self, model_path: str, locations_path: str):
        self.model_path = Path(model_path)
        self.locations_path = Path(locations_path)
        self.pipeline = None
        self.known_locations: set[str] = set()

    def load(self) -> None:
        self.pipeline = joblib.load(self.model_path)
        if self.locations_path.exists():
            self.known_locations = set(json.loads(self.locations_path.read_text()))

    def predict(self, X: pd.DataFrame) -> float:
        if self.pipeline is None:
            raise RuntimeError("Model not loaded yet")
        log_pred = self.pipeline.predict(X)
        price = np.expm1(log_pred)[0]
        return float(price)


settings = get_settings()

model_service = ModelService(
    model_path=settings.model_path,
    locations_path=settings.locations_path,
)