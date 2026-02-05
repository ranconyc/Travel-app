import os
import re

def analyze_file_quality(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')
            
            # Metrics
            num_lines = len(lines)
            num_any = len(re.findall(r':\s*any\b', content)) + len(re.findall(r'as\s+any\b', content))
            num_todos = len(re.findall(r'TODO:', content, re.IGNORECASE))
            num_fixmes = len(re.findall(r'FIXME:', content, re.IGNORECASE))
            num_console = len(re.findall(r'console\.log', content))
            
            return {
                "path": file_path,
                "lines": num_lines,
                "any_count": num_any,
                "todos": num_todos + num_fixmes,
                "console": num_console
            }
    except:
        return None

def main():
    print("--- Code Quality Audit Scan ---")
    
    src_dir = "src"
    results = []
    
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                res = analyze_file_quality(os.path.join(root, file))
                if res:
                    results.append(res)
    
    # Sort by lines (descending)
    large_files = sorted(results, key=lambda x: x['lines'], reverse=True)[:10]
    
    # Sort by 'any' usage
    any_heavy = sorted(results, key=lambda x: x['any_count'], reverse=True)[:10]
    
    # Files with TODOs
    todo_heavy = sorted([r for r in results if r['todos'] > 0], key=lambda x: x['todos'], reverse=True)
    
    print("\n[Top 10 Largest Files (Candidates for splitting)]")
    for r in large_files:
        print(f"{r['lines']} lines: {r['path']}")
        
    print("\n[Top 10 Files using 'any' (Type safety risks)]")
    for r in any_heavy:
        if r['any_count'] > 0:
            print(f"{r['any_count']} uses: {r['path']}")
            
    print("\n[Files with TODOs/FIXMEs]")
    for r in todo_heavy:
        print(f"{r['todos']} found: {r['path']}")

    print("\n[Files with console.log (Cleanup needed)]")
    for r in sorted([x for x in results if x['console'] > 0], key=lambda x: x['console'], reverse=True):
         print(f"{r['console']} found: {r['path']}")

if __name__ == "__main__":
    main()
