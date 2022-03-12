const { expect } = require('@jest/globals');
const { getJSONData, writeJSONData, isObjectIntegral } = require('./app.js');
const fs = require('fs');
const weather = require("./weather.js");

test("getJSONData should return content of file, if it doesn't exist, then create it with empty json", () => {
    expect(getJSONData("data.json")).toEqual(fs.readFileSync("data.json")); 
});

test("writeJSONData should overwrite file with stringified JSON from parameter", () => {
    expect(writeJSONData(new weather("Warsaw", 15, 25, 1012), "test.json")).toEqual(fs.readFileSync("test.json"));
});
test("isObjectIntegral should return false if object doesn't have required fields", () => {
    expect(isObjectIntegral(["location", "temperature"], { "location": "Warsaw", "humidity": 21 })).toEqual(false);
});
