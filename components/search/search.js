// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    placeholder: {
      type: String,
      value: '请输入关键字',
    },
  },

  // 接收外部传入的样式，因为组件里不能直接使用如下的class名称
  externalClasses: [
    'iconfont',
    'icon-sousuo',
  ],

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
