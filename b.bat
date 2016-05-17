RMDIR "tos-laimas-compass-win32-x64" /S /Q
call electron-packager . --platform=win32 --arch=x64 --overwrite
CD
DEL ".\tos-laimas-compass-win32-x64\resources\app\.gitignore" /f
DEL ".\tos-laimas-compass-win32-x64\resources\app\*.bat" /f

DEL ".\tos-laimas-compass-win32-x64\resources\app\*.less" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\.npmignore" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\.dockerignore" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\makefile" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\.tern-port" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\.grunt.js" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\.LICENSE-MIT" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\.travis.yml" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\*.md" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\LICENSE" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\AUTHORS" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\*.gzip" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\*.map" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\*.iml" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\*.ipr" /f /s
DEL ".\tos-laimas-compass-win32-x64\resources\app\*.iws" /f /s

