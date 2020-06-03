<template>
  <div></div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String,
    arr: [],
    list: []
  },
  mounted() {
    // 注释123123
    this.init();
    //this.getHero()
    //this.getHero('5ec1f8481b9068f9773e5b75');
    this.addUser();
    //this.getSort();
  },
  methods: {
    comp(obj1, obj2) {
      var val1 = obj1.value;
      var val2 = obj2.value;
      if (val1 < val2) {
      return -1;
      } else if (val1 > val2) {
      return 1;
      } else {
      return 0;
      }  
    },
    getSort() {
      this.arr = []
      for(let i=0; i<1000; i++) {
        this.arr.push(
          {value: Math.random() + 1.5}
        )
      }
      
      console.log(this.arr.sort(this.comp));
    },
    // 登录
    init() {
      this.$http({
        url: '/api/login',
        method: 'get',
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取全量用户
    getHero() {
      this.$http({
        url:'/api/hero',
        method: 'get'
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    
    },
    // 获取某一个user
    getCurHero(userId) {
      this.$http({
        url:'/api/hero?id=' + userId,
        method: 'GET',
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    },
    // 增加mysql一个用户
    addUser() {
      this.$http({
        url:'/api/addUser',
        method: 'POST',
        data: {
          id: Math.ceil(Math.random()*15),
          name: 'zhangsan',
          password: '321'
        }
      }).then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
