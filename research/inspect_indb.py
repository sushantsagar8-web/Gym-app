from pathlib import Path
import json
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
base = ROOT / 'research' / 'indb'
result = {}
for filename in ['INDB.xlsx', 'recipes_names.xlsx', 'recipes_servingsize.xlsx']:
    path = base / filename
    sheets = pd.ExcelFile(path).sheet_names
    result[filename] = {'sheets': sheets}
    for sheet in sheets[:3]:
        frame = pd.read_excel(path, sheet_name=sheet, nrows=5)
        result[filename][sheet] = {'columns': [str(c) for c in frame.columns], 'rows': frame.head(2).fillna('').to_dict(orient='records')}
print(json.dumps(result, ensure_ascii=False, indent=2, default=str))
