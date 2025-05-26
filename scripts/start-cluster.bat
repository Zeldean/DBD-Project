@echo off
cd /d %~dp0
echo Starting full MongoDB cluster...

call start-config.bat
call start-eu1.bat
call start-eu2.bat
call start-asia1.bat
call start-asia2.bat
call start-us1.bat
call start-us2.bat
call start-mongos.bat

echo All nodes launched.
pause
