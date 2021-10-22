#!/usr/bin/env node
const fs = require('fs');
const { pinyin } = require('pinyin-pro');
const axios = require("axios");

let rawData = fs.readFileSync("country.json");
let object = JSON.parse(rawData);
let countryArray =[]
for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
        const element = object[key];
        countryArray =  countryArray.concat(element)
    }
}
for (let i = 0; i < countryArray.length; i++) {
    let countryArrayElement = countryArray[i];
    let collection = {"index":i,"countryCode": countryArrayElement["N"], "countryNameCN":countryArrayElement["C"], "countryNameAbbreviate":countryArrayElement["B"]}
    const fileName = prefixIntrger(i, 3) + "." + pinyin(countryArrayElement["C"], { toneType: 'none' }).replaceAll(" ", "") + ".png";
    const saveAs = "download/" + fileName;
    // console.log("mv ", i +"."+ pinyin(countryArrayElement["C"], { toneType: 'none' }).replaceAll(" ", "") + ".png "+fileName)
    fs.access(saveAs, fs.constants.F_OK, (err) => {
        if(err){
            console.log(`${fileName} ${'不存在'}`);
        }else{
            collection["countryFlagUrl"]= "https://style.chemball.com/static/common/country/flag/" + fileName
        }
        console.log(collection)

        domain = "https://api.chemball.com";
        // domain = "http://localhost:4000";
        axios.post(domain + "/api/collection/save/common/country", {"body":collection, filter:{"index":i }})
        .then(function (response) {
            //console.log(response.data);
        })
        .catch(function (error) {
            console.log("axios Error: ", error.response);
        });
    });
}

function prefixIntrger(num,length){
    return (Array(length).join(`0`)+num).slice(-length);
}