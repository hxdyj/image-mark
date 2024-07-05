<template>
    <div class="page-base" style="height: 100vh;">
    </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import { ImageMark } from '../../package/index';
onMounted(() => {
    // var draw = SVG().addTo('body').size(300, 300)
    // var rect = draw.rect(100, 100).attr({ fill: '#f06' })
    new ImageMark({
        el: '.page-base',
        src: '/1.jpg',
        data: [
            {
                x: 50,
                y: 50,
                width: 100,
                height: 100,
                type: 'rect'
            },
            {
                x: 400,
                y: 400,
                width: 100,
                height: 100,
                type: 'rect'
            },
        ],
        scaleToCenter: {
            // box: {
            //     x: 400,
            //     y: 400,
            //     width: 100,
            //     height: 100,
            // },
            // padding: 0.1
        }
    })
})
</script>
<style scoped lang="scss">
.page-base {}
</style>