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

userAgentArray =[
    `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36`,
    `Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50`,
    `Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0;`,
    `Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)`,
    `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)`,
    `Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv,2.0.1) Gecko/20100101 Firefox/4.0.1`,
    `Mozilla/5.0 (Windows NT 6.1; rv,2.0.1) Gecko/20100101 Firefox/4.0.1`,
    `Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11`,
    `Opera/9.80 (Windows NT 6.1; U; en) Presto/2.8.131 Version/11.11`,
    `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11`,
    `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)`,
    `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)`,
    `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; The World)`,
    `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SE 2.X MetaSr 1.0; SE 2.X MetaSr 1.0; .NET CLR 2.0.50727; SE 2.X MetaSr 1.0)`,
    `Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)`
]

const c = new Crawler({
    encoding: null,
    rateLimit: 10000,
    rotateUA: true,
    userAgent: userAgentArray,
    jQuery: false,// set false to suppress warning message.
    preRequest: (options, done) => {
        // 'options' here is not the 'options' you pass to 'c.queue', instead, it's the options that is going to be passed to 'request' module
        console.log(options);
    	// when done is called, the request will start
    	done();
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

