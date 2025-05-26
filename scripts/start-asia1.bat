@echo off
start "Asia Node 1 (Primary)" cmd /k mongod --shardsvr --replSet rs_asia --port 27101 --dbpath ..\mongo-cluster\rs_asia1 --logpath ..\mongo-cluster\rs_asia1.log
