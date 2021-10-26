<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        ref="userForm"
        :model="userQueryForm"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="userQueryForm.userId"
            placeholder="请输入用户ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="userQueryForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userQueryForm.state">
            <el-option label="所有" :value="0"></el-option>
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleReset('userForm')">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          v-has:per="'user-create'"
          @click="handleCreateUser"
        >
          新增
        </el-button>
        <el-button
          type="danger"
          v-has:per="'user-patch-delete'"
          @click="handlePatchDelete"
        >
          批量删除
        </el-button>
      </div>
      <el-table
        :data="userList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              type="default"
              size="mini"
              v-has:per="'user-edit'"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              v-has:per="'user-delete'"
              @click="handleOneDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
    <UserFormDialog
      :show-dialog="showDialog"
      :action="action"
      :title="dialogTitle"
      :form="userDialogForm"
      :role-list="roleList"
      :dept-list="deptList"
      @submit="handleDialogSubmit"
      @cancel="handleDialogClose"
    />
  </div>
</template>
<script>
import { ref, reactive, onMounted, getCurrentInstance, computed, toRaw } from 'vue'
import UserFormDialog from '@/components/UserFormDialog/index.vue'

export default {
  name: 'UserManage',
  components: {
    UserFormDialog
  },
  setup() {
    // 获取composition API上下文对象
    const { ctx } = getCurrentInstance()
    // 初始化用户表单对象
    const userQueryForm = reactive({
      state: 1
    })
    // 初始化用户列
    const columns = ref([
      {
        label: '用户ID',
        prop: 'userId'
      },
      {
        label: '用户名',
        prop: 'username'
      },
      {
        label: '用户邮箱',
        prop: 'email'
      },
      {
        label: '用户角色',
        prop: 'role',
        formatter: function (row, column, value) {
          return {
            0: '管理员',
            1: '普通用户'
          }[value]
        }
      },
      {
        label: '用户状态',
        prop: 'state',
        formatter: function (row, column, value) {
          return {
            1: '在职',
            2: '离职',
            3: '试用期'
          }[value]
        }
      },
      {
        label: '注册时间',
        prop: 'createTime'
      },
      {
        label: '上次登录时间',
        prop: 'lastLoginTime'
      },
    ])
    // 初始化用户列表
    const userList = ref([])
    // 初始化分页数据
    const pager = reactive({
      pageNum: 1,
      pageSize: 10
    })
    // 选中用户id的列表
    const checkedUserIds = ref([])
    // 用户编辑弹窗是否显示
    const showDialog = ref(false)
    // 用户的行为
    const action = ref('add')
    // 弹窗标题
    const dialogTitle = computed(() => {
      return {
        'add': '新增用户',
        'edit': '编辑用户'
      }[action.value]
    })
    // 用户弹窗表单
    const userDialogForm = reactive({
      state: 3
    })
    // 角色列表
    const roleList = ref([])
    // 部门列表
    const deptList = ref([])
    // 初始化接口调用
    onMounted(() => {
      getUserList()
      getRoleList()
      getDeptList()
    })

    // 获取用户列表
    const getUserList = async () => {
      let params = {
        ...userQueryForm,
        ...pager
      }
      const { list, page } = await ctx.$api.getUserList(params)
      userList.value = list
      pager.total = page.total
    }
    // 查询事件,获取用户列表
    const handleQuery = async () => {
      pager.pageNum = 1
      getUserList()
    }
    // 重置事件
    const handleReset = (form) => {
      ctx.$refs[form].resetFields()
    }
    // 改变当前页数事件
    const handleCurrentChange = (current) => {
      pager.pageNum = current
      getUserList()
    }
    // 用户单个删除事件
    const handleOneDelete = async (row) => {

      const res = await ctx.$api.userDelete({
        userIds: [row.userId]
      })
      if (res.nModified > 0) {
        ctx.$message.success('删除成功')
        getUserList()
      } else {
        ctx.$message.error('删除失败')
      }

    }
    // 表格多选框选中事件
    const handleSelectionChange = (val) => {
      checkedUserIds.value = val.map(item => item.userId)
    }
    // 批量删除
    const handlePatchDelete = async () => {
      if (checkedUserIds.value.length == 0) {
        ctx.$message.error('请选择要删除的用户')
        return
      }
      try {
        const res = await ctx.$api.userDelete({
          userIds: checkedUserIds.value
        })
        if (res.nModified > 0) {
          ctx.$message.success('删除成功')
          getUserList()
        } else {
          ctx.$message.error('删除失败')
        }
      } catch (error) {
        ctx.$message.error('删除失败')
      }
    }
    // 新增用户
    const handleCreateUser = async () => {
      action.value = 'add'
      showDialog.value = true
    }
    // 关闭弹窗
    const handleDialogClose = () => {
      showDialog.value = false
    }
    // 新增用户弹窗提交事件
    const handleDialogSubmit = async (valid) => {
      if (valid) {
        let data = {}
        Object.assign(data, userDialogForm)
        data.action = action.value
        data.email += '@imooc.com'
        try {
          await ctx.$api.userSubmit(data)
          ctx.$message.success(action.value === 'add' ? '新增用户成功' : '用户编辑成功')
          showDialog.value = false
          getUserList()
        } catch (error) {
          // showDialog.value = true
        }
      } else {
        ctx.$message.error('请填写正确的用户信息')
      }
    }
    // 编辑用户
    const handleEdit = (row) => {
      action.value = 'edit'
      showDialog.value = true
      ctx.$nextTick(() => {
        let temp = {}
        Object.assign(temp, row)
        temp.email = temp.email.split('@')[0]
        delete temp.createTime
        delete temp.lastLoginTime
        Object.assign(userDialogForm, temp)
      })
    }
    // 获取角色列表
    const getRoleList = async () => {
      let res = await ctx.$api.getRoleAllList()
      roleList.value = res
    }
    // 获取部门列表
    const getDeptList = async () => {
      let res = await ctx.$api.getDeptList()
      deptList.value = res
    }
    return {
      userQueryForm,
      pager,
      columns,
      userList,
      showDialog,
      action,
      dialogTitle,
      userDialogForm,
      roleList,
      deptList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleOneDelete,
      handleSelectionChange,
      handlePatchDelete,
      handleCreateUser,
      handleDialogClose,
      handleDialogSubmit,
      handleEdit,
    }
  }
}
</script>
<style lang="scss">
.user-manage {
  height: 100%;
}
</style>