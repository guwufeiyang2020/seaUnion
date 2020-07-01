const sendMsg = {
  state: {
    sendMsgInfo: {},
    shipName: '',
    jumpType: '2', // 1表示从菜单， 2表示从首页
  },
  mutations: {
    GET_SHIP_NAME: (state, shipName) => {
      state.shipName = shipName;
    },
    SEND_MSG_INFO: (state, sendMsgInfo) => {
      state.sendMsgInfo = sendMsgInfo;
    },
  },

};

export default sendMsg;
