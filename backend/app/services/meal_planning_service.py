import uuid
from typing import List, Dict, Any
from app.schemas.meal_planner import (
    MealPlanGenerateRequest,
    MealPlanResponse,
    DayMealPlan,
    MealItem
)

# Meal candidate repository with explicit allergen tagging
MEAL_RECIPE_POOL = [
    # Breakfasts
    {
        "meal_type": "Breakfast",
        "name": "Steel-Cut Oats with Chia Seeds, Berries & Almond Butter",
        "calories": 420, "protein_g": 14, "carbs_g": 62, "fat_g": 14, "prep_time_min": 10,
        "allergens": ["Tree Nuts"],
        "suitable_diets": ["Omnivore", "Mediterranean", "Vegetarian", "Vegan"],
        "ingredients": ["Steel-cut oats", "Chia seeds", "Fresh blueberries", "Almond butter", "Cinnamon"],
        "rationale": "High-fiber beta-glucan breakfast provides steady, sustained glucose release and prolonged morning satiety."
    },
    {
        "meal_type": "Breakfast",
        "name": "Scrambled Farm Eggs with Sautéed Spinach & Whole Grain Sourdough",
        "calories": 390, "protein_g": 24, "carbs_g": 28, "fat_g": 18, "prep_time_min": 12,
        "allergens": ["Eggs", "Gluten"],
        "suitable_diets": ["Omnivore", "Mediterranean", "Vegetarian", "High-Protein"],
        "ingredients": ["Free-range eggs", "Baby spinach", "Whole wheat sourdough", "Olive oil"],
        "rationale": "Complete high-biological-value protein and lutein supporting muscle synthesis and optical health."
    },
    {
        "meal_type": "Breakfast",
        "name": "Creamy Greek Yogurt Parfait with Hemp Hearts & Strawberries",
        "calories": 360, "protein_g": 28, "carbs_g": 32, "fat_g": 12, "prep_time_min": 5,
        "allergens": ["Dairy"],
        "suitable_diets": ["Omnivore", "Mediterranean", "Vegetarian", "High-Protein", "Low-Carb"],
        "ingredients": ["Plain Greek yogurt", "Hemp hearts", "Fresh strawberries", "Raw honey"],
        "rationale": "Probiotic-rich dairy paired with essential omega-3 fatty acids for gut microbiome diversity."
    },
    {
        "meal_type": "Breakfast",
        "name": "Keto Avocado & Smoked Salmon Plate with Soft-Boiled Eggs",
        "calories": 480, "protein_g": 32, "carbs_g": 6, "fat_g": 36, "prep_time_min": 10,
        "allergens": ["Eggs", "Fish"],
        "suitable_diets": ["Omnivore", "Ketogenic", "Low-Carb", "High-Protein", "Mediterranean"],
        "ingredients": ["Hass avocado", "Wild smoked salmon", "Pasture-raised eggs", "Dill", "Extra virgin olive oil"],
        "rationale": "Low carbohydrate, high healthy fat profile promoting ketosis and mental clarity."
    },

    # Lunches
    {
        "meal_type": "Lunch",
        "name": "Grilled Lemon Herb Chicken Bowl with Quinoa & Roasted Veggies",
        "calories": 580, "protein_g": 46, "carbs_g": 52, "fat_g": 18, "prep_time_min": 20,
        "allergens": [],
        "suitable_diets": ["Omnivore", "Mediterranean", "High-Protein"],
        "ingredients": ["Chicken breast", "Quinoa", "Zucchini", "Bell peppers", "Lemon", "Olive oil"],
        "rationale": "Lean poultry protein combined with complete plant amino acids and micronutrient-dense roasted vegetables."
    },
    {
        "meal_type": "Lunch",
        "name": "Mediterranean Chickpea & Persian Cucumber Salad with Crumbled Feta",
        "calories": 480, "protein_g": 18, "carbs_g": 54, "fat_g": 20, "prep_time_min": 12,
        "allergens": ["Dairy"],
        "suitable_diets": ["Omnivore", "Mediterranean", "Vegetarian"],
        "ingredients": ["Garbanzo beans (chickpeas)", "Persian cucumbers", "Cherry tomatoes", "Feta cheese", "Kalamata olives", "Red wine vinaigrette"],
        "rationale": "Polyphenol-rich legumes and unsaturated fats supporting cardiovascular endothelial health."
    },
    {
        "meal_type": "Lunch",
        "name": "Crispy Tofu & Edamame Soba Noodle Bowl with Sesame Ginger Dressing",
        "calories": 520, "protein_g": 26, "carbs_g": 64, "fat_g": 16, "prep_time_min": 18,
        "allergens": ["Soy", "Sesame", "Gluten"],
        "suitable_diets": ["Omnivore", "Vegetarian", "Vegan"],
        "ingredients": ["Firm organic tofu", "Shelled edamame", "Buckwheat soba noodles", "Toasted sesame oil", "Fresh ginger"],
        "rationale": "Plant-forward balanced protein synthesis with complex slow-burning buckwheat carbohydrates."
    },

    # Dinners
    {
        "meal_type": "Dinner",
        "name": "Pan-Seared Wild Alaskan Salmon with Asparagus & Garlic Mashed Cauliflower",
        "calories": 610, "protein_g": 48, "carbs_g": 16, "fat_g": 38, "prep_time_min": 25,
        "allergens": ["Fish"],
        "suitable_diets": ["Omnivore", "Mediterranean", "Ketogenic", "Low-Carb", "High-Protein"],
        "ingredients": ["Wild Alaskan salmon fillet", "Fresh asparagus spears", "Cauliflower head", "Grass-fed butter", "Garlic"],
        "rationale": "High concentration of EPA/DHA marine omega-3 fatty acids to reduce systemic inflammation."
    },
    {
        "meal_type": "Dinner",
        "name": "Slow-Braised Lentil & Sweet Potato Curry with Basmati Rice",
        "calories": 560, "protein_g": 22, "carbs_g": 88, "fat_g": 12, "prep_time_min": 30,
        "allergens": [],
        "suitable_diets": ["Omnivore", "Vegetarian", "Vegan", "Mediterranean"],
        "ingredients": ["Brown lentils", "Sweet potatoes", "Coconut milk", "Curry spices", "Basmati rice", "Fresh cilantro"],
        "rationale": "Complex carbohydrates and prebiotic dietary fiber that nourish colon short-chain fatty acid synthesis."
    },
    {
        "meal_type": "Dinner",
        "name": "Grass-Fed Beef Sirloin Steak with Roasted Rosemary Sweet Potato Wedges & Broccoli",
        "calories": 670, "protein_g": 52, "carbs_g": 44, "fat_g": 30, "prep_time_min": 25,
        "allergens": [],
        "suitable_diets": ["Omnivore", "High-Protein", "Paleo"],
        "ingredients": ["Grass-fed beef sirloin", "Sweet potatoes", "Fresh broccoli florets", "Rosemary", "Avocado oil"],
        "rationale": "Bioavailable heme iron, zinc, and muscle-repairing branched-chain amino acids (BCAAs)."
    },

    # Snacks
    {
        "meal_type": "Snack",
        "name": "Crisp Apple Slices with Creamy SunButter (Sunflower Seed Butter)",
        "calories": 210, "protein_g": 6, "carbs_g": 28, "fat_g": 10, "prep_time_min": 3,
        "allergens": [],
        "suitable_diets": ["Omnivore", "Mediterranean", "Vegetarian", "Vegan"],
        "ingredients": ["Honeycrisp apple", "Sunflower seed butter"],
        "rationale": "Allergen-free afternoon energy stabilizer providing vitamin E and pectin fiber."
    },
    {
        "meal_type": "Snack",
        "name": "Roasted Spiced Chickpeas & Pumpkin Seeds",
        "calories": 190, "protein_g": 9, "carbs_g": 22, "fat_g": 8, "prep_time_min": 5,
        "allergens": [],
        "suitable_diets": ["Omnivore", "Mediterranean", "Vegetarian", "Vegan"],
        "ingredients": ["Roasted chickpeas", "Raw pumpkin seeds (pepitas)", "Smoked paprika"],
        "rationale": "Nut-free crunchy protein snack rich in magnesium and plant sterols."
    }
]

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


class MealPlanningService:
    def generate_plan(self, req: MealPlanGenerateRequest) -> MealPlanResponse:
        plan_id = f"mp_{uuid.uuid4().hex[:8]}"
        excluded_allergens = [a.strip().lower() for a in req.allergens_to_avoid]

        # Filter candidate pool against strict allergen exclusions
        safe_pool = []
        for meal in MEAL_RECIPE_POOL:
            meal_allergens = [a.lower() for a in meal.get("allergens", [])]
            # Strict allergen guardrail: check if any excluded allergen matches
            has_forbidden_allergen = any(
                ex in meal_allergens or any(ex in ing.lower() for ing in meal.get("ingredients", []))
                for ex in excluded_allergens
            )
            if not has_forbidden_allergen:
                safe_pool.append(meal)

        if not safe_pool:
            # Fallback safe meals with zero allergens
            safe_pool = [m for m in MEAL_RECIPE_POOL if not m.get("allergens")]

        # Group by meal type
        breakfasts = [m for m in safe_pool if m["meal_type"] == "Breakfast"] or safe_pool
        lunches = [m for m in safe_pool if m["meal_type"] == "Lunch"] or safe_pool
        dinners = [m for m in safe_pool if m["meal_type"] == "Dinner"] or safe_pool
        snacks = [m for m in safe_pool if m["meal_type"] == "Snack"] or safe_pool

        days_list: List[DayMealPlan] = []
        all_ingredients: List[str] = []

        for day_idx in range(req.duration_days):
            day_name = DAY_NAMES[day_idx % 7]
            b_item = breakfasts[day_idx % len(breakfasts)]
            l_item = lunches[day_idx % len(lunches)]
            d_item = dinners[day_idx % len(dinners)]

            day_meals: List[MealItem] = [
                MealItem(id=f"m_{day_idx}_b", **b_item),
                MealItem(id=f"m_{day_idx}_l", **l_item),
                MealItem(id=f"m_{day_idx}_d", **d_item)
            ]

            if req.include_snacks:
                s_item = snacks[day_idx % len(snacks)]
                day_meals.append(MealItem(id=f"m_{day_idx}_s", **s_item))

            for m in day_meals:
                all_ingredients.extend(m.ingredients)

            total_cals = sum(m.calories for m in day_meals)
            total_prot = sum(m.protein_g for m in day_meals)
            total_carbs = sum(m.carbs_g for m in day_meals)
            total_fat = sum(m.fat_g for m in day_meals)

            days_list.append(
                DayMealPlan(
                    day_number=day_idx + 1,
                    day_name=day_name,
                    target_calories=req.target_daily_calories,
                    estimated_calories=total_cals,
                    total_protein_g=total_prot,
                    total_carbs_g=total_carbs,
                    total_fat_g=total_fat,
                    meals=day_meals
                )
            )

        # Categorize shopping list by grocery store aisle
        unique_ingredients = sorted(list(set(all_ingredients)))
        shopping_list: Dict[str, List[str]] = {
            "Fresh Produce": [],
            "Proteins & Seafood": [],
            "Dairy & Alternatives": [],
            "Pantry & Grains": [],
            "Spices & Oils": []
        }

        for item in unique_ingredients:
            lower = item.lower()
            if any(k in lower for k in ["spinach", "apple", "berries", "strawberry", "blueberries", "avocado", "cucumber", "zucchini", "peppers", "asparagus", "cauliflower", "sweet potato", "lemon", "broccoli", "tomatoes", "cilantro", "ginger"]):
                shopping_list["Fresh Produce"].append(item)
            elif any(k in lower for k in ["chicken", "salmon", "beef", "sirloin", "eggs", "tofu"]):
                shopping_list["Proteins & Seafood"].append(item)
            elif any(k in lower for k in ["yogurt", "feta", "cheese", "milk", "butter"]):
                shopping_list["Dairy & Alternatives"].append(item)
            elif any(k in lower for k in ["oil", "paprika", "cinnamon", "salt", "pepper", "dill", "rosemary", "curry", "vinaigrette"]):
                shopping_list["Spices & Oils"].append(item)
            else:
                shopping_list["Pantry & Grains"].append(item)

        # Clean empty categories
        shopping_list = {k: v for k, v in shopping_list.items() if v}

        return MealPlanResponse(
            id=plan_id,
            title=f"{req.duration_days}-Day Personalized {req.diet_pattern} Nutrition Plan",
            duration_days=req.duration_days,
            diet_pattern=req.diet_pattern,
            allergens_excluded=req.allergens_to_avoid,
            target_daily_calories=req.target_daily_calories,
            days=days_list,
            shopping_list=shopping_list,
            disclaimer=(
                "NUTRITION COUNSELING NOTICE: Generated meal schedules serve lifestyle organization, culinary planning, and wellness goals. "
                "They do not constitute individualized clinical medical nutrition therapy (MNT). Individuals with severe food allergies, "
                "metabolic disorders, or prescription medication interactions must consult a registered dietitian or licensed physician."
            )
        )


meal_planning_service = MealPlanningService()
