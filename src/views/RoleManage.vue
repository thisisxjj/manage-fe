<template>
  <div class="role-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        ref="roleForm"
        :model="queryForm"
        class="demo-form-inline"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="queryForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoleList"> 查询 </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleReset('roleForm')">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" v-has:per="'role-create'" @click="handleAdd">
          创建
        </el-button>
      </div>
      <el-table :data="roleList" style="width: 100%">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              v-has:per="'role-edit'"
              type="default"
              size="mini"
            >
              编辑
            </el-button>
            <el-button
              @click="handlePermissionDialog(scope.row)"
              type="primary"
              v-has:per="'role-permission'"
              size="mini"
            >
              设置权限
            </el-button>
            <el-button
              type="danger"
              size="mini"
              v-has:per="'role-delete'"
              @click="handleDelete(scope.row._id)"
            >
              删除
            </el-button>
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
      />
    </div>
    <el-dialog
      :title="dialogTitle"
      v-model="showRoleDialog"
      @closed="handleRoleClose"
    >
      <el-form
        ref="dialogForm"
        :model="roleDialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleDialogForm.roleName"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="角色备注" prop="remark">
          <el-input
            v-model="roleDialogForm.remark"
            type="textarea"
            placeholder="请输入角色备注"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRoleDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleRoleSubmit">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :title="permissionTitle"
      v-model="showPermisDialog"
      @closed="handlePermisClose"
    >
      <el-form ref="permisForm" label-width="100px">
        <el-form-item label="角色名称">
          <span>{{ curRoleName }}</span>
        </el-form-item>
        <el-form-item label="选择权限" prop="menuList">
          <el-tree
            :data="menuList"
            ref="permissionTree"
            show-checkbox
            node-key="_id"
            default-expand-all
            :props="{ label: 'menuName' }"
          >
          </el-tree>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPermisDialog = false">取 消</el-button>
          <el-button type="primary" @click="handlePermisSubmit">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'role',
  data() {
    return {
      queryForm: {
        roleName: '',
      },
      roleList: [],
      menuList: [],
      columns: [
        {
          label: '角色名称',
          prop: 'roleName',
          width: 120
        },
        {
          label: '备注',
          prop: 'remark'
        },
        {
          label: '权限列表',
          prop: 'permissionList.halfCheckedKeys',
          formatter: (row, column, val) => {
            if (!val || val.length === 0) {
              return '无权限'
            }
            const list = []
            val.forEach(item => {
              list.push(this.menuIdNameMap[item])
            })
            return list.join(',')
          }
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
        {
          label: '更新时间',
          prop: 'updateTime'
        },
      ],
      showRoleDialog: false,  // 角色编辑弹窗
      showPermisDialog: false, // 权限设置弹窗
      dialogTitle: '',
      permissionTitle: '设置权限',
      action: '',
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
        ]
      },
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      roleDialogForm: {
        roleName: '',
        remark: ''
      },
      curRoleName: '',
      curRoleId: '',
      menuIdNameMap: {}
    }
  },
  mounted() {
    this.getRoleList()
    this.getMenuList()
  },
  methods: {
    // 获取角色详细列表
    async getRoleList() {
      const { roleName } = { ...this.queryForm }
      const { pageSize, pageNum } = { ...this.pager }
      const { page, list } = await this.$api.getRoleList({
        roleName,
        pageSize,
        pageNum
      })
      this.roleList = list
      this.pager.total = page.total
    },
    // 获取菜单列表
    async getMenuList() {
      const menuList = await this.$api.getMenuList()
      this.menuList = menuList
      this.getMenuIdNameMap(this.menuIdNameMap)
    },
    // 获取菜单列表id - name 之间的映射
    getMenuIdNameMap(map) {
      const deep = (list) => {
        if (!list || list[0].menuType === 2) {
          return
        }
        list.forEach(item => {
          map[item._id] = item.menuName
          deep(item.children)
        })
      }
      deep(this.menuList)
    },
    // 创建角色
    handleAdd() {
      this.dialogTitle = '角色创建'
      this.showRoleDialog = true
      this.action = 'add'
    },
    // 编辑角色
    handleEdit(row) {
      this.dialogTitle = '角色编辑'
      this.showRoleDialog = true
      this.action = 'edit'
      this.$nextTick(() => {
        const { roleName, remark, _id } = { ...row }
        this.roleDialogForm = { roleName, remark, _id }
      })
    },
    // 重置表单
    handleReset(form) {
      this.$refs[form].resetFields()
    },
    // 关闭角色弹窗
    handleRoleClose() {
      this.handleReset('dialogForm')
    },
    // 角色弹窗提交事件
    handleRoleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const { roleDialogForm, action } = { ...this }
          const { roleName, remark, _id } = { ...roleDialogForm }
          const params = {}
          if (roleName) params.roleName = roleName
          if (remark) params.remark = remark
          if (_id) params._id = _id
          params.action = action
          await this.$api.roleSubmit(params)
          this.$message.success(action === 'add' ? '角色添加成功' : '角色更新成功')
          this.showRoleDialog = false
          this.getRoleList()
        }
      })
    },
    // 删除
    async handleDelete(_id) {
      try {
        await this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$api.roleSubmit({
          _id,
          action: 'delete'
        })
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      } catch (error) {
        if (error === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
      }
    },
    // 分页
    handleCurrentChange(curPage) {
      this.pager.pageNum = curPage
      this.getRoleList()
    },
    // 权限设置弹窗
    handlePermissionDialog(row) {
      this.showPermisDialog = true
      this.$nextTick(() => {
        const { _id, roleName, permissionList } = { ...row }
        // console.log(permissionList)
        this.curRoleName = roleName
        this.curRoleId = _id
        this.$refs.permissionTree.setCheckedKeys(permissionList.checkedKeys)
      })
    },
    // 权限设置弹窗关闭
    handlePermisClose() {
      this.$refs.permissionTree.setCheckedKeys([])
    },
    async handlePermisSubmit() {
      const half = this.$refs.permissionTree.getHalfCheckedKeys()
      const nodes = this.$refs.permissionTree.getCheckedNodes()
      const checkedKeys = []
      let halfCheckedKeys = []
      nodes.forEach((item) => {
        if (item.menuType === 2) {
          checkedKeys.push(item._id)
        } else {
          halfCheckedKeys.push(item._id)
        }
      })
      halfCheckedKeys = halfCheckedKeys.concat(half)
      await this.$api.updatePermission({
        _id: this.curRoleId,
        permissionList: {
          checkedKeys,
          halfCheckedKeys
        }
      })
      this.$message.success('权限设置成功')
      this.showPermisDialog = false
      this.getRoleList()
    }
  }
}
</script>

<style lang="scss">
.role-manage {
  height: 100%;
}
</style>
