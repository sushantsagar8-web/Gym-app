from pathlib import Path
import json
import re
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT / 'research' / 'indb'
OUT = ROOT / 'shared' / 'prepared-food-reference.ts'

def clean(value):
    return '' if pd.isna(value) else str(value).strip()

def slug(value):
    return re.sub(r'[^a-z0-9]+', '-', clean(value).lower()).strip('-')

def region_for(name):
    text = name.lower()
    if any(k in text for k in ['sushi', 'ramen', 'pad ', 'thai', 'kimchi', 'noodle', 'dumpling', 'fried rice', 'teriyaki']):
        return 'Asia'
    if any(k in text for k in ['taco', 'burrito', 'burger', 'chili', 'pancake', 'sandwich', 'macaroni', 'meatloaf']):
        return 'Americas'
    if any(k in text for k in ['pasta', 'lasagna', 'risotto', 'paella', 'quiche', 'stew', 'casserole']):
        return 'Europe'
    return 'India'

def aliases(name):
    values = {name.lower()}
    replacements = {'garam chai': 'chai', 'chapati': 'roti', 'dal': 'daal', 'paratha': 'parantha'}
    for source, target in replacements.items():
        if source in name.lower(): values.add(name.lower().replace(source, target))
    return sorted(values)

def main():
    nutrients = pd.read_excel(BASE / 'indb' / 'INDB.xlsx', sheet_name='Nutrient Data') if (BASE / 'indb' / 'INDB.xlsx').exists() else pd.read_excel(BASE / 'INDB.xlsx', sheet_name='Nutrient Data')
    names = pd.read_excel(BASE / 'recipes_names.xlsx')
    servings = pd.read_excel(BASE / 'recipes_servingsize.xlsx')
    merged = names.merge(nutrients[['food_code','food_name','energy_kcal','carb_g','protein_g','fat_g','servings_unit','unit_serving_energy_kcal','unit_serving_carb_g','unit_serving_protein_g','unit_serving_fat_g']], left_on='recipe_code', right_on='food_code', how='inner')
    merged = merged.merge(servings[['recipe_code','no_of_servings','size_of_servings','servings_unit','remarks_1','remarks_2']], on='recipe_code', how='left', suffixes=('','_serving'))
    rows = []
    for _, row in merged.iterrows():
        name = clean(row.get('recipe_name')) or clean(row.get('food_name'))
        if not name: continue
        unit = clean(row.get('servings_unit_serving')) or clean(row.get('servings_unit')) or clean(row.get('servings_unit_x')) or 'serving'
        serving_count = float(row.get('no_of_servings', 1) or 1)
        size = float(row.get('size_of_servings', 1) or 1)
        records_per_serving = max(serving_count, 1)
        kcal = float(row.get('unit_serving_energy_kcal', 0) or 0)
        protein = float(row.get('unit_serving_protein_g', 0) or 0)
        carbs = float(row.get('unit_serving_carb_g', 0) or 0)
        fat = float(row.get('unit_serving_fat_g', 0) or 0)
        if kcal <= 0:
            kcal = float(row.get('energy_kcal', 0) or 0) / records_per_serving
            protein = float(row.get('protein_g', 0) or 0) / records_per_serving
            carbs = float(row.get('carb_g', 0) or 0) / records_per_serving
            fat = float(row.get('fat_g', 0) or 0) / records_per_serving
        rows.append({
            'id': f"indb-recipe-{slug(clean(row.get('recipe_code')))}",
            'name': name,
            'aliases': aliases(name),
            'region': region_for(name),
            'category': 'Prepared regional dish',
            'state': 'prepared',
            'basis': f"{size:g} {unit}",
            'servingGrams': None,
            'servingCount': serving_count,
            'servingUnit': unit,
            'calories': round(kcal, 1),
            'protein': round(protein, 1),
            'carbs': round(carbs, 1),
            'fat': round(fat, 1),
            'source': 'Indian Nutrient Databank (INDB)',
            'sourceUrl': 'https://www.anuvaad.org.in/indian-nutrient-databank/',
            'confidence': 'reference',
            'notes': 'Prepared recipe estimate; recipe, oil, and serving variation may change actual values.',
        })
    # Retain a practical, diverse reference subset and remove duplicate names.
    seen = set(); selected = []
    for row in rows:
        key = re.sub(r'[^a-z0-9]+',' ',row['name'].lower()).strip()
        if key and key not in seen:
            seen.add(key); selected.append(row)
    payload = json.dumps(selected, ensure_ascii=False, separators=(',', ':'))
    OUT.write_text("// Prepared regional dish records from the sourced INDB recipe workbook. Values are per stated household serving.\n" + "export type PreparedFoodReference = " + "{ id: string; name: string; aliases: string[]; region: string; category: string; state: string; basis: string; servingGrams: number | null; servingCount: number; servingUnit: string; calories: number; protein: number; carbs: number; fat: number; source: string; sourceUrl: string; confidence: string; notes: string };\n" + f"export const PREPARED_FOOD_REFERENCE: PreparedFoodReference[] = {payload};\n")
    print(json.dumps({'merged': len(merged), 'selected': len(selected), 'outputBytes': OUT.stat().st_size}))

if __name__ == '__main__':
    main()
