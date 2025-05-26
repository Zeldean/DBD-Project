@echo off
start "Asia Node 2 (Secondary)" cmd /k mongod --shardsvr --replSet rs_asia --port 27102 --dbpath ..\mongo-cluster\rs_asia2 --logpath ..\mongo-cluster\rs_asia2.log
