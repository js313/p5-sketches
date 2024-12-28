#!/bin/bash

# Get the absolute path of the current directory
current_dir="$(pwd)"

# Check if we're in the p5-sketches directory or its parent
if [[ "$(basename "$current_dir")" == "p5-sketches" ]]; then
  repo_root="$current_dir"
else
  # Assume p5-sketches is the root if not in it already
  repo_root="$current_dir/p5-sketches"
fi

echo "Repo root: $repo_root"  # Debug output to check the repo root

# Check if p5-sketches directory exists
if [ ! -d "$repo_root" ]; then
  echo "p5-sketches directory not found. Make sure you are in the repo root or parent."
  exit 1
fi

# Get the list of modified files in the last commit
modified_files=$(git diff --name-only HEAD~1 HEAD)
echo "Modified files: $modified_files"  # Debug output to check modified files

# Get the list of project directories (project1, project2, etc.) under p5-sketches
project_dirs=$(find "$repo_root" -mindepth 1 -maxdepth 1 -type d)
echo "Project directories found: $project_dirs"  # Debug output to check project directories

# Loop through each project directory
for project_dir in $project_dirs; do
  # Check if any files in the project directory were modified (case-insensitive comparison)
  if echo "$modified_files" | grep -iq "^$(basename "$project_dir")"; then
    echo "Changes detected in $project_dir"

    # Create the 'build' directory if it doesn't exist
    build_dir="$project_dir/build"
    mkdir -p "$build_dir"

    # Create a combined and minified JavaScript file
    combined_js="$build_dir/index.min.js"
    > "$combined_js"  # Clear the file if it exists

    # Loop through all JS files in the project and combine them
    for js_file in "$project_dir"/*.js; do
      if [[ "$js_file" != "$combined_js" ]]; then
        cat "$js_file" >> "$combined_js"
        echo "// End of $js_file" >> "$combined_js"
      fi
    done

    # Use the local terser binary from node_modules/.bin
    node_modules/.bin/terser "$combined_js" -o "$combined_js" --compress --mangle

    echo "Build created in $build_dir"
  fi
done

echo "Build creation complete. No commits made."
