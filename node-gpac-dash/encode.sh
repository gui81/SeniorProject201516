#!/bin/bash

cd /home/SeniorProject201516/node-gpac-dash/

IPvar=$(/sbin/ip addr | grep -A3 eth0 | grep 'inet ' | awk '{print $2}' | awk -F'/' '{print $1}')

echo $IPvar

nodejs gpac-dash.js -cors -segment-marker eods -chunk-media-segments -ip $IPvar -port $2 &

$3

while true
do
  sleep 1
done
