<template>
	<div class="comp-sposor">
		<div v-for="item in list" :key="item.imgName" class="sposor-item">
			<img :src="baseUrl + item.imgName" alt="" class="img">
			<div class="sposor-name">{{ item.name }} [ {{ item.price }} ]</div>
		</div>
	</div>

</template>
<script setup lang="ts">
import { computed } from 'vue';

type Item = {
	name: string,
	imgName: string,
	price: string,
}

const enterpriseList: Item[] = []
const personalList: Item[] = [
	{
		name: '今天胖了嘛',
		imgName: '今天胖了嘛.jpg',
		price: '青铜',
	}
]

const props = withDefaults(defineProps<{
	type: 'enterprise' | 'personal',
}>(), {
	type: 'personal',
})


const list = computed(() => {
	return props.type === 'enterprise' ? enterpriseList : personalList
})

const baseUrl = computed(() => {
	return props.type === 'enterprise' ? '/sponsor/enterprise/' : '/sponsor/personal/'
})

</script>
<style scoped lang="scss">
.comp-sposor {
	display: flex;
	flex-wrap: wrap;
	column-gap: 16px;
	row-gap: 16px;

	.sposor-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 14px;
		row-gap: 8px;

		.img {
			width: 80px;
			height: 80px;
		}
	}
}
</style>
