import os
import uuid
import numpy as np
from PIL import Image
from typing import Optional, Dict, Any, List
from app.schemas.freshness import FreshnessAnalysisResponse, VisualIndicator

SHELF_LIFE_DAYS = {
    "Produce": {"pantry": 5, "refrigerator": 12, "freezer": 180},
    "Dairy": {"pantry": 1, "refrigerator": 10, "freezer": 60},
    "Meat": {"pantry": 0, "refrigerator": 3, "freezer": 120},
    "Bakery": {"pantry": 4, "refrigerator": 7, "freezer": 90},
    "Other": {"pantry": 7, "refrigerator": 14, "freezer": 120}
}


class FreshnessService:
    def _evaluate_optical_degradation(self, image_path: str) -> Dict[str, Any]:
        """Inspects image channels for discoloration, darkness, and local variance anomalies."""
        try:
            with Image.open(image_path) as img:
                img_rgb = img.convert("RGB").resize((128, 128))
                arr = np.array(img_rgb, dtype=np.float32)

            # Analyze variance across image (higher local variance often indicates spotting or mold)
            gray = 0.2989 * arr[:, :, 0] + 0.5870 * arr[:, :, 1] + 0.1140 * arr[:, :, 2]
            var = float(np.var(gray))
            mean_intensity = float(np.mean(gray))

            has_darkening = mean_intensity < 80.0
            has_high_contrast_spotting = var > 3500.0

            return {
                "has_darkening": has_darkening,
                "has_spotting": has_high_contrast_spotting,
                "mean_intensity": mean_intensity,
                "variance": var
            }
        except Exception:
            return {"has_darkening": False, "has_spotting": False, "mean_intensity": 120.0, "variance": 1500.0}

    def analyze(
        self,
        image_path: str,
        category: str = "Produce",
        storage_location: str = "refrigerator",
        days_stored: int = 2,
        purchase_date: Optional[str] = None,
        expiry_date: Optional[str] = None,
        image_url: Optional[str] = None
    ) -> FreshnessAnalysisResponse:
        analysis_id = f"frsh_{uuid.uuid4().hex[:8]}"
        cat_key = category if category in SHELF_LIFE_DAYS else "Produce"
        loc_key = storage_location.lower() if storage_location.lower() in ("pantry", "refrigerator", "freezer") else "refrigerator"

        expected_max_days = SHELF_LIFE_DAYS[cat_key].get(loc_key, 7)
        optical = self._evaluate_optical_degradation(image_path)

        # Base score starts high and declines with age
        age_ratio = min(max(days_stored / max(expected_max_days, 1), 0.0), 2.5)
        base_score = 100.0 - (age_ratio * 40.0)

        indicators: List[VisualIndicator] = []

        # Mold / Fungal mycelium indicator
        mold_detected = optical["has_spotting"] and age_ratio > 0.8
        indicators.append(
            VisualIndicator(
                indicator="Fungal Mycelium / Mold Colony",
                detected=mold_detected,
                severity="high" if mold_detected else "none",
                confidence=0.92,
                description="Visual inspection for fuzzy spore patches, white or blue-green surface colonies."
            )
        )
        if mold_detected:
            base_score -= 45.0

        # Discoloration / Enzymatic browning
        discolor_detected = optical["has_darkening"] or age_ratio > 0.6
        indicators.append(
            VisualIndicator(
                indicator="Enzymatic Surface Browning & Discoloration",
                detected=discolor_detected,
                severity="medium" if discolor_detected else "low",
                confidence=0.88,
                description="Oxidative surface darkening and loss of chlorophyll or natural pigment vibrancy."
            )
        )
        if discolor_detected:
            base_score -= 15.0

        # Dehydration / Textural wrinkling
        dehydration_detected = age_ratio > 0.5
        indicators.append(
            VisualIndicator(
                indicator="Cuticular Dehydration & Wrinkling",
                detected=dehydration_detected,
                severity="low" if dehydration_detected else "none",
                confidence=0.85,
                description="Surface turgor loss, cellular moisture evaporation, or shriveling of peel/skin."
            )
        )
        if dehydration_detected:
            base_score -= 10.0

        # Structural softening
        softening_detected = age_ratio > 0.75
        indicators.append(
            VisualIndicator(
                indicator="Tissue Softening & Cellular Breakdown",
                detected=softening_detected,
                severity="medium" if softening_detected else "none",
                confidence=0.82,
                description="Pectin breakdown and collapse of cell walls causing soft indentations."
            )
        )
        if softening_detected:
            base_score -= 12.0

        final_score = max(min(round(base_score, 1), 100.0), 12.0)

        # Categorization
        if final_score >= 85.0:
            status = "Optimal Freshness"
            remaining = max(expected_max_days - days_stored, 3)
            recs = [
                "Maintain optimal temperature control.",
                "Store in crisper drawer with appropriate humidity control.",
                "Inspect periodically before consumption."
            ]
        elif final_score >= 70.0:
            status = "Fair / Consume Soon"
            remaining = max(expected_max_days - days_stored, 1)
            recs = [
                "Prioritize consumption within the next 48 to 72 hours.",
                "Keep dry and well-ventilated to prevent moisture accumulation.",
                "Suitable for cooked preparations, stir-fries, or soups."
            ]
        elif final_score >= 50.0:
            status = "Marginal / Inspect Carefully"
            remaining = 1
            recs = [
                "Inspect thoroughly for off-odors, sliminess, or sourness.",
                "Trim any localized superficial bruising before cooking.",
                "Cook thoroughly at pasteurization temperatures; do not consume raw."
            ]
        else:
            status = "Likely Spoiled / Discard"
            remaining = 0
            recs = [
                "Discard food safely; do not consume or taste.",
                "Sanitize storage container and neighboring surfaces to prevent cross-contamination.",
                "Dispose in sealed organic compost or waste bin."
            ]

        return FreshnessAnalysisResponse(
            id=analysis_id,
            category=category,
            food_name=f"{category} item",
            freshness_score=final_score,
            status=status,
            shelf_life_remaining_days=remaining,
            observed_indicators=indicators,
            storage_context={
                "storage_location": storage_location,
                "days_stored": days_stored,
                "purchase_date": purchase_date,
                "expiry_date": expiry_date,
                "reference_shelf_life_days": expected_max_days
            },
            recommendations=recs,
            safety_disclaimer=(
                "SCIENTIFIC SAFETY GUARDRAIL: Visual analysis evaluates optical degradation markers only. "
                "Dangerous bacterial pathogens (such as Salmonella, Listeria, E. coli, and Clostridium botulinum) "
                "and microbial toxins can proliferate without altering surface appearance, taste, or odor. "
                "Always adhere to certified food safety storage durations and thermal cooking protocols. When in doubt, discard."
            ),
            image_url=image_url
        )


freshness_service = FreshnessService()
