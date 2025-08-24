function main(item) {

    // sctv映射表（name -> live_id）
    const sichuanChannels = {
        'scws': 'sctv18f9fb5888dedbe0c6a1b',
        'scxw': 'sctv48f9fb5888dedbe0c6a1b',
        'scjj': 'sctv28f9fb5888dedbe0c6a1b',
        'scwh': 'sctv38f9fb5888dedbe0c6a1b',
        'scys': 'sctv58f9fb5888dedbe0c6a1b',
        'scfn': 'sctv78f9fb5888dedbe0c6a1b',
        'scgw': 'sctv68f9fb5888dedbe0c6a1b',
        'scxc': 'sctv98f9fb5888dedbe0c6a1b',
        'kbws': 'kangba8f9fb5888dedbe0c6a1b'
    };

    // 获取ID参数
    const id = ku9.getQuery(item.url, "id");
    
    // 检查四川频道映射表
    if (sichuanChannels.hasOwnProperty(id)) {
        const live_id = sichuanChannels[id];
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const streamName = `/hdlive/${live_id}/1.m3u8`;
        
        // 构建鉴权API URL
        const authApiUrl = `https://gw.scgchc.com/app/v1/anti/getLiveSecret?streamName=${encodeURIComponent(streamName)}&txTime=${currentTimestamp}`;
        
        // 请求鉴权API的headers
        const authHeaders = {
            'User-Agent': 'si chuan guan cha/8.4.0 (iPhone; iOS 15.8.2; Scale/2.00)',
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiU0VSVklDRV9TQ0dDLURFTU8iXSwidXNlcl9pZCI6MTk0NDA3Mzg5OTk5NjgxNTM2MSwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTc1NjYwMDQzOCwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BUFBfQ0xJRU5UX1VTRVIiXSwianRpIjoiNDc0MWVkZDEtYWU3YS00NGJmLTg3MGYtZTliNDcyY2YyODNiIiwiY2xpZW50X2lkIjoiU0VSVklDRV9TQ0dDLUFQUCJ9.f0Yru7OGLykML1nUrm1aTB-2_KyUICwIa7m1Xtm1pOUKSLlMy2QamJJ63YqJ31qo6M9RreMD3nrTB2o2bfiHn8U5dMcN_9DInp4kHIcwJrANj0q5YJa5disVks0goLZEnnwGKzuWiA_HIQIyMhUfwKfL3aAlxYNkbLzihU_4B3MwrSWFGXtMrkFjeC1upHOtapPUu4UV1bClh14Zq_ZFCi9I80J9RtMjo9-QXUF9VHzAYVIrO3LoXmAiHoGQerPnzmteqj45Ha_iMUdD4F8TdBKqBUGaqtXTksglJVlhKgOA1s7oCzo8gkm1MoqnY2l-WN1-k0blXfzRUzH2oQOSJA'
        };

        // 发送鉴权请求
        const authResponse = ku9.get(authApiUrl, authHeaders);
        
        if (authResponse) {
            try {
                const data = JSON.parse(authResponse);
                if (data && data.data && data.data.secret) {
                    // 提取auth_key
                    const secret = data.data.secret;
                    const authKey = secret.split('auth_key=')[1].split('&')[0];
                    
                    // 构建播放URL
                    const playUrl = `https://tvshow.scgchc.com/hdlive/${live_id}/1.m3u8?auth_key=${authKey}`;
                    
                    return {
                        url: playUrl,
                        headers: {
                            'Referer': 'https://scgc.video.play/',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                        }
                    };
                }
            } catch (e) {
                // JSON解析失败处理
            }
        }
        
        // 鉴权失败时返回默认视频
        return {
            url: 'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-720p.mp4',
            headers: {
                'Referer': 'https://www.sctv.com/'
            }
        };
    }
    
}