const fs = require('fs');
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const port = 8081;
const weather = require("./weather.js");
const { json } = require('express/lib/response');
const JSONStorageFile = "./data.json";
const data = JSON.parse(getJSONData(JSONStorageFile).toString('utf-8'));
const requiredParameters = ["location", "temperature", "humidity", "pressure"];

app.use(bodyParser.json());

appendOrModifyObjectInArray(data,new weather("Warsaw", 25.6, 35, 1000));
appendOrModifyObjectInArray(data,new weather("Poznan", 25.6, 35, 1000));

writeJSONData(data,JSONStorageFile);

function getJSONData(file) {
  try {
    return fs.readFileSync(file);
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      console.log(`file in location: "${file}" not found, creating...`); 
      fs.appendFileSync(file, "[]");
      return fs.readFileSync(file);
    }
  }  
}
function writeJSONData(Arr,file) {
  fs.writeFileSync(file, JSON.stringify(Arr));
  return fs.readFileSync(file);
}
function appendOrModifyObjectInArray(dataArr, obj) {
  const elemIndex = dataArr.findIndex((e) => e.location === obj.location);
  if (elemIndex != -1) {
    for (let key of Object.keys(dataArr[elemIndex])) {
      dataArr[elemIndex][key] = obj[key];
    }
  }
  else {
    data.push(obj);
  }
  writeJSONData(data,JSONStorageFile);
}
function deleteObjectIfExists(dataArr, obj) {
  const elemIndex = dataArr.findIndex((e) => e.location === obj.location);
  if (elemIndex != -1) {
    dataArr.splice(elemIndex, 1);
    console.log("deleted");
    writeJSONData(data,JSONStorageFile);
  }
  else {
    console.log("requested object doesn't exist");
  }
}
function isObjectIntegral(requiredParameters,obj) {
  for (let key of requiredParameters) {
    if (Object.keys(obj).findIndex((k) => key === k) === -1) {
      return false;
    }
  }
  return true;
}
app.get('/', (req, res) => {
  res.send(data);
});
app.post('/', (req, res) => {
  console.log(req.body);
    if (!isObjectIntegral(requiredParameters,req.body)) {
      return res.status(500).send({
        error: `data should be sent in JSON format and contain fields: ${requiredParameters}. Check it and try again.`
     });
    }
    else { 
      appendOrModifyObjectInArray(data,req.body);
      writeJSONData(data,JSONStorageFile);
    }
  return res.send(`received post request of ${req.body.location}\n`);
});
app.delete('/', (req, res) => {
  console.log(req.body);
  deleteObjectIfExists(data,req.body);
  return res.send(`received delete request of ${req.body.location}\n`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = {
  getJSONData,
  writeJSONData,
  isObjectIntegral
};