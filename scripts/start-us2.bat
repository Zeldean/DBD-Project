@echo off
start "US Node 2 (Secondary)" cmd /k mongod --shardsvr --replSet rs_us --port 27202 --dbpath ..\mongo-cluster\rs_us2 --logpath ..\mongo-cluster\rs_us2.log
