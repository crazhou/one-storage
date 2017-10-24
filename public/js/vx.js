Vue.component('todo-item', {
    props:['todo'],
    template: '<li>{{todo.text}}</li>'
})

new Vue({
    el:'#app',
    created : function() {
        console.log('A->', this.gList);
    },
    data:{
        message:'Hello Vue!',
        gList: [
            {id:1,text:'Hello PHP'},
            {id:2,text:'Hello JSP'},
            {id:3,text:'Hello JavaScript!'}
        ]
    },
    methods:{
        reverseMsg : function() {
            this.gList = this.gList.reverse();
        }
    }
})