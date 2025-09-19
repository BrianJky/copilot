// 书籍状态枚举
export const BOOK_STATUS = {
  NORMAL: 'normal',
  ALL_BORROWED: 'all_borrowed',
  FORBIDDEN: 'forbidden'
}

// 书籍状态标签
export const BOOK_STATUS_LABELS = {
  [BOOK_STATUS.NORMAL]: '正常',
  [BOOK_STATUS.ALL_BORROWED]: '全部借出',
  [BOOK_STATUS.FORBIDDEN]: '禁止借出'
}

// 副本状态枚举
export const COPY_STATUS = {
  IN_STOCK: 'in_stock',
  LOST: 'lost',
  DAMAGED: 'damaged',
  BORROWED: 'borrowed',
  UNARCHIVED: 'unarchived'
}

// 副本状态标签
export const COPY_STATUS_LABELS = {
  [COPY_STATUS.IN_STOCK]: '在库',
  [COPY_STATUS.LOST]: '丢失',
  [COPY_STATUS.DAMAGED]: '损坏',
  [COPY_STATUS.BORROWED]: '借出',
  [COPY_STATUS.UNARCHIVED]: '未归档'
}

// 书籍数据模型
export class Book {
  constructor(data = {}) {
    this.id = data.id || Date.now()
    this.name = data.name || ''
    this.author = data.author || ''
    this.publisher = data.publisher || ''
    this.publishDate = data.publishDate || ''
    this.price = data.price || 0
    this.pages = data.pages || 0
    this.isbn = data.isbn || ''
    this.quantity = data.quantity || 0
    this.stockDate = data.stockDate || new Date().toISOString().split('T')[0]
    this.borrowCount = data.borrowCount || 0
    this.status = data.status || BOOK_STATUS.NORMAL
    this.copies = data.copies || []
  }
}

// 副本数据模型
export class BookCopy {
  constructor(data = {}) {
    this.id = data.id || Date.now()
    this.bookId = data.bookId
    this.copyNumber = data.copyNumber || ''
    this.location = data.location || ''
    this.status = data.status || COPY_STATUS.IN_STOCK
    this.borrowCount = data.borrowCount || 0
    this.borrowRecords = data.borrowRecords || []
  }
}

// 借阅记录数据模型
export class BorrowRecord {
  constructor(data = {}) {
    this.id = data.id || Date.now()
    this.copyId = data.copyId
    this.borrower = data.borrower || ''
    this.borrowDate = data.borrowDate || ''
    this.returnDate = data.returnDate || null
  }
}
