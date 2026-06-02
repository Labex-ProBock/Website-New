@echo off
cd /d "C:\Users\Mandy\Desktop\Labex"
"C:\Users\Mandy\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" scripts\bulk-image-fetch.py --retry-failures 1>> bulk-image-fetch.log 2>> bulk-image-fetch.err.log
