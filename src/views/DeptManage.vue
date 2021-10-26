<template>
  <div class="dept-manage">
    <div class="query-form">
      <el-form
        :inline="true"
        ref="deptForm"
        :model="deptQueryForm"
        class="demo-form-inline"
      >
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="deptQueryForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="default"> 重置 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          v-has:per="'menu-create'"
          @click="handleAdd(1)"
        >
          创建
        </el-button>
      </div>
      <el-table :data="deptList" style="width: 100%" row-key="_id">
        <el-table-column v-for="item in columns" :key="item.prop" v-bind="item">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button
              type="default"
              size="mini"
              @click="handleEdit(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dept',
  data() {
    return {
      deptQueryForm: {
        deptName: ''
      },
      columns: [
        {
          prop: 'deptName',
          label: '部门名称',
          width: 120
        },
        {
          prop: 'userName',
          label: '负责人',
        },
        {
          prop: 'updateTime',
          label: '更新时间',
        },
        {
          prop: 'createTime',
          label: '创建时间',
        }
      ],
      deptList: []
    }
  }
}
</script>