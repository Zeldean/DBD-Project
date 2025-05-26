@echo off
start "US Node 1 (Primary)" cmd /k mongod --shardsvr --replSet rs_us --port 27201 --dbpath ..\mongo-cluster\rs_us1 --logpath ..\mongo-cluster\rs_us1.log
