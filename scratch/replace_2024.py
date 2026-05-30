import os

search_dirs = ["."]
extensions = (".html", ".js", ".css", ".tsx", ".ts", ".json")

count = 0
modified_files = []

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
                        occurrences = content.count("2024")
                        content = content.replace("2024", "2026")
                        with open(filepath, "w", encoding="utf-8") as f:
                            f.write(content)
                        count += occurrences
                        modified_files.append((filepath, occurrences))
                except Exception as e:
                    print(f"Error processing {filepath}: {e}")

print(f"Replacement completed. Replaced {count} occurrences across {len(modified_files)} files:")
for filepath, occurrences in modified_files:
    print(f"  {filepath}: {occurrences} replacements")
