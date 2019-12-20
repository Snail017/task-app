<template>
    <div class="page"  v-show="show">
        <div class="pagelist">
            <span class="jump" v-show="current_page>1" @click="jumpPage(current_page-1)" >上一页</span>
            <span v-show="current_page>5" class="jump" @click="jumpPage(1)">1</span>
            <span class="ellipsis"  v-show="efont">...</span>
            <span class="jump" v-for="num in indexs" :class="{bgprimary:current_page==num}" @click="jumpPage(num)">{{num}}</span>
            <span class="ellipsis"  v-show="current_page<page.totalPage-4" >...</span>
            <span v-show="current_page<(page.totalPage-4)"  class="jump" @click="jumpPage(page.totalPage)" >{{page.totalPage}}</span>
            <span class="jump" @click="jumpPage(current_page+1)" >下一页</span>
            <span class="jumppoint">跳转到：</span>
            <span class="jumpinp"><input type="text" v-model="changePage"></span>
            <span class="jump gobtn" @click="jumpPage(changePage)">GO</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "pagination",
        data(){
            return{
                current_page: 1, //当前页
                changePage:'',//跳转页
                nowIndex:0,
            }
        },
        props:{
            page:Object,
            task_key_p:'',
        },
        computed:{
            show:function(){
                return this.page.totalPage && this.page.totalPage !=1&& this.page.totalPage !=0
            },
            efont: function() {
                if (this.page.totalPage <= 7) return false;
                return this.current_page > 5
            },
            indexs: function() {
                var left = 1,
                    right = this.page.totalPage,
                    ar = [];
                if (this.page.totalPage >= 7) {
                    if (this.current_page > 5 && this.current_page < this.page.totalPage - 4) {
                        left = Number(this.current_page) - 3;
                        right = Number(this.current_page) + 3;
                    } else {
                        if (this.current_page <= 5) {
                            left = 1;
                            right = 7;
                        } else {
                            right = this.page.totalPage;

                            left = this.page.totalPage - 6;
                        }
                    }
                }
                while (left <= right) {
                    ar.push(left);
                    left++;
                }
                return ar;
            },
        },
        methods: {
            jumpPage: function(id) {
                if(parseInt(id)>parseInt(this.page.totalPage)&&parseInt(this.page.totalPage)>1){
                    alert("超過最大頁數");
                    this.changePage=''
                }else{
                    this.current_page = id;
                    this.$emit('current_page',this.current_page)
                }
            },
        },
    }
</script>

<style>

    .page {
        font-weight: 900;
        height: 40px;
        text-align: center;
        color: #888;
        margin: 0 auto;
        background: #f2f2f2;
    }

    .pagelist {
        font-size: 0;
        background: #fff;
        height: 50px;
        line-height: 50px;
    }

    .pagelist span {
        font-size: 14px;
    }

    .pagelist .jump {
        border: 1px solid #ccc;
        padding: 5px 8px;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        cursor: pointer;
        margin-left: 5px;
    }

    .pagelist .bgprimary {
        cursor: default;
        color: #fff;
        background: #337ab7;
        border-color: #337ab7;
    }

    .jumpinp input {
        width: 55px;
        height: 26px;
        font-size: 13px;
        border: 1px solid #ccc;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        text-align: center;
    }

    .ellipsis {
        padding: 0px 8px;
    }

    .jumppoint {
        margin-left: 30px;
    }

    .pagelist .gobtn {}

    .bgprimary {
        cursor: default;
        color: #fff;
        background: #337ab7;
        border-color: #337ab7;
    }

</style>