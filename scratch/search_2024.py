import os
import re

search_dirs = [".", "frontend/src"]
extensions = (".html", ".js", ".css", ".tsx", ".ts", ".json")

results = []

for s_dir in search_dirs:
    for root, dirs, files in os.walk(s_dir):
        if "node_modules" in root or ".next" in root or ".git" in root:
            continue
        for file in files:
            if file.endswith(extensions):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, "r", encoding="utf-8") as f:
                        content = f.read()
                    if "2024" in content:
                        # Find line numbers
                        lines = content.splitlines()
                        for i, line in enumerate(lines, 1):
                            if "2024" in line:
                                results.append((filepath, i, line.strip()))
                except Exception as e:
                    pass

print(f"Found {len(results)} matches for '2024':")
for filepath, line_num, text in results:
    print(f"{filepath}:{line_num}: {text}")
