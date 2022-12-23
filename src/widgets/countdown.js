const { start } = require('repl')

const countdown = Vue.extend(
{
    template: `
        <div class="card0 countdownbase" @click="load">
            <span class="text-overflow countdown-title">距离 {{app.rule}} 还剩</span>
            <div class="countdown-infobox">
                <span class="countdown-daynum">{{app.day}}</span>
                <span class="countdown-day">天</span>
            </div>
            <span class="countdown-date">{{app.date}}</span>
        </div>
            `,
    data()
    {
        return {
            // data
            app:
            {
                rule: '某件事',
                day: 0,
                date: '结束时间'
            },
        }
    },
    mounted()
    {
        this.load()
    },
    methods:
    {
        load()
        {
            const { join } = require('path')
            const { readFileSync } = require('fs')
            const file = join(__dirname, 'data/countdown.json')
            var parse = JSON.parse(readFileSync(file, 'utf-8'))
            this.app.rule = parse.activity
            var date = parse.date
            this.app.date = date[0] + '年' + date[1] + '月' + date[2] + '日'
            var mon = new Date().getMonth() + 1
            var day = new Date().getDate()
            var nowDate = new Date().getFullYear() + '-' + (mon < 10 ? "0" + mon : mon) + '-' + (day < 10 ? "0" + day : day)
            var target = date[0] + '-' + date[1] + '-' + date[2]
            this.getDaysBetween(nowDate, target)
        },
        getDaysBetween(date1, date2)
        {
            var startDate = Date.parse(date1);
            var endDate = Date.parse(date2);
            if (startDate >= endDate)
            {
                this.app.day = 0
                var option = {
                    title: 'DWidgets',
                    body: '今天是: ' + parse.activity
                }
                new window.Notification(option.title, option)
            }
            if (startDate == endDate)
            {
                this.app.day = 1;
            }
            var days = Math.round((endDate - startDate) / (1 * 24 * 60 * 60 * 1000))
            this.app.day = days
        }
    },
})