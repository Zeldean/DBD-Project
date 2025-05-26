@echo off
start "EU Node 2 (Secondary)" cmd /k mongod --shardsvr --replSet rs_eu --port 27002 --dbpath ..\mongo-cluster\rs_eu2 --logpath ..\mongo-cluster\rs_eu2.log
