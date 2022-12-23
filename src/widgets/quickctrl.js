const exec = require('child_process').exec
const quickctrl = Vue.extend(
{
    template: `
    <div class="card0 quickctrlbase">
            <div class="quickctrl-item mdi mdi-lock" @click="lock"></div>
            <div class="quickctrl-item mdi mdi-monitor" @click="folder"></div>
            <div class="quickctrl-item mdi mdi-calculator" @click="calc"></div>
            <div class="quickctrl-item mdi mdi-pencil-box" @click="note"></div>
    </div>
    `,
    methods:
    {
        lock()
        {
            exec('Rundll32.exe user32.dll,LockWorkStation')
        },
        folder(){
            exec('Explorer.exe')
        },
        calc(){
            exec('calc')
        },
        note(){
            const { ipcRenderer } = require('electron')
            ipcRenderer.send('note', '')
        }
    },
})