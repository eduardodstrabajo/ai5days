import { FoodItem } from '../types';

export const STATIC_FOODS_DATABASE: FoodItem[] = [
  // ==========================================
  // HIGH PURINE - AVOID (15 Items)
  // ==========================================
  {
    name: "Beer",
    p_rating: "High",
    mgPer100g: "150-300mg",
    category: "Beverages",
    why: "Beer is doubly dangerous. It is high in yeast purines and alcohol, which slows down the kidneys from excreting uric acid, leading to rapid accumulation. (Healthline Medically Reviewed)"
  },
  {
    name: "Beef Liver",
    p_rating: "High",
    mgPer100g: "440-550mg",
    category: "Meats",
    why: "Organ meats are the absolute highest sources of purines. Unfit for gout diets; can easily trigger acute joint strikes. (Mayo Clinic)"
  },
  {
    name: "Sardines",
    p_rating: "High",
    mgPer100g: "350-480mg",
    category: "Seafood",
    why: "Very concentrated animal purines. Small oily fish should be avoided during gout treatment and flares. (PubMed)"
  },
  {
    name: "Shrimp",
    p_rating: "High",
    mgPer100g: "150-200mg",
    category: "Seafood",
    why: "Shellfish contains high amounts of purines that digest into uric acid. Avoid during active flare-ups. (Healthline Medically Reviewed)"
  },
  {
    name: "High Fructose Corn Syrup Soda",
    p_rating: "High",
    mgPer100g: "N/A",
    category: "Beverages",
    why: "Fructose triggers cellular ATP breakdown into uric acid within minutes. Carbonated sugary sodas are key contributors to uric acid spikes. (PubMed, 2024)"
  },
  {
    name: "Sweetbreads (Pancreas/Thymus)",
    p_rating: "High",
    mgPer100g: "600mg+",
    category: "Meats",
    why: "Extreme concentrations of organic purines. Highly inflammatory for joints. (Mayo Clinic)"
  },
  {
    name: "Mussels & Scallops",
    p_rating: "High",
    mgPer100g: "110-180mg",
    category: "Seafood",
    why: "Seafood shellfish contains dense purine loads. Restrict strictly to lower systemic risks. (Cleveland Clinic)"
  },
  {
    name: "Anchovies",
    p_rating: "High",
    mgPer100g: "410-465mg",
    category: "Seafood",
    why: "Small fish like anchovies carry exceptionally high purine concentrations. Highly correlated with joint pain flares. (PubMed)"
  },
  {
    name: "Trout",
    p_rating: "High",
    mgPer100g: "297mg",
    category: "Seafood",
    why: "Contains high levels of animal-derived purines. While rich in omega-3, it should be minimized or avoided, especially during active phases. (Mayo Clinic)"
  },
  {
    name: "Bacon",
    p_rating: "High",
    mgPer100g: "150-200mg",
    category: "Meats",
    why: "Processed pork meats contain dense purine concentrations and saturated fats that exacerbate joint inflammation. (Cleveland Clinic)"
  },
  {
    name: "Turkey",
    p_rating: "High",
    mgPer100g: "150-220mg",
    category: "Meats",
    why: "Higher in purines than chicken or pork, turkey can elevate serum uric acid if eaten in large amounts. (Healthline)"
  },
  {
    name: "Yeast Supplements (Brewer's/Nutritional)",
    p_rating: "High",
    mgPer100g: "500-1500mg",
    category: "Other",
    why: "Yeast extracts are incredibly dense in RNA and DNA purines, causing rapid conversion to uric acid. Avoid yeast supplements. (PubMed)"
  },
  {
    name: "Venison (Game Meat)",
    p_rating: "High",
    mgPer100g: "138-160mg",
    category: "Meats",
    why: "Wild game meats have higher purine content than standard domestic meats, placing a heavy load on kidney excretion. (Mayo Clinic)"
  },
  {
    name: "Herring",
    p_rating: "High",
    mgPer100g: "210-380mg",
    category: "Seafood",
    why: "Oily fish species like herring contain very high purine amounts. Best substituted with lower purine options. (Cleveland Clinic)"
  },
  {
    name: "Meat Gravy & Concentrated Broths",
    p_rating: "High",
    mgPer100g: "100-300mg",
    category: "Meats",
    why: "Simmering meat concentrates soluble purines directly into the liquid. Gravy and bone broths should be strictly avoided. (Mayo Clinic)"
  },

  // ==========================================
  // MODERATE PURINE - MODERATE (15 Items)
  // ==========================================
  {
    name: "Salmon",
    p_rating: "Moderate",
    mgPer100g: "110-130mg",
    category: "Seafood",
    why: "While containing moderate purines, it provides excellent anti-inflammatory Omega-3 fatty acids. Eat in small, disciplined portions (under 100g). (PubMed)"
  },
  {
    name: "Beef Roast or Steak",
    p_rating: "Moderate",
    mgPer100g: "110-120mg",
    category: "Meats",
    why: "Red meat has moderate to high purines. Limit portion frequency. Accompany with generous water intake. (Mayo Clinic)"
  },
  {
    name: "Chicken Breast",
    p_rating: "Moderate",
    mgPer100g: "110-115mg",
    category: "Meats",
    why: "A safer alternative to red meat or organ meats, chicken still contains moderate levels of purines. Restrict portion sizes. (Healthline)"
  },
  {
    name: "Spinach",
    p_rating: "Moderate",
    mgPer100g: "50-70mg",
    category: "Vegetables",
    why: "High botanical purines, but clinical studies confirm vegetable-derived purines DO NOT increase the risk of gout or trigger flare-ups. Safe to consume. (PubMed, 2024)"
  },
  {
    name: "Oatmeal",
    p_rating: "Moderate",
    mgPer100g: "90-100mg",
    category: "Grains",
    why: "Contains moderate purines and rich dietary fiber. Excellent for cardiovascular health, safe in balanced portions. (Cleveland Clinic)"
  },
  {
    name: "Lentils",
    p_rating: "Moderate",
    mgPer100g: "110-120mg",
    category: "Grains",
    why: "Rich in plant protein and moderate purines. Safe substitute for heavy meats, and does not exhibit gout flare correlations. (PubMed)"
  },
  {
    name: "Pork Chop",
    p_rating: "Moderate",
    mgPer100g: "100-115mg",
    category: "Meats",
    why: "White pork meat contains moderate purines. Limit intake, especially the fatty cuts. (Healthline)"
  },
  {
    name: "Cauliflower",
    p_rating: "Moderate",
    mgPer100g: "51mg",
    category: "Vegetables",
    why: "Although it contains moderate plant-based purines, epidemiological evidence shows no link to gout flares. Safe to consume. (Cleveland Clinic)"
  },
  {
    name: "Mushrooms",
    p_rating: "Moderate",
    mgPer100g: "50-90mg",
    category: "Vegetables",
    why: "Contains moderate botanical purines. Rich in beta-glucans which support immune health and do not raise uric levels. (PubMed)"
  },
  {
    name: "Green Peas",
    p_rating: "Moderate",
    mgPer100g: "50-80mg",
    category: "Vegetables",
    why: "Contains moderate plant purines. Clinical guidelines consider it a healthy addition as plant purines do not stimulate hyperuricemia. (Mayo Clinic)"
  },
  {
    name: "Tuna",
    p_rating: "Moderate",
    mgPer100g: "120-150mg",
    category: "Seafood",
    why: "Canned or fresh tuna has moderate to high purines. Portions must be controlled (<100g per serving) to avoid triggering joints. (Healthline)"
  },
  {
    name: "Tofu / Soybeans",
    p_rating: "Moderate",
    mgPer100g: "80-100mg",
    category: "Other",
    why: "Soy contains moderate purines but clinical trials suggest it has a neutral to slightly protective effect against uric acid buildup. (PubMed)"
  },
  {
    name: "Asparagus",
    p_rating: "Moderate",
    mgPer100g: "55mg",
    category: "Vegetables",
    why: "Contains moderate levels of plant purines. Safe to eat as part of a balanced diet since veggie purines do not elevate risk. (Mayo Clinic)"
  },
  {
    name: "Cod",
    p_rating: "Moderate",
    mgPer100g: "109mg",
    category: "Seafood",
    why: "White fish like cod have moderate purines. Portions should be restricted but it serves as a lean source of protein. (Cleveland Clinic)"
  },
  {
    name: "Kidney Beans",
    p_rating: "Moderate",
    mgPer100g: "80-110mg",
    category: "Grains",
    why: "Contains moderate plant purines but also rich fiber which slows digestion and helps regulate glucose and metabolic parameters. (PubMed)"
  },

  // ==========================================
  // LOW PURINE - SAFE (20 Items)
  // ==========================================
  {
    name: "Tart Cherries",
    p_rating: "Safe",
    mgPer100g: "Under 5mg",
    category: "Fruits",
    why: "Superfood for gout! Cherries contain anthocyanins which lower serum uric acid levels, decrease inflammation, and clinically reduce gout flare risk by 35%. (PubMed)"
  },
  {
    name: "Water",
    p_rating: "Safe",
    mgPer100g: "0mg",
    category: "Beverages",
    why: "The absolute best remedy. Drinking 8-12 glasses of water a day aids the kidneys in flushing excess uric acid and preventing crystal formation. (Mayo Clinic)"
  },
  {
    name: "Plain Traditional Yogurt (Low-Fat)",
    p_rating: "Safe",
    mgPer100g: "Under 10mg",
    category: "Dairy",
    why: "Low-fat plain traditional yogurt contains proteins (casein and lactalbumin) that support renal excretion of uric acid. Starter cultures (L. bulgaricus, S. thermophilus, B. lactis, L. acidophilus) help metabolize purines. Avoid yogurts listing L. casei or L. paracasei or those with added sugars. (Yogurt Expert Guide)"
  },
  {
    name: "Unsweetened Cacao (Dark Chocolate)",
    p_rating: "Safe",
    mgPer100g: "Under 10mg",
    category: "Other",
    why: "Pure cacao is exceptionally rich in antioxidant polyphenols that have strong anti-inflammatory properties, helpful in relieving joint irritation. Keep it sugar-free, as fructose triggers uric acid production. (PubMed)"
  },
  {
    name: "Roasted Batatas (Sweet Potatoes)",
    p_rating: "Safe",
    mgPer100g: "Under 15mg",
    category: "Vegetables",
    why: "Sweet potatoes are highly nutritious, low-purine complex carbohydrates packed with Vitamin C, potassium, and beta-carotene. Vitamin C is a natural uricosuric that assists kidneys in clearing excess uric acid. (Mayo Clinic)"
  },
  {
    name: "Organic Sesame Seeds",
    p_rating: "Moderate",
    mgPer100g: "60-70mg",
    category: "Other",
    why: "Contains moderate purines (~60-70mg/100g) but also provides anti-inflammatory lignans (sesamin) and micronutrients. Use in moderation as part of a low-glycemic, balanced diet. (PubMed, Cleveland Clinic)"
  },
  {
    name: "Skim Milk",
    p_rating: "Safe",
    mgPer100g: "Under 5mg",
    category: "Dairy",
    why: "Highly recommended. Promotes rapid uric acid disposal by the kidneys and provides hydrated calcium. (Healthline)"
  },
  {
    name: "Cucumbers",
    p_rating: "Safe",
    mgPer100g: "7mg",
    category: "Vegetables",
    why: "Extremely hydrating (95% water) and highly alkaline, helping flush excess uric acid deposits out of joints. (Cleveland Clinic)"
  },
  {
    name: "Eggs",
    p_rating: "Safe",
    mgPer100g: "0mg",
    category: "Dairy",
    why: "Virtually zero purines. An excellent, protein-rich meat substitute that is completely safe for gout diets. (Mayo Clinic)"
  },
  {
    name: "Blueberries & Strawberries",
    p_rating: "Safe",
    mgPer100g: "Under 10mg",
    category: "Fruits",
    why: "Rich in Vitamin C and antioxidants. Vitamin C acts as a natural uricosuric agent, prompting renal uric acid clearance. (Healthline)"
  },
  {
    name: "Brown Rice",
    p_rating: "Safe",
    mgPer100g: "30-40mg",
    category: "Grains",
    why: "Completely safe carbohydrate source. High fiber helps manage glycemic spikes, which is beneficial for metabolic health. (Mayo Clinic)"
  },
  {
    name: "Celery",
    p_rating: "Safe",
    mgPer100g: "10-15mg",
    category: "Vegetables",
    why: "Celery contains compounds that act as natural diuretics, helping clear uric acid crystals and reducing overall inflammation. (PubMed)"
  },
  {
    name: "Black Coffee",
    p_rating: "Safe",
    mgPer100g: "Under 5mg",
    category: "Beverages",
    why: "Moderate coffee intake is associated with reduced uric acid levels because coffee polyphenols help block xanthine oxidase enzymes. (Mayo Clinic)"
  },
  {
    name: "Apples",
    p_rating: "Safe",
    mgPer100g: "Under 10mg",
    category: "Fruits",
    why: "Apples contain malic acid, which helps neutralize uric acid in the blood and provides fiber to support digestion. (Healthline)"
  },
  {
    name: "Bananas",
    p_rating: "Safe",
    mgPer100g: "Under 15mg",
    category: "Fruits",
    why: "Rich in potassium, which helps alkalize the urine and assists in preventing the formation of solid uric acid crystals. (Cleveland Clinic)"
  },
  {
    name: "Walnuts",
    p_rating: "Safe",
    mgPer100g: "25mg",
    category: "Other",
    why: "Low-purine nuts that provide healthy Omega-3 fatty acids to help combat joint inflammation and support vascular function. (PubMed)"
  },
  {
    name: "Almonds",
    p_rating: "Safe",
    mgPer100g: "10mg",
    category: "Other",
    why: "Very low purine nuts that are rich in magnesium, manganese, and Vitamin E, which reduce oxidative stress. (Mayo Clinic)"
  },
  {
    name: "Cabbage",
    p_rating: "Safe",
    mgPer100g: "15mg",
    category: "Vegetables",
    why: "Low-purine and highly alkaline when digested, supporting general pH levels and providing Vitamin C for renal clearance. (Healthline)"
  },
  {
    name: "Lemons & Oranges",
    p_rating: "Safe",
    mgPer100g: "Under 10mg",
    category: "Fruits",
    why: "Citrus fruits contain citric acid which helps alkalize the urine. They are also packed with Vitamin C, promoting uric excretion. (Mayo Clinic)"
  },
  {
    name: "Cottage Cheese (Low-Fat)",
    p_rating: "Safe",
    mgPer100g: "Under 5mg",
    category: "Dairy",
    why: "Low-fat cottage cheese is virtually purine-free and supplies casein, which promotes the clearance of uric acid via urine. (Cleveland Clinic)"
  }
];
