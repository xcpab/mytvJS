支持QuickJS基础功能，集成了CryptoJS库（见下方模板）。

你需要实现main函数，paramstr为截断的 http://xxx/xxx/xxx.js?aaaa ?后的所有内容(aaaa)。

返回为json格式的字符串，url代表实际播放地址，headers为请求头。

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
   const url = generateAuthorization(videoPath);
   return JSON.stringify({ url });
}
```

# 网络请求

## get

```
const headers = [
    'Content-Type: application/json'
];
const body = mytv.get(url, headers);
```

## post

```
const headers = [
    'Content-Type: application/json'
];
const post_body = JSON.stringify({
    code: prefix,
    keep_alive: false,
    password: pwd,
    phone: user
});
const body = mytv.post(url, headers, post_body);
```

## fetch
```
const body = mytv.fetch(url);
```

## request

```
const response = mytv.request(url, method,headers,body)
const body = response.body;
```
- url为链接（不可空）
- method为GET或POST（默认GET）
- headers为请求头数组（如['Accept: application/json, text/javascript, */*; q=0.01']）
- body为POST请求体
  
- 返回响应对象，包括body，code，headers，message四个属性
## 存储文件

```
// 判断文件存在
mytv.fileExists(fileName, timeOut) -> Boolean

//读取文件
const contentStr = mytv.readFile(filename);

//写入文件
mytv.writeFile(filename, contentStr);

```

# 提示词

以下提示词可供在使用AI编写时参考：
```
基于提供的代码，将其转为mytv上可用的js格式，它支持基本的js格式，额外的API如下：
程序的入口是main函数，参数为url的查询字符串，你可以通过内置的parseItems函数将参数提取为对象，如：
function main(item) {
    const { id } = parseItema(item); //第一种
    const items = parseItems(item); //第二种
    items.id; //可以直接使用
}
返回JSON字符串，属性包括：
url，字符串，为可播放的地址
error，字符串，为错误信息，没有错误时不传值
headers，字符串，为请求头，不需要指定时不传值。例如：
function main(item) {
    const { url } = parseItems(item);
    const headers = ['Accept: application/json, text/javascript, */*; q=0.01'].join('\n');
    return JSON.stringify({ url: url, headers: headers });
}
支持直接通过CryptoJS库进行加密解密操作，例如：
const signMd5 = CryptoJS.MD5(signMd5Str).toString(); //md5加密
最后，支持如下内置函数：
mytv.log(msg) //打印日志
mytv.fetch(url) //发起网络请求，返回响应文本
mytv.request(url, method,headers,body) //发起网络请求，url为链接（不可空），method为GET或POST（默认GET），headers为请求头数组（如['Accept: application/json, text/javascript, */*; q=0.01']），body为POST请求体,返回响应对象，包括body，code，headers，message四个属性
mytv.post(url,headers,body) //发起POST请求，参数同上，返回响应body
mytv.get(url,headers) //发起GET请求，参数同上，返回响应body
mytv.fileExists(path, timeOut) //判断缓存文件是否存在,timeOut为可选参数，单位毫秒，表示文件自上次修改以来的最大有效时间，超过该时间则视为不存在，返回布尔值
mytv.readFile(path) //读取缓存文件，返回文件内容字符串
mytv.writeFile(path,content) //写入缓存文件，path为文件路径，content为文件内容字符串，返回布尔值
mytv.Uri(url) //解析url，返回对象，包括Scheme,SchemeSpecificPart,Authority,RawUserInfo,Host,Port,Path,Query,Fragment属性
```