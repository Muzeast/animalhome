<template>
    <div>
        <div class="div-left">
            <List>
                <ListItem v-for="i in 10" :key="i">
                    <p>news {{i}}</p>
                </ListItem>
            </List>
        </div>
        <div class="div-mid">
            <div>
                <Carousel :slideData="slideData" :width="90" :height="200" :interval="3000"/>
            </div>
        </div>
        <div class="div-right"></div>
    </div>
</template>

<script>
import Carousel from '../plugins/animation/carousel.vue'

export default {
    name: 'Home',
    components : { Carousel },
    data () {
        return {
            slideData:[
            {
                title:'图片2',
                src:require('@/assets/picture/BingWallpaper_1.jpg'),
                url:'/show/499'
            },
            {
                title:'图片1',
                src:require('@/assets/picture/BingWallpaper_2.jpg'),
                url:'/show/499'

            }
            ]
        }
    }
}
</script>
<style scoped>
.div-left {
    width: 30%;
    float: left;
}
.div-mid {
    width: 40%;
    float: left;
}
.div-right {
    width: 30%;
    float: right;
}
</style>