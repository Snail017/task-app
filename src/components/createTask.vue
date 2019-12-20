<template>
	<div style="overflow: hidden;">
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
					<li data-status='progress' class="col-md-3 "><span class="active"> 创建任务</span></li>
					<li data-status='waitconfirm' class="col-md-3"><span> </span></li>
					<li data-status='finish' class="col-md-3"><span> </span></li>
					<li data-status='destroy' class="col-md-3"><span> </span></li>
				</ul>
			</div>
		</nav>
		<form class="st-form" :data=feedback_list.length :class="{'col-md-8':feedback_list.length>0}">
			<div class="st-issue">
				<p>
					<span>事项名称：
							<input type="text" autocomplete="off" placeholder="点击输入事项名" name='name' class="create_name">
						</span>
				</p>
				<p>
					<span>需要完成时间：<input autocomplete="off" type="text" name="estimated_finish_time" placeholder="点击选择完成时间" class="data-input1"></span>
				</p>
			</div>
			<div class="st_issue1_title">
				<div class="st-issue1">
					<p>
						<label class="demo--label">
				                        <input class="demo--radio" type="radio" value="plan" name="type" @input="planlist($event)" checked="checked">
				                        <span class="demo--radioInput"></span>计划内事项
									</label>
						<label class="demo--label">
				                        <input class="demo--radio" type="radio" value="tmp" name="type" @input="planlist($event)">
				                        <span class="demo--radioInput"></span>临时事项
									</label>
					</p>
					<div class='planlist'>
						<div>
							计划：
							<div class="select">
								<select name="plan" class="js-example-templating js-states form-control sel_menu select2">
									<option value="0">请选择</option>
									<template v-for="item in planlist_data">
										<option :value=item.id>[{{item.id }}]{{item.name}}</option>
									</template>
								</select>
							</div>
						</div>
					</div>
				</div>
				<span class="task_title">事项内容</span>
			</div>

			<Vtask v-for="taskNum in taskNum" :taskNum=taskNum :endDate=endDate :department_list=department_list :user_data=user_data :user=user @listenIndex="showIndex" @setEndDate="setEndDate"></Vtask>
			<p class="st-addtask">
				<span @click.stop="addtask('add')">添加任务</span>
				<span v-if="!submitOk">发布</span>
				<span @click.stop="submit($event)" class="on" v-if="submitOk">发布</span>
			</p>
		</form>
		<Vfeedback></Vfeedback>
		<div class="bg2" @click.stop="windClose"></div>
		<div class="bg1 bg" v-if="msgOk" @click="msgOk=false"></div>
		<div v-show="msgOk" class="msg">{{msg}}</div>
	</div>
</template>

<script>
	import Vtask from './task'
	import Vfeedback from './feedback'
	export default {
		name: "createTask",
		components: {
			Vtask,
			Vfeedback
		},

		data() {
			return {
				msgOk: false,
				msg: '',
				submitOk: true,
				taskNum: [{
					project: true,
					publish: false,
					test: false,
					index: 1
				}],
				Apidate:'',
				planlist_data: [],
				user_data: JSON.parse(localStorage.user_data),
				user: JSON.parse(localStorage.user),
				endDate: null,
				feedback_list: JSON.parse(localStorage.feedback),
				department_list:JSON.parse(localStorage.department_list),

			}
		},
		mounted() {
			var _this = this;
			this.axios.defaults.headers = {
				'Token': localStorage.token,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			this.$http.post('/task/plan/list', {
				emulateJSON: true
			}).then(function(res) {
				if(res.data.code == '200') {
					_this.planlist_data = res.data.data.plan;
				} else {
					_this.windClose()
					_this.msgOk = true;
					_this.msg = res.data.msg;
				}
			})
			setTimeout($("#app").height('inherit'),3000);
		},

		methods: {
			planlist(e) {
				if(e.target.defaultValue == 'plan') {
					$('.planlist>div').css('display', 'inline-block')
				} else {
					$('.planlist>div').css('display', 'none')
				}

			},
			ToData(str) {
				if(str != "" && str != undefined) {
					var year = str.split("年")[0],
						month = str.split("年")[1].split("月")[0],
						day = str.split("年")[1].split("月")[1].split("日"),
						date = year + '-' + month + '-' + day;
					return date;
				}

			},
			windClose() {
				$(".bg2").hide();
			},
			submit(e) {
				let result = this.CheckData();
				if(result == false) {
					return false;
				}
				let _this = this;
				this.$http.post('/task/create', this.Apidate, {
					emulateJSON: true
				}).then(function(res) {
					console.log(res)
					if(res.data.code == 200) {
						_this.msgOk = true;
						_this.msg = "发布成功";
						setTimeout(function() {
							location.reload();
						}, 1000);

					} else {
						_this.msgOk = true;
						_this.msg = res.data.msg;
					}

				});
			},
			setEndDate(endDate) {
				this.endDate = endDate;
			},
			CheckData() {
				var formData = $('.st-form').serializeArray();
				let _subtask = {},
					submitData = {};

				for(var i in formData) {
					if(formData.hasOwnProperty(i)) {
						let {
							name,
							value
						} = formData[i];
						let issub = false,
							index = 0;
						var nameSplit = -1;

						if((nameSplit = name.indexOf('-')) != -1) {
							issub = true;
							index = name.substr(nameSplit + 1);
							name = name.substr(0, nameSplit);
						}

						if(name == 'estimated_finish_time' || name == 'estimated_begin_time' || name == 'estimated_end_time') {
							value = this.ToData(value);
						}
						value = $.trim(value);
						if(index == 0) {
							if(name == 'name' && value == '') {
								this.msgOk = true;
								this.msg = "请输入事项名称";
								return false;
							} else if(name == 'estimated_finish_time' && value == '') {
								this.msgOk = true;
								this.msg = "请选择完成时间";
								return false;
							} else if(name == 'content' && value == '') {
								this.msgOk = true;
								this.msg = "请填写任务详细内容";
								return false;
							} else if(name == 'cycle' && value == '') {
								this.msgOk = true;
								this.msg = "请输入确定周期";
								return false;
							}
							submitData[name] = value;
						} else {
							switch(name) {
								case 'department':
									if(value == "") {
										this.msgOk = true;
										this.msg = "请选择任务" + index + "的部门";
										return false;
									}
									break;
								case 'executor':
									if(value == "") {
										this.msgOk = true;
										this.msg = "请选择任务" + index + "的执行人";
										return false;
									}
									break;
								case 'checker':
									if(value == "") {
										this.msgOk = true;
										this.msg = "请选择任务" + index + "的验收人";
										return false;
									}
									break;
								case 'estimated_begin_time':
									if(value == "") {
										this.msgOk = true;
										this.msg = "请填写任务" + index + "的预计开始时间";
										return false;
									}
									break;
								case 'estimated_end_time':
									if(value == "") {
										this.msgOk = true;
										this.msg = "请填写任务" + index + "的预计结束时间";
										return false;
									}
									break;
								case 'content':
									if(value == "") {
										this.msgOk = true;
										this.msg = "请填写任务" + index + "的详细内容";
										return false;
									}
									break;
							}

							if(_subtask.hasOwnProperty(index)) {
								_subtask[index][name] = value;
							} else {
								_subtask[index] = {
									'type': 'common',
								};
								_subtask[index][name] = value;
							}
						}
					}
				}
				submitData['subtask'] = Object.values(_subtask);

				//取得选择的问题反馈
				var _id = '',
					$CheckBox = $(".right-nav .demo--radio:checked");
				for(let i = 0; i < $CheckBox.length; i++) {
					let id = $CheckBox.eq(i).data("id");
					_id = id + ',' + _id;
				}

				submitData['feedback_id'] = _id;
				submitData['content'] = $('.summernote1').summernote('code');
				this.Apidate = $.param(submitData);
				
				return true;
			},
			showIndex(res) {
				console.log(res)
				let type = res.split(",")[1],
					index = res.split(",")[0],
					_eq = Number(index) - 1;
				if(_eq >= 0) {
					console.log(type + '    ' + index + '   ' + _eq);
					if(type == 'project') {
						this.taskNum.splice(_eq, 1);
					} else if(type == 'test') {
						this.taskNum[_eq].test = false;
					} else if(type == "publish") {
						this.taskNum[_eq].publish = false;

					}
				}

			},
			addtask(res, index) {
				let i = Number(index) - 1;
				if(res == "add") {
					this.taskNum.push({
						project: true,
						publish: false,
						test: false,
						index: Number(this.taskNum.length) + 1
					})
				} else if(res == 'proj') {
					this.taskNum[i].test = true;
					this.taskNum[i].publish = true;
				} else if(res == 'noproj') {
					this.taskNum[i].test = false;
					this.taskNum[i].publish = false;
				}

			},
		}

	}
</script>

<style scoped>

</style>