# FTC Robot Scoreboard
This will allow you to display a scoreboard on a TV as if you are at a FTC event and control it from your phone. 

The way this works is it starts up a web server on the host computer on port `3000` which will allow you to go to `computerip:3000` for the scoreboard and `computerip:3000/admin.html` for the admin page. 

To get your computer's ip, on windows you can use `ipconfig` command in command prompt. 

To run, make sure you have Node.js installed then download this repo, open the folder in command prompt, then run `npm i` then `node index.js` to start the code.

Everything updates in real time. 

## IMPORTANT 
Most 