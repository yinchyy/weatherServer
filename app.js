const fs = require('fs');
const express = require('express');
const app = express();
const port = 8081;
const weather = require("./weather.js");
const JSONStorageFile = "./data.json";
let data = Array.from(getJSONData(JSONStorageFile));

data.push(new weather("Warsaw", 25.6, 35, 1000));
data.push(new weather("Poznan", 25.6, 35, 1000));

writeJSONData(JSONStorageFile);

function getJSONData(file) {
  try {
    return fs.readFileSync(file);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`file in location: "${file}" not found, creating...`); 
      fs.appendFileSync(file, "");
    }
  }  
}
function writeJSONData(file) {
  fs.writeFileSync(file, JSON.stringify(data));
}
app.get('/', (req, res) => {
  res.send(data);
});
app.post('/', (req, res) => {
  req.on('data', (chunk) => {
    console.log(chunk.toString('utf8'));
    data.push(JSON.parse(chunk.toString('utf8')));
    writeJSONData(JSONStorageFile);
  });
  return res.send("received post\n");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})