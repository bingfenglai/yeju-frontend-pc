import request from '@/utils/request'
import webSocketBaseUrl from '@/store/websocket'

import store from '@/store/modules/user'
import { Notification } from 'element-ui'
// 查询公告列表
export function listNotice(currentPage,size) {
  return request({
    url: '/yeju-notice/notice/list/'+currentPage+"?size="+size,
    method: 'get',
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(data) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'delete'
  })
}

// websocket 实时接收公告
export function realTimeNotice(){
  console.log("进行websocket连接》。。。")
  const wsUrl = webSocketBaseUrl.state.ws+'/yeju-notice/ws/notice'
  console.log(wsUrl)
  const that = this;
  let token = store.state.token.Authorization
  if (typeof (WebSocket) == 'undefined') {
    Notification.warning({
      message: '当前浏览器不支持消息通知功能，建议更换chrome浏览器或者Edge浏览器',
      type:  'warning',
      onClose: false
    })
  } else {
    // 获取token保存到vuex中的用户信息，此处仅适用于本项目，注意删除或修改
   // store.actions('GetInfo').then(info => {
      // 实例化socket，这里我把用户名传给了后台，使后台能判断要把消息发给哪个用户，其实也可以后台直接获取用户IP来判断并推送
      const socketUrl = 'ws://127.0.0.1:8868/websocket/';

     const socket = new WebSocket(wsUrl)
      // 监听socket打开
      socket.onopen = function() {

        //console.log(token)
        socket.send(token)
      };
      // 监听socket消息接收
      socket.onmessage = function(msg) {
        // 转换为json对象

        let data = JSON.parse(msg.data)
        Notification.info({
          title: data.title,
          message : data.message,
          duration: 0,
          position: 'bottom-right',
          //showClose: false
        })
      };
      // 监听socket错误
      socket.onerror = function() {
        that.$notify({
          title: '错误',
          message: '服务器错误，无法接收实时报警信息',
          type: 'error',
          duration: 0
        });
      };
      // 监听socket关闭
      socket.onclose = function() {
        console.log('WebSocket已关闭');
      }
    //})
  }
}
