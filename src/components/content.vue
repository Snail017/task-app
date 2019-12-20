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
                    <li @click.stop="turns(1)" data-status='progress' class="col-md-3 ">
                        <span class="active">进行中</span>
                    </li>
                    <li @click.stop="turns(2)" data-status='waitconfirm' class="col-md-3" :class="typeof(user) != 'undefined' && user.hasOwnProperty('hasUnConfirm') &&  user.hasUnConfirm?'on':''">
                        <span>待确定</span>
                    </li>
                    <li @click.stop="turns(3)" data-status='finish' class="col-md-3">
                        <span>已完成</span>
                    </li>
                    <li @click.stop="turns(4)" data-status='destroy' class="col-md-3">
                        <span>已作废</span>
                    </li>
                </ul>
                <ul class="nav navbar-nav navbar-right col-md-4 row">
                    <li @click.stop="createTask()" v-if="user.createTask" class="createtask col-md-12">
                        <span>创建任务</span>
                    </li>
                </ul>
            </div>
        </nav>
        <div >
            <div v-show="!istask" class="content">
                <form method="post" @submit.prevent='search("all")'>
                    <ul class="content-nav">
                        <li>
                            <span>部门：</span>
                            <div class="select">
                                <select class="js-example-templating js-states form-control sel_menu select2 sel_depart">
                                    <option value="0">请选择</option>
                                    <template v-for="item in department_list">
                                        <option :value="item.lft +'-'+item.rgt" :data-id=item.id v-if="(( item.attr & 8 ) == 8)&&item.depth<=2">
                                            {{ item.depth > 1 ? (new Array( item.depth -2 ).join('&nbsp;&nbsp;&nbsp;&nbsp;┊')+ '&nbsp;&nbsp;&nbsp;&nbsp; ├ '):"" }} [{{item.id}}]
                                            {{item.name}}
                                            <!--[{{item.id}}]{{item.name}}-->
                                        </option>
                                    </template>
                                </select>
                            </div>
                        </li>
                        <li>
                            <span>项目组：</span>
                            <div class="select">
                                <select class="js-example-templating js-states form-control sel_menu select2">
                                    <option value="0">请选择</option>
                                    <template v-for="item in department_list">
                                        <option :value="item.id" :data-id=item.id :data-name="item.name" v-if="(( item.attr & 1 ) == 1)&&item.depth>2&&(item.lft>sel_depart.lft)&&(item.lft<sel_depart.rgt)">
                                            <!--{{ item.depth > 1 ?  (new Array( item.depth -2 ).join('&nbsp;&nbsp;&nbsp;&nbsp;┊')+ '&nbsp;&nbsp;&nbsp;&nbsp; ├ '):"" }} [{{item.id}}] {{item.name}}-->
                                            [{{item.id}}]{{item.name}}
                                        </option>
                                    </template>
                                </select>
                            </div>
                        </li>
                        <li class="issueSear">
                            <span>事项：</span>
                            <div>
                                <input type="text" placeholder="输入任务名称" class="taskName">
                            </div>
                        </li>
                        <li>
                            <span>创建人：</span>
                            <div class="select">
                                <select class="js-example-templating js-states form-control sel_menu select2">
                                    <option value="0">请选择</option>
                                    <template v-for="item in user_data">
                                        <option :value=item.id>[{{item.id}}]{{item.name}}</option>
                                    </template>
                                </select>
                            </div>
                        </li>
                        <li>
                            <span>执行人：</span>
                            <div class="select">
                                <select class="js-example-templating js-states form-control sel_menu select2">
                                    <option value="0">请选择</option>
                                    <template v-for="item in user_data">
                                        <option :value=item.id>[{{item.id}}]{{item.name}}</option>
                                    </template>
                                </select>
                            </div>
                        </li>
                        <li>
                            <label class="demo--label">
                                <input class="demo--radio" type="checkbox" data-flag="checker">
                                <span class="demo--radioInput"></span>我验收
                            </label>
                            <label class="demo--label">
                                <input class="demo--radio" type="checkbox" data-flag="originator ">
                                <span class="demo--radioInput"></span>我创建</label>
                        </li>
                        <li class="st_status">
                            <span>状态：</span>
                            <div class="select st-status">
                                <select name="task_status" class="js-example-templating js-states form-control sel_menu select2">
                                    <option value="0">请选择</option>
                                    <option value="testing" >测试中</option>
                                    <option value="error" >未通过</option>
                                    <option value="wait_publish" >未发布</option>
                                    <option value="success" >已经发布</option>
                                    <!--<option value="success" >未完成</option>-->
                                    <!--<option value="success" >已完成</option>-->
                                </select>
                            </div>

                        </li>
                        <li class="createTime">
                            <select name="" id="" style="border:0px" >
                                <option value="0">创建时间</option>
                                <option value="1">完成时间</option>
                            </select>：
                                <input  autocomplete="off" type="text" name="estimated_finish_time" placeholder="点击选择开始时间" class="data-input-all"  style="line-height: 28px;border:1px solid #ccc;text-align: center;border-radius: 5px;">
                                &nbsp;&nbsp;—&nbsp;&nbsp;
                                <input autocomplete="off" type="text" name="estimated_finish_time" placeholder="点击选择结束时间" class="data-input-all"  style="line-height: 28px;border:1px solid #ccc;text-align: center;border-radius: 5px;">

                        </li>
                        <p  @click.stop='search("all")' style="display:inline-block;margin: 15px 0 0;line-height: 27px;padding-left:10px;border:1px solid #ccc;background: #eff1f1;border-radius: 5px;cursor: pointer;">搜索
                            <span style="margin-left: 10px;;" class="ico-search"></span>
                        </p>
                    </ul>
                </form>
            </div>
            <div v-show="!istask" v-for="(item,index) in task_list" class="task">
                <div :class="{highone:item.highlight=='red',hightwo:item.highlight=='yellow'}">
                    <div class="task-title" @click='goDetail(item)'>
                        <!--<img src="../assets/img/ico-task.png" alt="" v-if="item.highlight==''">-->
                        <!--<img src="../assets/img/ico-whitetask.png" alt="" v-if="item.highlight=='red'||item.highlight=='dept'">-->
                        <em class="icon iconfont " v-bind:class="{ 'icon-tubiao37':(!item.hasOwnProperty('Ishow')||(item.hasOwnProperty('Ishow')&&(item.Ishow==false))) ,'icon-tubiao35':(item.hasOwnProperty('Ishow')&&(item.Ishow==true))}"
                            @click.stop='Ishow(item,index)'></em>
                        <!--v-bind:class="{ 'icon-tubiao37':(!item.hasOwnProperty('Ishow')||(item.hasOwnProperty('Ishow')&&(item.Ishow==false))) ,'icon-tubiao35':(item.hasOwnProperty('Ishow')&&(item.Ishow==true))||(!item.hasOwnProperty('Ishow')&&index==1)||(!item.hasOwnProperty('Ishow')&&index==2)||(!item.hasOwnProperty('Ishow')&&index==0)}"   默认显示前三个-->
                        <span>事项：{{item.name}} （{{item.id}}）</span>
                        <span v-if="item.plan!=0">|</span>
                        <span @click.stop='plan(item)' class="st_tititle1 st_note" v-if="item.plan!=0" :tips=item.plan_name>计划：{{item.plan_month}}({{item.plan}}) </span>
                        <!--<span class="st_tititle1">事项：{{item.name}} </span>-->
                        <!--<span class="st_tititle1">事项：{{item.name}} </span>-->
                        <div class="btn-name">
                            <span>创建人：{{item.originator_name}}&nbsp;&nbsp;</span>
                            <span class="btn-abolish" @click.stop="WinShow(index,5,item,index)" v-if="item.hasOwnProperty('enable') &&  (item.enable.indexOf('destroy') != -1||item.enable.indexOf('cantDelete') != -1)">删除</span>
                        </div>
                    </div>
                    <ul class="task-body" v-if="!(item.hasOwnProperty('Ishow')&&item.Ishow==true)">
                        <!--v-if="(item.hasOwnProperty('Ishow')&&item.Ishow==true)||(!item.hasOwnProperty('Ishow')&&index==1)||(!item.hasOwnProperty('Ishow')&&index==2)||(!item.hasOwnProperty('Ishow')&&index==0)"      只展开前三个-->
                        <li>
                            <span>任务</span>
                            <span class="body_mon">{{item.hasOwnProperty("begin_time") && item.begin_time != null?item.begin_time.split("-")[1].split("-")[0].split("0")[1]:''}}
                                <br />月</span>
                            <div class="progressCon" :style={width:proWidth}>
                                <v-touch class="progress" @panmove="touch($event)" tag="p" v-bind:style="{width:item.date_len.length*60+'px'}">
                                    <span v-for="items in item.date_len" :class=items.toNext :data-month=items.month>{{items.val}}</span>
                                </v-touch>
                            </div>
                        </li>
                        <div v-for="(items,index) in item.sub_task" class="st_progress">
                            <li :class="{high_one:items.highlight=='user',high_two:items.highlight=='dept'}">
                                <span @click.stop="WinShow($event,items.type,items,index)" class="st_proname " :class="viewStatus(items)">{{items.executor_name}}
                                    <em v-if="items.hasOwnProperty('viewStatus')&&items.viewStatus!=''" class="viewStatus">{{items.viewStatus|enableName1}}</em>
                                    <em :class="{st_note:(items.dept_name.length>6||(items.hasOwnProperty('parent_dept_name')&&items.parent_dept_name!=null&&items.parent_dept_name!=''&&items.parent_dept_name!=undefined))}"
                                        :tips="((items.hasOwnProperty('parent_dept_name')&&items.parent_dept_name!=null&&items.parent_dept_name!=''&&items.parent_dept_name!=undefined)?(items.parent_dept_name+'>'):'')+items.dept_name">
                                        <template v-if="items.hasOwnProperty('parent_dept_name')&&items.parent_dept_name!=''&&items.parent_dept_name!=null&&items.parent_dept_name!=undefined">{{items.parent_dept_name}}></template> {{items.dept_name}} </em>
                                </span>
                                <span>
                                    <em class="progPerc progPerc1">{{items.hasOwnProperty('progress')?items.progress+'%':'-'}}</em>
                                    <em class="progPerc" v-if="item.status=='progress'"> {{items.hasOwnProperty('needProgress')?'/'+items.needProgress+'%':''}}</em>
                                    <em v-if="enableKey(items) == '-1'" class="ico_per" style="height: 0px;"></em>
                                    <em v-if="enableKey(items) != '-1'" class="ico_per" @click.stop="WinShow($event, enableKey(items),items,index)">
                                        <span>{{items | enableName}}</span>
                                    </em>
                                </span>
                                <div :style={width:proWidth}>
                                    <v-touch class="progress" @panmove="touch($event)" tag="div" v-bind:style="{width:item.date_len.length*60+'px'}">
                                        <div v-for="clr in items.progress_bar" :class="'progress-bar progress-bar-clr progress-bar-'+clr.color " role="progressbar"
                                            aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" :style="'width: '+clr.progress+'%;'"></div>
                                        <div v-for="clr in items.progress_bar" class="progress-bar-txt progress-bar" :style="'width: '+clr.progress+'%;'" v-text="clr.hasOwnProperty('hour')?clr.hour:''"></div>
                                    </v-touch>
                                </div>
                            </li>

                        </div>
                    </ul>
                </div>
            </div>
            <Vpage :page="page"  ref="pagination"   @current_page="current_page"></Vpage>
        </div>
        <div v-show="istask" style="overflow: hidden;">
            <form class="st-form" :class="{'col-md-8':feedback_list.length>0}" v-show="typeof(istask)!='object'">
                <div class="st-issue" v-show="typeof(istask)!='object'">
                    <p>
                        <span>事项名称：
                            <input type="text" autocomplete="off" placeholder="点击输入事项名" name='name' class="create_name" :readonly="typeof(istask)=='object'"
                                v-show="typeof(istask)!='object'">
                        </span>
                    </p>
                    <p>
                        <span v-show="typeof(istask)!='object'">需要完成时间：
                            <input autocomplete="off" type="text" name="estimated_finish_time" placeholder="点击选择完成时间" class="data-input1">
                        </span>
                    </p>
                </div>
                <div class="st_issue1_title">
                    <div class="st-issue1" v-show="typeof(istask)!='object'">
                        <!--<p>确定周期:<input type="text" name='cycle' value="1" autocomplete="off" />天</p>-->
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
                    <span class="task_title" v-if="typeof(istask)!='object'">事项内容</span>
                    <div style="margin-left: 5px;">
                        <div class="summernote" v-show="typeof(istask)!='object'" :readonly="typeof(istask)!='object'" name="content" style="opacity:0;width: 100%;border:1px solid #ccc;padding:10px;border-radius: 5px;"
                            v-html=istask.content></div>
                    </div>
                </div>

                <Vtask v-show="typeof(istask)!='object'" v-for="taskNum in taskNum" :taskNum=taskNum :endDate=endDate :department_list=department_list
                    :user_data=user_data :user=user @listenIndex="showIndex" @setEndDate="setEndDate"></Vtask>
                <p class="st-addtask" v-if="typeof(istask)!='object'">
                    <span @click.stop="addtask('add')">添加任务</span>
                    <span v-if="!submitOk">发布</span>
                    <span @click.stop="submit($event)" class="on" v-if="submitOk">发布</span>
                </p>
            </form>
            <Vfeedback v-if="typeof(istask)!='object'"></Vfeedback>
            <form v-if="typeof(istask)=='object'" class="st-form" :class="{'col-md-8':istask.feedback.length>0}">
                <div v-if="typeof(istask)=='object'">
                    <a class="btn btn-default" style="float: right;margin: 5px 5px 0 0;" v-if="typeof(istask)=='object'" @click.stop="turns(istask)">返回</a>
                    <div :class="{st_taskhead:typeof(istask)=='object'}">
                        <div>
                            <div v-if="typeof(istask)=='object'">
                                <p>
                                    <span style="display: block;font-size: 20px;;text-align: center;font-weight: bold;">事项名称：{{istask.hasOwnProperty('name')?istask.name:''}}</span>
                                </p>

                                <p>
                                    <span v-if="typeof(istask)=='object'">需要完成时间：{{istask.hasOwnProperty('estimated_finish_time')?istask.estimated_finish_time:''}}</span>
                                </p>
                            </div>
                            <div class="st-issue1" v-if="typeof(istask)=='object'" style="float: left;width: 100%;text-align: left;">
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
                                <span class="task_title" v-if="typeof(istask)=='object'">事项内容</span>
                                <div class="summernote" v-show="typeof(istask)=='object'" :readonly="typeof(istask)=='object'" name="content" style="width: 100%;border:1px solid #ccc;padding:10px;border-radius: 5px;"
                                    v-html=istask.content></div>
                            </div>
                        </div>

                    </div>
                    <div class="st_addtask addtask" v-if="typeof(istask)=='object'" v-for='(items,index) in istask.sub_task'>
                        <span class="task_title">任务{{index+1}}:{{istask.name}}的{{items.dept_name}}任务
                            <b v-if="items.status=='progress'">({{items.progress}}%)</b>
                            <b v-if="items.status=='finish'">(已完成)</b>
                        </span>
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
                            <li v-if="items.content!=''">
                                <div style="width: 100%;border:1px solid #ccc;padding: 10px;border-radius: 5px;" v-html=items.content></div>
                            </li>
                        </ul>
                    </div>
                </div>

            </form>
            <section class="right-nav " v-if="typeof(istask)=='object'&&istask.feedback.length>0">
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
        <div class="st_start window">

            <p v-if="st_start.hasOwnProperty('userbtn')||st_start.userbtnid=='change_version'">是否确定{{st_start.userbtnid|enableName1}}</p>
            <p v-else-if="st_start.hasOwnProperty('info')">是否确定更改发布时间</p>
            <p v-else>是否确定{{st_start | enableName}}</p>
            <p v-if="st_start.userbtnid=='cancel_publish'">
                <input class="reason" type="text" placeholder="取消发布原因" />
            </p>
            <p v-if="st_start.hasOwnProperty('info')" class="changePublishTime">
                <label class="demo--label">
                    <input class="demo--radio" type="checkbox" data-flag="checker" v-model="checked">
                    <span class="demo--radioInput"></span>
                </label> 确定
                <input type="text" name="progress" :value="st_start.info[0].time" style="border:1px solid #ccc" class="data-input2" v-bind:readonly='!checked'
                />
            </p>
            <p v-show="st_start.userbtnid=='publish'||st_start.userbtnid=='confirm'">
                <label class="demo--label">
                    <input class="demo--radio" type="radio" name="publish_type" value="immediately" v-model="st_start.publish_type">
                    <span class="demo--radioInput"></span>
                </label>立即发布
                <label class="demo--label">
                    <input class="demo--radio" type="radio" name="publish_type" value="delayed" v-model="st_start.publish_type">
                    <span class="demo--radioInput"></span>
                </label>延时发布
                <input type="text" class="data-input3" v-show='st_start.publish_type=="delayed"' v-model="st_start.publish_time" placeholder="请输入延时发布时间"
                />
            </p>
            <div v-if="st_start.hasOwnProperty('userbtnid')&&st_start.userbtnid=='change_version'" style="width: 90%;margin: auto;">
                <label class="demo--label">
                    <input class="demo--radio" type="checkbox" name="versionIf" value="immediately" v-model="st_start.versionIf">
                    <span class="demo--radioInput"></span>
                </label>版本号
                <input type="text" class="data-version" :readonly='!st_start.versionIf' placeholder="请输入版本号" :value="st_start.version" />
            </div>
            <p v-if="st_start.hasOwnProperty('defer')&&st_start.defer&&!st_start.hasOwnProperty('userbtnid')" class="del-reason">请输入延误原因：
                <input type="text" style='display: inline-block;border:1px solid #ccc;width: 90%;margin:auto' />
            </p>
            <p>
                <span v-if="st_start.hasOwnProperty('info')||st_start.hasOwnProperty('userbtn')||st_start.userbtnid=='confirm'||(st_start.hasOwnProperty('userbtnid')&&st_start.userbtnid=='change_version')"
                    @click="rdStatus(st_start,st_start.userbtnid)">确定</span>
                <span v-else @click="sureTask(st_start,$event)">确定</span>
                <span @click="windClose">取消</span>
            </p>
        </div>
        <div class="st_start1 window">
            <p>是否确定{{st_start1| enableName}}</p>
            <p>
                <label class="demo--label">
                    <input class="demo--radio" type="checkbox" data-flag="checker" v-model="checked">
                    <span class="demo--radioInput"></span>
                </label> 开始时间
                <input type="text" name="progress" class="data-input2" v-bind:readonly='!checked' :placeholder="st_start1.hasOwnProperty('estimated')&& st_start1.estimated.hasOwnProperty('begin_time')?st_start1.estimated.begin_time.split(' ')[0]:''"
                    :data-time="st_start1.hasOwnProperty('estimated')&& st_start1.estimated.hasOwnProperty('begin_time')?st_start1.estimated.begin_time.split(' ')[0]:''"
                />
            </p>
            <p>
                <span @click="sureTask(st_start1,$event)">确定</span>
                <span @click="windClose">取消</span>
            </p>
        </div>
        <div class="st_delok window">
            <p>是否确定删除</p>
            <p>
                <span @click="delId(st_delok.index,st_delok.id,$event)">确定</span>
                <span @click="windClose">取消</span>
            </p>
        </div>
        <div class="st_SurePerc window">
            <p>进度
                <input type="number" name="progress" />%</p>
            <p>
                <span @click="progress(st_SurePerc,$event)">确定</span>
                <span @click="windClose">取消</span>
            </p>
        </div>
        <div class="window-min window">
            <span class="st-del" @click.stop="windClose"></span>
            <div v-if='winMin.type=="plan"' class="st_winPlan">
                <p>
                    <span>计划名称：</span>
                    <span>{{winMin.name}}</span>
                </p>
                <p>
                    <span>发布人：</span>
                    <span>{{winMin.originator_name}}</span>
                </p>
                <p>
                    <span>计划内容：</span>
                    <span>{{winMin.content}}</span>
                </p>
                <!--<p>
					<span>批注内容：</span>
					<span>{{winMin.postil_content}}</span>
				</p>
				<p>
					<span>验收内容：</span>
					<span>{{winMin.checked_content}}</span>
				</p>-->
            </div>
            <ul v-if='winMin.type=="common"'>
                <li>
                    <p>部门类型：
                        <span class="clr-ff5400">{{winMin.dept_name}}</span>
                    </p>
                    <p>执行人：
                        <span class="clr-ff5400">{{winMin.executor_name}}</span>
                    </p>
                    <p>验收人：
                        <span class="clr-ff5400">{{winMin.checker_name}}</span>
                    </p>
                </li>
                <li>
                    <p>预计开始时间：
                        <span class="clr-ff5400">{{ winMin | data('estimated', 'begin_time') | dateTime2Date }}</span>
                    </p>
                    <p>预计结束时间：
                        <span class="clr-ff5400">{{ winMin | data('estimated', 'end_time') | dateTime2Date }}</span>
                    </p>
                    <p>实际结束时间：
                        <span class="clr-ff5400">{{ winMin | data('finish_time') | dateTime2Date }}</span>
                    </p>
                </li>
                <li v-if="winMin.type=='common'&&winMin.checker_remark!=''">
                    <p>延误原因：
                        <span>{{winMin.checker_remark}}</span>
                    </p>
                </li>
                <li class="st_minwid_btn" v-if="winMin.type=='common'">
                    <p>
                        {{winMin.version_info}}
                        <span class='version' @click='btn_version(winMin)' v-if="winMin.hasOwnProperty('version')&&winMin.version!=''">更改版本</span>
                    </p>
                    <p>
                        <span v-for="item in winMin.userbtn" @click="userbtn(item,winMin)">{{item|enableName1}}</span>
                    </p>
                </li>
            </ul>
            <div v-if="winMin.content!=null&&winMin.content!=''&&winMin.type=='common'">
                <p>内容</p>
                <p v-html="winMin.content" class="winmin_cont"></p>
            </div>
            <div class="st_info" v-if="winMin.hasOwnProperty('info')&&winMin.info.length>0&&winMin.type=='test'">
                <p style="display: block;text-align: center;float: inherit;width: 100%;margin-bottom: 15px;;">{{winMin.name}}</p>
                <div v-for="info in winMin.info">
                    <p>
                        <span>{{info.begin}}</span>
                        <span>{{info.end}}</span>
                    </p>
                    <p>
                        <span v-if="info.executor!=''">执行人：{{info.executor}}</span>
                    </p>
                </div>
            </div>
            <div class="st_info" v-if="winMin.hasOwnProperty('info')&&winMin.info.length>0&&winMin.type=='publish'">
                <p style="display: block;text-align: center;float: inherit;width: 100%;margin-bottom: 15px;;">{{winMin.name}}</p>
                <div v-for="info in winMin.info">
                    <p style="width: 80%;">
                        <span>{{info.msg}}</span>
                    </p>
                    <p style="width: 16%;text-align: center;">
                        <span class="win-btn" v-if="info.enabled!=''" @click="userbtn(info,winMin)">{{info|enableName}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="bg2" @click.stop="windClose"></div>
        <div class="bg1 bg" v-if="msgOk" @click="msgOk=false"></div>
        <div v-show="msgOk" class="msg">{{msg}}</div>
    </div>
</template>

<script>
    import Vtask from './task'
    import Vfeedback from './feedback'
    import Vpage  from  './pagination'

    export default {
        name: "Vcontent",
        data() {
            return {
                num: 5,
                locale: {
                    "format": 'YYYY-MM-DD',
                    "separator": " -222 ",
                    "applyLabel": "确定",
                    "cancelLabel": "取消",
                    "fromLabel": "起始时间",
                    "toLabel": "结束时间'",
                    "customRangeLabel": "自定义",
                    "weekLabel": "W",
                    "daysOfWeek": ["日", "一", "二", "三", "四", "五", "六"],
                    "monthNames": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                    "firstDay": 1
                },
                sel_depart: [],
                checked: '',
                windowShow: false,
                dateWidth: '',
                st_start: [],
                st_start1: '',
                st_SurePerc: '',
                st_delok: [],
                taskNum: [{

                }],
                proWidth: '',
                winMax: [],
                winMin: [],
                Apidate: '',
                submitOk: true,
                istask: false,
                task_list: '',
                msgOk: false,
                msg: '',
                task_key: {   /*//页面第一次加载时传入task/list  的接口数据*/
                    status: 'progress',
                    id: '',
                    task_status: '',
                    originator: '',
                    executor: '',
                    department: '',
                    team: '',
                    create_at_begin:'',
                    create_at_end:'',
                    finish_at_begin:'',
                    finish_at_end:'',
                    flag:'',
                    p:1,
                    limit:10
                },
                page:{              //接收从接口得到的分页数据
                    total:'' ,  //总条数
                    totalPage:''  //总页数
                },
                dateLen: [],
                endDate: null,
                planlist_data: [],
            }
        },
        components: {
            Vtask,
            Vfeedback,
            Vpage
        },
        computed: {
            department_list() {
                return this.$store.state.department_list;
            },
            user_data() {
                return this.$store.state.user_data;
            },
            user() {
                return this.$store.state.user;
            },
            feedback_list() {
                return this.$store.state.feedback;
            }
        },
        watch: {
            checked() {
                if (!this.checked) {
                    $('.data-input2').datepicker('remove');
                } else {
                    $('.data-input2').datepicker({
                        language: 'zh-CN',
                        autoclose: true,
                        format: "yyyy-mm-dd",
                        startDate: this.nowdate()
                    });
                }

            },
            istask(curVal, oldVal) {
                if (curVal == true && oldVal == false && this.taskNum.length == 0) {
                    this.addtask('add');
                }　　　　　　　
            },
        },
        filters: {
            data: function () {
                var argv = arguments;
                var obj = argv[0] || {};

                for (var i = 1; i < argv.length; i++) {
                    if (obj.hasOwnProperty(argv[i]) && obj[argv[i]] != null) {
                        obj = obj[argv[i]];
                    } else {
                        return "";
                    }
                }
                return obj;
            },
            dateTime2Date: function (value) {
                if (value.length > 10) {
                    return value.slice(0, 10);
                } else {
                    return value;
                }
            },
            enableName: function (value) {
                var nameMap = {
                    'confirm': '确认',
                    'begin': '开始',
                    'progress': '更改进度',
                    'finish': '完成',
                    'change': '更改发布时间'
                };
                if (!value.hasOwnProperty('enabled')) {
                    return "";
                }
                value = value['enabled'];
                if (value.length > 0) {
                    value = value[0];
                }
                return nameMap.hasOwnProperty(value) ? nameMap[value] : "";
            },
            enableName1: function (value) {
                var nameMap = {
                    "test": "申请测试",
                    "publish": '发布',
                    "cancel_publish": '取消发布',
                    'confirm': "发布",
                    'testing': '测试中',
                    'error': '未通过',
                    'pass': '通过',
                    'wait_confirm': '等待发布确定',
                    'wait_publish': '等待发布',
                    'success': '发布成功',
                    'cancel': '取消发布',
                    'already_confirm':'发布已确认',
                    'change_version': '更改版本号'
                };
                return nameMap.hasOwnProperty(value) ? nameMap[value] : "";
            },
            showConfirm: function (value) {
                var enable = ['confirm', 'begin', 'finish'];
                if (enable.indexOf(value) !== -1) {
                    return true;
                }
                return false;
            }
        },
        mounted() {

            let her = window.location.href.split("?"),
                her1, her2, her3;
            if (her.length > 1) {
                her1 = her[1].split("&");
                if (her1.length > 1) {
                    for (let i = 0; i++; i < her1.length) {
                        her2 = her1[i].split("=");
                    }
                } else {
                    her2 = her1[0].split("=");
                    if (her2[0] == 'feedback') {
                        this.turns(5)
                    }
                }
            }

            this.proWidth = $(document).width() - 36 - 30 - 355 + 'px';
            this.axios.defaults.headers = {
                'Token': localStorage.token,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
            this.task_func();
            var _this = this;
            this.$store.dispatch('ajax', {
                vue: this
            });
            this.$http.post('/task/plan/list', {
                emulateJSON: true
            }).then(function (res) {
                if (res.data.code == '200') {
                    _this.planlist_data = res.data.data.plan;
                } else {
                    _this.windClose()
                    _this.msgOk = true;
                    _this.msg = res.data.msg;
                }
            })
            $('.select2').select2({
                placeholder: "请选择",
                callback: function () {
                }
            });
            $(document).on("select2:select", ".sel_menu1", function (e) {
                e.preventDefault();
                var type = e.params.data.element.dataset.type,
                    index = e.params.data.element.dataset.index;
                if (type == 1) {
                    _this.addtask("proj", index);
                } else {
                    _this.addtask("noproj", index);
                }
            });
            $(".sel_depart").on('change', function () {
                var left = $(".sel_depart").val().split("-");
                _this.$set(_this.sel_depart, 'lft', left[0]);
                _this.$set(_this.sel_depart, 'rgt', left[1]);
            });
        },
        methods: {
            current_page(current_page){
                this.$set(this.task_key,'p',current_page);
                this.task_func();
            },
            goDetail(item) { //跳转任务详情页
                let routerDetail = this.$router.resolve({
                    name: 'taskdetail',
                    query: {
                        id: item.id
                    }
                })
                window.open('//task-api.' + localStorage.domain + '/iframe?url=' + encodeURIComponent(
                    '/index.html' + routerDetail.href + ''), "_blank")
            },
            createTask() { //跳转创建任务页面
                let createTask = this.$router.resolve({
                    name: 'createTask',
                })
                window.open('//task-api.' + localStorage.domain + '/iframe?url=' + encodeURIComponent(
                    '/index.html' + createTask.href + ''), "_blank")
            },
            tipsbox() {
                zq.tipsbox({
                    obj: $(".st_note"),
                    position: 'top',
                    width: 'more-line',
                    align: 'center'
                })
            },
            btn_version(res) {
                this.st_start = res;
                this.$set(this.st_start, 'userbtnid', 'change_version');
                this.$set(this.st_start, 'id', res.id);
                this.$set(this.st_start, 'version', res.version);
                $(".window").hide();
                $(".st_start").show();
            },
            planlist(e) {
                if (e.target.defaultValue == 'plan') {
                    $('.planlist>div').css('display', 'inline-block')
                } else {
                    $('.planlist>div').css('display', 'none')
                }

            },
            Ishow(res, index) {
                if (res.Ishow == true) {
                    this.$set(res, 'Ishow', false);
                } else {
                    this.$set(res, 'Ishow', true);
                }

            },
            viewStatus(items) {
                if (items.hasOwnProperty('viewStatus') && items.viewStatus != '') {
                    return items.viewStatus;
                }
            },
            setEndDate(endDate) {
                this.endDate = endDate;
            },
            userbtn(type, res) {
                $(".window").hide();
                $(".st_start").show();
                this.st_start = res;

                if (type == 'publish' || type == 'cancel_publish') { //当发布确定的时候 传值
                    this.$set(this.st_start, 'userbtnid', type);
                } else {
                    this.$set(this.st_start, 'userbtnid', type.enabled);
                }
                $('.data-input3').datetimepicker({
                    language: 'zh-CN',
                    autoclose: true,
                    formatDate: "yyyy-mm-dd hh:mm:ss",
                    startDate: this.nowdate()
                });
            },
            SearchFeedback() {
                let _disply = $(".window-max-right").css("display"),
                    _magLeft = $(".window-max").css("margin-left");
                if (_disply == 'none') {
                    $(".window-max-right").css("display", 'inline-block');
                    $(".window-max").css("margin-left", parseInt(_magLeft) - 150);
                } else {
                    $(".window-max").css("margin-left", parseInt(_magLeft) + 150);
                    $(".window-max-right").css("display", 'none')
                }
            },
            enableKey: function (value) {
                var nameMap = {
                    'confirm': 6,
                    'begin': 3,
                    'progress': 4,
                    'finish': 3
                };
                if (!value.hasOwnProperty('enabled')) {
                    return -1;
                }
                value = value['enabled'];
                if (value.length > 0) {
                    value = value[0];
                }
                return nameMap.hasOwnProperty(value) ? nameMap[value] : -1;
            },
            CompareDate(d1, d2) {
                return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
            },
            nowdate() {
                var day2 = new Date();
                day2.setTime(day2.getTime());
                var s2 = day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
                return s2;
            },
            sureTask(item, e) {
                //				$(".msg").css("top", e.pageY)
                var value = item['enabled'] || [];
                var begin_time = $(".st_start p>input").val();
                if (value.length > 0) {
                    value = value[0];
                } else {
                    return false;
                }

                if (value == "") {
                    return false;
                }

                var urlMap = {
                    'confirm': 'confirm',
                    'begin': 'mark/begin',
                    'finish': 'finish/confirm'
                };

                if (urlMap.hasOwnProperty(value)) {
                    value = urlMap[value];
                } else {
                    return false;
                }
                var _this = this,
                    progress;
                let _progress = $(".st_start1 p>input").val();
                if (value === "confirm") {
                    progress = "&estimated_begin_time=" + _progress
                } else if (value === 'finish/confirm') {
                    var _remark = $(".st_start .del-reason input").val();
                    if (_remark == '') {
                        _this.windClose();
                        _this.msgOk = true;
                        _this.msg = '请输入延误原因';
                        return false;
                    }
                    progress = "&remark=" + _remark + "";
                } else {
                    progress = "&progress=" + _progress;

                }
                this.$http.post('/task/' + value, 'sub_id=' + item.id + progress + '', {
                    emulateJSON: true
                }).then(function (res) {
                    if (res.data.code == '200') {
                        item.enabled = res.data.enabled;
                        $('.data-input2').datepicker('remove');
                        $(".st_start1 p>input").val("");
                        _this.dateLen = [];
                        if (begin_time != undefined && begin_time != "") {
                            _this.numDate(begin_time, _this.task_list[item.index].end_time);
                            _this.task_list[item.index].date_len = _this.dateLen;
                        }

                        _this.checked = false;
                        _this.msgOk = true;
                        _this.msg = res.data.msg;
                        _this.task_func();
                        _this.windClose();
                    } else {
                        _this.windClose()
                        _this.msgOk = true;
                        _this.msg = res.data.msg;
                    }
                })
            },
            plan(item) {
                var _this = this;
                this.$http.post('/plan/info', 'plan_id=' + item.plan, {
                    emulateJSON: true
                }).then(function (res) {
                    if (res.data.code == '200') {
                        _this.winMin = res.data.data;
                        _this.$set(_this.winMin, 'type', 'plan');
                        $(".window-min,.bg2").show();
                        $(".window-min").css("height", 'inherit');
                    } else {

                    }
                })
            },
            progress(item, e) {
                //$(".msg").css("top", e.pageY);
                var _this = this;
                let progress = $(".st_SurePerc input").val();
                this.$http.post('/task/progress', 'sub_id=' + item.id + '&progress=' + progress, {
                    emulateJSON: true
                }).then(function (res) {
                    if (res.data.code == '200') {
                        item.enabled = res.data.enabled;
                        $(".st_SurePerc input").val("");
                        _this.task_func()
                        _this.windClose()
                    } else {
                        _this.windClose()
                        _this.msgOk = true;
                        _this.msg = res.data.msg;
                    }
                })
            },
            search(str) {
                let _this = this;
                let $id = $.trim($(".taskName").val()),
                    $status = $(".active").parent().data("status"),
                    $flag1 = $.trim(($(".demo--radio:checked").eq(0).data("flag") == undefined) ? "" : $(".demo--radio:checked").eq(0).data("flag")),
                    $flag2 = $.trim(($(".demo--radio:checked").eq(1).data("flag") == undefined) ? "" : $(".demo--radio:checked").eq(1).data("flag")),
                    $task_status = $.trim(($(".st_status select").val() == undefined) ? "" : $(".st_status select").val()),
                    $team = $.trim($(".select").find(".select2-selection__rendered").eq(1).text()),
                    $originator = $.trim($(".select").find(".select2-selection__rendered").eq(2).text()),
                    $department = $.trim($(".select").find(".select2-selection__rendered").eq(0).text()),
                    $executor = $.trim($(".select").find(".select2-selection__rendered").eq(3).text()),
                    $selectDate= $(".createTime select").val();
                if (str == "all") {
                    this.task_key.status= $status;
                    this.task_key.id= $id;
                    this.task_key.flag=($flag1 == "" && $flag2 == "") ? '' : $flag1 + ',' + $flag2;
                    this.task_key.task_status =$task_status== '' ? '':$task_status;  ///单选我创建我验收。。。。。
                    this.task_key.originator= ($originator == "请选择") ? "" : _this.ToNum($originator);
                    this.task_key.executor=($executor == "请选择") ? "" : _this.ToNum($executor);
                    this.task_key. department= ($department == "请选择") ? "" : _this.ToNum($department);
                    this.task_key. team=($team == "请选择") ? "" : _this.ToNum($team);
                    if($selectDate=='0'){     //筛选创建时间和完成时间    创建时间为0   完成时间为1
                        this.task_key.create_at_begin=this.todateType($(".createTime input").eq(0).val());               //日期格式修改为xxxx-xx-xx   调用方法todateType
                        this.task_key.create_at_end=this.todateType($(".createTime input").eq(1).val());
                        this.task_key.finish_at_begin='';
                        this.task_key.finish_at_end='';
                    }else{
                        this.task_key.create_at_begin='';               //日期格式修改为xxxx-xx-xx   调用方法todateType
                        this.task_key.create_at_end='';
                        this.task_key.finish_at_begin=this.todateType($(".createTime input").eq(0).val());
                        this.task_key.finish_at_end=this.todateType($(".createTime input").eq(1).val());
                    }

                }
                this.task_func();
                return false;
            },
            todateType(str){    //日期格式修改为xxxx-xx-xx
                var year='' , month ='',day ='';
                if(str!=''){
                    year=str.split("年");
                    if(year.length>1){
                        month=year[1].split("月");
                        if(month.length>1){
                            day=month[1].split("日")[0];
                            return year[0]+'-'+month[0]+'-'+day;
                        }
                    }else{
                       return '';
                    }
                }else{
                    return '';
                }
            },
            delId(index, id, e) {
                var _this = this;
                //				$(".msg").css("top", e.pageY)
                this.$http.post('/task/destroy', 'task_id=' + id + '', {
                    emulateJSON: true
                }).then(function (res) {
                    _this.windClose();
                    if (res.data.code == '200') {
                        _this.task_list.splice(index, 1);
                    } else {
                        _this.msgOk = true;
                        _this.msg = res.data.msg;
                    }
                })
            },
            summernote() {
                $('.summernote1,.summernote').summernote({
                    placeholder: '点击输入事项内容',
                    tabsize: 4,
                    height: 200,
                    callbacks: {
                        onImageUpload: function (files) {
                            var imageData = new FormData();
                            var $this = $(this);
                            imageData.append("photo", files[0]);
                            _this.imgUpload(imageData, $this);
                        }
                    }
                });
            },
            imgUpload(files) {
                this.$http.post('upload', files, {
                    emulateJSON: true
                }).then(function (result) {
                    if (result.data.code = "200") {
                        var imgNode = document.createElement("img");
                        //读取后台返回的图片url
                        imgNode.src = result.data.data.url;
                        $('.summernote').summernote('insertNode', imgNode);
                    }

                });
            },
            showIndex(res) {
                let type = res.split(",")[1],
                    index = res.split(",")[0],
                    _eq = Number(index) - 1;
                if (_eq >= 0) {
                    if (type == 'project') {
                        this.taskNum.splice(_eq, 1);
                    } else if (type == 'test') {
                        this.taskNum[_eq].test = false;
                    } else if (type == "publish") {
                        this.taskNum[_eq].publish = false;

                    }
                }

            },
            checkCont() {
                let _createName = document.getElementsByClassName("create_name"),
                    _dataInput1 = document.getElementsByClassName("data-input1"),
                    _noteEdit = document.getElementsByClassName("note-editable"),
                    _select2XMZ = document.getElementsByClassName("select2-selection__rendered");
                let flag = true;

                for (let i = 0; i < _createName.length; i++) {
                    if (_createName[i].value == "" || _createName[i].value == undefined) {
                        this.submitOk = false;
                        flag = false;
                        break;
                    } else {
                        this.submitOk = true;
                    }
                };
                if (flag) {
                    for (let i = 0; i < _dataInput1.length; i++) {
                        if (_dataInput1[i].value == '' || _dataInput1[i].value == undefined) {
                            this.submitOk = false;
                            flag = false;
                            break;
                        } else {
                            this.submitOk = true;
                        }
                    };
                }
                if (flag) {
                    for (let i = 0; i < _noteEdit.length; i++) {
                        if (_noteEdit[i].innerHTML == '' || _noteEdit[i].value == undefined) {
                            this.submitOk = false;
                            flag = false;
                            break;
                        } else {
                            this.submitOk = true;
                        }
                    };
                }
                if (flag) {
                    for (let i = 0; i < _select2XMZ.length; i++) {
                        if (_select2XMZ[i].value == '' || _select2XMZ[i].value == undefined) {
                            this.submitOk = false;
                            flag = false;
                            break;
                        } else {
                            this.submitOk = true;
                        }
                    };
                }
            },

            ToNum(str) {
                return str.split("[")[1].split(']')[0]
            },
            ToData(str) {
                if (str != "" && str != undefined) {
                    var year = str.split("年")[0],
                        month = str.split("年")[1].split("月")[0],
                        day = str.split("年")[1].split("月")[1].split("日"),
                        date = year + '-' + month + '-' + day;
                    return date;
                }

            },
            submit(e) {

                //				$(".msg").css("top", Number(e.pageY) - 300)
                let result = this.CheckData();
                if (result == false) {
                    return false;
                }
                let _this = this;
                this.$http.post('/task/create', this.Apidate, {
                    emulateJSON: true
                }).then(function (res) {
                    if (res.data.code == 200) {
                        _this.msgOk = true;
                        _this.msg = "发布成功";
                        setTimeout(function () {
                            location.reload();
                        }, 1000);

                    } else {
                        _this.msgOk = true;
                        _this.msg = res.data.msg;
                    }

                });
            },
            addtask(res, index) {
                let i = Number(index) - 1;
                if (res == "add") {
                    this.taskNum.push({
                        project: true,
                        publish: false,
                        test: false,
                        index: Number(this.taskNum.length) + 1
                    })
                } else if (res == 'proj') {
                    this.taskNum[i].test = true;
                    this.taskNum[i].publish = true;
                } else if (res == 'noproj') {
                    this.taskNum[i].test = false;
                    this.taskNum[i].publish = false;
                }

            },
            task_func() {
                var _this = this;
                this.$http.post('/task/list',
                    "status=" + _this.task_key.status + "&team=" + _this.task_key.team + "&name= " + $(
                        ".taskName").val() + "&department= " + _this.task_key.department + "&p=" + _this.task_key.p + "&limit=" + _this.task_key.limit + "&originator= " +
                    _this.task_key.originator + "&executor= " + _this.task_key.executor + "&task_status= " + _this.task_key.task_status + "&create_at_begin="+_this.task_key.create_at_begin+"&create_at_end="+_this.task_key.create_at_end+"&finish_at_begin="+_this.task_key.finish_at_begin+"&finish_at_end="+_this.task_key.finish_at_end+"&flag= " + _this.task_key.flag + ""
                ).then(function (res) {
                    _this.$set(_this.page,'total',res.data.total);
                    _this.$set(_this.page,'totalPage',res.data.totalPage);
                    if (res.data.code == "200" && res.data.data.length > 0) {
                        _this.task_list = res.data.data;
                        for (let i = 0; i < _this.task_list.length; i++) {
                            _this.dateLen = [];
                            _this.numDate(_this.task_list[i].begin_time, _this.task_list[i].end_time);
                            _this.task_list[i].date_len = _this.dateLen
                        }

                        _this.$nextTick(function () {
                            _this.progressLen();
                            _this.tipsbox(); //d调用tipsbox  
                        })

                    } else {
                        _this.task_list = [];
                    }
                });
            },
            progressLen() {
                for (let i = 0; i < $(".task-body").length; i++) {
                    let _width = $(".task-body").eq(i).find(".progress").eq(0).children("span").length * 60;
                    $(".task-body").eq(i).find(".progress").css("width", _width + 'px')
                }
            },
            getDate(datestr) {
                var temp = datestr.split(" ")[0].split("-");
                var date = new Date(temp[0], temp[1], temp[2]);
                return date;
            },
            numDate(start, end) {
                var _this = this;
                _this.date_len = [];
                var lastDate = Date.parse(start);
                var endDate = Date.parse(end);
                while (lastDate <= endDate) {
                    var tmp = new Date(lastDate)
                    var month = tmp.getMonth() + 1;
                    var day = tmp.getDate();
                    _this.dateLen.push({
                        val: month + '/' + (day < 10 ? '0' + day : day),
                        toNext: "toNext" + month,
                        month: month
                    });

                    lastDate = (lastDate + 86400000);
                }
            },
            turns(tp) { //点击切换内容，
                this.istask = tp;
                if (typeof (tp) != 'object' && tp != 5) {
                    this.istask = false;
                    $("#navbar-menu ul li>span ").removeClass("active");
                    $("#navbar-menu ul:nth-of-type(1) li:nth-of-type(" + tp + ")>span ").addClass("active");
                    if (tp === 1) {
                        this.task_key.status = "progress";
                    } else if (tp === 3) {
                        this.task_key.status = "finish";
                    } else if (tp === 2) {
                        this.task_key.status = "waitconfirm"
                    } else if (tp === 4) {
                        this.task_key.status = "destroy"
                    }
                    this.$refs.pagination.jumpPage(1);//菜单点击切换时  ，当前页码要改为第一页
                } else if (tp == 5) {
                    $("#navbar-menu ul li>span ").removeClass("active");
                    $("#navbar-menu ul:nth-of-type(2) li:nth-of-type(1)>span ").addClass("active");
                    this.istask = true;
                    this.summernote();
                    $(".summernote,.summernote1").summernote('code', '');
                } else {
                    if (this.istask.hasOwnProperty('backid')) {
                        $("#navbar-menu ul li>span ").removeClass("active");
                        $("#navbar-menu ul:nth-of-type(1) li:nth-of-type(" + this.istask.backid + ")>span ").addClass(
                            "active");
                        if (this.istask.backid == 1) {
                            this.task_key.status = "progress";
                            this.task_func();
                        } else if (this.istask.backid == 3) {
                            this.task_key.status = "finish";
                            this.task_func();
                        } else if (this.istask.backid == 2) {
                            this.task_key.status = "waitconfirm"
                            this.task_func();
                        } else if (this.istask.backid == 4) {
                            this.task_key.status = "destroy"
                            this.task_func();
                        }
                        this.istask = false;
                    } else {
                        $('.summernote1,.summernote').each(function () {
                            $(this).summernote('destroy')
                        });
                        this.$set(this.istask, 'backid', Number($("#navbar-menu .active").parent().index()) + 1);
                        $("#navbar-menu ul li>span ").removeClass("active");
                        $("#navbar-menu ul:nth-of-type(2) li:nth-of-type(1)>span ").addClass("active");
                    }
                }
            },
            rdStatus(res, api) {
                let _this = this;
                if (api == 'status') {
                    this.$http.post('/task/rd/' + api + '',
                        "sub_id=" + res.id + ""
                    ).then(function (res) {
                        if (res.data.code == "200" && res.data.enabled != []) {
                            _this.$set(_this.winMin, 'userbtn', res.data.enabled);
                        }
                    });
                } else if (api == 'test' || (res.hasOwnProperty('userbtn')&&res.userbtn[0] == 'test')) {
                    this.$http.post('/task/rd/test',
                        "sub_id=" + res.id + ""
                    ).then(function (res) {
                        _this.msgOk = true;
                        _this.windClose();
                        _this.msg = res.data.msg;
                    });
                } else if (api == 'cancel_publish') {
                    let reason = $(".st_start .reason").val();
                    this.$http.post('/task/rd/' + api + '',
                        "sub_id=" + res.id + "&reason=" + reason + ""
                    ).then(function (res) {
                        _this.msgOk = true;
                        _this.windClose();
                        _this.msg = res.data.msg;
                        if (res.data.code == "200") {
                            $(".st_start .reason").val("");
                        }
                    });
                } else if (api == 'publish') {
                    let reason = $(".st_start .reason").val(),
                        data = '';
                    if (res.publish_type == "immediately") {
                        data = 'sub_id=' + res.id + '&publish_type=immediately'
                    } else {
                        let publish_time = $(".st_start .data-input3").val();
                        data = 'sub_id=' + res.id + '&publish_type=delayed&publish_time=' + publish_time + ''
                    }
                    this.$http.post('/task/rd/' + api + '',
                        data
                    ).then(function (res) {
                        _this.msgOk = true;
                        _this.windClose();
                        _this.msg = res.data.msg;
                        if (res.data.code == "200") {
                            $(".st_start .reason").val("");
                        }
                    });
                } else if (api == 'confirm' || res.hasOwnProperty('info')) {
                    let reason = $(".st_start .reason").val(),
                        data = '';
                    if (res.hasOwnProperty('info')) {
                        let publish_time = $(".st_start .changePublishTime .data-input2").val();
                        data = 'sub_id=' + res.id + '&publish_type=delayed&time=' + publish_time + ''

                        if (res.publish_type == "immediately") {
                            data = 'sub_id=' + res.id + '&publish_type=immediately'
                        } else {
                            let publish_time = $(".st_start .data-input3").val();
                            data = 'sub_id=' + res.id + '&publish_type=delayed&time=' + publish_time + ''
                        }
                    };

                    this.$http.post('/task/publish/confirm',
                        data
                    ).then(function (res) {
                        _this.msgOk = true;
                        _this.task_func();
                        _this.windClose();
                        _this.msg = res.data.msg;
                        if (res.data.code == "200") {
                            $(".st_start .reason").val("");
                        }
                    });
                } else if (api == 'change_version') {
                    let version = $(".st_start .data-version").val(),
                        data = 'sub_id=' + res.id + '&version=' + version + '';
                    if (this.st_start.versionIf == true) {
                        this.$http.post('/task/version',
                            data
                        ).then(function (res) {
                            _this.msgOk = true;
                            _this.task_func();
                            _this.windClose();
                            _this.msg = res.data.msg;
                            _this.$set(_this.st_start, 'versionIf', false);
                        });
                    } else {
                        _this.windClose();
                    }

                }

            },
            WinShow(event, type, data, index) { //type===1 显示执行人弹窗内容，type===2显示任务弹窗
                if(data.hasOwnProperty('enable')&&data.enable.indexOf('cantDelete')!=-1){
                    this.msg='已确认的任务不能删除';
                    this.msgOk=true;
                    return false;
                }
                this.winMax = data;
                $(".window").hide();
                var _this = $(event.target);
                //				$(".window,.msg").css("top", event.pageY)
                $(".bg2").show();
                if (type == 'common' || type == 'test' || type == 'publish') {
                    this.winMin = data;
                    this.rdStatus(data, 'status');
                    if (type == 'test' || type == 'publish') {
                        if (this.winMin.info.length > 0) {
                            setTimeout(function () {
                                if ($(".st_info").css("height") < $(".window-min").css("height")) {
                                    $(".window-min").css("height", "initial").css("display", "block");
                                }
                            }, 100);
                            $(".window-min").show();
                        } else {
                            this.windClose();
                            this.msgOk = true;
                            if (type == 'test') {
                                this.msg = "提示测试任务尚未开始"
                            }
                            if (type == 'publish') {
                                this.msg = "尚未申请发布"
                            }

                        }
                    } else {
                        $(".window-min").show();
                    }

                } else if (type == 2) {
                    $(".window-max").show();
                    this.winMax = data;
                } else if (type == 3) {
                    $(".st_start").show();
                    this.st_start = data;
                    this.st_start.div = event;
                    this.st_start.index = index;
                } else if (type == 4) {
                    $(".st_SurePerc").show();
                    this.st_SurePerc = data;
                    this.st_SurePerc.div = event;
                    this.st_SurePerc.index = index;
                } else if (type == 5) {
                    $(".st_delok").show();
                    this.st_delok.id = data.id;
                    this.st_delok.index = event;
                } else if (type == 6) {
                    $(".st_start1").show();
                    this.st_start1 = data;
                    this.st_start1.div = event;
                    this.st_start1.index = index;
                }
            },
            windClose() {
                //				var _this = $(event.target);
                $(".window").hide();
                $(".bg2,.msg").hide();
            },
            touch(event) {
                //独立封装这个事件可以保证执行顺序，从而能够访问得到应该访问的数据。
                var _this = $(event.target).parents(".task-body").find(".progress"),
                    _this1 = $(event.target).parents(".task-body").find(".progressCon"),
                    _monSt = $(event.target).parents(".task-body").find(".progress span").data("month"),
                    _monLen = $(event.target).parents(".task-body").find(".toNext" + _monSt).length * 60 - 30,
                    _x,
                    mon;
                if (event.additionalEvent == 'panleft') {
                    _x = Number(_this.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4]) - parseInt(event.direction *
                        2.5);
                } else {
                    _x = Number(_this.css("transform").replace(/[^0-9\-,]/g, '').split(',')[4]) + parseInt(event.direction *
                        2.5);
                }
                if (_x > 0 || _this[0].offsetWidth < _this1[0].offsetWidth) {
                    _x = 0
                }
                if (_this[0].offsetWidth > _this1[0].offsetWidth) {
                    if (_x < _this1[0].offsetWidth - _this[0].offsetWidth) {
                        _x = _this1[0].offsetWidth - _this[0].offsetWidth
                    }
                }
                _this.css("transform", "translate(" + _x + "px,0px)");
                if (Math.abs(_x) > _monLen) {
                    mon = Number(_monSt) + 1 + '月';
                } else {
                    mon = Number(_monSt) + '月';
                }
                $(event.target).parents(".task-body").find(".body_mon").html(mon);
            },
        },
    }
</script>

<style scoped>

</style>
