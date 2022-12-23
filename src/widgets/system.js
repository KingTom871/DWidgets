const { dir } = require('console')

const system = Vue.extend(
{
    template: `
            <div class="card3 systembase">
                <div class="system-cpu">
                    <i class="mdi mdi-memory"></i>
                    <div>
                        <span>总内存: {{mem.total}}GB</span><br>
                        <span>已用: {{mem.used}}GB</span><br>
                        <span>可用: {{mem.free}}GB</span><br>
                        <span>使用率: {{mem.rate}}%</span><br>
                    </div>
                </div>
                <div class="system-drive-box">
                    <div class="system-drive" v-for="(item, index) in drive" :key="index" @click="openDrive(item.drive)">
                        <div>
                            <span>{{item.drive}}</span>
                            <div class="system-drive-icon">
                                <div class="system-drive-icon-dot"></div>
                            </div>
                        </div>
                        <div>
                            <progress :value="item.used" :max="item.total"></progress>
                            <span>{{item.total - item.used}} GB可用, 共 {{item.total}} GB</span>
                        </div>
                    </div>
                </div>
            </div>
    `,
    data()
    {
        return {
            mem:
            {
                total: 0,
                used: 0,
                free: 0,
                rate: 0
            },
            drive: [ /*{ drive: 'C:/', total: 91.7, used: 40.2 }*/ ]
        }
    },
    mounted()
    {
        this.getDrive()
        this.getMemory()
    },
    methods:
    {
        // getDrive()
        // {
        //     const { existsSync } = require('fs')
        //     var template = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        //     var drive = []
        //     for (var i = 0; i < 26; i++)
        //     {
        //         if (existsSync(`${template.substring(i, i+1)}:/`))
        //         {
        //             drive.push(`${template.substring(i, i+1)}:/`)
        //         }
        //     }
        //     return drive
        // },
        getDrive()
        {
            var d = require('diskinfo')
            var drive = []
            d.getDrives((err, aDrives) =>
            {
                for (var i = 0; i < aDrives.length; i++)
                {
                    var template = {
                        drive: aDrives[i].mounted + '\\',
                        total: Math.round(aDrives[i].blocks / 1000000000),
                        used: Math.round(aDrives[i].used / 1000000000)
                    }
                    drive.push(template)
                }

            })
            this.drive = drive
        },
        getMemory()
        {
            const os = require('os')

            let getInfo = () =>
            {
                var total = Math.round(os.totalmem() / (1024 * 1024 * 1024))
                var free = (os.freemem() / (1024 * 1024 * 1024)).toFixed(1)
                var used = ((os.totalmem() - os.freemem()) / (1024 * 1024 * 1024)).toFixed(1)
                var rate = Math.round((used / total) * 100)
                var mem = {
                    total: total,
                    used: used,
                    free: free,
                    rate: rate
                }
                this.mem = mem
            }
            getInfo()
            setInterval(getInfo, 3000);

        },
        openDrive(drive)
        {
            const { shell } = require('electron')
            shell.openExternal(drive)
        }
    },
})