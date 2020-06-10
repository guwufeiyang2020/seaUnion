<template>
	<div class="select-ship-wrapper">
		<el-form :model="formData" :rules="rules" ref="SelectShipForm" label-width="140px">
			<el-form-item label="船舶" prop="name">
				<el-select v-model="formData.name" placeholder="请选择">
					<el-option
						v-for="item in shipNameList"
						:key="item.value"
						:label="item.label"
						:value="item.value"
					></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="船舶识别号码">{{shipNumber}}</el-form-item>
			<el-form-item label="总吨位/载重吨">{{shipWeight}}</el-form-item>
			<el-form-item label="船舶种类(闪点)">{{shipType}}</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="resetFields">取 消</el-button>
			<el-button type="primary" size="small" @click="saveInfo">确 定</el-button>
		</div>
	</div>
</template>

<script>
export default {
  name: 'selectShip',
  props: {},
  data() {
    return {
      formData: {
        name: ''
      },
      shipNumber: '',
      shipWeight: '',
      shipType: '',
      rules: {
        name: [{ required: true, message: '请选择船舶', trigger: 'change' }]
      },
      shipNameList: [
        {
          label: '舟山号 ',
          value: '01'
        },
        {
          label: '南通号',
          value: '02'
        },
        {
          label: '泰坦尼克号',
          value: '03'
        }
      ]
    };
  },

  methods: {
    resetFields() {
      this.$emit('closeSelectShipDialog');
    },
    saveInfo() {
      this.$refs.SelectShipForm.validate((valid) => {
        if (valid) {
          const params = {
            partnerIds: this.formData.value,
            teamName: this.formData.name,
            agentId: this.agentId
          };
          SocietyService.addStt(params)
            .then((rep) => {
              this.$message({
                message: '已新增团队',
                type: 'success'
              });
              this.$emit('closeAddDialog');
            })
            .catch((e) => {});
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.el-dialog__body {
	.ipt {
		width: 656px;
	}
}
</style>
