<template>
  <div class="copy-management">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" style="margin-bottom: 20px;">
      <el-breadcrumb-item>
        <a href="#" @click.prevent="goBack">书籍管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ book?.name || '书籍副本' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="header-actions">
      <h2>副本管理 - {{ book?.name }}</h2>
      <div class="actions">
        <el-select 
          v-model="statusFilter" 
          placeholder="筛选状态" 
          clearable
          style="width: 150px; margin-right: 10px;"
        >
          <el-option label="全部" value="" />
          <el-option 
            v-for="(label, key) in COPY_STATUS_LABELS" 
            :key="key" 
            :label="label" 
            :value="key" 
          />
        </el-select>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          新增副本
        </el-button>
      </div>
    </div>

    <!-- 书籍基本信息 -->
    <el-card class="book-info" style="margin-bottom: 20px;" v-if="book">
      <div class="book-details">
        <div class="detail-item">
          <span class="label">作者：</span>
          <span>{{ book.author }}</span>
        </div>
        <div class="detail-item">
          <span class="label">出版社：</span>
          <span>{{ book.publisher }}</span>
        </div>
        <div class="detail-item">
          <span class="label">ISBN：</span>
          <span>{{ book.isbn }}</span>
        </div>
        <div class="detail-item">
          <span class="label">总副本数：</span>
          <span>{{ book.copies.length }}</span>
        </div>
        <div class="detail-item">
          <span class="label">状态：</span>
          <el-tag :type="getBookStatusType(book.status)" size="small">
            {{ BOOK_STATUS_LABELS[book.status] }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 副本列表 -->
    <el-table :data="filteredCopies" style="width: 100%" stripe>
      <el-table-column prop="copyNumber" label="副本编号" width="120" />
      <el-table-column prop="location" label="位置" width="150" />
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag 
            :type="getCopyStatusType(scope.row.status)"
            size="small"
          >
            {{ COPY_STATUS_LABELS[scope.row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="borrowCount" label="借阅次数" width="100" />
      <el-table-column label="当前状态详情" width="200">
        <template #default="scope">
          <span v-if="scope.row.status === COPY_STATUS.BORROWED && getCurrentBorrower(scope.row)">
            借阅人：{{ getCurrentBorrower(scope.row) }}
          </span>
          <span v-else-if="scope.row.status === COPY_STATUS.IN_STOCK">
            可借阅
          </span>
          <span v-else>
            {{ COPY_STATUS_LABELS[scope.row.status] }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="400">
        <template #default="scope">
          <el-button size="small" @click="editCopy(scope.row)">修改</el-button>
          
          <el-button 
            v-if="scope.row.status === COPY_STATUS.IN_STOCK"
            size="small" 
            type="success" 
            @click="borrowCopy(scope.row)"
          >
            借出
          </el-button>
          
          <el-button 
            v-if="scope.row.status === COPY_STATUS.BORROWED"
            size="small" 
            type="warning" 
            @click="returnCopy(scope.row)"
          >
            还回
          </el-button>
          
          <el-button 
            v-if="scope.row.status === COPY_STATUS.UNARCHIVED"
            size="small" 
            type="info" 
            @click="archiveCopy(scope.row)"
          >
            归档
          </el-button>
          
          <el-button 
            size="small" 
            type="primary" 
            @click="showBorrowRecords(scope.row)"
          >
            借阅记录
          </el-button>
          
          <el-button 
            size="small" 
            type="danger" 
            @click="deleteCopy(scope.row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑副本对话框 -->
    <el-dialog 
      :title="copyDialogTitle" 
      v-model="copyDialogVisible" 
      width="500px"
      :before-close="closeCopyDialog"
    >
      <el-form :model="copyFormData" :rules="copyRules" ref="copyFormRef" label-width="100px">
        <el-form-item label="副本编号" prop="copyNumber">
          <el-input v-model="copyFormData.copyNumber" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="copyFormData.location" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="copyFormData.status" style="width: 100%">
            <el-option 
              v-for="(label, key) in COPY_STATUS_LABELS" 
              :key="key" 
              :label="label" 
              :value="key" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeCopyDialog">取消</el-button>
          <el-button type="primary" @click="saveCopy">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 借出对话框 -->
    <el-dialog 
      title="借出副本" 
      v-model="borrowDialogVisible" 
      width="400px"
    >
      <el-form :model="borrowFormData" :rules="borrowRules" ref="borrowFormRef" label-width="80px">
        <el-form-item label="借阅人" prop="borrower">
          <el-input v-model="borrowFormData.borrower" placeholder="请输入借阅人姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="borrowDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmBorrow">确定借出</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 借阅记录对话框 -->
    <BorrowRecordsDialog 
      v-model="recordsDialogVisible" 
      :copy="selectedCopy"
    />
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBookStore } from '../composables/useBookStore.js'
import { BOOK_STATUS, BOOK_STATUS_LABELS, COPY_STATUS, COPY_STATUS_LABELS } from '../models/book.js'
import BorrowRecordsDialog from './BorrowRecordsDialog.vue'

const props = defineProps({
  bookId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['back-to-books'])

const { 
  getBookById, 
  addCopy, 
  updateCopy, 
  deleteCopy: removeCopy, 
  borrowCopy: setBorrowCopy, 
  returnCopy: setReturnCopy 
} = useBookStore()

const book = ref(null)
const statusFilter = ref('')
const copyDialogVisible = ref(false)
const borrowDialogVisible = ref(false)
const recordsDialogVisible = ref(false)
const copyFormRef = ref()
const borrowFormRef = ref()
const isCopyEdit = ref(false)
const editingCopyId = ref(null)
const selectedCopy = ref(null)

const copyFormData = ref({
  copyNumber: '',
  location: '',
  status: COPY_STATUS.IN_STOCK
})

const borrowFormData = ref({
  borrower: ''
})

const copyRules = {
  copyNumber: [{ required: true, message: '请输入副本编号', trigger: 'blur' }],
  location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

const borrowRules = {
  borrower: [{ required: true, message: '请输入借阅人姓名', trigger: 'blur' }]
}

const filteredCopies = computed(() => {
  if (!book.value) return []
  if (!statusFilter.value) return book.value.copies
  return book.value.copies.filter(copy => copy.status === statusFilter.value)
})

const copyDialogTitle = computed(() => isCopyEdit.value ? '编辑副本' : '新增副本')

const getBookStatusType = (status) => {
  switch (status) {
    case BOOK_STATUS.NORMAL:
      return 'success'
    case BOOK_STATUS.ALL_BORROWED:
      return 'warning'
    case BOOK_STATUS.FORBIDDEN:
      return 'danger'
    default:
      return 'info'
  }
}

const getCopyStatusType = (status) => {
  switch (status) {
    case COPY_STATUS.IN_STOCK:
      return 'success'
    case COPY_STATUS.BORROWED:
      return 'warning'
    case COPY_STATUS.LOST:
    case COPY_STATUS.DAMAGED:
      return 'danger'
    case COPY_STATUS.UNARCHIVED:
      return 'info'
    default:
      return 'info'
  }
}

const getCurrentBorrower = (copy) => {
  const activeRecord = copy.borrowRecords.find(record => !record.returnDate)
  return activeRecord?.borrower || ''
}

const loadBook = () => {
  book.value = getBookById(props.bookId)
  if (!book.value) {
    ElMessage.error('书籍不存在')
    goBack()
  }
}

const goBack = () => {
  emit('back-to-books')
}

const showAddDialog = () => {
  isCopyEdit.value = false
  editingCopyId.value = null
  resetCopyForm()
  copyDialogVisible.value = true
}

const editCopy = (copy) => {
  isCopyEdit.value = true
  editingCopyId.value = copy.id
  copyFormData.value = { ...copy }
  copyDialogVisible.value = true
}

const resetCopyForm = () => {
  copyFormData.value = {
    copyNumber: '',
    location: '',
    status: COPY_STATUS.IN_STOCK
  }
  nextTick(() => {
    copyFormRef.value?.clearValidate()
  })
}

const closeCopyDialog = () => {
  copyDialogVisible.value = false
  resetCopyForm()
}

const saveCopy = async () => {
  try {
    await copyFormRef.value.validate()
    
    if (isCopyEdit.value) {
      updateCopy(props.bookId, editingCopyId.value, copyFormData.value)
      ElMessage.success('副本更新成功')
    } else {
      addCopy(props.bookId, copyFormData.value)
      ElMessage.success('副本添加成功')
    }
    
    loadBook() // 重新加载书籍数据
    closeCopyDialog()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const borrowCopy = (copy) => {
  selectedCopy.value = copy
  borrowFormData.value.borrower = ''
  borrowDialogVisible.value = true
}

const confirmBorrow = async () => {
  try {
    await borrowFormRef.value.validate()
    
    setBorrowCopy(props.bookId, selectedCopy.value.id, borrowFormData.value.borrower)
    ElMessage.success('借出成功')
    
    loadBook() // 重新加载书籍数据
    borrowDialogVisible.value = false
    borrowFormData.value.borrower = ''
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const returnCopy = async (copy) => {
  try {
    await ElMessageBox.confirm(
      `确定要归还副本"${copy.copyNumber}"吗？`,
      '确认归还',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
      }
    )
    
    setReturnCopy(props.bookId, copy.id)
    ElMessage.success('归还成功')
    loadBook() // 重新加载书籍数据
  } catch (error) {
    // 用户取消操作
  }
}

const archiveCopy = async (copy) => {
  try {
    await ElMessageBox.confirm(
      `确定要归档副本"${copy.copyNumber}"吗？`,
      '确认归档',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    )
    
    updateCopy(props.bookId, copy.id, { status: COPY_STATUS.IN_STOCK })
    ElMessage.success('归档成功')
    loadBook() // 重新加载书籍数据
  } catch (error) {
    // 用户取消操作
  }
}

const deleteCopy = async (copy) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除副本"${copy.copyNumber}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    removeCopy(props.bookId, copy.id)
    ElMessage.success('副本删除成功')
    loadBook() // 重新加载书籍数据
  } catch (error) {
    // 用户取消删除
  }
}

const showBorrowRecords = (copy) => {
  selectedCopy.value = copy
  recordsDialogVisible.value = true
}

onMounted(() => {
  loadBook()
})
</script>

<style scoped>
.copy-management {
  width: 100%;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions h2 {
  margin: 0;
  color: #303133;
}

.actions {
  display: flex;
  align-items: center;
}

.book-info .book-details {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.book-info .detail-item {
  display: flex;
  align-items: center;
}

.book-info .label {
  font-weight: bold;
  margin-right: 8px;
  color: #606266;
}
</style>
