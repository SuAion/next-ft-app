# 📂 项目目录结构重构指南

## 🎯 重构目标

将当前混乱的目录结构重组为清晰、可维护的架构，遵循 **功能驱动** 和 **分层架构** 的设计原则。

## 📊 当前问题分析

### ❌ 现有问题

1. **组件目录混乱**: `app/ui-components` 与 `components` 职责重叠 🎯
2. **路由分组不清**: `(admin-nowith)` 命名不明确🎯
3. **类型定义分散**: 缺少统一的类型管理
4. **功能模块耦合**: 相关功能分散在不同目录
5. **文件命名不一致**: 拼写错误和命名规范不统一

## 🎯 推荐的新结构

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/              # 需要登录的仪表板页面
│   │   ├── admin/               # 管理后台
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── dashboard/       # 仪表板首页
│   │   │   ├── posts/          # 文章管理
│   │   │   └── users/          # 用户管理
│   │   └── profile/            # 用户个人中心
│   ├── (public)/               # 公开访问页面
│   │   ├── explore/            # 浏览页面
│   │   ├── chat/              # 聊天功能
│   │   └── about/             # 关于页面
│   ├── (auth)/                # 认证相关页面
│   │   ├── login/
│   │   ├── register/
│   │   └── admin-login/
│   ├── api/                   # API 路由
│   │   ├── auth/             # 认证 API
│   │   ├── posts/            # 文章 API
│   │   ├── users/            # 用户 API
│   │   └── admin/            # 管理员 API
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── not-found.tsx
├── components/                # 通用组件库
│   ├── ui/                   # 基础 UI 组件
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   ├── Toast/
│   │   └── index.ts          # 统一导出
│   ├── layout/               # 布局组件
│   │   ├── Header/
│   │   ├── Footer/
│   │   ├── Sidebar/
│   │   └── Navigation/
│   ├── feedback/             # 反馈组件
│   │   ├── Loading/
│   │   ├── ErrorBoundary/
│   │   ├── Toast/
│   │   └── Skeleton/
│   └── data-display/         # 数据展示组件
│       ├── Table/
│       ├── List/
│       ├── Card/
│       └── VirtualList/
├── features/                 # 功能模块 (按业务领域组织)
│   ├── auth/                # 认证功能
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── blog/                # 博客功能
│   │   ├── components/
│   │   │   ├── BlogList/
│   │   │   ├── BlogCard/
│   │   │   └── BlogEditor/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── user/                # 用户功能
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   └── admin/               # 管理功能
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── shared/                  # 共享资源
│   ├── lib/                # 核心库
│   │   ├── auth.ts
│   │   ├── request.ts
│   │   ├── response.ts
│   │   ├── database.ts
│   │   └── validation.ts
│   ├── types/              # 全局类型定义
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── common.ts
│   │   └── index.ts
│   ├── utils/              # 工具函数
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   ├── date.ts
│   │   └── index.ts
│   ├── constants/          # 常量定义
│   │   ├── api.ts
│   │   ├── routes.ts
│   │   ├── config.ts
│   │   └── index.ts
│   ├── hooks/              # 全局 Hooks
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── store/              # 状态管理
│   │   ├── auth.ts
│   │   ├── ui.ts
│   │   └── index.ts
│   └── styles/             # 全局样式
│       ├── globals.scss
│       ├── mixins.scss
│       └── variables.scss
├── assets/                 # 静态资源
│   ├── icons/
│   ├── images/
│   └── fonts/
└── locales/               # 国际化文件
    ├── en/
    ├── zh-CN/
    └── index.ts
```

## 🔄 迁移步骤

### Step 1: 创建新目录结构

```bash
# 创建主要目录
mkdir -p src/features/{auth,blog,user,admin}/{components,hooks,services}
mkdir -p src/components/{ui,layout,feedback,data-display}
mkdir -p src/shared/{lib,types,utils,constants,hooks,store,styles}
mkdir -p src/assets/{icons,images,fonts}
```

### Step 2: 重组路由结构

```bash
# 重命名和移动路由组
# 当前: (admin-nowith) -> 新: (auth)
# 当前: (view) -> 新: (public)
# 当前: admin/dashborad -> 新: (dashboard)/admin/dashboard
```

### Step 3: 组件重新分类

#### 移动基础组件到 components/ui/

```bash
# 从 src/components/ 移动到 src/components/ui/
src/components/FTImage/ -> src/components/ui/Image/
src/components/FTScroll/ -> src/components/ui/Scroll/
src/components/LoadingComponent/ -> src/components/feedback/Loading/
```

#### 移动业务组件到 features/

```bash
# 从 src/app/ui-components/ 移动到对应 feature
src/app/ui-components/Display/BlogList/ -> src/features/blog/components/BlogList/
src/app/ui-components/Display/Profile/ -> src/features/user/components/Profile/
src/app/ui-components/Layout/ -> src/components/layout/
```

### Step 4: 类型定义重构

#### 创建统一的类型文件

```typescript
// src/shared/types/index.ts
export * from './api';
export * from './auth';
export * from './common';
export * from './blog';
export * from './user';

// src/shared/types/common.ts
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// src/shared/types/blog.ts
export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}
```

### Step 5: 服务层重构

#### 按功能模块组织服务

```typescript
// src/features/blog/services/blogService.ts
import { request } from '@/shared/lib/request';
import { Post, CreatePostRequest } from '@/shared/types';

export const blogService = {
  getPosts: (params: PaginationParams) =>
    request.get<{ posts: Post[]; pagination: PaginationParams }>('/api/posts', { params }),

  createPost: (data: CreatePostRequest) => request.post<Post>('/api/posts', data),

  updatePost: (id: string, data: Partial<CreatePostRequest>) => request.put<Post>(`/api/posts/${id}`, data),

  deletePost: (id: string) => request.delete(`/api/posts/${id}`),
};
```

### Step 6: 创建统一导出

#### 组件统一导出

```typescript
// src/components/ui/index.ts
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
export { default as Toast } from './Toast';

// src/components/index.ts
export * from './ui';
export * from './layout';
export * from './feedback';
export * from './data-display';
```

#### 功能模块统一导出

```typescript
// src/features/blog/index.ts
export * from './components';
export * from './hooks';
export * from './services';
export * from './types';
```

## 📋 重构检查清单

### Phase 1: 目录结构 ✅

- [ ] 创建新目录结构
- [ ] 移动现有文件到新位置
- [ ] 更新所有导入路径
- [ ] 测试构建是否正常

### Phase 2: 组件重构 ✅

- [ ] 重新分类基础组件
- [ ] 移动业务组件到对应 feature
- [ ] 创建组件统一导出
- [ ] 更新组件引用路径

### Phase 3: 类型系统 ✅

- [ ] 创建统一类型定义
- [ ] 移动现有类型到新位置
- [ ] 补充缺失的类型定义
- [ ] 更新所有类型引用

### Phase 4: 服务层重构 ✅

- [ ] 按功能模块重组服务
- [ ] 创建统一的服务接口
- [ ] 移除测试代码
- [ ] 优化 API 调用逻辑

### Phase 5: 配置优化 ✅

- [ ] 更新 tsconfig.json 路径映射
- [ ] 优化 eslint 配置
- [ ] 更新构建配置
- [ ] 添加必要的开发工具

## 🔧 配置文件更新

### tsconfig.json 路径映射

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/assets/*": ["./src/assets/*"]
    }
  }
}
```

### ESLint 规则更新

```javascript
// eslint.config.mjs
export default [
  {
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
        },
      ],
    },
  },
];
```

## 🎯 重构后的优势

### ✅ 改进效果

1. **清晰的职责分离**: 每个目录都有明确的职责
2. **功能模块化**: 相关功能聚合在一起
3. **可维护性提升**: 代码组织更加直观
4. **类型安全**: 统一的类型定义系统
5. **开发效率**: 更好的代码提示和自动补全
6. **团队协作**: 标准化的目录结构便于团队协作

### 📈 长期收益

- **扩展性**: 新功能可以轻松添加到对应模块
- **复用性**: 组件和工具函数可以轻松复用
- **测试友好**: 清晰的模块划分便于单元测试
- **重构安全**: 类型系统保证重构的安全性

## 🚀 实施建议

1. **分阶段执行**: 不要一次性重构所有内容
2. **保持构建**: 每个阶段都要确保项目能正常构建
3. **测试验证**: 重构后进行充分测试
4. **团队同步**: 与团队成员同步重构计划
5. **文档更新**: 及时更新开发文档

这个重构方案将使您的项目结构更加清晰、可维护，为后续开发打下良好基础。
