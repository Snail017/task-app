<template>
	<section class="right-nav" :class="{'col-md-4':feedback_list.length>0}">
		<div v-for="items in feedback_list" >
			<label class="demo--label">
				<input class="demo--radio" type="checkbox" name="demo-radio" v-bind:checked='items.checked==1' :data-id="items.id"> 
				<span class="demo--radioInput"></span>
			
			<p >反馈人：{{items.staff_name}}</p>
			<p>{{items.content}}</p>
			<p>
				<span>{{items.addtime}}</span>
				<span>{{items.type_name}}</span>
				<span>{{items.status_name}}</span>
			</p>
			</label>
		</div>
	</section>
</template>

<script>
	export default {
		name: "feedback",
		computed: {
			feedback_list() {
				let aa=JSON.parse(window.localStorage.feedback);
				return aa;
			}
		}
	}
</script>

<style>

</style>