<template>
  <el-dialog :title="title" v-model="showDialog" @closed="handleClose">
    <el-form ref="userForm" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          :disabled="action === 'edit'"
          size="medium"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          :disabled="action === 'edit'"
          size="medium"
        >
          <template #append> @imooc.com </template>
        </el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="岗位" prop="job">
        <el-input v-model="form.job" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select
          v-model="form.state"
          placeholder="请选择用户状态"
          size="medium"
        >
          <el-option label="在职" :value="1"></el-option>
          <el-option label="离职" :value="2"></el-option>
          <el-option label="试用期" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="系统角色" prop="roleList">
        <el-select
          v-model="form.roleList"
          placeholder="请选择对应角色"
          size="medium"
          multiple
          style="width: 100%"
        >
          <el-option
            v-for="item in roleList"
            :key="item._id"
            :label="item.roleName"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-cascader
          :options="deptList"
          v-model="form.deptId"
          :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
          clearable
          size="medium"
          style="width: 100%"
          placeholder="请选择所属部门"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { getCurrentInstance, reactive, ref } from 'vue'
export default {
  name: 'UserFormDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: null
    },
    roleList: {
      type: Array,
      default: []
    },
    deptList: {
      type: Array,
      default: []
    },
    action: {
      type: String,
      default: ''
    }
  },
  emits: ['cancel', 'submit'],
  setup() {
    const { ctx } = getCurrentInstance()
    const rules = reactive({
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }
      ],
      email: [
        {
          required: true,
          message: '请输入用户邮箱',
          trigger: 'blur'
        }
      ],
      mobile: [
        {
          pattern: /^1[2-9][0-9]{9}$/g,
          message: '请输入正确的手机号',
          trigger: 'blur'
        }
      ],
      deptId: [
        {
          required: true,
          message: '请选择用户所属部门',
          trigger: 'blur'
        }
      ]
    })
    // 重置事件
    const handleReset = (form) => {
      ctx.$refs[form].resetFields()
    }
    // 关闭事件
    const handleClose = () => {
      handleReset('userForm')
      ctx.$emit('cancel')
    }
    // 提交
    const handleSubmit = () => {
      ctx.$refs.userForm.validate((valid) => {
        ctx.$emit('submit', valid, ctx.$refs.userForm)
      })
    }
    return {
      rules,
      handleReset,
      handleClose,
      handleSubmit
    }
  }
}
</script>
<style lang="scss">
.append {
  width: 140px;
}
</style>
