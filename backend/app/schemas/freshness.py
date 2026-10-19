from typing import List, Optional
from pydantic import BaseModel, Field


class VisualIndicator(BaseModel):
    indicator: str
    detected: bool
    severity: str  # none, low, medium, high
    confidence: float
    description: str


class FreshnessAnalysisResponse(BaseModel):
    id: str
    category: str
    food_name: str
    freshness_score: float = Field(..., ge=0.0, le=100.0)
    status: str  # Optimal Freshness, Fair / Consume Soon, Marginal / Inspect Carefully, Likely Spoiled / Discard
    shelf_life_remaining_days: int
    observed_indicators: List[VisualIndicator]
    storage_context: dict
    recommendations: List[str]
    safety_disclaimer: str
    image_url: Optional[str] = None
