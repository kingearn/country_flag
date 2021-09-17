const Crawler = require('crawler');
const fs = require('fs');
const { pinyin } = require('pinyin-pro');

let rawData = fs.readFileSync("country.json");
let object = JSON.parse(rawData);
// let countryArray =[]
// for (const key in object) {
//     if (Object.hasOwnProperty.call(object, key)) {
//         const element = object[key];
//         countryArray =  countryArray.concat(element)
//     }
// }
let countryArray = [];
for (const [key, value] of Object.entries(object)) {
    countryArray =  [...countryArray, ...value]
}


const c = new Crawler({
    encoding: null,
    rateLimit: 10000,
    jQuery: false,// set false to suppress warning message.
    headers: {
        'User-Agent':`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36`//,
    },
    callback: (err, res, done) => {
        if (err) {
            console.error(err.stack);
        } else {
            fs.createWriteStream(res.options.filename).write(res.body);
        }

        done();
    }
});

for (let i = 0; i < countryArray.length; i++) {
    
    const country = countryArray[i];
    const fileName = pinyin(country.C, { toneType: 'none' }).replaceAll(" ", "") + ".png";
    const saveAs = "download/" + i + "." + fileName;
    fs.access(saveAs, fs.constants.F_OK, (err) => {
        
        if(err){
            let downloadUrl = "https://img-picdown.ivsky.com/img/tupian/pic/201010/06/"+fileName+"?download"
            console.info(i+"."+countryArray[i].C + " : ", downloadUrl)
            c.queue({
                uri: downloadUrl,
                filename: saveAs
            });
        }else{
            console.log(`${fileName} ${'已存在'}`);
        }
    });
    
}

