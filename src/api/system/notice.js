import request from '@/utils/request'
import webSocketBaseUrl from '@/store/websocket'

import { Notification } from 'element-ui'
// 查询公告列表
export function listNotice(currentPage,size) {
  return request({
    url: '/yeju-all-rest-api/message/notice/list/'+currentPage+"?size="+size,
    method: 'get'
  })
}

// 查询公告类型列表
export function listNoticeType(){
  return request({
    url: '/yeju-all-rest-api/message/notice/type/list',
    method: 'get'
  })
}

// 查询公告详细
export function getNotice(noticeId) {
  return request({
    url: '/yeju-all-rest-api/message/notice/' + noticeId,
    method: 'get'
  })
}

// 新增公告
export function addNotice(args) {
  return request({
    url: '/yeju-all-rest-api/message/notice',
    method: 'post',
    data: args
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/yeju-all-rest-api/message/notice',
    method: 'put',
    data: data
  })
}

// 删除公告
export function delNotice(noticeId) {
  console.log("删除一个")
  return request({
    url: '/yeju-all-rest-api/message/notice/'+noticeId,
    method: 'delete'
  })
}

export function deleteNoticeBatch(Ids){
  console.log("删除多个")
  return request({
    url: '/yeju-all-rest-api/message/notice/deleteBatch',
    method: 'delete',
    data: Ids,
  })
}

// websocket 实时接收公告
export function realTimeNotice(token){
  console.log("进行websocket连接》。。。")
  const wsUrl = webSocketBaseUrl.state.ws+'/yeju-message/ws/notice'
  console.log(wsUrl)
  const that = this;



  //let token = store.state.token.Authorization
  if (typeof (WebSocket) == 'undefined') {
    Notification.warning({
      message: '当前浏览器不支持消息通知功能，建议更换chrome浏览器或者Edge浏览器',
      type:  'warning',
      onClose: false
    })
  } else {

    const socket = new WebSocket(wsUrl)
      // 监听socket打开
      socket.onopen = function() {

        socket.send(token)
      };
      // 监听socket消息接收
      socket.onmessage = function(msg) {
        // 转换为json对象

        let data = JSON.parse(msg.data)
        Notification({
          title: data.title,

          message : data.message,
          duration: 0,
          dangerouslyUseHTMLString: true,
          type: data.type||'info',
          position: 'bottom-right',
          //showClose: false
         //onClose: confirmRead(data.messageId)
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


function confirmRead(messageIdStr) {

  request({
    url: '/yeju-message/notice/confirmRead/'+messageIdStr,
    method: 'post',
  })
}
