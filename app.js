const fs = require('fs');
const express = require('express');
const app = express();
const port = 8081;
const weather = require("./weather.js");
const { json } = require('express/lib/response');
const JSONStorageFile = "./data.json";
const data = JSON.parse(getJSONData(JSONStorageFile).toString('utf-8'));


appendOrModifyObjectInArray(data,new weather("Warsaw", 25.6, 35, 1000));
appendOrModifyObjectInArray(data,new weather("Poznan", 25.6, 35, 1000));

writeJSONData(JSONStorageFile);

function getJSONData(file) {
  try {
    return fs.readFileSync(file);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`file in location: "${file}" not found, creating...`); 
      fs.appendFileSync(file, "[]");
    }
  }  
}
function writeJSONData(file) {
  fs.writeFileSync(file, JSON.stringify(data));
}
function appendOrModifyObjectInArray(dataArr, obj) {
  const elemIndex = dataArr.findIndex((e) => e.location === obj.location);
  if (elemIndex != -1) {
    for (let key of Object.keys(dataArr[elemIndex])) {
      dataArr[elemIndex][key] = obj[key];
    }
    writeJSONData(JSONStorageFile);
  }
  else {
    data.push(obj);
  }
}
function deleteObjectIfExists(dataArr, obj) {
  const elemIndex = dataArr.findIndex((e) => e.location === obj.location);
  if (elemIndex != -1) {
    dataArr.splice(elemIndex, 1);
    console.log("deleted");
    writeJSONData(JSONStorageFile);
  }
  else {
    console.log("requested object doesn't exist");
  }
}
app.get('/', (req, res) => {
  res.send(data);
});
app.post('/', (req, res) => {
  req.on('data', (chunk) => {
    console.log(chunk.toString('utf8'));
    appendOrModifyObjectInArray(data,JSON.parse(chunk.toString('utf8')));
    writeJSONData(JSONStorageFile);
  });
  return res.send("received post\n");
});
app.delete('/', (req, res) => {
  req.on('data', (chunk) => {
    console.log(chunk.toString('utf8'));
    deleteObjectIfExists(data, JSON.parse(chunk.toString('utf8')));
  });
  return res.send("received delete\n");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})