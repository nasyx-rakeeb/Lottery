#!/bin/bash -e 
commit_message="$1" 
git config --global credential.helper store
git add .  
git commit -m "$commit_message" 
git push -u origin main
clear
