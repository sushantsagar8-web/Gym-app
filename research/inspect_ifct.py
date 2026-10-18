import pandas as pd

path = "/home/ubuntu/fitpath-india/research/ifct-compositions.csv"
df = pd.read_csv(path)
print("rows", len(df), "columns", len(df.columns))
print("macro candidates", [c for c in df.columns if any(k in c.lower() for k in ["ener", "prot", "carb", "fat", "fibt"] )])
print(df[["code", "name", "grup", "enerc", "protcnt", "fatce", "fibtg"]].head(10).to_string(index=False))
