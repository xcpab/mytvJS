
# Template
```
function generateAuthorization(videoPath) {
    const AUTHORIZATION_TV_KEY = "key";
    const currentTimeMillis = Date.now();
    const md5Part = CryptoJS.MD5(AUTHORIZATION_TV_KEY + currentTimeMillis).toString();
    const uuidArray = [];
    for (let i = 0; i < 16; i++) {
        uuidArray.push(Math.floor(Math.random() * 256));
    }
    const uuidPart = uuidArray.map(b => ('0' + b.toString(16)).slice(-2)).join('').toUpperCase();
    const authorization = md5Part + currentTimeMillis + uuidPart;
    const sep = videoPath.includes('?') ? '&' : '?';
    return videoPath + sep + 'Authorization=' + authorization;
}

function main(paramstr) {
   const response = mytv.fetch("http://btv8kappvms.interway.com.cn");
   const data = JSON.parse(response);
   const videoPath = data.data.flv_url;
   return generateAuthorization(videoPath);
}
```