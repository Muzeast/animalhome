<template>
  <div id="carousel" :style="{width: width > 100 ? width + 'px' : width + '%'}">
    <div class="carousel" ref="carousel"  :style="{height:height+'px', position: 'relative'}">
      <transition-group tag="ul" class="slide clearfix"  :name="transitionName" >
        <li v-for="(item,index) in slideData" :key="item.title" v-show="index==beginValue">
          <router-link :to="item.url">
            <img :src="item.src">
            <div class="title">{{item.title}}</div>
          </router-link>
        </li>
      </transition-group>
      <!--<div class="up" @click="up" v-show="arrow"></div>
      <div class="next" @click="next" v-show="arrow"></div>-->
      <Icon class="up" @click="up" type="ios-arrow-dropleft" size="50"/>
      <Icon class="next" @click="next" type="ios-arrow-dropright" size="50"/>
      <div class="slideDot" v-show="dot">
        <span v-for="(item,index) in slideData" :class="{active:index==beginValue}" @click="change(index)" :key="index"></span>
      </div>
    </div>
  </div>
</template>
 
<script>
  export default {
    name: "carousel",
    props:{
      width:{
        type: Number,
        default: 40
      },
      height:{
        type: Number,
        default: 300
      },
      dot:{
        type: Boolean,
        default: true
      },
      arrow:{
        type: Boolean,
        default: true
      },
      interval:{
        type: Number,
        default: 5000
      },
      begin:{
        type: Number,
        default: 0
      },
      slideData:{
        type: Array,
        default: function () {
          return [];
        }
      }
    },
    data(){
      return{
        setInterval:'',
        beginValue:0,
        transitionName:'slide'
      }
    },
    beforeDestroy() {
      // 组件销毁前,清除监听器
      clearInterval(this.setInterval);
    },
    methods:{
      change(key){
        if(key>(this.slideData.length-1)){
          key=0;
        }
        if(key<0){
          key=this.slideData.length-1;
        }

        this.beginValue=key;
      },
      autoPlay(){
        //console.log(this.$refs.carousel.getBoundingClientRect().width);
        this.transitionName='slide';
        this.beginValue++
        if(this.beginValue>=this.slideData.length){
          this.beginValue=0;
          return;
        }
      },
      play(){
        this.setInterval=setInterval(this.autoPlay,this.interval)
      },
      mouseOver(){ //鼠标进入
        //console.log('over')
        clearInterval(this.setInterval)
      },
      mouseOut(){ //鼠标离开
        //console.log('out')
        this.play()
      },
      up(){ //上一页
        --this.beginValue;
        this.transitionName='slideBack';
        this.change(this.beginValue);
 
      },
      next(){ //下一页
        ++this.beginValue;
        this.transitionName='slide';
        this.change(this.beginValue);
      }
 
    },
    mounted(){
      var box = this.$refs.carousel; //监听对象
      box.addEventListener('mouseover',()=>{
        this.mouseOver();
      })
      box.addEventListener('mouseout',()=>{
        this.mouseOut();
      })
      this.beginValue=this.begin;
      this.play();
 
    }
  }
</script>
 
<style scoped>
.slide {
  width: 100%;
  height:200px;
  position: relative;
  overflow: hidden;
}
.slide li {
  width: 100%;
  height:200px;
  list-style: none;
  position: absolute;
}
.slide li img {
  width: 100%;
  cursor:pointer;
}
.slide li .title {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 5px 10px;
  width: 100%;
  background: rgba(0,0,0,.35);
  color: #fff;
  font-size: larger;
  text-align: center;
}

.slideDot {
  position: absolute;
  z-index: 999;
  bottom: 40px;
  right:10px;
}
.slideDot span {
  display: inline-block;
  width: 40px;
  height: 7px;
  background:rgba(255,255,255,.65);
  margin-left: 5px;
}
.slideDot span.active {
  background:rgba(255,255,255,1);
}

.up,.next {
  position: absolute;
  bottom: 80px;
  display: inline-block;
  cursor: pointer;
}
.up {
  left: 5%;
}
.next {
  right: 5%;
}
.up:hover, .next:hover {
  background-color: #fff
}


/*进入过渡生效时的状态*/
.slide-enter-active{
  transform:translateX(0);
  transition: all 1s ease;
}

/*进入开始状态*/
.slide-enter{
  transform:translateX(100%);
}

/*离开过渡生效时的状态*/
.slide-leave-active{
  transform:translateX(-100%);
  transition: all 1s ease;
}

/*离开过渡的开始状态*/
.slide-leave{
  transform:translateX(0);
}

/*进入过渡生效时的状态*/
.slideBack-enter-active{
  transform:translateX(0);
  transition: all 1s ease;
}

/*进入开始状态*/
.slideBack-enter{
  transform:translateX(-100%);
}

/*离开过渡生效时的状态*/
.slideBack-leave-active{
  transform:translateX(100%);
  transition: all 1s ease;
}

/*离开过渡的开始状态*/
.slideBack-leave{
  transform:translateX(0);
}
</style>