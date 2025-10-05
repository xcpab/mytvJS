//********ku9 js使用示例(适合1.3.4及以上版本使用)********//

//识别名称main
function main( item ) {

    //获取地址和参数
    const url = item.url;
    var id = ku9.getQuery( url, "id" ) || "btv4k";

    // 频道映射表
    var channelMap = {
        'btv4k': 91417,
        'sh4k': 96050,
        'js4k': 95925,
        'zj4k': 96039,
        'sd4k': 95975,
        'hn4k': 96038,
        'gd4k': 93733,
        'sc4k': 95965,
        'sz4k': 93735,
    };

    // 如果是list请求，返回频道列表
    if (id == "list") {
        var baseUrl = url.split('?')[0];
        var content = "#EXTM3U\n";
        for (var cid in channelMap) {
            var channelName = {
                'btv4k': '北京卫视4K',
                'sh4k': '上海卫视4K',
                'js4k': '江苏卫视4K',
                'zj4k': '浙江卫视4K',
                'sd4k': '山东卫视4K',
                'hn4k': '湖南卫视4K',
                'gd4k': '广东卫视4K',
                'sc4k': '四川卫视4K',
                'sz4k': '深圳卫视4K'
            }[cid];
            content += "#EXTINF:-1," + channelName + "\n";
            content += baseUrl + "?id=" + cid + "\n";
        }
        return { m3u8: content };
    }

    // 生成签名函数
    function makeSign(url, params, timeMillis, key) {
        var payload = {url: url, params: params, time: timeMillis};
        var json = JSON.stringify(payload);
        // 使用AES-256-ECB加密
        var encrypted = ku9.opensslEncrypt(json, "AES-256-ECB", key, 0, "");
        return encrypted.replace(/[\r\n]/g, '');
    }

    var key = '01234567890123450123456789012345';
    var url1 = 'https://api.chinaaudiovisual.cn/web/user/getVisitor';
    var url2 = 'https://api.chinaaudiovisual.cn/column/getColumnAllList';

    // 获取token（使用缓存）
    var token = ku9.getCache('visitor_token');
    if (!token) {
        var time1 = Date.now();
        var sign1 = makeSign(url1, '', time1, key);
        var headers1 = {
            'Content-Type': 'application/json',
            'headers': '1.1.3',
            'sign': sign1
        };
        
        var res1 = ku9.request(url1, "POST", headers1, "", true);
        if (res1.code !== 200) {
            return { url: "" };
        }
        
        var data1;
        try {
            data1 = JSON.parse(res1.body);
        } catch (e) {
            return { url: "" };
        }
        
        if (!data1.success || !data1.data || !data1.data.token) {
            return { url: "" };
        }
        
        token = data1.data.token;
        ku9.setCache('visitor_token', token, 86400000);
    }

    // 获取频道列表（使用缓存）
    var cacheData = ku9.getCache('column_all_list_33');
    var dataArr;
    if (cacheData) {
        try {
            dataArr = JSON.parse(cacheData);
        } catch (e) {
            dataArr = null;
        }
    }
   
    if (!dataArr) {
        var columnId = 350;
        var cityId = 0;
        var provinceId = 0;
        var version = "1.1.4";
        var params = "cityId=" + cityId + "&columnId=" + columnId + "&provinceId=" + provinceId + "&token=" + encodeURIComponent(token) + "&version=" + version;
        var time2 = Date.now();
        var sign2 = makeSign(url2, params, time2, key);
        var headers2 = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'okhttp/3.11.0',
            'sign': sign2
        };
        
        var res2 = ku9.request(url2, "POST", headers2, params, true);
        if (res2.code !== 200) {
            return { url: "" };
        }
        
        try {
            dataArr = JSON.parse(res2.body);
        } catch (e) {
            return { url: "" };
        }
        
        if (!dataArr.success) {
            return { url: "" };
        }
        
        ku9.setCache('column_all_list_33', JSON.stringify(dataArr), 600000);
    }

    // 查找播放地址
    var targetId = channelMap[id];
    var playUrl = null;
   
    if (dataArr && dataArr.data && Array.isArray(dataArr.data)) {
        for (var i = 0; i < dataArr.data.length; i++) {
            var itemData = dataArr.data[i];
            if (itemData.mediaAsset && itemData.mediaAsset.id === targetId) {
                playUrl = itemData.mediaAsset.url;
                break;
            }
        }
    }

    // 直接返回播放地址，不进行任何切片代理
    if (playUrl) {
        return {
            url: playUrl,
            headers: {
                'User-Agent': 'aliplayer',
                'Referer': 'https://api.chinaaudiovisual.cn/'
            }
        };
    }
   
    return { url: "" };
}

