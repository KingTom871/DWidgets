//卧槽怎么越写越乱
const timer = Vue.extend(
{
    template: `
                <div class="card1 timerbase">
                <div class="timer-show">
                    <span class="mdi mdi-chevron-up" @click="add(timer.m, 1)"></span>
                    <h1>{{timer.m}}</h1>
                    <span class="mdi mdi-chevron-down" @click="reduce(timer.m, 1)"></span>
                </div>
                <span>:</span>
                <div class="timer-show" style="text-align: left;">
                    <span class="mdi mdi-chevron-up" @click="add(timer.s, 0)"></span>
                    <h1>{{timer.s}}</h1>
                    <span class="mdi mdi-chevron-down" @click="reduce(timer.s, 0)"></span>
                </div>
                <div>
                    <div class="timer-controls" @click="run">{{bthtext}}</div>
                    <div class="timer-controls" @click="clear">清除</div>
                </div>
            </div>
    `,
    data()
    {
        return {
            isrun: false,
            bthtext: '开始',
            timer:
            {
                m: '00',
                s: '00'
            }
        }
    },
    methods:
    {
        add(num, type)
        {
            if (num < 60 && this.isrun != true)
            {
                var result = (Number(num) + 1)
                result = result.toString()
                if (type == 1)
                {
                    this.timer.m = result[1] ? result : '0' + result
                }
                else
                {
                    this.timer.s = result[1] ? result : '0' + result
                }
            }
            if (num == 59 && type == 0 && this.isrun != true)
            {
                this.add(this.timer.m, 1)
                this.timer.s = '00'
            }
        },
        reduce(num, type, caller)
        {

            if (num > 0)
            {
                // 检查调用
                if (this.isrun != true || caller == 'system')
                {
                    var result = (Number(num) - 1)
                    result = result.toString()
                    // 个位补零
                    if (type == 1)
                    {
                        this.timer.m = result[1] ? result : '0' + result
                    }
                    else
                    {
                        this.timer.s = result[1] ? result : '0' + result
                    }
                }
            }
            if (num == 0 && type == 0)
            {
                // 检查调用
                if (this.isrun != true || caller == 'system')
                {
                    // 分钟为0时
                    if (this.timer.m == '00')
                    {
                        this.clear()
                    }
                    else
                    {
                        // 分钟减一
                        this.reduce(this.timer.m, 1, 'system')
                        this.timer.s = '59'
                    }
                }
            }
        },
        clear()
        {
            this.timer.m = '00'
            this.timer.s = '00'
            this.isrun = false
        },
        run()
        {
            var _this = this
            var option = {
                title: 'DWidgets',
                body: '计时器操作完成!'
            }
            var _this = this
            this.isrun = !this.isrun
            this.isrun ? this.bthtext = '停止' : this.bthtext = '开始'
            var gettime = Number(this.timer.m * 60) + Number(this.timer.s)
            if (this.isrun == true)
            {
                var loop = setInterval(() =>
                {
                    gettime--
                    if (gettime < 0 || this.isrun == false)
                    {
                        new window.Notification(option.title, option)
                        clearInterval(loop)
                        this.isrun = false
                        this.bthtext = '开始'
                    }
                    else
                    {
                        this.reduce(this.timer.s, 0, 'system')
                    }
                }, 1000);
            }
        }
    }
})