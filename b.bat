RMDIR "tos-laimas-compass-win32-x64" /S /Q
electron-packager . --platform=win32 --arch=x64 --overwrite
DEL "tos-laimas-compass-win32-x64\resources\app\.gitignore" /a:H
DEL "tos-laimas-compass-win32-x64\resources\app\*.bat"