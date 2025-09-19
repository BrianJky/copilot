#!/usr/bin/env node

/**
 * KOCA Design 组件替换工具
 * 自动将 Element Plus 组件替换为 KOCA Design 组件
 */

const fs = require('fs');
const path = require('path');

// Element Plus 到 KOCA Design 的组件映射
const COMPONENT_MAPPING = {
  // 布局组件
  'el-container': 'k-container',
  'el-header': 'k-header', 
  'el-main': 'k-main',
  'el-aside': 'k-aside',
  'el-footer': 'k-footer',
  
  // 表格组件
  'el-table': 'k-table',
  'el-table-column': 'k-table-column',
  
  // 表单组件
  'el-form': 'k-form',
  'el-form-item': 'k-form-item',
  'el-input': 'k-input',
  'el-button': 'k-button',
  'el-select': 'k-select',
  'el-option': 'k-option',
  'el-date-picker': 'k-date-picker',
  'el-input-number': 'k-input-number',
  'el-checkbox': 'k-checkbox',
  'el-radio': 'k-radio',
  'el-switch': 'k-switch',
  
  // 反馈组件
  'el-dialog': 'k-dialog',
  'el-message': 'k-message',
  'el-message-box': 'k-message-box',
  'el-tag': 'k-tag',
  'el-empty': 'k-empty',
  'el-loading': 'k-loading',
  
  // 导航组件
  'el-breadcrumb': 'k-breadcrumb',
  'el-breadcrumb-item': 'k-breadcrumb-item',
  'el-menu': 'k-menu',
  'el-menu-item': 'k-menu-item',
  
  // 数据展示
  'el-card': 'k-card',
  'el-collapse': 'k-collapse',
  'el-collapse-item': 'k-collapse-item',
  'el-tabs': 'k-tabs',
  'el-tab-pane': 'k-tab-pane',
  
  // 布局
  'el-row': 'k-row',
  'el-col': 'k-col',
  'el-divider': 'k-divider',
  
  // 其他
  'el-icon': 'k-icon',
  'el-image': 'k-image',
  'el-avatar': 'k-avatar',
  'el-badge': 'k-badge',
  'el-tooltip': 'k-tooltip',
  'el-popover': 'k-popover'
};

// API 方法映射
const API_MAPPING = {
  'ElMessage': 'KMessage',
  'ElMessageBox': 'KMessageBox',
  'ElNotification': 'KNotification',
  'ElLoading': 'KLoading'
};

/**
 * 替换文件中的组件
 */
function replaceComponents(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // 替换组件标签
  Object.entries(COMPONENT_MAPPING).forEach(([elComponent, kComponent]) => {
    const regex = new RegExp(`<${elComponent}([\\s>])`, 'g');
    const closingRegex = new RegExp(`</${elComponent}>`, 'g');
    
    if (content.match(regex) || content.match(closingRegex)) {
      content = content.replace(regex, `<${kComponent}$1`);
      content = content.replace(closingRegex, `</${kComponent}>`);
      hasChanges = true;
      console.log(`✓ 替换 ${elComponent} → ${kComponent} in ${filePath}`);
    }
  });

  // 替换 API 调用
  Object.entries(API_MAPPING).forEach(([elApi, kApi]) => {
    const regex = new RegExp(elApi, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, kApi);
      hasChanges = true;
      console.log(`✓ 替换 ${elApi} → ${kApi} in ${filePath}`);
    }
  });

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
  }

  return hasChanges;
}

/**
 * 遍历目录替换文件
 */
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(fullPath);
    } else if (file.endsWith('.vue') || file.endsWith('.js') || file.endsWith('.ts')) {
      replaceComponents(fullPath);
    }
  });
}

console.log('🚀 开始 KOCA Design 组件替换...\n');
processDirectory('./src');
console.log('\n✅ 组件替换完成！');
console.log('\n📝 接下来请手动完成以下步骤：');
console.log('1. 更新 package.json 中的依赖');
console.log('2. 更新 main.js 中的导入');
console.log('3. 更新 vite.config.js 配置');
console.log('4. 检查并调整组件属性差异');
console.log('5. 测试所有功能是否正常');
