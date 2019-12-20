import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import content from '@/components/content'
import taskdetail from '@/components/taskdetail'
import createTask from '@/components/createTask'
Vue.use(Router)

export default new Router({
	routes: [{
			path: '/login',
			name: 'login',
			component: login
		},
		{
			path: '/',
			name: 'content',
			component: content,
//			children: [{
//				path: '/create',
//				component: createTask
//			}],
			meta: {
				auth: true
			} // 设置当前路由需要校验 
		},
		{
			path: '/detail',
			name: 'taskdetail',
			component: taskdetail,
		},{
			path: '/createTask',
			name: 'createTask',
			component: createTask,
		},
	]
})