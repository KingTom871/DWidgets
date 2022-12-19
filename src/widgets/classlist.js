const classlist = Vue.extend(
{
    template: `
    <div class="card2" @click="init">
        <div class="classlist-menu">
            <h4 style="margin:6.5px 10px">| 课程表</h4>
            <div></div>
            <span>今天/星期{{today}}</span>
        </div>
        <hr>
        <div class="classlist-list">
            <div class="classlist-item" v-for="(item, index) in list" :key="index">
                <span style="border-right:1px solid #E2E9E3">{{item.start}}</span>
                <h3>{{item.subject}}</h3>
                <span style="border-right:1px solid #E2E9E3">{{item.end}}</span>
                <span>{{item.teach}}</span>
            </div>
        </div>
    </div>
    `,
    data()
    {
        return {
            today: "",
            list: [
                // {"subject":"语文", "teach":"王老师", "start":"9:00", "end":"10:00"}
            ]
        }
    },
    mounted()
    {
        this.init()
    },
    methods:
    {
        init()
        {
            const { readFileSync } = require('fs')
            const { join } = require('path')
            var file = join(__dirname + '/data/classlist.json')
            var today = new Date().getDay()
            var week = ["天", "一", "二", "三", "四", "五", "六"]
            this.today = week[today]
            var data = JSON.parse(readFileSync(file, 'utf-8'))
            this.list = data[today]
        }
    },
})