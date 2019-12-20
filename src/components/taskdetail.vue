<template>
	<div>
		<nav class="navbar nav-cont" role="navigation">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu">
				        <span class="sr-only">切换导航</span>
				        <span class="icon-bar"></span>
				        <span class="icon-bar"></span>
				        <span class="icon-bar"></span>
				     	<span class="icon-bar"></span>
			        </button>
			</div>
			<div class="collapse navbar-collapse row" id="navbar-menu">
				<ul class="nav navbar-nav navbar-left col-md-8 row">
					<li data-status='progress' class="col-md-3 "><span class="active"> 任务详情</span></li>
					<li data-status='waitconfirm' class="col-md-3"><span> </span></li>
					<li data-status='finish' class="col-md-3"><span> </span></li>
					<li data-status='destroy' class="col-md-3"><span> </span></li>
				</ul>
			</div>
		</nav>
		<div style="overflow: hidden;">
			<form class="st-form" :class="{'col-md-8':istask.feedback==[]}">
				<div>
					<div :class="{st_taskhead:typeof(istask)=='object'}">
						<div>
							<div>
								<p>
									<span style="display: block;font-size: 20px;;text-align: center;font-weight: bold;">事项名称：{{istask.hasOwnProperty('name')?istask.name:''}}</span>
								</p>

								<p>
									<span>需要完成时间：{{istask.hasOwnProperty('estimated_finish_time')?istask.estimated_finish_time:''}}</span>
								</p>
							</div>
							<div class="st-issue1" style="float: left;width: 100%;text-align: left;">
								<!--//typeof(istask)=='object   展示-->
								<!--<p style="padding-left: 0px;">确定周期:{{istask.cycle}}天</p>-->
								<p>
									<input class="demo--radio" type="radio" value="plan" :checked="istask.type=='计划内事项'">
									<span class="demo--radioInput"></span>计划内事项
									<input class="demo--radio" type="radio" value="tmp" :checked="istask.type=='临时事项'">
									<span class="demo--radioInput"></span>临时事项
								</p>
								<div class='planlist' v-if="istask.plan_name!=''&&istask.plan_name!=undefined&&istask.type=='计划内事项'">
									<div>
										计划：{{istask.plan_name}}
									</div>
								</div>
							</div>

							<div v-if="istask.content!=''&&istask.content!=undefined">
								<span class="task_title">事项内容</span>
								<div class="summernote" v-show="typeof(istask)=='object'" :readonly="typeof(istask)=='object'" name="content" style="width: 100%;padding:10px;border-radius: 5px;" v-html=istask.content></div>
							</div>
						</div>

					</div>
					<div class="st_addtask addtask" v-for='(items,index) in istask.sub_task'>
						<span class="task_title">任务{{index+1}}:{{istask.name}}的{{items.dept_name}}任务  <b v-if="items.status=='progress'">({{items.progress}}%)</b><b v-if="items.status=='finish'">(已完成)</b></span>
						<ul style="padding-bottom: 10px;">
							<li>
								<p style="width: 100%;">
									<span>部门：</span>
									<span class="st_task_show">{{items.dept_name}}</span>
								</p>

								<p v-if="items.type=='common'" style="width: 150px;">
									<span>执行人：</span>
									<span class="st_task_show">{{items.executor_name}}</span>
								</p>
								<p v-if="items.type=='common'&&items.hasOwnProperty('confirm_time')&&items.confirm_time!=''">
									<span>确定用时：</span>
									<span class="st_task_show">{{items.confirm_time}}</span>
								</p>
								<p v-if="items.type=='common'" style="width: 100%;">
									<span>验收人：</span>
									<span class="st_task_show">{{items.checker_name}}</span>
								</p>
								<p v-if="items.hasOwnProperty('defer')&&items.defer&&items.checker_remark!=null">
									<span>延误原因：</span>
									<span class="st_task_show">{{items.checker_remark}}</span>
								</p>
							</li>
							<li class="addli2" v-if="items.type=='common'">
								<p>预计开始时间：{{items.estimated.begin_time}}</p>
								<p>预计结束时间：{{items.estimated.end_time}}</p>
							</li>
							<li v-if="items.content!=''">任务详情:
								<div style="width: 100%;padding: 10px;border-radius: 5px;" v-html=items.content></div>
							</li>
						</ul>
					</div>
				</div>
			</form>
			<section class="right-nav " v-if="typeof(istask)=='object'&&istask.feedback!=[]">
				<div v-for="items in istask.feedback">
					<input class="demo--radio" type="checkbox" name="demo-radio" checked="checked">
					<span class="demo--radioInput"></span>

					<p>反馈人：{{items.staff_name}}</p>
					<p>{{items.content}}</p>
					<p>
						<span>{{items.addtime}}</span>
						<span>{{items.type_name}}</span>
						<span>{{items.status_name}}</span>
					</p>
				</div>
			</section>

		</div>
	</div>
</template>

<script>
	import Vfeedback from './feedback'

	export default {
		name: "taskdetail",
		data() {
			return {
				istask: []
			}
		},
		components: {
			Vfeedback
		},
		mounted() {
			this.axios.defaults.headers = {
				'Token': localStorage.token,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			this.task_func();
			
		},
		methods: {
			task_func() {
				var _this = this,
					_urlId = window.location.hash.split("=")[1];

				this.$http.post('/task/list',
					"status=&team=&name=" + _urlId + "&department=&originator=&executor=&flag=", {
						emulateJSON: true
					}
				).then(function(res) {
					if(res.data.code == "200") {
						_this.istask = res.data.data[0];

					} else {
						_this.istask = [];
					}
				});
			},
			
		}
	}
</script>

<style scoped>

</style>