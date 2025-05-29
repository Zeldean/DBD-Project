@echo off
cd /d %~dp0
echo Starting full MongoDB cluster...

echo Starting config server...
call start-config.bat


echo Starting EU node 1...
call start-eu1.bat


echo Starting EU node 2...
call start-eu2.bat


echo Starting Asia node 1...
call start-asia1.bat


echo Starting Asia node 2...
call start-asia2.bat


echo Starting US node 1...
call start-us1.bat


echo Starting US node 2...
call start-us2.bat


echo Starting mongos router...
call start-mongos.bat


echo All nodes launched.

