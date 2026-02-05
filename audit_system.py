import os
import re

def find_files(start_path, extensions):
    files_found = []
    for root, _, files in os.walk(start_path):
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                files_found.append(os.path.join(root, file))
    return files_found

def get_file_content(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        return ""

def base_name_without_ext(path):
    base = os.path.basename(path)
    return os.path.splitext(base)[0]

def analyze_components():
    print("--- Analyzing Components ---")
    component_dirs = ["src/components/atoms", "src/components/molecules", "src/components/organisms"]
    all_src_files = find_files("src", [".tsx", ".ts"])
    
    unused_count = 0
    
    for comp_dir in component_dirs:
        if not os.path.exists(comp_dir):
            continue
            
        for comp_name in os.listdir(comp_dir):
            comp_path = os.path.join(comp_dir, comp_name)
            if not os.path.isdir(comp_path):
                continue
                
            # Assume Usage Pattern: <CompName
            # OR import ... from ".../CompName"
            
            is_used = False
            for file_path in all_src_files:
                # Skip self
                if file_path.startswith(comp_path):
                    continue
                # Skip stories/tests
                if ".stories." in file_path or ".test." in file_path:
                    continue
                    
                content = get_file_content(file_path)
                if comp_name in content:
                    is_used = True
                    break
            
            if not is_used:
                print(f"UNUSED COMPONENT: {comp_name} ({comp_dir})")
                unused_count += 1
                
    print(f"Total Potentially Unused Components: {unused_count}\n")

def analyze_hooks():
    print("--- Analyzing Hooks ---")
    # hooks usually start with use...
    hook_files = find_files("src", [".ts", ".tsx"])
    hooks_definitions = []
    
    for f in hook_files:
        name = os.path.basename(f)
        if name.startswith("use") and "stories" not in name and "test" not in name:
             hooks_definitions.append((base_name_without_ext(f), f))
             
    all_src_files = find_files("src", [".tsx", ".ts"])
    
    unused_count = 0
    for hook_name, hook_path in hooks_definitions:
        is_used = False
        for file_path in all_src_files:
            if file_path == hook_path: continue
            
            content = get_file_content(file_path)
            if hook_name in content:
                is_used = True
                break
        
        if not is_used:
            print(f"UNUSED HOOK: {hook_name} ({hook_path})")
            unused_count += 1
            
    print(f"Total Potentially Unused Hooks: {unused_count}\n")

def analyze_pages():
    print("--- Analyzing Routes/Pages ---")
    # Just list them for manual review of "weird" ones
    app_dir = "src/app"
    for root, _, files in os.walk(app_dir):
        if "page.tsx" in files:
            rel_path = os.path.relpath(root, app_dir)
            print(f"ROUTE: /{rel_path}")

def main():
    analyze_components()
    analyze_hooks()
    analyze_pages()

if __name__ == "__main__":
    main()
