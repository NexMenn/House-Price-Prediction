from pydantic import BaseModel, Field

class PredictionRequest(BaseModel):
    location: str = Field(..., min_length=1, description="Locality, e.g. 'Andheri West, Mumbai'")
    carpet_area_sqft: float = Field(..., gt=0, description="Carpet area in square feet")
    floor_num: int = Field(..., ge = -1, description="Floor number (0 = ground, -1 = basement)")
    bathroom: int = Field(..., ge=0, description="Number of bathrooms")
    balcony: int = Field(..., ge=0, description="Number of balconies")
    furnishing: str = Field(..., min_length=1, description="'Furnished' | 'Semi-Furnished' | 'Unfurnished'")
    transaction: str = Field(..., min_length=1, description="'New Property' | 'Resale'")
    ownership: str = Field(..., min_length=1, description="e.g. 'Freehold', 'Leasehold'")
    facing: str = Field(..., min_length=1, description="e.g. 'East', 'North-West'")

    model_config = {
        "json_schema_extra": {
            "example": {
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
        }
    }

class PredictionResponse(BaseModel):
    predicted_price: float

class HealthResponse(BaseModel):
    status: str