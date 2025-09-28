<template>
	<div class="page-swiper">
		<div class="w-[600px] h-[600px]">
			<PreviewImgListMN slide-name="swiper1" :image-list="[
				{
					imageUrl: '/img/demo-base.jpg'
				},
				{
					imageUrl: '/img/demo-parking.jpg'
				},
				{
					imageUrl: '/img/demo-two-instance-1.jpg'
				},
				{
					imageUrl: '/img/demo-two-instance-2.jpg'
				},
			]" />
		</div>
	</div>

</template>
<script setup lang="ts">
import PreviewImgListMN from './components/PreviewImgListMN.vue';
</script>
<style scoped lang="scss">
.page-swiper {}
</style>
