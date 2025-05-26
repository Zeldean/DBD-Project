@echo off
start "EU Node 1 (Primary)" cmd /k mongod --shardsvr --replSet rs_eu --port 27001 --dbpath ..\mongo-cluster\rs_eu1 --logpath ..\mongo-cluster\rs_eu1.log
