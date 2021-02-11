//刷新token计数
const countRefreshToken = {

  state:{
    count: 0
  },

  mutations:{
    SET_COUNT(state,count){
      state.count = count;
    }
  }
}
export default countRefreshToken;
