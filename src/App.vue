<template>
	<div id="app" :style="{height:height}" style="padding-bottom:40px;">
		<router-view/>
	</div>
</template>

<script>
	export default {
		name: 'App',
		data() {
			return {
				height: ""
			}
		},
		mounted() {
			this.height = window.screen.height - 95-33-66+'px';
			 
		}

	}
</script>

<style>
	#app {
		font-family: MicrosoftYaHei;
	}
</style>