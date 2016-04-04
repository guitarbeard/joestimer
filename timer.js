const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var filePath     = '',
    data        = [],
    currentTask = {},
    startTime   = 0,
    endTime     = 0;

timerInit();
controlPrompt();

function timerInit() {
  var date  = new Date(),
      month = date.getMonth() + 1,
      day   = date.getDate(),
      temp;

  filePath = './logs/'+month+'_'+day+'_log.js';
  fs.access(filePath, fs.F_OK, (err) => {
    if (!err) {
      fs.readFile(filePath, 'utf8', function(err, content) {
        temp = JSON.parse(content);
        if (Object.keys(temp).length > 0) {
          data.push(temp);
        }
      });
    } else {
      fs.mkdir('./logs/', function(err) {
        fs.openSync(filePath, 'w');
      });
    }
  });
}

function timerControl(command) {
  switch(command) {
    case 'print', 'p':
      timerPrint();
      controlPrompt();
      break;
    case 'exit', 'x':
      writeFile();
      console.log('closing...');
      rl.close();
      break;
    default:
      timerStart(command);
      break;
  }
}

function controlPrompt() {
  rl.question('timer command ([desc], print[p], exit[x]):', (answer) => {
    timerControl(answer); 
  }); 
}

function timerStart(description) {
  startTime = new Date();

  currentTask = {
    'desc': description,
    'time': startTime
  };
  rl.question('press enter to end...', (answer) => {
    timerStop();
  }); 
}

function timerStop() {
  var endTime = new Date();

  currentTask['time'] = formatTime(endTime - startTime);
  data.push(currentTask);
  currentTask = {};
  controlPrompt();
}

function timerPrint() {
  console.log(data);
}

function writeFile() {
  fs.writeFile(filePath, JSON.stringify(data)); 
}

function formatTime(time) {
  var seconds = time / 1000,
      minutes = seconds / 60,
      hours   = minutes / 60;

  return (hours >= 1 ? parseInt(hours) + ' hours, ' : '') + (minutes >= 1 ? parseInt(minutes) + ' minutes, ' : '') + parseInt(seconds) + ' seconds';
}
