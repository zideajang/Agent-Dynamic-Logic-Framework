// rollup.config.js
import path from 'path';

export default {
  // 定义入口文件，即你的主 JS 文件
  input: 'src/main.js',
  
  // 定义输出配置
  output: {
    // 打包后的文件名和路径
    file: 'dist/bundle.js',
    // 输出格式，通常为 ES Modules (esm) 或 CommonJS (cjs)
    format: 'esm'
  }
};