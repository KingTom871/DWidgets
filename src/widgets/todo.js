const { join } = require('path')
const file = join(__dirname, 'data/todo.json')

const todo = Vue.extend(
{
    template: `
    <div class="card2">
        <div class="todo-title">
            <h4 style="margin:6.5px 10px">| 代办</h4>
            <input class="todo-input" type="text" placeholder="输入代办..." maxlength="15" v-model="_data.content">
            <div class="todo-button" @click="add"><span class="mdi mdi-pencil"></span></div>
            <div class="todo-button" @click="todo=[]"><span class="mdi mdi-delete-sweep"></span></div>
        </div>
        <div class="todo-list" v->
        <div class="todo-tip" v-show="tip">暂无代办,尝试添加一个吧!</div>
            <div class="todo-item" v-for="(item, index) in todo" :key="index">
                <div class="todo-button" v-show="item.done" @click="done(index, item.title)"><span class="mdi mdi-checkbox-marked"></span></div>
                <div class="todo-button" v-show="!item.done" @click="done(index, item.title)"><span class="mdi mdi-checkbox-blank-outline"></span></div>
                <span style="line-height: 40px;" class="text-overflow">{{item.title}}</span>
                <div class="todo-button" @click="remove(index)"><span class="mdi mdi-delete"></span></div>
            </div>
        </div>
    </div>
    `,
    data()
    {
        return {
            content: '',
            tip: false,
            todo: []
        }
    },
    mounted()
    {
        this.load()
    },
    methods:
    {
        add()
        {
            if (this.content != '')
            {
                this.todo.push({ "title": this.content, "done": false })
                this.content = ''
            }
        },
        remove(num)
        {
            if (num == 0)
            {
                this.todo.splice(0, 1)
            }
            this.todo.splice(num, num)
        },
        done(num, title)
        {
            var done = this.todo[num].done
            this.todo[num].done = !done
            this.remove(num)
            this.todo.push({ "title": title, "done": !done })
            const { writeFileSync } = require('fs')
            writeFileSync(file, JSON.stringify(this.todo))
        },
        load()
        {
            const { readFileSync } = require('fs')
            this.todo = JSON.parse(readFileSync(file, 'utf-8'))
        },
        save()
        {
            const { writeFileSync } = require('fs')
            writeFileSync(file, JSON.stringify(this.todo))
        }
    },
    watch:
    {
        todo:
        {
            immediate: false,
            handler(newtodo, oldtodo)
            {
                this.save()
                if (newtodo.length == 0)
                {
                    this.tip = true
                }
                else
                {
                    this.tip = false
                }
            }
        }
    }
})