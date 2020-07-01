<script>
import { $http } from '@commonbox/utils';
import { destroyAllDialogs } from '@qycloud/lego';
import BaseFormPage from './BaseFormPage.vue';
import MyFieldBox from '../FormComponents/Todo/MyFieldBox.vue';

export default {
  name: 'xingyezilvtqcjiancha',
  extends: BaseFormPage,
  xComponents: {
    'field-field-box': MyFieldBox,
  },
  methods: {
    sendMsg() {
      let sendMsgInfo = JSON.parse(localStorage.getItem('sendMsgInfo'));
      $http.post('/sdkseaunion/portalApi/sendSmsMes', {
        sendPhone: sendMsgInfo.lianxidianhua,
        sendName: sendMsgInfo.displayValue,
        owner: sendMsgInfo.owner,
        shipName: localStorage.getItem('shipName'),
      })
        .then((rspData) => {
          this.$message({
            type: 'success',
            message: '短信发送成功!'
          });
          this.$bus.emit('refreshData');
          destroyAllDialogs();
        }).catch((error) => {
          console.log(error);
        });
    },
    afterFormFinished() {
      if (localStorage.getItem('jumpType') === '1') {
        this.$router.push({
          path: `/appList/${this.module}/${this.app}/${this.spaceId}`
        });
      } else {

      }
    },
    onFormAction(ctx, { action, formData, validate, next }) {
      if (['CANCEL', 'DATAFLOW_CANCEL', 'WORKFLOW_CANCEL', 'SAVE_WORKFLOW'].indexOf(action) > -1) {
        next();
        return;
      }
      validate().then((result) => {
        if (result) {
          next().then(() => {
            if (localStorage.getItem('jumpType') === '2') {
              this.sendMsg();
            }
          });
        }
      });
    },
  }
};
</script>
