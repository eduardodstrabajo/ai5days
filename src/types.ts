export interface FlareLog {
  id: string;
  startDate: string; // ISO string Date (YYYY-MM-DD)
  endDate?: string;  // ISO string Date (YYYY-MM-DD)
  joint: string;     // e.g. "Left Big Toe", "Right Knee", etc.
  painLevel: number; // 1 to 10
  triggers: string[]; // e.g. ["Seafood", "Beer", "Dehydration", "Red Meat"]
  remediesTaken: string[]; // natural remedies used for relief
  notes?: string;
  status: 'active' | 'resolved';
}

export interface UricAcidLog {
  id: string;
  date: string; // ISO string Date (YYYY-MM-DD)
  value: number; // in mg/dL (clinical target is typically < 6.0 mg/dL)
  notes?: string;
}

export interface HydrationLog {
  date: string; // YYYY-MM-DD
  amount: number; // Current logged amount in mL
  target: number; // Daily target in mL (usually 2500 - 3000 mL)
}

export interface NaturalFood {
  id: string;
  name: string;
  servingSize: string; // e.g., "1 cup (approx 20 cherries)", "1 tall glass", "500mg"
  frequency: 'Daily' | 'During Active Flares' | 'Occasional Maintenance';
  mechanism?: string; // e.g. "Natural xanthine oxidase inhibitor", "Alkalizes urine to flush crystals"
  category: 'Fruit' | 'Vegetable' | 'Beverage' | 'Dairy' | 'Herbal/Seasoning' | 'Other';
  takenDates: string[]; // list of YYYY-MM-DD strings representing times logged as consumed
  notes?: string;
}

export interface FoodItem {
  name: string;
  p_rating: 'Safe' | 'Moderate' | 'High'; // Purine level
  mgPer100g?: string; // purine milligram equivalent
  category: 'Seafood' | 'Meats' | 'Beverages' | 'Vegetables' | 'Dairy' | 'Grains' | 'Fruits' | 'Other';
  why: string;
}

export interface AIAnalysisResult {
  foodName: string;
  purineRating: 'Safe' | 'Moderate' | 'High';
  ratingExplanation: string;
  uricAcidImpact: string;
  safetyTips: string[];
  lowPurineAlternatives: string[];
}

export interface ExerciseLog {
  id: string;
  date: string; // YYYY-MM-DD
  activityType: 'Walking' | 'Cycling' | 'Swimming' | 'Stretching/Yoga' | 'Elliptical' | 'Other';
  duration: number; // in minutes
  jointStrain: number; // 1 to 10
  remissionPhase: boolean; // whether they was in remission
  notes?: string;
}

export interface SleepLog {
  id: string;
  date: string; // YYYY-MM-DD
  hours: number;
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  restlessJoints: boolean; // did their joints keep them awake?
  meditationCompleted: boolean;
  isDaytimeRest?: boolean;
  restType?: 'Night Sleep' | 'Daytime Joint Rest Only';
}

export interface SymptomLog {
  id: string;
  date: string; // YYYY-MM-DD
  symptom: string; // e.g., 'Toe pain', 'Swelling'
  severity: number; // 1-10
  notes?: string;
} 

