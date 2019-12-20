<template id="addtask">
	<div>
		<div class="st_addtask addtask" >
			<span class="task_title">任务{{taskNum.index}}</span>
			<span class="st-del" @click="sendIndex" data-type='project' :data-index=taskNum.index></span>
			<ul>
				<li>
					<p>
						<span>部门：</span>
						<select :name="'department-'+taskNum.index" :id="'department-'+taskNum.index" class="js-example-templating js-states form-control sel_menu sel_menu1">
							<option value="0">请选择</option>
							<template v-for="item in department_list">
								<option  :value="item.id" :data-id=item.id :data-index=taskNum.index :data-lft=item.lft :data-type="((item.attr & 1) == 1?1:0)"   :data-name="item.name" >
                                {{ item.depth > 1 ?  (new Array( item.depth -2 ).join('&nbsp;&nbsp;&nbsp;&nbsp;┊')+ '&nbsp;&nbsp;&nbsp;&nbsp; ├ '):"" }} [{{item.id}}] {{item.name}}                           
                                </option>
							</template>
						</select>
					</p>
					<p>
						<span>执行人：</span>
						<select :name="'executor-'+taskNum.index" :id="'executor-'+taskNum.index"  class="js-example-templating js-states form-control sel_menu">
							<option value="0">请选择</option>
							<template v-for="item in user_data">
								<option :value=item.id>[{{item.id}}]{{item.name}}</option>
							</template>

						</select>
					</p>
					<p>
						<span>验收人：</span>
						<select :name="'checker-'+taskNum.index" class="js-example-templating js-states form-control sel_menu">
							<option value="0">请选择</option>
							<template v-for="item in user_data">
								<option :value=item.id>[{{item.id}}]{{item.name}}</option>
							</template>
						</select>
					</p>
					
				</li>
				<li class="addli2">
					<p>预计开始时间：<input type="text" :name="'estimated_begin_time-'+taskNum.index" class="data-input1" autocomplete="off"></p>
					<!--<p>实际开始时间：<input type="text" class="data-input1"></p>-->
					<p>预计结束时间：<input type="text" :name="'estimated_end_time-'+taskNum.index"  class="data-input1" autocomplete="off"></p>
					<!--<p>实际结束时间：<input type="text" class="data-input1"></p>-->
				</li>
				<li>
					<textarea class="summernote1" :name="'content-'+taskNum.index"></textarea>
					<input type="hidden" :name="'version_type-'+taskNum.index">
					<input type="hidden" :name="'version_appid-'+taskNum.index">
					<input type="hidden" :name="'version_channelid-'+taskNum.index">
					<input type="hidden" :name="'version_gameid-'+taskNum.index">
					<input type="hidden" :name="'version_servername-'+taskNum.index">
					<input type="hidden" :name="'version-'+taskNum.index">
					<input type="hidden" :name="'related_vid-'+taskNum.index">
					<input type="hidden" :name="'vid-'+taskNum.index">	
					<input type="hidden" :name="'flag-'+taskNum.index" :value="(taskNum.test?'test':'')+(taskNum.publish?',publish':'')">
				</li>
				<li class="addlinote" v-show="isProjectTeam">
					<label style="float: left">
						<input type="checkbox" name="is_replace-1" v-model="change"  :value="change?1:0" >
						替换包
					</label>
					<a @click="iframeShow=true;currentIndex=taskNum.index" :id="'info-'+taskNum.index" >关联版本（点击关联版本）</a>
				</li>
			</ul>
			<input type="hidden" :id="'iframe-'+taskNum.index" v-model='iframeShow'>
			<div v-show="iframeShow" class="iframeBox">
				<div class="bg" @click="iframeShow=false"> </div>
				<iframe :src="ifSrc+'/' + taskNum.index + '/'+(this.change?1:0)" frameborder="1" width="90%" height="420px"></iframe>
			</div>
		</div>
		<div class="st_addtask" :class="{addtask:taskNum.test}" v-show="taskNum.test">
			<span class="task_title">任务{{taskNum.index}}的测试组</span>
			<span class="st-del" @click="sendIndex" data-type='test' :data-index=taskNum.index></span>
			<ul>
				<li>
					<p>
						<span>项目组：</span>
						<span>测试组</span>
					</p>
				</li>

				<li>
					<textarea class="summernote1" :name="'test_content-'+taskNum.index" ></textarea>
				</li>
			</ul>
		</div>
		<div class="st_addtask" :class="{addtask:taskNum.test}" v-show="taskNum.publish">
			<span class="task_title">任务{{taskNum.index}}的发布组</span>
			<span class="st-del" @click="sendIndex" data-type='publish' :data-index=taskNum.index></span>
			<ul>
				<li>
					<p>
						<span>项目组：</span>
						<span>发布组</span>
					</p>
				</li>
				<li>
					<textarea class="summernote1" :name="'publish_content-'+taskNum.index" ></textarea>
				</li>
			</ul>
		</div>

	</div>
</template>

<script>
	export default {
		name: "task",
		data() {
			return {
				currentIndex: 0,
				iframeShow: false,
				ifSrc: this.$store.state.baseURL +  '/product/versionApi/' + localStorage.token,
				isProjectTeam:0,
				change:'',
			}
		},
		mounted() {
			this.axios.defaults.headers = {
				'Token': localStorage.token,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			var _this=this;

			$(".sel_menu").select2({
				Width: '100px',
				placeholder: "请选择"
			});

			$('.summernote1,.summernote').summernote({
				placeholder: '点击输入事项内容',
				tabsize: 4,
				height: 200,
				callbacks: {
				 	onImageUpload: function(files) {
				 		 var imageData = new FormData();
				 		 var $this = $(this);
				 		 imageData.append("photo", files[0]);
				 		_this.imgUpload(imageData, $this);
				 	}
				 }
			});

			$('.data-input1').datepicker({
				language: 'zh-CN',
				autoclose: true,
				dateFormat: "yy-mm-dd",
				startDate: this.nowdate(),
			}).on('changeDate', function(ev) {
				if ($(ev.target).attr('name') == 'estimated_finish_time') {
		         	if (ev.date) {
		         	   	$('.addtask .data-input1').datepicker('setStartDate', new Date())
		               	$('.addtask .data-input1').datepicker('setEndDate', new Date(ev.date.valueOf()))
		               	_this.$emit('setEndDate',new Date(ev.date.valueOf()));
		            } else {
		            	$('.addtask .data-input1').datepicker('setStartDate', new Date())
		               	$('.addtask .data-input1').datepicker('setEndDate', null);
		               	_this.$emit('setEndDate', null);
		            }
	            }
  		    });
            $('.data-input-all').datepicker({
                language: 'zh-CN',
                autoclose: true,
                dateFormat: "yy-mm-dd",
            }).on('changeDate', function(ev) {
                if ($(ev.target).attr('name') == 'estimated_finish_time') {
                    if (ev.date) {
                        $('.addtask .data-input1').datepicker('setStartDate', new Date())
                        $('.addtask .data-input1').datepicker('setEndDate', new Date(ev.date.valueOf()))
                        _this.$emit('setEndDate',new Date(ev.date.valueOf()));
                    } else {
                        $('.addtask .data-input1').datepicker('setStartDate', new Date())
                        $('.addtask .data-input1').datepicker('setEndDate', null);
                        _this.$emit('setEndDate', null);
                    }
                }
            });
  		    if (_this.endDate != null) {
  		    	$('.addtask .data-input1').datepicker('setEndDate', _this.endDate);
  		    }

			$('#iframe-'+_this.taskNum.index).on('change', function() {
	            _this.iframeShow = false;
			})

			$('input[name=version_type-'+_this.taskNum.index+']').on('change', function() {

				var version_type = $(this).val();
				if (version_type == 'server') {
					_this.taskNum.publish = false;
				} else {
					_this.taskNum.publish = true;
				}
			})

			$('#department-'+_this.taskNum.index).on('change', function() {
				_this.isProjectTeam = $(this).find('option:selected').data('type');

				var lft = $(this).find('option:selected').data('lft');

				var dept = _this.department_list.hasOwnProperty(lft)?_this.department_list[lft]:{};
				var user = dept.hasOwnProperty('user')? dept['user'] :[];

				if (_this.isProjectTeam) {
					_this.taskNum.test = true;
					_this.taskNum.publish = true;
				}

				var option = '<option value="0">请选择</option>'; 
				var selected = "";
				for(var i in user) {
					if (typeof(_this.user) != 'undefined' && _this.user.hasOwnProperty('id') && user[i].id == _this.user.id) {
						selected = "selected";
					} else {
						selected = "";
					}
					option += '<option value="' + user[i].id+'" '+selected+'>['+user[i].id+']'+ user[i].name+'</option>';
				}
				$('#executor-'+_this.taskNum.index).html(option);
				$('#executor-'+_this.taskNum.index).select2({
					Width: '100px',
					placeholder: "请选择"
				});
			})
			if (typeof(_this.user) != 'undefined' && _this.user.hasOwnProperty('dept')) {
				$('#department-'+_this.taskNum.index).val(_this.user.dept).trigger('change');
			}
			console.log()
		},
		props: {taskNum:{type:Object},endDate:{type:null}, eventHub:{type:Object},department_list:{type:null},user_data:{type:Array}, user:{type:null}, istask:null},
		methods: {
			nowdate() {
				var day2 = new Date();
				day2.setTime(day2.getTime());
				var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
				return s2;
			},
			imgUpload(files,editor){
				this.$http.post('upload', files, {
					emulateJSON: true
				}).then(function(result) {
					 if (result.data.code = "200") {
					 	var imgNode = document.createElement("img");
					 	//读取后台返回的图片url
					 	imgNode.src = result.data.data.url;

					 	editor.summernote('insertNode', imgNode);
					 }

				});
			},
			sendIndex(e) {
				this.$emit("listenIndex", $(e.target).data("index") + ',' + $(e.target).data("type"))
			}
		}
	}

</script>

<style scoped>

</style>