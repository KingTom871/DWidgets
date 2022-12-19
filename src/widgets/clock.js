const clock = Vue.extend(
{
    template: `
    <div class="card0 clock-clockbase">
        <div style="margin-top: 30px"><span class="clock-hm">{{app.hm}}</span><span class="clock-s">{{app.s}}</span></div>
        <div><span>{{app.date}}</span></div>
        <span>{{app.week}}</span>
    </div>
    `,
    data()
    {
        return {
            app:
            {
                date: '',
                hm: '',
                s: '',
                week:''
            },
            style:
            {

            }
        }
    },
    created()
    {
        this.getTimes()
    },
    methods:
    {
        getTimes()
        {
            setInterval(this.getTimesInterval, 1000)
        },
        getTimesInterval: function ()
        {
            let year = new Date().getFullYear()
            let month = new Date().getMonth() + 1
            let day = new Date().getDate()
            let hours = new Date().getHours()
            let minutes = new Date().getMinutes()
            let seconds = new Date().getSeconds()
            let getweek = new Date().getDay()
            let week = ["天","一", "二", "三", "四", "五", "六"]
            if (hours < 10)
            {
                hours = "0" + hours
            }
            if (minutes < 10)
            {
                minutes = "0" + minutes
            }
            if (seconds < 10)
            {
                seconds = "0" + seconds
            }
            this.app.hm = hours + ":" + minutes
            this.app.s = ":" + seconds
            this.app.week = "星期"+week[getweek]
            this.app.date = year + "年" + month + "月" + day + "日"
        },
    }
})