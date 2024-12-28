#!/bin/bash

# Ensure we are in the root of the repository
repo_root="$(pwd)"

# Get the list of modified files in the last commit
modified_files=$(git diff --name-only HEAD~1 HEAD)

# Get the list of project directories (project1, project2, etc.)
project_dirs=$(find p5-sketches -mindepth 1 -maxdepth 1 -type d)

# Loop through each project directory
for project_dir in $project_dirs; do
  # Check if any files in the project directory were modified
  if echo "$modified_files" | grep -q "^$project_dir"; then
    echo "Changes detected in $project_dir"

    # Create the 'build' directory if it doesn't exist
    build_dir="$project_dir/build"
    mkdir -p "$build_dir"

    # Create a combined and minified JavaScript file
    combined_js="$build_dir/index.js"
    > "$combined_js"  # Clear the file if it exists

    # Loop through all JS files in the project and combine them
    for js_file in "$project_dir"/*.js; do
      if [[ "$js_file" != "$combined_js" ]]; then
        cat "$js_file" >> "$combined_js"
        echo "// End of $js_file" >> "$combined_js"
      fi
    done

    # Minify the combined JavaScript file using terser
    terser "$combined_js" -o "$combined_js" --compress --mangle

    # Stage the changes for commit (including the build dir)
    git add "$build_dir"

    echo "Build created and added for $project_dir"
  fi
done

# Commit the changes (including the build directories) with a message
if git diff --cached --quiet; then
  echo "No changes to commit"
else
  git commit -m "Add build directories and minified JS files"
  echo "Changes committed"
fi
