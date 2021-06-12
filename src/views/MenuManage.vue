<template>
  <div class="menu-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        ref="menuForm"
        :model="menuQueryForm"
        class="demo-form-inline"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuQueryForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="menuQueryForm.menuState">
            <el-option label="正常" :value="1"></el-option>
            <el-option label="禁用" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleReset('menuForm')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
      </div>
      <el-table :data="menuList" style="width: 100%" row-key="_id" stripe>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              @click="handleAdd(2, scope.row)"
              type="primary"
              size="mini"
            >
              新增
            </el-button>
            <el-button
              @click="handleEdit(scope.row)"
              type="default"
              size="mini"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row._id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle" v-model="showDialog" @closed="handleClose">
      <el-form
        ref="dialogForm"
        :model="menuDialogForm"
        label-width="100px"
        :rules="rules"
      >
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuDialogForm.parentId"
            :options="allMenuList"
            :props="{
              checkStrictly: true,
              value: '_id',
              label: 'menuName',
            }"
            clearable
            size="medium"
            style="width: 40%"
            placeholder="请选择所属部门"
          />
          <span style="color: #aaa; margin-left: 20px">
            不选,则直接创建一级菜单
          </span>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuDialogForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuDialogForm.menuName"
            placeholder="请输入菜单名称"
          />
        </el-form-item>
        <el-form-item
          v-show="menuDialogForm.menuType === 1"
          label="菜单图标"
          prop="icon"
        >
          <el-input
            v-model="menuDialogForm.icon"
            placeholder="请输入菜单图标"
          />
        </el-form-item>
        <el-form-item
          v-show="menuDialogForm.menuType === 1"
          label="路由地址"
          prop="path"
        >
          <el-input
            v-model="menuDialogForm.path"
            placeholder="请输入路由地址"
          />
        </el-form-item>
        <el-form-item
          v-show="menuDialogForm.menuType === 1"
          label="组件路径"
          prop="component"
        >
          <el-input
            v-model="menuDialogForm.component"
            placeholder="请输入组件路径"
          />
        </el-form-item>
        <el-form-item
          v-show="menuDialogForm.menuType === 2"
          label="权限标识"
          prop="menuCode"
        >
          <el-input
            v-model="menuDialogForm.menuCode"
            placeholder="请输入权限标识"
          />
        </el-form-item>
        <el-form-item label="菜单状态" prop="deptId">
          <el-radio-group v-model="menuDialogForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showDialog = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确 定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      menuQueryForm: {
        menuName: '',
        menuState: 1,
      },
      menuList: [],
      allMenuList: [],
      columns: [
        {
          label: '菜单名称',
          prop: 'menuName',
          width: 120
        },
        {
          label: '图标',
          prop: 'icon'
        },
        {
          label: '菜单类型',
          prop: 'menuType'
        },
        {
          label: '权限标示',
          prop: 'menuCode'
        },
        {
          label: '路由地址',
          prop: 'path'
        },
        {
          label: '组件路径',
          prop: 'component'
        },
        {
          label: '菜单状态',
          prop: 'menuState',
          formatter: (v1, v2, v3) => {
            return {
              1: '正常',
              2: '禁用'
            }[v3]
          }
        },
        {
          label: '创建时间',
          prop: 'createTime'
        },
      ],
      showDialog: false,
      dialogTitle: '',
      menuDialogForm: {
        menuType: 1,
        menuState: 1,
        parentId: []
      },
      action: '',
      rules: {
        menuName: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 6,
            message: '长度在2-6之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted() {
    this.getMenuList()
    this.getAllMenuList()
  },
  methods: {
    /**
     * 查询获取列表
     */
    async getMenuList() {
      const { menuName, menuState } = { ...this.menuQueryForm }
      const menuList = await this.$api.getMenuList({
        menuName,
        menuState
      })
      this.menuList = menuList
    },
    /**
     * 获取所有列表
     */
    async getAllMenuList() {
      const menuList = await this.$api.getMenuList()
      this.allMenuList = menuList
    },
    /**
     * 重置表单 
     */
    handleReset(form) {
      this.$refs[form].resetFields()
      this.getMenuList()
    },
    // 添加
    handleAdd(type, row) {
      this.showDialog = true
      this.action = 'add'
      if (type === 2) {
        this.$nextTick(() => {
          this.menuDialogForm.parentId = [...row.parentId, row._id].filter((item) => item)
        })
      }
    },
    // 删除
    async handleDelete(_id) {
      try {
        await this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await this.$api.menuSubmit({
          _id,
          action: 'delete'
        })
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
    // 关闭弹窗
    handleClose() {
      this.handleReset('dialogForm')
    },
    // 提交
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const { menuDialogForm, action } = this
          await this.$api.menuSubmit({
            ...menuDialogForm,
            action
          })
          this.$message.success('操作成功')
          this.showDialog = false
          this.getMenuList()
        }
      })
    },
    // 编辑
    handleEdit(row) {
      this.action = 'edit'
      this.showDialog = true
      this.$nextTick(() => {
        this.menuDialogForm = row
      })
    }
  }
}
</script>

<style lang="scss">
.menu-manage {
  height: 100%;
}
</style>
