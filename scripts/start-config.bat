@echo off
start "Config Server" cmd /k mongod --configsvr --replSet cfg_rs --port 26001 --dbpath ..\mongo-cluster\cfg1 --logpath ..\mongo-cluster\cfg1.log
