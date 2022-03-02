const fs = require('fs');
const express = require('express');
const app = express();
const port = 8081;

app.get('/', (req, res) => {
  try {
    fs.readFileSync("test.json");
    
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      console.log("file not found");
    }
  }
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})