const { getServers } = require('dns')

const bilicard = Vue.extend(
{
    template: `
    <div class="card1 bilicardbase" @click="getData" @contextmenu.prevent="login">
        <div class="bilicard-head" :style="topimage">
            <img class="bilicard-face" :src="user.face">
                <div>
                    <h2 class="text-overflow">{{user.name}}</h2>
                    <span class="text-overflow">{{user.sign}}</span>
                </div>
            <img class="bilicard-lv" :src="user.lv">
        </div>
        <div class="bilicard-foot">
            <span>粉丝</span>
            <span>关注</span>
            <span>获赞</span>
            <span>文章</span>
            <h3>{{user.data.fans}}</h3>
            <h3>{{user.data.attention}}</h3>
            <h3>{{user.data.like}}</h3>
            <h3>{{user.data.article}}</h3>
        </div>
    </div>`,
    data()
    {
        return {
            topimage: 'background: url("./assets/image/bilibili/head/1.webp");',
            islogin: false,
            user:
            {
                name: '未登录',
                sign: '右键点击卡片登录吧!',
                face: './assets/image/bilibili/tv.png',
                lv: './assets/image/bilibili/lv0.png',
                data:
                {
                    fans: 0,
                    like: 0,
                    attention: 0,
                    article: 0
                }
            }
        }
    },
    mounted()
    {
        this.loop()
    },
    methods:
    {
        loop()
        {
            this.getData()
            this.changeTopimage()
            setInterval(() =>
            {
                if (this.islogin == true)
                {
                    this.getData()
                }
                this.changeTopimage()
            }, 300000);
        },
        login()
        {
            const { readFileSync, writeFile, write } = require('fs')
            const { join } = require('path')
            const settings = join(__dirname, 'data/settings.json')
            var tip = {
                title: 'DWidgets',
                body: '登录完毕后关闭窗口即可'
            }
            new window.Notification(tip.title, tip)
            ipcRenderer.send('cookies', '')
            ipcRenderer.on('cookie_data', (event, data) =>
            {
                var getSettings = JSON.parse(readFileSync(settings, 'utf-8'))
                var sessdata = data.filter((item) =>
                {
                    return (item.name == 'SESSDATA')
                })
                var mid = data.filter((item) =>
                {
                    return (item.name == 'DedeUserID')
                })
                var userData = {
                    "mid": mid[0].value,
                    "sessdata": sessdata[0].value
                }
                getSettings.bilibili = userData
                writeFile(settings, JSON.stringify(getSettings), (err) =>
                {
                    if (!err)
                    {
                        var loginSuccess = {
                            title: 'DWidgets',
                            body: '登录成功!\n登录信息已保存在: ' + settings
                        }
                        new window.Notification(loginSuccess.title, loginSuccess)
                        this.getData()
                    }
                })
            })
        },
        getData()
        {
            const { readFileSync } = require('fs')
            const { join } = require('path')
            const axios = require('axios')
            const settings = join(__dirname, 'data/settings.json')
            var user = JSON.parse(readFileSync(settings, 'utf-8')).bilibili
            if (user.sessdata != '' && user.mid != '')
            {
                axios.get('http://api.bilibili.com/x/web-interface/card?mid=' + user.mid,
                    {
                        header:
                        {
                            'content-type': 'application/x-www-form-urlencoded',
                            'Cookie': +user.sessdata,
                        }
                    })
                    .then((res) =>
                    {
                        var data = res.data.data
                        var card = {
                            name: data.card.name,
                            sign: data.card.sign,
                            face: data.card.face,
                            lv: './assets/image/bilibili/lv' + data.card.level_info.current_level + '.png',
                            data:
                            {
                                fans: data.card.fans,
                                like: data.like_num,
                                attention: data.card.friend,
                                article: data.card.article
                            }
                        }
                        this.user = card
                        this.islogin = true
                    })
            }
            // else
            // {
            //     var loginfail = {
            //         title: 'DWidgets',
            //         body: 'SESSDATA或DedeUserID为空, 请尝试重新登录!'
            //     }
            //     new window.Notification(loginfail.title, loginfail)
            // }
        },
        changeTopimage()
        {
            let timeNow = new Date();
            let hours = timeNow.getHours();
            if (hours >= 0 && hours <= 14)
            {
                this.topimage = 'background: url("./assets/image/bilibili/head/1.webp");'
            }
            else if (hours > 14 && hours <= 18)
            {
                this.topimage = 'background: url("./assets/image/bilibili/head/2.webp");'
            }
            else if (hours > 18 && hours <= 24)
            {
                this.topimage = 'background: url("./assets/image/bilibili/head/3.webp");'
            }
        }
    },
})