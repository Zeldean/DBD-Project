@echo off
start "Mongos Router" cmd /k mongos --configdb cfg_rs/localhost:26001 --port 30000 --logpath ..\mongo-cluster\mongos.log
