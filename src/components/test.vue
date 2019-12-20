<template>
<div>
<input type="text" v-model="name" id="v666" ref="name">
<p>
    {{name}}
</p>

<button type="button" @click.stop=showA>showName</button>
</div>
</template>


<script>
    export default {
        data() {
            return {
                name:'555',
            }
        },
        watch:{
//             $ref.name(curVal,oldVal){
// 　　　　　　　　　　console.log(curVal,oldVal);
// 　　　　　　　　},
            // window.abc(curVal,oldVal)
        },
        methods:{
            showA() {
                console.log(this.name);
            }
        },
        mounted() {
            var _this = this;
            $('#v666').on('change', function(a){
                var a = $(this).val();
                _this.name = a;
            })
        }
    }
</script>