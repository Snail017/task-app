// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import {mapGetters, mapActions} from 'vuex'
import $ from 'jquery'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-datepicker'
import 'daterangepicker'
import 'daterangepicker/daterangepicker.css'
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css'
import './assets/bootstrap-datetimepicker-master'
import './assets/bootstrap-datetimepicker-master/css/bootstrap-datetimepicker.min.css'
import './assets/js/bootstrap-datepicker.zh-CN'
import './assets/css/content.css'
import 'summernote'
import 'summernote/dist/summernote.css'
import 'select2'
import 'select2/dist/css/select2.min.css'
import {zq} from './assets/js/zq/zq.js'
import './assets/js/zq/zq.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueTouch from 'vue-touch'

Vue.prototype.zq = zq
Vue.use(router)
Vue.use(VueTouch, {name: 'v-touch'})
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
axios.defaults.baseURL = '//task-api.' + localStorage.domain + '/api';

router.beforeEach((to, from, next) => {
    if (to.matched.some(m => m.meta.auth)) {
        // 对路由进行验证
        if (localStorage.changeLogin == '100') { // 已经登陆
            next() // 正常跳转到你设置好的页面
        } else {
            // 未登录则跳转到登陆界面，query:{ Rurl: to.fullPath}表示把当前路由信息传递过去方便登录后跳转回来；
            next({
                path: '/login',
                query: {
                    Rurl: to.fullPath
                }
            })
        }
    } else {
        next()
    }
})
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>',
})


const custom = {
    //Rd使用的Task
    RdToTask(version_type, version, game_id, game_name, vid, app_id, app_name, channel_id, channel_name, servername, related_vid, index) {

        $('input[name=version_type-' + index + ']').val(version_type);
        $('input[name=version_appid-' + index + ']').val(app_id);
        $('input[name=version_channelid-' + index + ']').val(channel_id);
        $('input[name=version_gameid-' + index + ']').val(game_id);
        $('input[name=version_servername-' + index + ']').val(servername);
        $('input[name=version-' + index + ']').val(version);
        $('input[name=related_vid-' + index + ']').val(related_vid);

        $('input[name=vid-' + index + ']').val(vid);
        var str = "已关联";
        if (version_type == 'game') {
            str += " [" + game_id + "]" + game_name;
        } else if (version_type == 'app') {
            str += " [" + app_id + "-" + channel_id + "]" + app_name + "-" + channel_name;
        } else {
            str += " " + servername + " 服务器版本";
            if (related_vid != 0) {
                str += " 使用客户端 [" + game_id + "]" + game_name + "vid (" + related_vid + ")";
            }
        }
        str += " 版本:" + version;
        $('#info-' + index).text(str);
        $('#info-' + index).addClass('st_linked');

        $('input[name=version_type-' + index + ']').trigger('change')
    },
    RdClose(index) {
        $('#iframe-' + index).trigger('change');
    },
    tokenLogin(token, uid, dept) {
        localStorage.setItem('token', token);
        localStorage.setItem('changeLogin', 100);
        localStorage.setItem('uid', uid);
        localStorage.setItem('dept', dept);
    }
}

window.toTask = custom.RdToTask;
window.toClose = custom.RdClose;
window.tokenLogin == custom.tokenLogin;

window.$ = $;

