#!/bin/bash
while true; do

DATE=$(date +"%Y-%m-%d_%H%M%S")

fswebcam -r 1280x720 --no-banner /home/pi/Desktop/sc/$DATE.jpg
sleep 0
done
