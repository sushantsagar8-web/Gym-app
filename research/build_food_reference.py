from __future__ import annotations

import json
import re
from pathlib import Path

import pandas as pd

ROOT = Path('/home/ubuntu/fitpath-india')
OUT = ROOT / 'shared' / 'food-reference.ts'


def clean_aliases(value: object) -> list[str]:
    if value is None or pd.isna(value):
        return []
    text = str(value)
    parts = re.split(r'[;|,]', text)
    return [p.strip() for p in parts if p.strip() and len(p.strip()) > 2]


def norm(value: object) -> str:
    return re.sub(r'[^a-z0-9 ]+', ' ', str(value).lower()).strip()


def make_record(*, id_: str, name: str, aliases: list[str], region: str, category: str, state: str, kcal: float, protein: float, carbs: float, fat: float, source: str, source_url: str, confidence: str = 'reference') -> dict:
    aliases = sorted(set([name, *aliases]), key=len)
    return {
        'id': id_, 'name': name, 'aliases': aliases, 'region': region, 'category': category,
        'state': state, 'basis': 'per 100 g', 'calories': round(max(0.0, kcal), 1),
        'protein': round(max(0.0, protein), 1), 'carbs': round(max(0.0, carbs), 1),
        'fat': round(max(0.0, fat), 1), 'source': source, 'sourceUrl': source_url,
        'confidence': confidence,
    }


def load_ifct() -> list[dict]:
    path = ROOT / 'research' / 'ifct-compositions.csv'
    df = pd.read_csv(path)
    records = []
    for _, row in df.iterrows():
        name = str(row.get('name', '')).strip()
        if not name or name == 'nan':
            continue
        aliases = clean_aliases(row.get('lang')) + clean_aliases(row.get('scie'))
        group = str(row.get('grup', 'Indian food')).strip()
        records.append(make_record(
            id_=f"ifct-{row['code']}", name=name, aliases=aliases,
            region='India', category=group, state='raw',
            kcal=float(row.get('enerc', 0) or 0) * 0.239006,
            protein=float(row.get('protcnt', 0) or 0), carbs=float(row.get('choavldf', row.get('chocdf', 0)) or 0),
            fat=float(row.get('fatce', 0) or 0), source='IFCT 2017',
            source_url='https://ifct2017.github.io/',
        ))
    return records


def load_usda() -> list[dict]:
    base = ROOT / 'research' / 'usda-sr-legacy' / 'FoodData_Central_sr_legacy_food_csv_2018-04'
    foods = pd.read_csv(base / 'food.csv', low_memory=False)
    categories = pd.read_csv(base / 'food_category.csv', low_memory=False)
    foods = foods.merge(categories[['id', 'description']], left_on='food_category_id', right_on='id', how='left', suffixes=('', '_category'))
    nutrients = pd.read_csv(base / 'nutrient.csv', low_memory=False)
    nutrient_names = {int(r['id']): str(r['name']).lower() for _, r in nutrients.iterrows()}
    wanted = {}
    for nid, name in nutrient_names.items():
        if name == 'energy' or name == 'protein' or name == 'carbohydrate, by difference' or name == 'total lipid (fat)':
            wanted[name] = nid
    values = pd.read_csv(base / 'food_nutrient.csv', low_memory=False)
    values = values[values['nutrient_id'].isin(wanted.values())]
    pivot = values.pivot_table(index='fdc_id', columns='nutrient_id', values='amount', aggfunc='first')
    records = []
    for _, row in foods.iterrows():
        fdc_id = int(row['fdc_id'])
        if fdc_id not in pivot.index:
            continue
        name = str(row.get('description', '')).strip()
        if not name:
            continue
        p = pivot.loc[fdc_id]
        kcal = float(p.get(wanted.get('energy'), 0) or 0)
        protein = float(p.get(wanted.get('protein'), 0) or 0)
        carbs = float(p.get(wanted.get('carbohydrate, by difference'), 0) or 0)
        fat = float(p.get(wanted.get('total lipid (fat)'), 0) or 0)
        category = str(row.get('description_category', 'USDA food')).strip()
        state = 'prepared' if any(k in name.lower() for k in ['cooked', 'prepared', 'boiled', 'baked', 'roasted', 'fried']) else 'raw'
        records.append(make_record(
            id_=f'usda-{fdc_id}', name=name, aliases=[], region='Americas/Europe', category=category,
            state=state, kcal=kcal, protein=protein, carbs=carbs, fat=fat,
            source='USDA FoodData Central SR Legacy', source_url='https://fdc.nal.usda.gov/',
        ))
    return records


def main() -> None:
    indian = load_ifct()
    global_records = load_usda()
    # Keep the mobile bundle practical: all Indian records plus a curated set of common USDA records.
    keywords = ['chicken', 'turkey', 'beef', 'pork', 'salmon', 'tuna', 'egg', 'milk', 'yogurt', 'cheese', 'bread', 'pasta', 'rice', 'oat', 'potato', 'tomato', 'apple', 'banana', 'orange', 'avocado', 'peanut', 'almond', 'bean', 'lentil', 'pizza', 'sandwich', 'soup', 'cereal', 'tortilla', 'burger']
    selected = [r for r in global_records if any(k in norm(r['name']) for k in keywords)]
    # Deduplicate by normalized name, retaining the first sourced record.
    seen = set()
    combined = []
    for record in indian + selected:
        key = norm(record['name'])
        if key and key not in seen:
            seen.add(key)
            combined.append(record)
    payload = json.dumps(combined, ensure_ascii=False, separators=(',', ':'))
    OUT.write_text(
        "// Source-attributed curated food reference. Values are approximate per 100 g; dish and portion estimates remain approximate.\n"
        "// Generated from IFCT 2017 and USDA FoodData Central SR Legacy.\n"
        "export type FoodReference = { id: string; name: string; aliases: string[]; region: string; category: string; state: string; basis: string; calories: number; protein: number; carbs: number; fat: number; source: string; sourceUrl: string; confidence: string };\n"
        f"export const FOOD_REFERENCE: FoodReference[] = {payload};\n"
    )
    print(json.dumps({'indian': len(indian), 'usdaSelected': len(selected), 'combined': len(combined), 'outputBytes': OUT.stat().st_size}))


if __name__ == '__main__':
    main()
