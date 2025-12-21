#!/bin/bash

# Script to update requirements.txt with current installed packages
source .venv/bin/activate
pip freeze > requirements.txt
echo "Requirements updated!"