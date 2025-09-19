<template>
  <el-dialog 
    title="借阅记录" 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)"
    width="700px"
  >
    <div v-if="copy">
      <div class="copy-info" style="margin-bottom: 20px;">
        <el-tag type="info" size="large">
          副本编号：{{ copy.copyNumber }}
        </el-tag>
        <span style="margin-left: 15px; color: #606266;">
          位置：{{ copy.location }}
        </span>
        <span style="margin-left: 15px; color: #606266;">
          总借阅次数：{{ copy.borrowCount }}
        </span>
      </div>

      <el-table 
        :data="copy.borrowRecords" 
        style="width: 100%" 
        stripe
        empty-text="暂无借阅记录"
      >
        <el-table-column prop="borrower" label="借阅人" width="120" />
        <el-table-column prop="borrowDate" label="借阅时间" width="120" />
        <el-table-column label="还回时间" width="120">
          <template #default="scope">
            <span v-if="scope.row.returnDate">
              {{ scope.row.returnDate }}
            </span>
            <el-tag v-else type="warning" size="small">未还回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="借阅天数" width="100">
          <template #default="scope">
            <span v-if="scope.row.returnDate">
              {{ calculateDays(scope.row.borrowDate, scope.row.returnDate) }} 天
            </span>
            <span v-else>
              {{ calculateDays(scope.row.borrowDate, getCurrentDate()) }} 天
              <el-tag type="info" size="small" style="margin-left: 5px;">进行中</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="scope">
            <el-tag 
              :type="scope.row.returnDate ? 'success' : 'warning'" 
              size="small"
            >
              {{ scope.row.returnDate ? '已还回' : '借阅中' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="copy.borrowRecords.length === 0" class="empty-state">
        <el-empty description="暂无借阅记录" />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('update:modelValue', false)">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  copy: {
    type: Object,
    default: null
  }
})

defineEmits(['update:modelValue'])

const calculateDays = (startDate, endDate) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const timeDiff = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0]
}
</script>

<style scoped>
.copy-info {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.empty-state {
  text-align: center;
  padding: 20px;
}
</style>
