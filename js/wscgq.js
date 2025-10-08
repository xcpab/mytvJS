function main(paramstr) {
    // 解析参数
    const params = {};
    if (paramstr) {
        paramstr.split('&').forEach(item => {
            const [key, value] = item.split('=');
            if (key) params[key] = value;
        });
    }
    
    const id = params.id || 'btv4k';
    
    // 频道映射表
    const channelMap = {
        'btv4k': 91417,
        'sh4k': 96050,
        'js4k': 95925,
        'zj4k': 96039,
        'sd4k': 95975,
        'hn4k': 96038,
        'gd4k': 93733,
        'sc4k': 95965,
        'sz4k': 93735
    };

    // 如果是list请求，返回频道列表
    if (id == "list") {
        const baseUrl = paramstr.split('?')[0];
        let content = "#EXTM3U\n";
        for (const cid in channelMap) {
            const channelName = {
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
        return content;
    }

    // 生成签名函数
    function makeSign(url, params, timeMillis, key) {
        const payload = {url: url, params: params, time: timeMillis};
        const json = JSON.stringify(payload);
        // 使用AES-256-ECB加密
        const encrypted = mytv.opensslEncrypt(json, "AES-256-ECB", key, 0, "");
        return encrypted.replace(/[\r\n]/g, '');
    }

    const key = '01234567890123450123456789012345';
    const url1 = 'https://api.chinaaudiovisual.cn/web/user/getVisitor';
    const url2 = 'https://api.chinaaudiovisual.cn/column/getColumnAllList';

    // 获取token
    let token = mytv.getCache('visitor_token');
    if (!token) {
        const time1 = Date.now();
        const sign1 = makeSign(url1, '', time1, key);
        const headers1 = [
            'Content-Type: application/json',
            'headers: 1.1.3',
            'sign: ' + sign1
        ];
        
        const res1 = mytv.post(url1, headers1, '');
        if (!res1) {
            return JSON.stringify({ url: "" });
        }
        
        let data1;
        try {
            data1 = JSON.parse(res1);
        } catch (e) {
            return JSON.stringify({ url: "" });
        }
        
        if (!data1.success || !data1.data || !data1.data.token) {
            return JSON.stringify({ url: "" });
        }
        
        token = data1.data.token;
        mytv.setCache('visitor_token', token, 86400000);
    }

    // 获取频道列表
    let cacheData = mytv.getCache('column_all_list_33');
    let dataArr;
    if (cacheData) {
        try {
            dataArr = JSON.parse(cacheData);
        } catch (e) {
            dataArr = null;
        }
    }
   
    if (!dataArr) {
        const columnId = 350;
        const cityId = 0;
        const provinceId = 0;
        const version = "1.1.4";
        const postParams = "cityId=" + cityId + "&columnId=" + columnId + "&provinceId=" + provinceId + "&token=" + encodeURIComponent(token) + "&version=" + version;
        const time2 = Date.now();
        const sign2 = makeSign(url2, postParams, time2, key);
        const headers2 = [
            'Content-Type: application/x-www-form-urlencoded',
            'User-Agent: okhttp/3.11.0',
            'sign: ' + sign2
        ];
        
        const res2 = mytv.post(url2, headers2, postParams);
        if (!res2) {
            return JSON.stringify({ url: "" });
        }
        
        try {
            dataArr = JSON.parse(res2);
        } catch (e) {
            return JSON.stringify({ url: "" });
        }
        
        if (!dataArr.success) {
            return JSON.stringify({ url: "" });
        }
        
        mytv.setCache('column_all_list_33', JSON.stringify(dataArr), 600000);
    }

    // 查找播放地址
    const targetId = channelMap[id];
    let playUrl = null;
   
    if (dataArr && dataArr.data && Array.isArray(dataArr.data)) {
        for (let i = 0; i < dataArr.data.length; i++) {
            const itemData = dataArr.data[i];
            if (itemData.mediaAsset && itemData.mediaAsset.id === targetId) {
                playUrl = itemData.mediaAsset.url;
                break;
            }
        }
    }

    // 返回播放地址
    if (playUrl) {
        return JSON.stringify({
            url: playUrl,
            headers: {
                'User-Agent': 'aliplayer',
                'Referer': 'https://api.chinaaudiovisual.cn/'
            }
        });
    }
   
    return JSON.stringify({ url: "" });
}
