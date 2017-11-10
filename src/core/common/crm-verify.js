
// 第一种:input 要有自定义属性'name'字段说明,'field'验证规则
// var flag = validate.init('id');  传入ID
// if(!flag){
//     return;
// }
//
// 第二种:组件里面,传入lists就行了
// var flag = validate.init(testList,true);
// if(!flag){
//     return;
// }


define(function(require, exports, module) {
    //require('./mui.min');
    var validator = {
        status:true,
        error:'',
        filedStatus:{},
        check: function(field,val,name){
            var reg;
            switch (field){
                case 'int':
                    validator.error = name+'只能输入数字';
                    reg = /^[\d]+$/;
                    break;
                case 'email':
                    validator.error = name+'格式不对';
                    reg = /^(([^*<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    break;
                case 'domainEmail':
                    validator.error = name+'格式不对';
                    reg = /[\*|\w+]([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
                    break;
                case 'mobile':
                    validator.error = name+'格式不对';
                    reg = /^(0?86)?1[\d]{10}$/i;
                    break;
                case 'phone':
                    validator.error = name+'格式不对';
                    reg = /^0\d{2,3}-?\d{7,8}$/;
                    break;
                case 'url':
                    validator.error = name+'格式不对';
                    var str = "^((https|http|ftp|rtsp|mms)?://)"
                        + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                        + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                        + "|" // 允许IP和DOMAIN（域名）
                        + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
                        + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
                        + "[a-z]{2,6})" // first level domain- .com or .museum
                        + "(:[0-9]{1,4})?" // 端口- :80
                        + "((/?)|" // a slash isn't required if there is no file name
                        + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
                    reg = new RegExp(str);
                    break;
                case 'certificate':
                    validator.error = name+'格式不对';
                    reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
                    break;
                case 'carType':
                    validator.error = name+'格式不对';
                    reg = /[@#\$%\^&\*\(\)\+\!\~]+/igm;
                    break;
                case 'netname':
                    validator.error = name+'格式不对';
                    reg = /^[0-9a-z]+(?:\w|[\.\-])+?$/;
                    break;
                case 'empty':
                    reg = /^\s*$/;
                    break;
                case 'qq':
                    validator.error = name+'格式不对';
                    reg = /^\d{5,12}$/g;
                default:
                    validator.error = name+'不能输入特殊字符';
                    reg = /^(?!.*[%\/\\\'\"&<\>|\^])/igm;
                    break;
            }

            return reg.test(val);

            // legitimacy:function (val, falgs,name) {
            //     validator.error = name+'不能输入特殊字符';
            //     if (falgs) {
            //         var reg = /[%\\\'\"&<\>|\^]/igm;
            //     } else {
            //         var reg = /[%\/\\\'\"&<\>|\^]/igm;
            //     }
            //     return !reg.test(val);
            // }

        },
        init:function (element,type) {
             this.initData();
             var fields,object;
             if(type){
                 fields = element
             }else{
                 var elementCon = document.getElementById(element);
                 fields = elementCon.getElementsByTagName('input');
             }

             for(var i = 0, l = fields.length; i<l; i++){
                 if(fields[i].value){
                     if(type){
                         object = fields[i]
                     }else{
                         object = {
                             name:fields[i].getAttribute('name'),
                             field:fields[i].getAttribute('field')
                         }
                     }
                     if(!this.checkOne(fields[i].value,object)){
                         this.status = false;
                         break;
                     }else{
                         this.status = true;
                     }
                 }
             }

             return this.status;
        },
        initData:function () {
            this.status = true;
            this.error = '';
            this.filedStatus = {};
        },
        checkOne:function (val,list) {
            var flag = this.check(list.field,val,list.name);
            if(!flag){
                mui.alert(this.error,'提示');
            }
            return flag;
        }
    };

    module.exports=validator;
});

