#!/bin/bash

# Check if the template folder exists
TEMPLATE_DIR="template"
if [ ! -d "$TEMPLATE_DIR" ]; then
    echo "Error: Template directory '$TEMPLATE_DIR' does not exist."
    exit 1
fi

# Check if a project name is provided
if [ -z "$1" ]; then
    echo "Usage: ./new_project.sh <project_name>"
    exit 1
fi

# Create the new project folder
PROJECT_NAME=$1
NEW_PROJECT_DIR="$PROJECT_NAME"

if [ -d "$NEW_PROJECT_DIR" ]; then
    echo "Error: Project '$PROJECT_NAME' already exists."
    exit 1
fi

mkdir "$NEW_PROJECT_DIR"

# Copy the contents of the template folder to the new project folder, excluding 'build' folder
rsync -av --exclude='build' "$TEMPLATE_DIR/" "$NEW_PROJECT_DIR/"

echo "Project '$PROJECT_NAME' has been created successfully in '$NEW_PROJECT_DIR'."
