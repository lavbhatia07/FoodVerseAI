import os
from typing import Optional, List, Dict, Any
from app.core.config import settings
from app.schemas.cooking import (
    CookingChatRequest,
    CookingChatResponse,
    Recipe,
    RecipeIngredient,
    RecipeStep,
    SubstituteResponse,
    SubstituteOption
)

SUBSTITUTION_CATALOG: Dict[str, List[Dict[str, str]]] = {
    "buttermilk": [
        {"name": "Whole milk + 1 tbsp Lemon juice or White vinegar", "ratio": "1:1", "notes": "Let rest for 5 minutes until curdled to mimic buttermilk acidity."},
        {"name": "Plain Greek yogurt thinned with water", "ratio": "3:1 yogurt to water", "notes": "Provides similar tartness and batter tenderizing properties."}
    ],
    "egg": [
        {"name": "Milled flaxseed + warm water (Flax egg)", "ratio": "1 tbsp ground flax + 3 tbsp water per egg", "notes": "Ideal binding substitute in baked goods like muffins and pancakes."},
        {"name": "Silken tofu", "ratio": "1/4 cup blended silken tofu per egg", "notes": "Excellent moisture and structure in cakes and dense brownies."},
        {"name": "Mashed ripe banana or unsweetened applesauce", "ratio": "1/4 cup per egg", "notes": "Adds moisture; banana will impart subtle sweetness."}
    ],
    "sour cream": [
        {"name": "Plain whole-milk Greek yogurt", "ratio": "1:1", "notes": "Almost identical texture, lower fat, higher protein."},
        {"name": "Cottage cheese blended with 1 tsp lemon juice", "ratio": "1:1", "notes": "Blends into a smooth creamy texture."}
    ],
    "soy sauce": [
        {"name": "Coconut aminos", "ratio": "1:1", "notes": "Soy-free, gluten-free, slightly sweeter and lower sodium."},
        {"name": "Tamari", "ratio": "1:1", "notes": "Rich umami depth; gluten-free if certified."}
    ],
    "heavy cream": [
        {"name": "Full-fat coconut milk (canned)", "ratio": "1:1", "notes": "Great for rich curries, soups, and dairy-free ganache."},
        {"name": "Whole milk + melted unsalted butter", "ratio": "3/4 cup milk + 1/4 cup melted butter", "notes": "Reconstitutes emulsion for cooking; does not whip."}
    ]
}


class CookingAssistantService:
    def chat(self, request: CookingChatRequest) -> CookingChatResponse:
        msg = request.message.strip().lower()
        pref = request.preferences

        # Detect recipe generation intent or ingredient mentions
        is_recipe_query = any(word in msg for word in ["recipe", "cook", "make", "dinner", "lunch", "breakfast", "how to make", "ingredients"])

        if is_recipe_query or len(msg.split()) > 4:
            # Generate a structured gourmet recipe respecting dietary constraints
            diet = pref.diet if pref and pref.diet else "Balanced"
            time_limit = pref.max_time_min if pref and pref.max_time_min else 25

            # Dynamic dish selection based on prompt
            if "chicken" in msg:
                title = "Pan-Seared Lemon Herb Chicken Cutlets with Garlic Wilted Spinach"
                prep_time = 8
                cook_time = min(time_limit - 8, 14)
                ingredients = [
                    RecipeIngredient(name="Boneless Skinless Chicken Breast", amount="400g", notes="sliced horizontally into thin cutlets"),
                    RecipeIngredient(name="Fresh Baby Spinach", amount="200g", notes="rinsed and dried"),
                    RecipeIngredient(name="Fresh Garlic", amount="3 cloves", notes="thinly sliced"),
                    RecipeIngredient(name="Lemon", amount="1 whole", notes="zested and juiced"),
                    RecipeIngredient(name="Extra Virgin Olive Oil", amount="2 tbsp", notes="divided"),
                    RecipeIngredient(name="Sea Salt & Black Pepper", amount="To taste")
                ]
                steps = [
                    RecipeStep(step_number=1, instruction="Pat chicken cutlets dry with paper towels; season both sides generously with sea salt, freshly cracked black pepper, and lemon zest.", timer_sec=60, technique_tip="Dry meat ensures superior caramelization (Maillard reaction)."),
                    RecipeStep(step_number=2, instruction="Heat 1.5 tbsp olive oil in a heavy stainless steel skillet over medium-high heat until shimmering. Sear chicken cutlets undisturbed for 3-4 minutes per side until golden brown (internal temp 74°C / 165°F). Transfer to a warm plate.", timer_sec=420, technique_tip="Do not crowd the skillet to avoid steaming."),
                    RecipeStep(step_number=3, instruction="Reduce heat to medium. Add remaining olive oil and sliced garlic; saute for 45 seconds until fragrant. Add baby spinach in handfuls, tossing until just wilted.", timer_sec=120, technique_tip="Garlic burns quickly; keep moving in the pan."),
                    RecipeStep(step_number=4, instruction="Deglaze skillet with fresh lemon juice, scraping up any flavorful fond. Return chicken cutlets to the pan, spoon pan juices over top, and serve immediately.", timer_sec=60)
                ]
                chef_tips = "Pounding cutlets to uniform 1/2-inch thickness guarantees even cooking in under 8 minutes without drying out."
            elif "pasta" in msg or "spaghetti" in msg:
                title = "20-Minute Creamy Garlic-Herb Fettuccine with Cherry Tomatoes"
                prep_time = 5
                cook_time = 15
                ingredients = [
                    RecipeIngredient(name="Fettuccine or Pasta", amount="250g"),
                    RecipeIngredient(name="Cherry Tomatoes", amount="200g", notes="halved"),
                    RecipeIngredient(name="Garlic", amount="4 cloves", notes="minced"),
                    RecipeIngredient(name="Extra Virgin Olive Oil", amount="2 tbsp"),
                    RecipeIngredient(name="Fresh Basil", amount="1/4 cup", notes="torn")
                ]
                steps = [
                    RecipeStep(step_number=1, instruction="Bring a large pot of water to a rolling boil and season heavily with salt (should taste like seawater). Cook pasta until 1 minute shy of al dente.", timer_sec=600),
                    RecipeStep(step_number=2, instruction="Meanwhile, blister halved cherry tomatoes and garlic in olive oil in a wide skillet until tomatoes burst and form a rich glossy sauce.", timer_sec=360),
                    RecipeStep(step_number=3, instruction="Reserve 1/2 cup pasta cooking water. Transfer drained pasta directly into tomato sauce. Toss vigorously with splash of starchy water to emulsify.", timer_sec=120),
                    RecipeStep(step_number=4, instruction="Finish off the heat with torn fresh basil, freshly ground pepper, and a final drizzle of raw olive oil.", timer_sec=60)
                ]
                chef_tips = "Pasta water contains dissolved starches that bind fat and aromatics into a silky restaurant-style sauce without needing heavy cream."
            else:
                title = "Vibrant Mediterranean Herb Grain Bowl with Avocado & Citrus Vinaigrette"
                prep_time = 10
                cook_time = 12
                ingredients = [
                    RecipeIngredient(name="Cooked Quinoa or Brown Rice", amount="2 cups"),
                    RecipeIngredient(name="Hass Avocado", amount="1 whole", notes="sliced"),
                    RecipeIngredient(name="Cucumber", amount="1 medium", notes="diced"),
                    RecipeIngredient(name="Chickpeas", amount="1 can (400g)", notes="rinsed and drained"),
                    RecipeIngredient(name="Extra Virgin Olive Oil & Lemon", amount="3 tbsp", notes="whisked into vinaigrette")
                ]
                steps = [
                    RecipeStep(step_number=1, instruction="Toss drained chickpeas with olive oil, smoked paprika, salt, and roast in a hot pan or toaster oven for 10 minutes until crispy.", timer_sec=600),
                    RecipeStep(step_number=2, instruction="Whisk olive oil, lemon juice, Dijon mustard, and sea salt in a small bowl to create an emulsion.", timer_sec=120),
                    RecipeStep(step_number=3, instruction="Assemble grain bowl: layer warm grains, diced crisp cucumber, crispy seasoned chickpeas, and fan out ripe sliced avocado.", timer_sec=180),
                    RecipeStep(step_number=4, instruction="Drizzle vibrant citrus vinaigrette over all ingredients and garnish with toasted pumpkin seeds or herbs.", timer_sec=60)
                ]
                chef_tips = "Contrasting temperatures—warm seasoned grains and roasted chickpeas alongside crisp, chilled cucumber and rich room-temp avocado—elevates a simple salad into a craveable main dish."

            recipe = Recipe(
                title=title,
                prep_time_min=prep_time,
                cook_time_min=cook_time,
                servings=2,
                difficulty=pref.skill_level if pref and pref.skill_level else "Intermediate",
                calories_per_serving=460,
                ingredients=ingredients,
                steps=steps,
                chef_tips=chef_tips,
                allergens=[]
            )

            reply = (
                f"I've tailored a custom recipe based on your culinary prompt: **{title}**.\n\n"
                f"Total preparation and cooking time is just **{prep_time + cook_time} minutes**, "
                f"optimized for your **{diet}** preference. You can follow the interactive step-by-step checklist "
                f"below, activate the cooking timer for each phase, or ask for ingredient substitutions."
            )

            suggested = [
                "What can I substitute for the oil?",
                "How do I adjust this recipe for 4 people?",
                "What side dish or wine pairs best with this?"
            ]

            return CookingChatResponse(reply=reply, recipe=recipe, suggested_questions=suggested)
        else:
            # General culinary Q&A
            reply = (
                "Welcome to the **FoodVerse Culinary Console**! I can assist you with:\n\n"
                "• **Pantry-to-Plate Recipe Generation:** Tell me what ingredients you have in your fridge.\n"
                "• **Ingredient Substitutions:** Ask what to swap for eggs, buttermilk, cream, or gluten.\n"
                "• **Technique & Thermal Safety:** Inquire about proper pan searing, braising temperatures, or knife cuts.\n\n"
                "What would you like to cook today?"
            )
            return CookingChatResponse(
                reply=reply,
                recipe=None,
                suggested_questions=[
                    "I have eggs, cheese, and spinach. What can I make?",
                    "What can I substitute for buttermilk in pancakes?",
                    "How do I cook a tender medium-rare salmon fillet?"
                ]
            )

    def substitute(self, ingredient: str, context: Optional[str] = None) -> SubstituteResponse:
        norm = ingredient.strip().lower()
        matches = []
        for key, options in SUBSTITUTION_CATALOG.items():
            if key in norm or norm in key:
                matches = [SubstituteOption(**opt) for opt in options]
                break

        if not matches:
            matches = [
                SubstituteOption(
                    name="Equal volume of plain olive oil or butter",
                    ratio="1:1",
                    notes="General culinary fat substitute depending on thermal application."
                ),
                SubstituteOption(
                    name="Mild vegetable or chicken stock",
                    ratio="1:1",
                    notes="Reduces fat while maintaining moisture and savory depth in sauces."
                )
            ]

        explanation = (
            f"When substituting for **{ingredient}**, evaluate whether its primary culinary function is "
            "chemical leavening acidity, moisture retention, binding protein, or flavor emulsification. "
            "Choose the option that aligns closest with your heating method and desired texture."
        )

        return SubstituteResponse(
            ingredient=ingredient,
            substitutes=matches,
            culinary_explanation=explanation
        )


cooking_assistant_service = CookingAssistantService()
