from typing import List, Optional, Dict
from pydantic import BaseModel, Field


class RecognizedItem(BaseModel):
    name: str
    confidence: float
    category: str
    food_101_class: Optional[str] = None


class PortionInfo(BaseModel):
    grams: float = 100.0
    unit: str = "grams"
    description: str = "Standard 100g portion"


class NutritionMacros(BaseModel):
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    sugar_g: float
    sodium_mg: float


class Micronutrients(BaseModel):
    potassium_mg: Optional[float] = None
    vitamin_c_mg: Optional[float] = None
    calcium_mg: Optional[float] = None
    iron_mg: Optional[float] = None
    cholesterol_mg: Optional[float] = None


class FoodRecognitionResponse(BaseModel):
    id: str
    recognized_items: List[RecognizedItem]
    top_prediction: RecognizedItem
    portion: PortionInfo
    nutrition: NutritionMacros
    micronutrients: Micronutrients
    data_source: str
    disclaimer: str
    image_url: Optional[str] = None


class NutritionQueryRequest(BaseModel):
    item_name: str
    portion_grams: float = Field(default=100.0, gt=0, le=2000)
