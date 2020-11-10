<script>
import { $http } from '@commonbox/utils';
import { destroyAllDialogs } from '@qycloud/lego';
import BaseFormPage from './BaseFormPage2.vue';
import MyFieldBox from '../FormComponents/Todo/MyFieldBox.vue';

export default {
  name: 'xingyezilvtqcjiancha',
  extends: BaseFormPage,
  xComponents: {
    'field-field-box': MyFieldBox,
  },
  data() {
    return {
    };
  },
  methods: {
    sendMsg(sendName, shipName, owner) {
      $http.post('/sdkseaunion/portalApi/sendSmsMes', {
        sendName,
        owner,
        shipName,
      })
        .then((rspData) => {
          /* this.$message({
              message: '短信发送成功',
              type: 'success'
            });  */
          if (localStorage.getItem('jumpType') === '2') {
            this.$bus.emit('refreshData');
            destroyAllDialogs();
          }
        }).catch((error) => {
          console.log(error);
        });
    },
    onFormAction(ctx, { action, formData, validate, next }) {
      if (localStorage.getItem('jumpType') === '2' && ['CANCEL', 'DATAFLOW_CANCEL', 'WORKFLOW_CANCEL', 'SAVE_WORKFLOW'].indexOf(action) > -1) {
        this.$bus.emit('refreshData');
        destroyAllDialogs();
        next();
        return;
      }
      if (['CANCEL', 'DATAFLOW_CANCEL', 'WORKFLOW_CANCEL', 'SAVE_WORKFLOW'].indexOf(action) > -1) {
        next();
        return;
      }
      validate().then((result) => {
        if (result) {
          let zhuanjiaxuanze = ctx.$store.state.fields.xingyezilvtqcjiancha.master.zhuanjiaxuanze.value;
          let shipName = ctx.$store.state.fields.xingyezilvtqcjiancha.master.chuanming.value;
          let owner = ctx.$store.state.fields.xingyezilvtqcjiancha.master.owner.value ? ctx.$store.state.fields.xingyezilvtqcjiancha.master.owner.value : window.AY.get('user').userId;
          if (shipName.includes('#')) {
            shipName = shipName.substring(0, shipName.indexOf('#'));
          }
          next().then(() => {
            this.sendMsg(JSON.stringify(zhuanjiaxuanze), shipName, owner);
          });
        }
      });
    },
    onFieldValueChange(ctx, { table, field, value }) {
      if (field === 'zhuanjiaxuanze' && table === 'xingyezilvtqcjiancha' && value.length > 3) {
        value.length = 3;
        	 this.$message({
          type: 'error',
          message: '最多只能选择三名专家！'
        });
      }
    },
    afterFormFinished() {
      if (localStorage.getItem('jumpType') === '1') {
        this.$router.push({
          path: `/appList/${this.module}/${this.app}/${this.spaceId}`
        });
      } else {
        // destroyAllDialogs();
      }
    },
  }
};
</script>
