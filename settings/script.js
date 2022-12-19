//module
const fs = require('fs')
const path = require('path')
//Countdown
const Countdown = Vue.extend(
{
    template: `
    <div>
            <h2 class="title">倒计时设置</h2>
            <hr>
            <h3 class="subject">事情</h3>
            <input type="text" style="width: 150px;" maxlength="10" v-model="app.activity">
            <h3>时间</h3>
            <input type="number" style="width: 60px;" maxlength="4" v-model="app.date[0]">
            <span>年</span>
            <input type="number" style="width:40px;" maxlength="2" v-model="app.date[1]">
            <span>月</span>
            <input type="number" style="width:40px;" maxlength="2" v-model="app.date[2]">
            <span>日</span>
            <div class="save" @click="save">保存</div>
        </div>
    `,
    data()
    {
        return {
            app:
            {
                activity: "一件事",
                date: [2023, 12, 1]
            }
        }
    },
    methods:
    {
        save()
        {
            var file = path.join(__dirname, 'data/countdown.json')
            fs.writeFileSync(file, JSON.stringify(this.app))
        }
    },
})
//Class
const Classlist = Vue.extend(
{
    template: `
            <div>
                <h2>课程表</h2>
                <hr>
                <span>上课时间</span>
                <input type="text" style="width: 100px;" v-model="app.template.start"><br><br>
                <span>下课时间</span>
                <input type="text" style="width: 100px;" v-model="app.template.end"><br><br>
                <span>课节</span>
                <input type="text" style="width: 100px;" v-model="app.template.subject"><br><br>
                <span>老师</span>
                <input type="text" style="width: 100px;" v-model="app.template.teach"><br><br>
                <span>星期</span>
                <select v-model="app.type">
                    <option value="0">周天</option>
                    <option value="1">周一</option>
                    <option value="2">周二</option>
                    <option value="3">周三</option>
                    <option value="4">周四</option>
                    <option value="5">周五</option>
                    <option value="6">周六</option>
                </select>
                <br><br><br>
                <div class="classlist-item">
                    <span style="border-right:1px solid #E2E9E3;color: #2F465E;">{{app.template.start}}</span>
                    <h3 style="color: #2F465E;">{{app.template.subject}}</h3>
                    <span style="border-right:1px solid #E2E9E3;color: #2F465E;">{{app.template.end}}</span>
                    <span style="color: #2F465E;">{{app.template.teach}}</span>
                </div>
                <div class="save" @click="add">添加</div>
                <div class="save" @click="remove" style="width:120px;background:#CD4640;">移除最后一节</div>
                <div class="save" @click="clear" style="background:#CD4640;">清空</div>
            </div>
            `,
    data()
    {
        return {
            app:
            {
                type: 0,
                template:
                {
                    subject: "语文",
                    teach: "王老师",
                    start: "8:00",
                    end: "9:00"
                }
            }
        }
    },
    methods:
    {
        add()
        {
            let file = path.join(__dirname, 'data/classlist.json')
            var day = Number(this.app.type)
            var item = { "subject": this.app.template.subject, "teach": this.app.template.teach, "start": this.app.template.start, "end": this.app.template.end }
            var data = JSON.parse(fs.readFileSync(file, 'utf-8'))
            data[day].push(item),
                fs.writeFileSync(file, JSON.stringify(data))
        },
        remove()
        {
            let file = path.join(__dirname, 'data/classlist.json')
            var day = Number(this.app.type)
            var data = JSON.parse(fs.readFileSync(file, 'utf-8'))
            var last = (data[day]).length - 1
            data[day].splice(last, last)
            if (last == 0)
            {
                data[day] = []
            }
            fs.writeFileSync(file, JSON.stringify(data))
        },
        clear()
        {
            let file = path.join(__dirname, 'data/classlist.json')
            var day = Number(this.app.type)
            var data = JSON.parse(fs.readFileSync(file, 'utf-8'))
            data[day] = []
            fs.writeFileSync(file, JSON.stringify(data))
        }
    }
})

const Widgets = Vue.extend(
{
    template: `
            <div>
                <h2>组件管理</h2>
                <hr>
                <table>
                    <tr>
                        <td><span>时钟</span></td>
                        <td><input type="checkbox" class="check-switch check-switch-anim" v-model="widgets[0].show"></td>
                    </tr>
                    <tr>
                        <td><span>倒计时(日期)</span></td>
                        <td><input type="checkbox" class="check-switch check-switch-anim" v-model="widgets[1].show"></td>
                    </tr>
                    <tr>
                        <td><span>代办</span></td>
                        <td><input type="checkbox" class="check-switch check-switch-anim" v-model="widgets[2].show"></td>
                    </tr>
                    <tr>
                        <td><span>课程表</span></td>
                        <td><input type="checkbox" class="check-switch check-switch-anim" v-model="widgets[3].show"></td>
                    </tr>
                    <tr>
                        <td><span>倒计时(分秒)</span></td>
                        <td><input type="checkbox" class="check-switch check-switch-anim" v-model="widgets[4].show"></td>
                    </tr>
                    <tr>
                        <td><span>音乐播放器</span></td>
                        <td><input type="checkbox" class="check-switch check-switch-anim" v-model="widgets[5].show"></td>
                    </tr>
                    <tr>
                        <td><span>BiliBili卡片</span></td>
                        <td><input type="checkbox" class="check-switch check-switch-anim" v-model="widgets[6].show"></td>
                    </tr>
                </table>
                <div class="save" @click="save">保存</div>
            </div>
    `,
    data()
    {
        return {
            widgets: [
                { show: false },
                { show: false },
                { show: false },
                { show: false },
                { show: false },
                { show: false },
                { show: false }
            ]
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
            let file = path.join(__dirname, 'data/layout_temp.json')
            var data = JSON.parse(fs.readFileSync(file, 'utf-8'))
            this.widgets = data
        },
        save()
        {
            var data = this.widgets
            let file = path.join(__dirname, 'data/layout.json')
            var temp = path.join(__dirname, 'data/layout_temp.json')
            fs.writeFileSync(file, JSON.stringify(data))
            fs.writeFileSync(temp, JSON.stringify(data))
        }
    }
})