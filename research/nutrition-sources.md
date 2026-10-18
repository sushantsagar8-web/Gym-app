# Nutrition Reference Research Notes

## Scope decision
FitPath will use a curated, maintainable reference layer rather than claim exhaustive coverage of every food worldwide. Entries will be normalized per 100 g where source data supports it, with optional household-serving metadata for common dishes. Mixed-dish estimates remain approximate because recipes, cooking methods, oil, and portion sizes vary.

## Authoritative sources discovered

1. USDA FoodData Central downloadable datasets: https://fdc.nal.usda.gov/download-datasets
   The USDA provides downloadable food-composition data in CSV and other formats. FoodData Central covers foundational foods, survey foods, and branded foods.

2. USDA FoodData Central main portal: https://fdc.nal.usda.gov/
   Primary search and reference portal for US and globally available food records.

3. USDA SR-Legacy dataset via Ag Data Commons: https://agdatacommons.nal.usda.gov/articles/dataset/USDA_National_Nutrient_Database_for_Standard_Reference_Legacy_Release/24661818
   Search result reports 7,793 food items and up to 150 food components in the SR-Legacy release.

4. Indian Food Composition Tables 2017 landing page: https://ifct2017.github.io/
   Data are attributed to Indian Food Composition Tables 2017 from the National Institute of Nutrition (ICMR), Hyderabad.

5. ICMR-National Institute of Nutrition achievements page: https://www.nin.res.in/achievements.html
   Search result reports IFCT 2017 contains nutrient information for 528 key foods and 151 discrete food components.

6. IFCT 2017 publication record: https://www.researchgate.net/profile/Thingnganing-Longvah/publication/313226719_Indian_food_Composition_Tables/links/589328db92851c5457486b19/Indian-food-Composition-Tables.pdf
   Search result notes that, except eggs, IFCT food component data are generally for raw foods, and that regional composite samples were averaged across six geographic regions of India. Raw versus cooked state must be preserved in the app metadata.

7. FAO/INFOODS databases: https://www.fao.org/infoods/infoods/tables-and-databases/faoinfoods-databases/en/
   FAO describes the Analytical Food Composition Database as a global compendium of scrutinized analytical data.

8. FAO/INFOODS Asia databases: https://www.fao.org/infoods/infoods/tables-and-databases/asia/en/
   Regional tables support Asian food coverage and should supplement USDA data where regional dishes and ingredients are missing.

9. Southeast Asia food-composition review: https://pmc.ncbi.nlm.nih.gov/articles/PMC6373311/
   Review indicates country-specific Southeast Asian food-composition tables commonly prioritize energy, protein, total fat, carbohydrates, iron, and zinc; it supports using regional sources rather than assuming US values represent all Asian foods.

## Data governance
The app should store source name, source URL, food state (raw/cooked/prepared), reference basis, aliases, region tags, and an approximate-confidence flag. The AI should match to this reference layer when possible and ask for clarification or fall back to manual entry when the food, preparation, or portion is unclear.

## Research limitation
Search results identify authoritative sources, but a reliable global database requires downloading and normalizing source files, resolving licensing/attribution constraints, and avoiding fabricated values. The initial integration should prioritize a verified curated set of common foods and dishes across India/Asia, North and South America, and Europe, then expand in versioned batches.

## Machine-readable source findings

10. Indian Food Composition package repository: https://github.com/ifct2017/ifct2017
    The package exposes detailed composition data for 542 key Indian foods, with codes, groups, local-language descriptions, regions, yield factors, and nutrient columns. It reports 20 food groups including cereals and millets, legumes, leafy vegetables, vegetables, fruits, roots and tubers, spices, nuts and oilseeds, dairy, eggs, poultry, meat, fish, shellfish, freshwater foods, and oils/fats. This is useful for aliases and regional matching, but the project must preserve attribution and verify redistribution terms before bundling extracted values.

11. Indian Nutrient Databank code repository: https://github.com/lindsayjaacks/Indian-Nutrient-Databank-INDB-
    The repository documents an open Indian recipe database approach with 1,014 common recipes and ingredient-level data. It combines IFCT 2017/2004, UK McCance and Widdowson data for 144 gaps, and USDA FoodData Central for 54 gaps. It records values per 100 g and per serving, includes recipe ingredients and servings, and explicitly documents source fields. The original IFCT files must be requested from the source; the app should not copy restricted files without checking license/permission.

12. Zenodo IFCT record: https://zenodo.org/records/7088653
    The record describes the IFCT 2017 data package, attributes measurements to the National Institute of Nutrition, Hyderabad, and links to npm/unpkg distributions. It is an alternative machine-readable route for validating names, aliases, groups, and composition fields.

## Implementation implication
A practical first release should bundle a curated, source-attributed subset of common foods and dishes rather than the full global universe. The dataset should include Indian staples and dishes, Asian staples and dishes, American staples, European staples, and common ingredients; each record should have aliases, region tags, raw/cooked/prepared state, serving grams, calories, protein, carbohydrates, fat, source, and confidence. The AI extraction endpoint should return candidate items and portions, then use this local reference layer to recompute totals whenever a high-confidence match exists.

## Prepared regional dishes source verification

- Indian Nutrient Databank portal: https://www.anuvaad.org.in/indian-nutrient-databank/ — reports 1,014 common Indian recipes with values per 100 g and per serving, built using IFCT 2017, Nutritive Value of Indian Foods, CoFID, and USDA FoodData Central.
- INDB repository: https://github.com/lindsayjaacks/Indian-Nutrient-Databank-INDB- — documents `INDB.xlsx`, `recipes.xlsx`, `recipes_names.xlsx`, and `recipes_servingsize.xlsx`; recipes include 490 from Art & Science of Cooking, 378 from Basic Food Preparation, and 148 from open web sources. Recipe serving sizes are explicitly modeled, and ingredient amounts are normalized to grams/ml/spoons/cups.
- Raw recipe workbook: https://raw.githubusercontent.com/lindsayjaacks/Indian-Nutrient-Databank-INDB-/main/recipes.xlsx
- USDA FoodData Central: https://fdc.nal.usda.gov/ — USDA states FDC data are public domain under CC0 1.0 Universal and requests attribution.
- FAO/INFOODS India tables: https://www.fao.org/infoods/infoods/tables-and-databases/india/en/ — Indian nutritive-value and common-recipe references.
- Pan-Asian dish-level research context: https://www.nature.com/articles/s41597-025-06180-5 — describes 4,403 representative dishes from 48 Asian countries/regions with recipe-level nutrient methodology; use only after confirming licensing/format before direct import.

Implementation policy: import prepared recipe records with source attribution, serving-size metadata, regional aliases, cooking state, and an approximate/reference confidence flag. Ask for clarification when dish variant, cooking method, or portion is ambiguous; do not present mixed-dish values as exact medical nutrition guidance.
