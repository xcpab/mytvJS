const _0x48d8 = ['apply', 'constructor', 'return\x20/\x22\x20+\x20this\x20+\x20\x22/', 'split', 'forEach', 'User-Agent:\x20okhttp/3.11.0', 'Content-Type:\x20application/json', 'Content-Type:\x20application/x-www-form-urlencoded', 'sign', 'get', 'data', 'url', 'success', 'body', 'mediaAsset', 'id', 'token', 'POST', 'setCache', 'getCache', 'opensslEncrypt'];
const _0x1299 = function(_0x48d880, _0x12994c) {
    _0x48d880 = _0x48d880 - 0x0;
    let _0x6114c8 = _0x48d8[_0x48d880];
    return _0x6114c8;
};

function parseItem(_0x53c2c1) {
    const _0x1318a4 = {};
    if (!_0x53c2c1) return _0x1318a4;
    _0x53c2c1['split']('&')['forEach'](_0x296f3b => {
        const [_0x52cd66, _0x1c0c7e] = _0x296f3b['split']('=');
        if (_0x52cd66) _0x1318a4[_0x52cd66] = _0x1c0c7e;
    });
    return _0x1318a4;
}

function main(_0x3e1db6) {
    const { id: _0x334dba } = parseItem(_0x3e1db6);
    const _0xa080c8 = _0x334dba || 'btv4k';
    
    // 频道映射表
    const _0x21cb05 = {
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
    if (_0xa080c8 == "list") {
        const _0x92a547 = _0x3e1db6.split('?')[0];
        let _0x143719 = "#EXTM3U\n";
        for (const _0x224e36 in _0x21cb05) {
            const _0x5d0f14 = {
                'btv4k': '北京卫视4K',
                'sh4k': '上海卫视4K',
                'js4k': '江苏卫视4K',
                'zj4k': '浙江卫视4K',
                'sd4k': '山东卫视4K',
                'hn4k': '湖南卫视4K',
                'gd4k': '广东卫视4K',
                'sc4k': '四川卫视4K',
                'sz4k': '深圳卫视4K'
            }[_0x224e36];
            _0x143719 += "#EXTINF:-1," + _0x5d0f14 + "\n";
            _0x143719 += _0x92a547 + "?id=" + _0x224e36 + "\n";
        }
        return _0x143719;
    }

    // 生成签名函数
    function makeSign(_0x2b8f9a, _0x3a7e8d, _0x5c8e12, _0x1f7c6e) {
        const _0x4d3e80 = { url: _0x2b8f9a, params: _0x3a7e8d, time: _0x5c8e12 };
        const _0x23e16c = JSON.stringify(_0x4d3e80);
        // 使用AES-256-ECB加密
        const _0x37cbd8 = mytv.opensslEncrypt(_0x23e16c, "AES-256-ECB", _0x1f7c6e, 0, "");
        return _0x37cbd8.replace(/[\r\n]/g, '');
    }

    const _0x37cbd8 = '01234567890123450123456789012345';
    const _0x92a5471 = 'https://api.chinaaudiovisual.cn/web/user/getVisitor';
    const _0x92a5472 = 'https://api.chinaaudiovisual.cn/column/getColumnAllList';

    // 获取token（使用缓存）
    let _0x23e16c = mytv.getCache('visitor_token');
    if (!_0x23e16c) {
        const _0x4d3e80 = Date.now();
        const _0x143719 = makeSign(_0x92a5471, '', _0x4d3e80, _0x37cbd8);
        const _0x224e36 = {
            'Content-Type': 'application/json',
            'headers': '1.1.3',
            'sign': _0x143719
        };
        
        const _0x5d0f14 = mytv.request(_0x92a5471, {
            method: 'POST',
            headers: _0x224e36,
            body: ''
        });
        
        if (!_0x5d0f14 || !_0x5d0f14.body) {
            return '';
        }
        
        let _0x183a5e;
        try {
            _0x183a5e = JSON.parse(_0x5d0f14.body);
        } catch (_0x2b8f9a) {
            return '';
        }
        
        if (!_0x183a5e.success || !_0x183a5e.data || !_0x183a5e.data.token) {
            return '';
        }
        
        _0x23e16c = _0x183a5e.data.token;
        mytv.setCache('visitor_token', _0x23e16c, 86400000);
    }

    // 获取频道列表（使用缓存）
    let _0x53c2c1 = mytv.getCache('column_all_list_33');
    let _0x1318a4;
    if (_0x53c2c1) {
        try {
            _0x1318a4 = JSON.parse(_0x53c2c1);
        } catch (_0x296f3b) {
            _0x1318a4 = null;
        }
    }
   
    if (!_0x1318a4) {
        const _0x52cd66 = 350;
        const _0x1c0c7e = 0;
        const _0x3180e9 = 0;
        const _0x4a275d = "1.1.4";
        const _0x53bb5f = "cityId=" + _0x1c0c7e + "&columnId=" + _0x52cd66 + "&provinceId=" + _0x3180e9 + "&token=" + encodeURIComponent(_0x23e16c) + "&version=" + _0x4a275d;
        const _0x399e5f = Date.now();
        const _0x6114c8 = makeSign(_0x92a5472, _0x53bb5f, _0x399e5f, _0x37cbd8);
        const _0xe81c55 = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'okhttp/3.11.0',
            'sign': _0x6114c8
        };
        
        const _0x154862 = mytv.request(_0x92a5472, {
            method: 'POST',
            headers: _0xe81c55,
            body: _0x53bb5f
        });
        
        if (!_0x154862 || !_0x154862.body) {
            return '';
        }
        
        try {
            _0x1318a4 = JSON.parse(_0x154862.body);
        } catch (_0x1d3dbf) {
            return '';
        }
        
        if (!_0x1318a4.success) {
            return '';
        }
        
        mytv.setCache('column_all_list_33', JSON.stringify(_0x1318a4), 600000);
    }

    // 查找播放地址
    const _0x1d3dbf = _0x21cb05[_0xa080c8] || 91417;
    let _0x2b8f9a = null;
   
    if (_0x1318a4 && _0x1318a4.data && Array.isArray(_0x1318a4.data)) {
        for (let _0x3a7e8d = 0; _0x3a7e8d < _0x1318a4.data.length; _0x3a7e8d++) {
            const _0x5c8e12 = _0x1318a4.data[_0x3a7e8d];
            if (_0x5c8e12.mediaAsset && _0x5c8e12.mediaAsset.id === _0x1d3dbf) {
                _0x2b8f9a = _0x5c8e12.mediaAsset.url;
                break;
            }
        }
    }

    // 返回播放地址
    if (_0x2b8f9a) {
        return JSON.stringify({
            url: _0x2b8f9a,
            headers: {
                'User-Agent': 'aliplayer',
                'Referer': 'https://api.chinaaudiovisual.cn/'
            }
        });
    }
   
    return '';
}
