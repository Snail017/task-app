<template>
	<div>
		<nav class="navbar nav-cont" role="navigation">
			<ul class="nav navbar-nav">
				<li @click.stop="turns($event,1)" data-status='progress' class="active">进行中</li>
				<li @click.stop="turns($event,2)" data-status='finish'>已完成</li>
				<li @click.stop="turns($event,3)" data-status='waitconfirm'>待确定</li>
				<li @click.stop="turns($event,4)" data-status='destroy'>已作废</li>
				<li @click.stop="turns($event,5)">创建任务</li>
			</ul>
		</nav>
		<div v-show="!istask" class="content">
			<ul class="content-nav">
				<li> <span>事项：</span> <input type="text" placeholder="输入任务名称" class="taskName"> <span class="ico-search" @click.stop='search("id")'></span> </li>
				<li> <span>项目组：</span>
					<div class="select">
						<select class="js-example-templating js-states form-control sel_menu">
							<option value="0">请选择</option>
							<template v-for="item in project_data">
								<option :value=item.id>[{{item.id }}]{{item.name}}</option>
								<option :value=items.id v-for="items in item.children"> &nbsp;&nbsp;&nbsp;&nbsp;├ [{{items.id }}]{{items.name}}</option>
							</template>
						</select>
					</div>
				</li>
				<li> <span @click.stop="submit()">发布人：</span>
					<div class="select">
						<select class="js-example-templating js-states form-control sel_menu">
							<option value="0">请选择</option>
							<template v-for="item in user_data">
								<option :value=item.id>[{{item.id}}]{{item.name}}</option>
							</template>
						</select>
					</div>
				</li>
				<li> <span>执行人：</span>
					<div class="select">
						<select class="js-example-templating js-states form-control sel_menu">
							<option value="0">请选择</option>
							<template v-for="item in user_data">
								<option :value=item.id>[{{item.id}}]{{item.name}}</option>
							</template>
						</select>
					</div>
				</li>
				<li> <label class="demo--label"> <input class="demo--radio" type="checkbox" data-flag="checker"> <span class="demo--radioInput"></span>我验收 </label> <label class="demo--label"> <input class="demo--radio" type="checkbox" data-flag="originator "> <span class="demo--radioInput"></span>我创建</label> </li> <span class="ico-search" @click.stop='search("all")'></span> </ul>
		</div>
		<div v-show="!istask" v-for="item in task_list" class="task">
			<div>
				<div class="task-title" @click.stop="WinShow($event,2)"> <img src="../assets/img/ico-task.png" alt=""> <span>事项ID：{{item.id}}</span> <span>|</span> <span>事项：{{item.name}} <em>（点击事项名查看详细事项内容）</em></span> <span class="btn-abolish" @click.stop="delId(item.id)" v-if="item.hasOwnProperty('enable') && item.enable.indexOf('destroy') != -1">删除</span> </div>
				<ul class="task-body">
					<li> <span>任务执行人</span> <span>{{item.hasOwnProperty("begin_time") && item.begin_time != null?item.begin_time.split("-")[1].split("-")[0]:''}}月</span>
						<div class="progressCon">
							<v-touch class="progress" @panmove="touch($event)" tag="p"> <span v-for="items in item.date_len">{{items.val}}</span> </v-touch>
						</div>
					</li>
					<div v-for="(items,index) in item.sub_task" class="st_progress">
						<li> <span @click.stop="WinShow($event,1)" class="st_proname">{{items.executor_name}} <em>{{items.dept_name}}</em></span> <span><em class="progPerc">{{items.hasOwnProperty('progress')?items.progress+'%':'-'}}</em> <em v-show="enableKey(items) != '-1'" class="ico_per" @click.stop="WinShow($event, enableKey(items))"><span >{{items | enableName}}</span></em>
							</span>
							<div>
								<v-touch class="progress" @panmove="touch($event)" tag="div">
									<div v-for="clr in items.progress_bar" :class="'progress-bar progress-bar-'+clr.color" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" :style="'width: '+clr.progress+'%;'"></div>
								</v-touch>
							</div>
						</li>
					</div>
				</ul>
			</div>
		</div>
		<div v-show="istask">
			<form class="st-form">
				<div class="st-issue">
					<p> <span>事项名称：<input type="text" name="name" placeholder="点击输入事项名" class="create_name"></span> </p>
					<p> <span>需要完成时间：<input type="text" name="estimated_finish_time" placeholder="点击选择完成时间" class="data-input1"></span> </p>
				</div>
				<div> <span class="task_title">事项内容</span> <textarea class="summernote" name="content"></textarea> </div>
				<Vtask v-for="taskNum in taskNum" :taskNum=taskNum @listenIndex="showIndex"></Vtask>
				<p class="st-addtask"> <span @click.stop="addtask('add')">添加任务</span> <span v-if="!submitOk">发布</span> <span @click.stop="submit" class="on" v-if="submitOk">发布</span> </p>
			</form>
			<Vfeedback></Vfeedback>
		</div>
		<div class="st_start window" v-show="windowShow">
			<p>是否确定{{items | enableName}}</p>
			<p> <span @click="sureTask(items)">确定</span> <span @click="windClose">取消</span> </p>
		</div>
		<div class="st_SurePerc window" v-show="windowShow">
			<p>进度<input type="text" name="progress" />%</p>
			<p> <span @click="progress(items,$event)">确定</span> <span @click="windClose">取消</span> </p>
		</div>
		<div class="window-max window" v-show="windowShow"> <span class="st-del" @click.stop="windClose"></span>
			<ul>
				<li>名称：<span>{{winMax.name}}</span></li>
				<li v-if="winMax.content!=undefined"> <span>内容：</span>
					<div v-html='winMax.content'></div>
				</li>
				<p>需要完成时间：<span class="clr-ff5400">{{winMax.end_time}}</span></p>
			</ul>
			<ul v-for="items in winMax.sub_task" class="winul2">
				<li>
					<p>部门类型：<span class="clr-ff5400">{{ items| data('dept_name') }}</span></p>
					<p v-if="items.type=='common'">执行人：<span class="clr-ff5400">{{items.executor_name}}</span></p>
					<p v-if="items.type=='common'">验收人：<span class="clr-ff5400">{{items.checker_name}}</span></p>
				</li>
				<li v-if="items.type=='common'">
					<p>预计开始时间：<span class="clr-ff5400">{{ items | data('estimated', 'begin_time') | dateTime2Date }}</span></p>
					<p>实际开始时间：<span class="clr-ff5400">{{ items | data('begin_time') | dateTime2Date }}</span></p>
					<p>预计结束时间：<span class="clr-ff5400">{{ items | data('estimated', 'end_time') | dateTime2Date}}</span></p>
					<p>实际结束时间：<span class="clr-ff5400">{{ items | data('finish_time') | dateTime2Date }}</span></p>
				</li>
				<li v-if="items.type=='common'">
					<p>事项内容:</p>
					<p v-html="items.content" class="st_area"></p>
				</li>
			</ul>
		</div>
		<div class="window-min window" v-show="windowShow">
			<ul>
				<li>
					<p>部门类型：<span class="clr-ff5400">{{winMin.dept_name}}</span></p>
					<p>执行人：<span class="clr-ff5400">{{winMin.executor_name}}</span></p>
					<p>验收人：<span class="clr-ff5400">{{winMin.checker_name}}</span></p>
				</li>
				<li>
					<p>预计开始时间：<span class="clr-ff5400">{{ winMin | data('estimated', 'begin_time') | dateTime2Date }}</span></p>
					<p>实际开始时间：<span class="clr-ff5400">{{ winMin | data('begin_time') | dateTime2Date }}</span></p>
					<p>预计结束时间：<span class="clr-ff5400">{{ winMin | data('estimated', 'end_time') | dateTime2Date }}</span></p>
					<p>实际结束时间：<span class="clr-ff5400">{{ winMin | data('finish_time') | dateTime2Date }}</span></p>
				</li> <span class="st-del" @click.stop="windClose"></span> </ul>
			<div v-if="winMin.content!=null&&items.content!=''">
				<p>内容</p>
				<p v-html="winMin.content" class="winmin_cont"></p>
			</div>
			<div class="st_info" v-if="items.hasOwnProperty('info')">
				<p v-for="info in items.info">info</p>
			</div>
		</div>
		<div class="bg2"></div>
		<div class="bg1 bg" v-if="msgOk" @click="msgOk=false"></div>
		<div v-if="msgOk" class="msg">{{msg}}</div>
	</div>
</template>
<script>
	import Vtask from './task'
	import Vfeedback from './feedback'
	export default {
		name: "Vcontent",
		data() {
			return {
				num: 5,
				windowShow: false,
				taskNum: [{
					project: true,
					publish: false,
					test: false,
					index: 1
				}],
				winMax: [],
				winMin: [],
				Apidate: '',
				submitOk: true,
				istask: false,
				task_list: '',
				msgOk: false,
				msg: '',
				task_key: [{
					status: 'progress',
					id: '',
					flag: '',
					originator: '',
					executor: '',
					department: '',
				}],
				dateLen: [],
			}
		},
		components: {
			Vtask,
			Vfeedback
		},
		computed: {
			project_data() {
				return this.$store.state.department_list;
			},
			user_data() {
				return this.$store.state.user_data;
			},
		},
		filters: {
			data: function() {
				var argv = arguments;
				var obj = argv[0] || {};
				for(var i = 1; i < argv.length; i++) {
					if(obj.hasOwnProperty(argv[i]) && obj[argv[i]] != null) {
						obj = obj[argv[i]];
					} else {
						return "";
					}
				}
				return obj;
			},
			dateTime2Date: function(value) {
				if(value.length > 10) {
					return value.slice(0, 10);
				} else {
					return value;
				}
			},
			enableName: function(value) {
				var nameMap = {
					'confirm': '确认',
					'begin': '开始',
					'progress': '更改进度',
					'finish': '完成'
				};
				if(!value.hasOwnProperty('enabled')) {
					return "";
				}
				value = value['enabled'];
				if(value.length > 0) {
					value = value[0];
				}
				return nameMap.hasOwnProperty(value) ? nameMap[value] : "";
			},
			showConfirm: function(value) {
				var enable = ['confirm', 'begin', 'finish'];
				if(enable.indexOf(value) !== -1) {
					return true;
				}
				return false;
			}
		},
		mounted() {
			this.axios.defaults.headers = {
				'Token': localStorage.token,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			this.task_func();
			var _this = this;
			this.$store.dispatch('ajax', {
				vue: this
			});
			$(document).on("select2:select", ".sel_menu1", function(e) {
				e.preventDefault();
				var type = e.params.data.element.dataset.type,
					index = e.params.data.element.dataset.index;
				console.log(index) if(type == 1) {
					_this.addtask("proj", index);
				} else {
					_this.addtask("noproj", index);
				}
			});
		},
		methods: {
			enableKey: function(value) {
				var nameMap = {
					'confirm': '3',
					'begin': '3',
					'progress': '4',
					'finish': '3'
				};
				if(!value.hasOwnProperty('enabled')) {
					return -1;
				}
				value = value['enabled'];
				if(value.length > 0) {
					value = value[0];
				}
				return nameMap.hasOwnProperty(value) ? nameMap[value] : -1;
			},
			sureTask(item) {
				var value = item['enabled'] || [];
				if(value.length > 0) {
					value = value[0];
				} else {
					return false;
				}
				if(value == "") {
					return false;
				}
				var urlMap = {
					'confirm': 'confirm',
					'begin': 'mark/begin',
					'finish': 'finish/confirm'
				};
				if(urlMap.hasOwnProperty(value)) {
					value = urlMap[value];
				} else {
					return false;
				}
				var _this = this;
				this.$http.post('/task/' + value, 'sub_id=' + item.id + '', {
					emulateJSON: true
				}).then(function(res) {
					if(res.data.code == '200') {
						item.enabled = res.data.enabled;
						_this.msgOk = true;
						_this.msg = res.data.msg;
						_this.windClose()
					} else {
						_this.windClose() _this.msgOk = true;
						_this.msg = res.data.msg;
					}
				})
			},
			progress(item, e) {
				var _this = this;
				let progress = $(e.target).parents(".st_progress").find(".st_SurePerc input").val();
				this.$http.post('/task/progress', 'sub_id=' + item.id + '&progress=' + progress, {
					emulateJSON: true
				}).then(function(res) {
					if(res.data.code == '200') {
						$(e.target).parents(".st_progress").find(".progPerc").text(res.data.progress + '%');
						item.enabled = res.data.enabled;
						_this.windClose(e)
					} else {
						_this.windClose(e) _this.msgOk = true;
						_this.msg = res.data.msg;
					}
				})
			},
			search(str) {
				let _this = this;
				let $id = $(".taskName").val(),
					$status = $(".active").data("status"),
					$flag1 = ($(".demo--radio:checked").eq(0).data("flag") == undefined) ? "" : $(".demo--radio:checked").eq(0).data("flag"),
					$flag2 = ($(".demo--radio:checked").eq(1).data("flag") == undefined) ? "" : $(".demo--radio:checked").eq(1).data("flag"),
					$originator = $(".select").find(".select2-selection__rendered").eq(0).text(),
					$department = $(".select").find(".select2-selection__rendered").eq(1).text(),
					$executor = $(".select").find(".select2-selection__rendered").eq(2).text();
				if(str == "id") {
					this.task_key = [{
						status: $status,
						id: $id,
						flag: '',
						originator: '',
						executor: '',
						department: '',
					}];
				}
				if(str == "all") {
					this.task_key = [{
						status: $status,
						id: $id,
						flag: ($flag1 == "" && $flag2 == "") ? '' : $flag1 + ',' + $flag2,
						originator: ($originator == "请选择") ? "" : _this.ToNum($originator),
						executor: ($executor == "请选择") ? "" : _this.ToNum($executor),
						department: ($department == "请选择") ? "" : _this.ToNum($department),
					}];
				}
				this.task_func();
			},
			delId(id) {
				var _this = this;
				this.$http.post('/task/destroy', 'task_id=' + id + '', {
					emulateJSON: true
				}).then(function(res) {
					if(res.data.code == '200') {
						_this.task_func();
					} else {
						_this.msgOk = true;
						_this.msg = res.data.msg;
					}
				})
			},
			imgUpload(files) {
				console.log(files) this.$http.post('upload', files, {
						emulateJSON: true
					}).then(function(result) {
							console.log(result);
							if(result.data.code = "200") {
								var imgNode = document.createElement("img"); //读取后台返回的图片url imgNode.src = result.data.data.url; $('.summernote').summernote('insertNode', imgNode); } }); }, showIndex(res) { console.log(res) let type = res.split(",")[1], index = res.split(",")[0], _eq = Number(index) - 1; if(_eq >= 0) { console.log(type + ' ' + index + ' ' + _eq); if(type == 'project') { this.taskNum.splice(_eq, 1); } else if(type == 'test') { this.taskNum[_eq].test = false; } else if(type == "publish") { this.taskNum[_eq].publish = false; } } }, checkCont() { let _createName = document.getElementsByClassName("create_name"), _dataInput1 = document.getElementsByClassName("data-input1"), _noteEdit = document.getElementsByClassName("note-editable"), _select2XMZ = document.getElementsByClassName("select2-selection__rendered"); let flag = true; for(let i = 0; i < _createName.length; i++) { if(_createName[i].value == "" || _createName[i].value == undefined) { this.submitOk = false; flag = false; break; } else { this.submitOk = true; } }; if(flag) { for(let i = 0; i < _dataInput1.length; i++) { if(_dataInput1[i].value == '' || _dataInput1[i].value == undefined) { this.submitOk = false; flag = false; break; } else { this.submitOk = true; } }; } if(flag) { for(let i = 0; i < _noteEdit.length; i++) { if(_noteEdit[i].innerHTML == '' || _noteEdit[i].value == undefined) { this.submitOk = false; flag = false; break; } else { this.submitOk = true; } }; } if(flag) { for(let i = 0; i < _select2XMZ.length; i++) { if(_select2XMZ[i].value == '' || _select2XMZ[i].value == undefined) { this.submitOk = false; flag = false; break; } else { this.submitOk = true; } }; } }, CheckData() { var formData = $('.st-form').serializeArray(); console.log(formData); let _subtask = {}, submitData = {}; for(var i in formData) { if(formData.hasOwnProperty(i)) { let { name, value } = formData[i]; let issub = false, index = -1; var nameSplit = -1; if((nameSplit = name.indexOf('-')) != -1) { issub = true; name = name.substr(0, nameSplit); index = name.substr(nameSplit); } if(name == 'estimated_finish_time' || name == 'estimated_begin_time' || name == 'estimated_end_time') { value = this.ToData(value); } value = $.trim(value); if(index == -1) { if(name == 'name' && value == '') { this.msgOk = true; this.msg = "请输入事项名称"; return false; } else if(name == 'estimated_finish_time' && value == '') { this.msgOk = true; this.msg = "请选择完成时间"; return false; } else if(name == 'content' && value == '') { this.msgOk = true; this.msg = "请填写任务详细内容"; return false; } submitData[name] = value; } else { switch(name) { case 'department': if(value == "") { this.msgOk = true; this.msg = "请选择任务" + index + "的项目组"; return false; } break; case 'executor': if(value == "") { this.msgOk = true; this.msg = "请选择任务" + index + "的执行人"; return false; } break; case 'checker': if(value == "") { this.msgOk = true; this.msg = "请选择任务" + index + "的验收人"; return false; } break; case 'estimated_begin_time': if(value == "") { this.msgOk = true; this.msg = "请填写任务" + index + "的预计开始时间"; return false; } break; case 'estimated_end_time': if(value == "") { this.msgOk = true; this.msg = "请填写任务" + index + "的预计结束时间"; return false; } break; case 'content': if(value == "") { this.msgOk = true; this.msg = "请填写任务" + index + "的详细内容"; return false; } break; } if(_subtask.hasOwnProperty(index)) { _subtask[index][name] = value; } else { _subtask[index] = { 'type': 'common', }; _subtask[index][name] = value; } } } } submitData['subtask'] = Object.values(_subtask); //取得选择的问题反馈 var _id = '', $CheckBox = $(".right-nav .demo--radio:checked"); for(let i = 0; i < $CheckBox.length; i++) { let id = $CheckBox.eq(i).data("id"); console.log(id) _id = id + ',' + _id; } submitData['feedback_id'] = _id; this.Apidate = $.param(submitData); return true; }, ToNum(str) { return str.split("[")[1].split(']')[0] }, ToData(str) { if(str != "" && str != undefined) { var year = str.split("年")[0], month = str.split("年")[1].split("月")[0], day = str.split("年")[1].split("月")[1].split("日"), date = year + '-' + month + '-' + day; return date; } }, submit() { let result = this.CheckData(); if(result == false) { return false; } let _this = this; this.$http.post('/task/create', this.Apidate, { emulateJSON: true }).then(function(res) { if(res.data.code == 200) { _this.msgOk = true; _this.msg = "发布成功"; } else { _this.msgOk = true; _this.msg = res.data.msg; } }); }, addtask(res, index) { let i = Number(index) - 1; if(res == "add") { this.taskNum.push({ project: true, publish: false, test: false, index: Number(this.taskNum.length) + 1 }) } else if(res == 'proj') { this.taskNum[i].test = true; this.taskNum[i].publish = true; } else if(res == 'noproj') { this.taskNum[i].test = false; this.taskNum[i].publish = false; } }, task_func() { var _this = this; this.$http.post('/task/list', "status=" + _this.task_key[0].status + "&id= " + _this.task_key[0].id + "&department= " + _this.task_key[0].department + "&originator= " + _this.task_key[0].originator + "&executor= " + _this.task_key[0].executor + "&flag= " + _this.task_key[0].flag + "" ).then(function(res) { if(res.data.code == "200" && res.data.data.length > 0) { _this.task_list = res.data.data; for(let i = 0; i < _this.task_list.length; i++) { _this.dateLen = []; _this.numDate(_this.task_list[i].begin_time, _this.task_list[i].end_time); _this.task_list[i].date_len = _this.dateLen } _this.$nextTick(function() { _this.progressLen() }) } else { _this.task_list = []; } }); }, progressLen() { for(let i = 0; i < $(".task-body").length; i++) { let _width = $(".task-body").eq(i).find(".progress").eq(0).children("span").length * 60; $(".task-body").eq(i).find(".progress").css("width", _width + 'px') } }, getDate(datestr) { var temp = datestr.split(" ")[0].split("-"); var date = new Date(temp[0], temp[1], temp[2]); return date; }, numDate(start, end) { var _this = this; var startTime = this.getDate(start), endTime = this.getDate(end); _this.date_len = []; while((endTime.getTime() - startTime.getTime()) >= 0) { var year = startTime.getFullYear(); var month = startTime.getMonth().toString().length == 1 ? "0" + startTime.getMonth().toString() : startTime.getMonth(); var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate(); _this.dateLen.push({ val: month + '/' + day }); startTime.setDate(startTime.getDate() + 1); }; }, turns(event, tp) { //点击切换内容， var _this = $(event.currentTarget); $(".sel_menu").select2("val", "请选择"); _this.parent().children("li").removeClass("active"); _this.addClass("active"); if(tp === 5) { //==4是为创建任务 ！=4时为任务显示，dom不改变 ，里面的内容渲染发生改变。 this.istask = true; } else { this.istask = false; if(tp === 1) { this.task_key[0].status = "progress"; this.task_func(); } else if(tp === 2) { this.task_key[0].status = "finish" this.task_func(); } else if(tp === 3) { this.task_key[0].status = "waitconfirm" this.task_func(); } else if(tp === 4) { this.task_key[0].status = "destroy" this.task_func(); } } }, WinShow(event, type) { //type===1 显示执行人弹窗内容，type===2显示任务弹窗 $(".window").hide(); var _this = $(event.target); $(".bg2").show(); if(type === 1) { _this.parents(".st_progress").children(".window-min").show(); } else if(type === 2) { _this.parents(".task").children(".window-max").show(); } else if(type === "3") { _this.parents(".st_progress").children(".st_start").show(); } else if(type == "4") { _this.parents(".st_progress").children(".st_SurePerc").show(); } console.log(type); }, windClose(event) { // var _this = $(event.target); $(".window").hide(); $(".bg2").hide() }, touch(event) { //独立封装这个事件可以保证执行顺序，从而能够访问得到应该访问的数据。 var _this = $(event.target).parents(".task-body").find(".progress"), _this1 = $(event.target).parents(".task-body").find(".progressCon"), _x; if(event.additionalEvent == 'panleft') { _x = Number(_this.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4]) - parseInt(event.direction * 2.5); } else { _x = Number(_this.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4]) + parseInt(event.direction * 2.5); } if(_x > 0 || _this[0].offsetWidth < _this1[0].offsetWidth) { _x = 0 } if(_this[0].offsetWidth > _this1[0].offsetWidth) { if(_x < _this1[0].offsetWidth - _this[0].offsetWidth) { _x = _this1[0].offsetWidth - _this[0].offsetWidth } } _this.css("transform", "translate(" + _x + "px,0px)"); }, }, }
</script>
<style scoped>

</style>