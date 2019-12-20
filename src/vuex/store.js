import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	windowShow: false,
	init: false,
	project_data: [],
	user_data: [],
	section_list: [],
	task_list: [],
	department_list: {},
	feedback: [],
	user: {
		id: localStorage.uid || 0,
		dept: localStorage.dept || 0,
		hasUnConfirm: 0
	},
	isLogin: 0,
	token: '',
	baseURL: '',
}

const mutations = {
	ajax(state, data) {
		state[data.key] = data.data;
	},
	changeLogin(state, data) {
		state.isLogin = data;
	},
	token(state, data) {
		state.token = data;
	},
}

const actions = {
	ajax(context, data) {
		console.log(context);
		console.log(data);
		const $http = data.vue.$http;
		if(localStorage.project_data) {
			try {
				var tmpData = JSON.parse(localStorage.project_data)
				context.commit('ajax', {
					key: 'project_data',
					data: tmpData
				});
			} catch(e) {

			}
		}

		if(localStorage.user_data) {
			try {
				var tmpData = JSON.parse(localStorage.user_data)
				context.commit('ajax', {
					key: 'user_data',
					data: tmpData
				});
			} catch(e) {

			}
		}

		if(localStorage.section_list) {
			try {
				var tmpData = JSON.parse(localStorage.section_list)
				context.commit('ajax', {
					key: 'section_list',
					data: tmpData
				});
			} catch(e) {

			}
		}

		if(localStorage.department_list) {
			try {
				var tmpData = JSON.parse(localStorage.department_list)
				context.commit('ajax', {
					key: 'department_list',
					data: tmpData
				});
			} catch(e) {

			}
		}
		if(localStorage.feedback) {
			try {
				var tmpData = JSON.parse(localStorage.feedback)
				context.commit('ajax', {
					key: 'feedback',
					data: tmpData
				});
			} catch(e) {

			}
		}

		$http.post('/app/list').then(function(res) {
			context.commit('ajax', {
				key: 'project_data',
				data: res.data.data
			});
			if(res.data.hasOwnProperty('data')) {
				localStorage.project_data = JSON.stringify(res.data.data);
			}
		});

		$http.post('/user/list').then(function(res) {
			context.commit('ajax', {
				key: 'user_data',
				data: res.data.data
			});
			if(res.data.hasOwnProperty('data')) {
				localStorage.user_data = JSON.stringify(res.data.data);
			}
		});
		$http.post('/section/list').then(function(res) {
			context.commit('ajax', {
				key: 'section_list',
				data: res.data.data
			});
			if(res.data.hasOwnProperty('data')) {
				localStorage.section_list = JSON.stringify(res.data.data);
			}
		});
		$http.post('/department/list').then(function(res) {
			context.commit('ajax', {
				key: 'department_list',
				data: res.data.data
			});
			if(res.data.hasOwnProperty('data')) {
				localStorage.department_list = JSON.stringify(res.data.data);
			}
		});
		context.commit('ajax', {
			key: 'user',
			data: {
				id: localStorage.uid,
				dept: localStorage.dept,
				hasUnConfirm: 0
			},
		})

		if(localStorage.token) {
			data.vue.axios.defaults.headers = {
				'Token': localStorage.token,
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			$http.post('/user').then(function(res) {
				context.commit('ajax', {
					key: 'user',
					data: res.data.data
				});
				if(res.data.hasOwnProperty('data')) {
					localStorage.user = JSON.stringify(res.data.data);
					if(localStorage.uid != res.data.data.id) {
						localStorage.setItem('uid', res.data.data.id);
					}
					if(localStorage.dept != res.data.data.dept) {
						localStorage.setItem('dept', res.data.data.dept);
					}
				}
			});
		}

		let her = window.location.href.split("?"),
			her1, her2, her3, url_feedback;
		if(her.length > 1) {
			her1 = her[1].split("&");
			if(her1.length > 1) {
				for(let i = 0; i++; i < her1.length) {
					her2 = her1[i].split("=");
				}
			} else {
				her2 = her1[0].split("=");
				if(her2[0] == 'feedback') {
					url_feedback = her2[1];
				}
			}
		}
		$http.post('/task/feedback?feedback=[' + url_feedback + ']').then(function(res) {
			context.commit('ajax', {
				key: 'feedback',
				data: res.data.data
			});
			if(res.data.hasOwnProperty('data')) {
				localStorage.feedback = JSON.stringify(res.data.data);
			}
		});
	}
}
const getters = {

}

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters,
})