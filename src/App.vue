<template>
  <div id="app">
    <el-container style="height: 100vh;">
      <el-header style="background: #409EFF; color: white; display: flex; align-items: center;">
        <h1 style="margin: 0; font-size: 24px;">图书馆管理系统</h1>
      </el-header>
      <el-main style="padding: 20px;">
        <BookManagement v-if="currentView === 'books'" @show-copies="showCopies" />
        <CopyManagement 
          v-else-if="currentView === 'copies'" 
          :book-id="currentBookId" 
          @back-to-books="backToBooks" 
        />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BookManagement from './components/BookManagement.vue'
import CopyManagement from './components/CopyManagement.vue'

const currentView = ref('books')
const currentBookId = ref(null)

const showCopies = (bookId) => {
  currentBookId.value = bookId
  currentView.value = 'copies'
}

const backToBooks = () => {
  currentView.value = 'books'
  currentBookId.value = null
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

* {
  box-sizing: border-box;
}
</style>
