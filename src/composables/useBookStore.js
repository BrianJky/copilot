import { ref } from 'vue'
import { Book, BookCopy, BorrowRecord, BOOK_STATUS, COPY_STATUS } from '../models/book.js'

// 模拟数据
const initBooks = () => [
  new Book({
    id: 1,
    name: 'Vue.js 设计与实现',
    author: '霍春阳',
    publisher: '人民邮电出版社',
    publishDate: '2022-03-01',
    price: 79.00,
    pages: 468,
    isbn: '9787115580905',
    quantity: 3,
    stockDate: '2023-01-15',
    borrowCount: 25,
    status: BOOK_STATUS.NORMAL,
    copies: [
      new BookCopy({
        id: 101,
        bookId: 1,
        copyNumber: 'VUE001',
        location: 'A区-1层-001',
        status: COPY_STATUS.IN_STOCK,
        borrowCount: 8,
        borrowRecords: [
          new BorrowRecord({
            id: 1001,
            copyId: 101,
            borrower: '张三',
            borrowDate: '2024-01-15',
            returnDate: '2024-02-15'
          }),
          new BorrowRecord({
            id: 1002,
            copyId: 101,
            borrower: '李四',
            borrowDate: '2024-03-01',
            returnDate: '2024-03-20'
          })
        ]
      }),
      new BookCopy({
        id: 102,
        bookId: 1,
        copyNumber: 'VUE002',
        location: 'A区-1层-002',
        status: COPY_STATUS.BORROWED,
        borrowCount: 12,
        borrowRecords: [
          new BorrowRecord({
            id: 1003,
            copyId: 102,
            borrower: '王五',
            borrowDate: '2024-04-01',
            returnDate: null
          })
        ]
      }),
      new BookCopy({
        id: 103,
        bookId: 1,
        copyNumber: 'VUE003',
        location: 'A区-1层-003',
        status: COPY_STATUS.IN_STOCK,
        borrowCount: 5,
        borrowRecords: []
      })
    ]
  }),
  new Book({
    id: 2,
    name: 'JavaScript高级程序设计',
    author: 'Matt Frisbie',
    publisher: '人民邮电出版社',
    publishDate: '2020-10-01',
    price: 129.00,
    pages: 888,
    isbn: '9787115545381',
    quantity: 2,
    stockDate: '2023-02-20',
    borrowCount: 45,
    status: BOOK_STATUS.ALL_BORROWED,
    copies: [
      new BookCopy({
        id: 201,
        bookId: 2,
        copyNumber: 'JS001',
        location: 'B区-2层-101',
        status: COPY_STATUS.BORROWED,
        borrowCount: 20,
        borrowRecords: []
      }),
      new BookCopy({
        id: 202,
        bookId: 2,
        copyNumber: 'JS002',
        location: 'B区-2层-102',
        status: COPY_STATUS.BORROWED,
        borrowCount: 25,
        borrowRecords: []
      })
    ]
  }),
  new Book({
    id: 3,
    name: 'React技术揭秘',
    author: '卡颂',
    publisher: '电子工业出版社',
    publishDate: '2021-05-01',
    price: 89.00,
    pages: 356,
    isbn: '9787121408953',
    quantity: 1,
    stockDate: '2023-03-10',
    borrowCount: 15,
    status: BOOK_STATUS.FORBIDDEN,
    copies: [
      new BookCopy({
        id: 301,
        bookId: 3,
        copyNumber: 'REACT001',
        location: 'C区-3层-201',
        status: COPY_STATUS.DAMAGED,
        borrowCount: 15,
        borrowRecords: []
      })
    ]
  })
]

export const useBookStore = () => {
  const books = ref(initBooks())
  
  // 获取所有书籍
  const getBooks = () => books.value
  
  // 根据ID获取书籍
  const getBookById = (id) => books.value.find(book => book.id === id)
  
  // 添加书籍
  const addBook = (bookData) => {
    const newBook = new Book({
      ...bookData,
      id: Date.now()
    })
    books.value.push(newBook)
    return newBook
  }
  
  // 更新书籍
  const updateBook = (id, bookData) => {
    const index = books.value.findIndex(book => book.id === id)
    if (index !== -1) {
      books.value[index] = { ...books.value[index], ...bookData }
      return books.value[index]
    }
    return null
  }
  
  // 删除书籍
  const deleteBook = (id) => {
    const index = books.value.findIndex(book => book.id === id)
    if (index !== -1) {
      books.value.splice(index, 1)
      return true
    }
    return false
  }
  
  // 禁止借阅
  const forbidBook = (id) => {
    return updateBook(id, { status: BOOK_STATUS.FORBIDDEN })
  }
  
  // 恢复借阅
  const restoreBook = (id) => {
    return updateBook(id, { status: BOOK_STATUS.NORMAL })
  }
  
  // 添加副本
  const addCopy = (bookId, copyData) => {
    const book = getBookById(bookId)
    if (book) {
      const newCopy = new BookCopy({
        ...copyData,
        id: Date.now(),
        bookId
      })
      book.copies.push(newCopy)
      book.quantity = book.copies.length
      return newCopy
    }
    return null
  }
  
  // 更新副本
  const updateCopy = (bookId, copyId, copyData) => {
    const book = getBookById(bookId)
    if (book) {
      const copyIndex = book.copies.findIndex(copy => copy.id === copyId)
      if (copyIndex !== -1) {
        book.copies[copyIndex] = { ...book.copies[copyIndex], ...copyData }
        return book.copies[copyIndex]
      }
    }
    return null
  }
  
  // 删除副本
  const deleteCopy = (bookId, copyId) => {
    const book = getBookById(bookId)
    if (book) {
      const copyIndex = book.copies.findIndex(copy => copy.id === copyId)
      if (copyIndex !== -1) {
        book.copies.splice(copyIndex, 1)
        book.quantity = book.copies.length
        return true
      }
    }
    return false
  }
  
  // 借出副本
  const borrowCopy = (bookId, copyId, borrower) => {
    const copy = updateCopy(bookId, copyId, { status: COPY_STATUS.BORROWED })
    if (copy) {
      const borrowRecord = new BorrowRecord({
        copyId,
        borrower,
        borrowDate: new Date().toISOString().split('T')[0]
      })
      copy.borrowRecords.push(borrowRecord)
      copy.borrowCount++
      return borrowRecord
    }
    return null
  }
  
  // 归还副本
  const returnCopy = (bookId, copyId) => {
    const book = getBookById(bookId)
    if (book) {
      const copy = book.copies.find(c => c.id === copyId)
      if (copy) {
        const activeRecord = copy.borrowRecords.find(record => !record.returnDate)
        if (activeRecord) {
          activeRecord.returnDate = new Date().toISOString().split('T')[0]
          copy.status = COPY_STATUS.IN_STOCK
          return activeRecord
        }
      }
    }
    return null
  }
  
  return {
    books,
    getBooks,
    getBookById,
    addBook,
    updateBook,
    deleteBook,
    forbidBook,
    restoreBook,
    addCopy,
    updateCopy,
    deleteCopy,
    borrowCopy,
    returnCopy
  }
}
