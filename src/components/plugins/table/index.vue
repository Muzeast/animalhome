<template>
    <Layout>
        <MyTable :columns="columns" :data="data"/>
    </Layout>
</template>

<script>
import MyTable from './MyTable'

export default {
    components: { MyTable },
    data () {
        return {
            columns: [
                {title: '姓名', key: 'name'},
                {title: '年龄', key: 'age'},
                {title: '性别', key: 'sex', render: (h, data) => {
                    if (data.sex == 'male') {
                        return h('Tooltip', {
                            props: {
                                content: data.name,
                                delay: 250
                            }
                        }, '男')
                    } else {
                        return h('Tooltip', {
                            props: {
                                content: data.name,
                                delay: 250
                            }
                        }, '女')
                    }
                }}
            ],
            data: []
        }
    },
    methods: {
        //
    },
    mounted () {
        for(let i = 0; i < 10; i++) {
            this.data.push({
                name: 'jack',
                age: 20 + i,
                sex: Math.random() > 0.5 ? 'male' : 'female'
            })
        }
    }
}
</script>