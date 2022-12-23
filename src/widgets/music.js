const music = Vue.extend(
{
    template: `
            <div class="card1 musicbase">
                <div class="music-image" @click="choose">
                    <span class="mdi mdi-music-note"></span>
                </div>
                <div class="music-controls">
                    <h2 class="text-overflow">{{music.name}}</h2>
                    <span class="text-overflow">{{music.artist}}</span>
                    <input type="range" v-model="nowtime" :max="fulltime" @mousedown="onmouse=true" @mouseup="settime($event)">
                    <div class="music-controls-buttons-box">
                        <div class="mdi mdi-skip-previous-circle" @click="forback"></div>
                        <div class="mdi" :class="playStyle" @click="play"></div>
                        <div class="mdi mdi-skip-next-circle" @click="forward"></div>
                    </div>
                </div>
                <audio :src="music.src" preload="auto" ref="audio" @canplay="play"></audio>
            </div>
        `,
    data()
    {
        return {
            playing: false,
            playStyle: 'mdi-play-circle',
            fulltime: 0,
            nowtime: 0,
            onmouse: false,
            music:
            {
                name: '未知音乐',
                artist: '未知艺术家',
                src: ''
            }
        }
    },
    mounted()
    {
        this.play()
    },
    methods:
    {
        play(changing)
        {
            this.playing = !this.playing
            if (this.playing == false)
            {
                this.playStyle = 'mdi-pause-circle'
                this.$refs.audio.play()
                var range = setInterval(() =>
                {
                    if (this.onmouse != true)
                    {
                        this.nowtime = this.$refs.audio.currentTime
                    }
                }, 1000);
            }
            else
            {

                this.playStyle = 'mdi-play-circle'
                this.$refs.audio.pause()
                clearInterval(range)
            }

        },
        forward()
        {
            this.$refs.audio.currentTime = this.$refs.audio.currentTime + 5
        },
        forback()
        {
            this.$refs.audio.currentTime = this.$refs.audio.currentTime - 5
        },
        settime(event)
        {
            this.$refs.audio.currentTime = event.target.value
            this.onmouse = false
        },
        choose()
        {
            const { ipcRenderer } = require('electron')
            const path = require('path')
            this.playStyle = 'mdi-play-circle'
            this.$refs.audio.pause()
            ipcRenderer.send('openFile', ['mp3'])
            ipcRenderer.on('openFileCallback', (event, file) =>
            {
                this.$refs.audio.load()
                this.music.src = file
                var str = String(file)
                var target = path.basename(str, '.mp3')
                var artist = target.substring(0, target.indexOf('-'))
                var name = target.substring(target.indexOf('-') + 1, target.length)
                this.music.artist = artist
                this.music.name = name
                this.$refs.audio.load()
                this.$refs.audio.oncanplay = () =>
                {
                    this.fulltime = this.$refs.audio.duration
                }
            })
        },
    },
    watch:
    {
        // nowtime(newdata)
        // {
        //     this.$refs.audio.currentTime = newdata
        // }
    }
})