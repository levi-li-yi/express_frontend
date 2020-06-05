<template>
    <div>
        <div class="animation_container">
            <div class="img_wrap" v-for="(src, index) in imgs" :key="src + index">
                <img :src="src.src" alt="" ref="imgs">
            </div>
        </div>
        <button @click="add">添加</button>
    </div>
</template>

<script>
// import imgs from '../../static/json/imgs.json'

export default {
    data() {
        return {
            alias: '@/assets/imgs/',
            imgs: [],
            userPath: require('@/assets/imgs/0.jpg')
        }
    },
    mounted() {
        this.imgs = this.preload([0,1,2,3,4,5])
    },
    methods: {
        preload(list) {
            return list.map((item) => {
                let src = null;
                switch(item) {
                    case 0:
                        src = require('@/assets/imgs/0.jpg')
                        break;
                    case 1:
                        src = require('@/assets/imgs/1.jpg')
                        break;
                    case 2:
                        src = require('@/assets/imgs/2.jpg')
                        break;
                    case 3:
                        src = require('@/assets/imgs/3.jpg')
                        break;
                    case 4:
                        src = require('@/assets/imgs/4.jpg')
                        break;
                    case 5:
                        src = require('@/assets/imgs/5.jpg')
                        break;
                    case 6:
                        src = require('@/assets/imgs/6.jpg')
                        break;
                    case 7:
                        src = require('@/assets/imgs/7.jpg')
                        break;
                    case 8:
                        src = require('@/assets/imgs/8.jpg')
                        break;
                    case 9:
                        src = require('@/assets/imgs/9.jpg')
                        break;
                    case 10:
                        src = require('@/assets/imgs/10.jpg')
                        break;
                }
                return {
                    src: src
                }
            })
        },
        getRect(doms) {
            console.log(doms)
            return doms.map((dom) => {
                const rect = dom.getBoundingClientRect()
                const {left, top} = rect
                return {left, top}
            })
        },
        /* createSrcRectMap(doms) {
            let rectMap = {}
            doms.forEach((dom) => {
                const rect = dom.getBoundingClientRect()
                // const {left, top} = rect
                //rectMap[dom.src] = rect
                //rectMap['img'] = dom
                rectMap[dom.src] = {
                    left: rect.left,
                    top: rect.top,
                    img: dom
                }
            })
            //console.log(rectMap)
            return rectMap;
        }, */
        createSrcRectMap(imgs) {
            return imgs.reduce((prev, img) => {
            const rect = img.getBoundingClientRect()
            const { left, top } = rect
            prev[img.src] = { left, top, img }
            return prev
            }, {})
        },
        async add() {
            const prevImgs = this.$refs.imgs.slice()
            const prevPositions = this.getRect(prevImgs)
            this.imgs = this.preload([6,7,8,9,10]).concat(this.imgs)

            this.$nextTick(() => {
                const currentPositions = this.getRect(prevImgs)
                prevImgs.forEach((imgRef, imgIndex) => {
                    const currentPosition = currentPositions[imgIndex]
                    const prevPosition =prevPositions[imgIndex]

                    const invert = {
                        left: prevPosition.left - currentPosition.left,
                        top: prevPosition.left - currentPosition.top,
                    }

                    const keyframes = [
                        // 初始位置为倒置后的位置
                        {
                            transform: `translate(${invert.left}px, ${invert.top}px)`
                        },
                        // 图片更新后应该的位置
                        {
                            transform: "translate(0)"
                        }
                    ]

                    const options = {
                        duration: 300,
                        easing: "cubic-bezier(0,0,0.32,1)"
                    }
                    imgRef.animate(keyframes, options)
                })
            })
        },
        async scheduleAnimation(update) {
            // 获取旧图片的位置
            const prevImgs = this.$refs.imgs.slice()
            const prevSrcRectMap = this.createSrcRectMap(prevImgs)
            // 更新数据
            update()
            // DOM更新后
            this.$nextTick(() => {
                const currentSrcRectMap = this.createSrcRectMap(prevImgs)
                Object.keys(currentSrcRectMap).forEach((src) => {
                const currentRect = currentSrcRectMap[src]
                const prevRect = prevSrcRectMap[src]
                if (!currentRect || !prevRect) return
                const invert = {
                    left: prevRect.left - currentRect.left,
                    top: prevRect.top - currentRect.top,
                }
                //console.log(invert)

                const keyframes = [
                    {
                    transform: `translate(${invert.left}px, ${invert.top}px)`,
                    },
                    { transform: "translate(0)" },
                ]
                const options = {
                    duration: 300,
                    easing: "cubic-bezier(0,0,0.32,1)",
                }
                currentRect.img.animate(keyframes, options)
                })
            })
        },
        add1() {
            this.scheduleAnimation(() => {
                this.imgs = this.preload([6,7,8,9,10]).concat(this.imgs)
            })
        }
    }
}
</script>

<style>
.animation_container{
    width: 600px;
    display: flex;
    flex-wrap: wrap;
    background-color: #e1e1e1;
}
.img_wrap{
    width: 25%;
    border-radius: 4px;
}
.img_wrap img {
    display: block;
    width: 100%;
    height: 200px;
}
</style>  