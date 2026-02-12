## 源码模块

| 模块                   | 职能                                                    |
| ---------------------- | ------------------------------------------------------- |
| **@vue/reactivity**    | 响应式系统核心：`reactive`、`ref`、`computed`、`effect` |
| **@vue/runtime-core**  | 平台无关运行时：虚拟DOM、组件系统、生命周期             |
| **@vue/runtime-dom**   | 浏览器运行时：DOM操作、事件、属性处理                   |
| **@vue/compiler-core** | 平台无关编译器：模板解析、AST、代码生成                 |
| **@vue/compiler-dom**  | 浏览器编译器：DOM特有转换                               |
| **@vue/compiler-sfc**  | 单文件组件编译器：解析 `.vue` 文件                      |

## 响应式原理

- Proxy 代理
- effect 依赖收集 触发更新
