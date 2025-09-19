<template>
  <div class="book-management">
    <div class="header-actions">
      <h2>书籍管理</h2>
      <div class="actions">
        <el-select 
          v-model="statusFilter" 
          placeholder="筛选状态" 
          clearable
          style="width: 150px; margin-right: 10px;"
        >
          <el-option label="全部" value="" />
          <el-option 
            v-for="(label, key) in BOOK_STATUS_LABELS" 
            :key="key" 
            :label="label" 
            :value="key" 
          />
        </el-select>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          新增书籍
        </el-button>
      </div>
    </div>

    <el-table :data="filteredBooks" style="width: 100%" stripe>
      <el-table-column prop="name" label="书籍名称" width="200" />
      <el-table-column prop="author" label="作者" width="120" />
      <el-table-column prop="publisher" label="出版社" width="150" />
      <el-table-column prop="publishDate" label="出版时间" width="120" />
      <el-table-column prop="price" label="价格" width="80">
        <template #default="scope">
          ¥{{ scope.row.price.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="pages" label="页数" width="80" />
      <el-table-column prop="isbn" label="ISBN" width="150" />
      <el-table-column prop="quantity" label="数量" width="80" />
      <el-table-column prop="stockDate" label="入库时间" width="120" />
      <el-table-column prop="borrowCount" label="借阅次数" width="100" />
      <el-table-column label="状态" width="100">
        <template #default="scope">
          <el-tag 
            :type="getStatusType(scope.row.status)"
            size="small"
          >
            {{ BOOK_STATUS_LABELS[scope.row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300" fixed="right">
        <template #default="scope">
          <el-button size="small" @click="editBook(scope.row)">修改</el-button>
          <el-button 
            v-if="scope.row.status === BOOK_STATUS.NORMAL"
            size="small" 
            type="warning" 
            @click="forbidBook(scope.row)"
          >
            禁止借阅
          </el-button>
          <el-button 
            v-if="scope.row.status === BOOK_STATUS.FORBIDDEN"
            size="small" 
            type="success" 
            @click="restoreBook(scope.row)"
          >
            恢复借阅
          </el-button>
          <el-button size="small" type="info" @click="showCopies(scope.row.id)">
            副本详情
          </el-button>
          <el-button size="small" type="danger" @click="deleteBook(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增/编辑书籍对话框 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible" 
      width="600px"
      :before-close="closeDialog"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="书籍名称" prop="name">
              <el-input v-model="formData.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="formData.author" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出版社" prop="publisher">
              <el-input v-model="formData.publisher" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版时间" prop="publishDate">
              <el-date-picker 
                v-model="formData.publishDate" 
                type="date" 
                placeholder="选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number 
                v-model="formData.price" 
                :precision="2" 
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="页数" prop="pages">
              <el-input-number 
                v-model="formData.pages" 
                :min="0"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="ISBN" prop="isbn">
          <el-input v-model="formData.isbn" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveBook">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBookStore } from '../composables/useBookStore.js'
import { BOOK_STATUS, BOOK_STATUS_LABELS } from '../models/book.js'

const emit = defineEmits(['show-copies'])

const { 
  books, 
  addBook, 
  updateBook, 
  deleteBook: removeBook, 
  forbidBook: setForbidBook, 
  restoreBook: setRestoreBook 
} = useBookStore()

const statusFilter = ref('')
const dialogVisible = ref(false)
const formRef = ref()
const isEdit = ref(false)
const editingId = ref(null)

const formData = ref({
  name: '',
  author: '',
  publisher: '',
  publishDate: '',
  price: 0,
  pages: 0,
  isbn: ''
})

const rules = {
  name: [{ required: true, message: '请输入书籍名称', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  publisher: [{ required: true, message: '请输入出版社', trigger: 'blur' }],
  publishDate: [{ required: true, message: '请选择出版时间', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
  pages: [{ required: true, message: '请输入页数', trigger: 'blur' }],
  isbn: [{ required: true, message: '请输入ISBN', trigger: 'blur' }]
}

const filteredBooks = computed(() => {
  if (!statusFilter.value) return books.value
  return books.value.filter(book => book.status === statusFilter.value)
})

const dialogTitle = computed(() => isEdit.value ? '编辑书籍' : '新增书籍')

const getStatusType = (status) => {
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

const showAddDialog = () => {
  isEdit.value = false
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

const editBook = (book) => {
  isEdit.value = true
  editingId.value = book.id
  formData.value = { ...book }
  dialogVisible.value = true
}

const resetForm = () => {
  formData.value = {
    name: '',
    author: '',
    publisher: '',
    publishDate: '',
    price: 0,
    pages: 0,
    isbn: ''
  }
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

const closeDialog = () => {
  dialogVisible.value = false
  resetForm()
}

const saveBook = async () => {
  try {
    await formRef.value.validate()
    
    if (isEdit.value) {
      updateBook(editingId.value, formData.value)
      ElMessage.success('书籍更新成功')
    } else {
      addBook(formData.value)
      ElMessage.success('书籍添加成功')
    }
    
    closeDialog()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const deleteBook = async (book) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除书籍"${book.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    removeBook(book.id)
    ElMessage.success('书籍删除成功')
  } catch (error) {
    // 用户取消删除
  }
}

const forbidBook = async (book) => {
  try {
    await ElMessageBox.confirm(
      `确定要禁止书籍"${book.name}"的借阅吗？`,
      '确认禁止借阅',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    setForbidBook(book.id)
    ElMessage.success('已禁止该书籍借阅')
  } catch (error) {
    // 用户取消操作
  }
}

const restoreBook = async (book) => {
  try {
    await ElMessageBox.confirm(
      `确定要恢复书籍"${book.name}"的借阅吗？`,
      '确认恢复借阅',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
      }
    )
    
    setRestoreBook(book.id)
    ElMessage.success('已恢复该书籍借阅')
  } catch (error) {
    // 用户取消操作
  }
}

const showCopies = (bookId) => {
  emit('show-copies', bookId)
}
</script>

<style scoped>
.book-management {
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
</style>
