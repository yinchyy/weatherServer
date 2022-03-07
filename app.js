const fs = require('fs');
const express = require('express');
const app = express();
const port = 8081;
const weather = require("./weather.js");
let data = new Array();

data.push(new weather("Warsaw", 25.6, 35, 1000));
console.log(JSON.stringify(data[0]));
app.get('/', (req, res) => {
  try {
    fs.readFileSync("test.json");    
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      console.log("file not found");

      fs.appendFileSync("data.json","");
    }
  }
  res.send(`${JSON.stringify(data[0])}`);
})

app.post('/', (req, res) => {
  req.on('data', (chunk) => {
    console.log(chunk.toString('utf8'));
  });

  res.send("received post\n");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})