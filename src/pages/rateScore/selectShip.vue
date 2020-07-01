<template>
	<div class="select-ship-wrapper">
		<el-form :model="formData" :rules="rules" ref="SelectShipForm" label-width="140px">
			<el-form-item label="船舶：" prop="shipId">
				<el-select v-model="formData.shipId" placeholder="请选择" filterable @change="changeShip">
					<el-option
						v-for="item in shipNameList"
						:key="item.id"
						:label="item.zhongwenchuanming"
						:value="item.id"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="船舶识别号码：">{{shipNumber}}</el-form-item>
			<el-form-item label="总吨位/载重吨：">{{shipWeight}}</el-form-item>
			<el-form-item label="船舶种类(闪点)：">{{shipType}}</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="resetFields">取 消</el-button>
			<el-button type="primary" size="small" @click="saveInfo">确 定</el-button>
		</div>
	</div>
</template>

<script>
import { $http } from '@commonbox/utils';

export default {
  name: 'selectShip',
  props: {
    jumpFrom: {
      required: true
    }
  },
  data() {
    return {
      formData: {
        shipId: '',
        shipName: ''
      },
      chuanbojingyingren: '',
      shipNumber: '',
      shipWeight: '',
      shipType: '',
      rules: {
        shipId: [{ required: true, message: '请选择船舶', trigger: 'change' }]
      },
      shipNameList: []
    };
  },

  methods: {
    async queryShipNameList() {
      let { data } = await $http.get('/sdkseaunion/dataSourceApi/getShipList');
      this.shipNameList = data.data;
    },
    changeShip(val) {
      let obj = this.shipNameList.find(item => item.id === val);
      this.shipNumber = obj.chuanboshibiehaoma;
      this.shipWeight = `${obj.zongdun} / ${obj.zaizhongdun}`;
      this.shipType = obj.chuanboleixing;
      this.formData.shipName = obj.zhongwenchuanming;
      this.chuanbojingyingren = obj.chuanbojingyingren;
    },
    resetFields() {
      this.$refs.SelectShipForm.resetFields();
      this.shipNumber = '';
      this.shipWeight = '';
      this.shipType = '';
      this.$emit('closeSelectShipDialog');
    },
    saveInfo() {
      this.$refs.SelectShipForm.validate((valid) => {
        if (valid) {
          this.$refs.SelectShipForm.resetFields();
          if (this.jumpFrom === 'rateList') {
            this.$emit('saveSelectShipDialog', this.formData.shipName, this.chuanbojingyingren);
          } else if (this.jumpFrom === 'questionList') {
            this.$emit('saveSelectShipDialog', this.formData.shipName);
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.queryShipNameList();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-dialog__body {
	.ipt {
		width: 656px;
	}
}
.select-ship-wrapper {
	/deep/ .el-form-item__label {
		font-weight: bold;
	}
	/deep/ .el-select {
		width: 250px;
	}
}
</style>
