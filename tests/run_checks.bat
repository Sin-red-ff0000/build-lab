@echo off
setlocal enabledelayedexpansion
for /r js %%F in (*.js) do node --check "%%F" || exit /b 1
set count=0
for /f "delims=" %%F in ('dir /b /on tests\*.test.js') do (
  node "tests\%%F" || exit /b 1
  set /a count+=1
)
echo All checks passed. (!count! tests)
