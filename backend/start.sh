#!/bin/bash
npm start &
node ./build/schedulers/updateRatingForInactivePlayers.js &
wait -n
exit $?