# Z-VAPE 技术实现文档（Code）

> 技术视角，对应产品文档 `docs/prd.md`。历史规划稿 `z-vape.md` 已 Deprecated，以本文与实测代码为准。

---

## 1. 技术栈与版本

| 层 | 选型 | 版本/说明 | 锚点 |
|----|------|-----------|------|
| 框架 | Next.js | `^16.3.1`，`output: 'standalone'` | `next.config.ts:9` `package.json:32` |
| UI | React | `19.2.6` | `package.json:35` |
| CMS | Payload CMS | `3.88.0`（`payload` + `@payloadcms/next/db-postgres/richtext-lexical/ui`） | `package.json:21-24` |
| 数据库 | PostgreSQL | `@payloadcms/db-postgres`，`idType: 'uuid'` | `payload.config.ts:43` |
| 富文本 | Lexical | `lexicalEditor()` | `payload.config.ts:37` |
| 样式 | Tailwind CSS | `^4.3.2` + `@tailwindcss/postcss`，`@import 'tailwindcss'` | `globals.css:1` `package.json:25` |
| 图片 | sharp | `^0.35.3` | `payload.config.ts:49` |
| 图标 | lucide-react | `^1.27.0` | `package.json:31` |
| 轮播 | embla-carousel | `embla-carousel-react/autoplay ^8.6.0` | `package.json:28-29` |
| 包管理 | pnpm | `^9 || ^10 || ^11`，`pnpm@11.3.0` | `package.json:58` |
| 测试 | Vitest + Playwright | `vitest ^4.1.10` / `@playwright/test 1.58.2` | `vitest.config.mts:1` `playwright.config.ts:1` |

Node 要求：`^18.20.2 || >=20.9.0`（`package.json:57`），Docker 构建使用 `node:24-alpine`（`Dockerfile:4`）。

---

## 2. 仓库结构

```
.
├── src/
│   ├── payload.config.ts          CMS 总配置（collections/globals/db/editor）
│   ├── payload-types.ts           生成类型（勿手改，payload generate:types）
│   ├── collections/               集合定义
│   │   ├── Users.ts               认证 + 角色 + 收货地址
│   │   ├── Media.ts               上传 + 文件名哈希
│   │   ├── Brands.ts              品牌
│   │   ├── Products.ts            商品
│   │   ├── Orders.ts              订单（含 Access）
│   │   └── Pages.ts               静态页
│   ├── globals/
│   │   ├── Header.ts              导航全局
│   │   └── Footer.ts              页脚全局
│   ├── hooks/
│   │   └── sanitizeMediaFilename.ts  媒体文件名哈希
│   ├── lib/
│   │   ├── auth.ts                getCurrentUser / setAuthCookie
│   │   ├── shipping.ts            运费规则
│   │   └── lexical-to-text.ts     富文本转文本（若有）
│   ├── components/
│   │   └── Logo.tsx               Admin Logo/Icon
│   └── app/
│       ├── (payload)/             Payload Admin 与 API
│       │   ├── admin/[[...segments]]/page.tsx
│       │   ├── api/[...slug]/route.ts
│       │   └── layout.tsx / custom.scss / importMap.js
│       └── (frontend)/            面向消费者的 Next App Router
│           ├── layout.tsx         根布局（字体/Header/Footer/AgeGate/CartProvider）
│           ├── globals.css        设计令牌与全局样式
│           ├── page.tsx           透传至 main/page.tsx
│           ├── main/page.tsx      首页（BrandGroups + HotBlocks）
│           ├── products/          列表与详情
│           ├── brands/[slug]/     品牌馆
│           ├── cart/page.tsx      购物车（client）
│           ├── checkout/          结算（page.tsx server + CheckoutForm.tsx client）
│           ├── order/[id]/page.tsx 订单确认
│           ├── login|register|verification|support|contact  认证与静态页
│           ├── components/        前端组件库（见 §6）
│           └── actions/           Server Actions（auth/orders）
├── public/assets/                 静态资源（logo/banner）
├── tests/                         int/e2e 测试（vitest/playwright）
├── docs/                          prd.md / code.md（本文）
├── next.config.ts / tsconfig.json / eslint.config.mjs / postcss.config.mjs
├── Dockerfile / docker-compose.yml
└── payload.config.ts 依赖的 .env（DATABASE_URL, PAYLOAD_SECRET）
```

`src/payload.config.ts:8` 注释掉了 `migrations` 导入，`prodMigrations: []` 为空，`src/migrations/` 目录当前为空。

---

## 3. 配置详解

### 3.1 Payload Config
`src/payload.config.ts:21-51`
- `admin.theme: 'dark'`，`user: Users.slug`，`importMap.baseDir` 指向 `src`
- `components.graphics.Logo/Icon` 均指向 `/components/Logo#default`
- `collections: [Users, Media, Brands, Products, Orders, Pages]`，`globals: [Header, Footer]`
- `editor: lexicalEditor()`，`typescript.outputFile: payload-types.ts`
- `db: postgresAdapter({ idType:'uuid', pool:{ connectionString: DATABASE_URL } })`，`sharp`

### 3.2 Next Config
`next.config.ts:1-38`
- `withPayload(nextConfig, { devBundleServerPackages:false })`
- `output: 'standalone'` + `outputFileTracingIncludes` 包含 `@swc/helpers`
- `images.localPatterns`: `/api/media/file/**`、`/assets/**`、`/logo/**`、`/icon/**`（后两者为 `<img>` → `next/image` 迁移时补入，缺则 dev 下渲染期抛 `E426`）
- `webpack.resolve.extensionAlias` 兼容 `.cjs/.js/.mjs` → `.ts` 解析，`turbopack.root` 指向项目根

### 3.3 设计令牌
`src/app/(frontend)/globals.css:3-26`
```css
--color-bg: #000019; --color-gold: #daa34a; --color-gold-light: #d4b87a;
--color-text-primary: #f0ece4; --color-text-secondary: #9a9590; --color-border: #1e1c19;
--font-heading: 'Playfair Display'; --font-body: 'Inter';
```
全局重置、平滑滚动、滚动条、`.section-padding`（`max-width:1400px`，三档响应式内边距）、`.full-bleed`、`.gold-line`。

### 3.4 环境变量
`.env.example` 仅示例 Mongo，实测为 Postgres，需：
```
DATABASE_URL=postgres://...
PAYLOAD_SECRET=...
```
`payload.config.ts:38,45` 对两者做 `|| ''` 兜底，缺失时构建可过但运行时鉴权/连接失败。

---

## 4. 数据模型

> 以 `src/collections/*`、`src/globals/*` 与 `payload-types.ts` 为准；`z-vape.md` 中的 `Categories` 未落地。

### 4.1 Users
`src/collections/Users.ts:1-59` → `payload-types.ts:138-168`
```
name: text required
phone: text
roles: select hasMany ['admin','editor','customer'] default ['customer'] saveToJWT
shippingAddress: group { line1, line2, city, state[AU 8], postcode }
+ auth 自动字段：email/password/hash/salt/resetPasswordToken/loginAttempts/lockUntil/sessions
admin.group: Commerce, useAsTitle: email
```

### 4.2 Media
`src/collections/Media.ts:1-28`
```
alt: text required
originalFilename: text readOnly sidebar
access.read: () => true
hooks.beforeOperation: sanitizeMediaFilename  // 哈希重命名，保留原名至 originalFilename
upload: true
```
`hooks/sanitizeMediaFilename.ts:6-23`：`formatHashedFilename` 取 8 字节随机 hex + 小写扩展名（1-16 字母数字），非法扩展名则仅保留 hash。

### 4.3 Brands
`src/collections/Brands.ts:1-41` → `payload-types.ts:193-207`
```
name: text required
slug: slugField() auto from name
description: textarea
logo: upload → media
bannerImage: upload → media
sortOrder: number default 0 sidebar
group: Catalog
```

### 4.4 Products
`src/collections/Products.ts:1-118` → `payload-types.ts:212-264`
```
name: text required
slug: slugField()
brand: relationship → brands required sidebar
description: richText (lexical)
images: array required minRows 1 { image: upload → media }
price: number required min 0 sidebar  // AUD
compareAtPrice: number sidebar
flavour: text
puffCount: number
nicotineStrength: text
sku: text unique sidebar
stock: number default 0 sidebar
featured: checkbox default false
newArrival: checkbox default false
status: select ['draft','active','archived'] default 'draft' sidebar
timestamps, defaultSort: '-createdAt'
```

### 4.5 Orders
`src/collections/Orders.ts:1-154` → `payload-types.ts:269-299`
```
orderNumber: text unique required sidebar
customer: relationship → users sidebar
items: array required minRows 1 { product: rel products required, quantity: number min1, unitPrice: number }
subtotal: number sidebar
shipping: number default 0 sidebar
total: number required sidebar
status: select ['pending','paid','shipped','delivered','cancelled','refunded'] default 'pending' sidebar
shippingAddress: group { name required, phone, line1 required, line2, city required, state[AU], postcode required }
notes: textarea
ageVerified: checkbox default false sidebar  // 结算勾选落库
timestamps
access: {
  create: Boolean(req.user)
  read: isAdmin ? true : req.user ? { customer: { equals: req.user.id } } : false
  update/delete: isAdmin
}
```

### 4.6 Pages
`src/collections/Pages.ts:1-28` → `payload-types.ts:304-330`
```
title: text required
slug: slugField()
content: richText
featuredImage: upload → media
group: Content
```

### 4.7 Globals
`Header.ts:1-31` → `payload-types.ts:610-622`：`brandName(text, default Z-VAPE)`, `navItems array {label, link}`，`group: Site Settings`  
`Footer.ts:1-61` → `payload-types.ts:627-651`：`brandDescription`, `customerService{email,phone,hours}`, `socialLinks[platform/url]`, `footerLinks[label/link]`

### 4.8 与 z-vape.md 的差异
- `Categories` 集合未实现；前端分类由 `Brand` 替代。
- `Products.category` 字段不存在。
- 其余字段与 `z-vape.md` 基本一致，`Orders.ageVerified` 为代码新增。

---

## 5. 权限与安全

- **Orders 行级权限**：`Orders.ts:13-23` 已实现 `isAdmin` 判定；`customer` 过滤仅返回本人订单，非本人/非 admin 访问 `order/[id]` 会 `notFound()`（`order/[id]/page.tsx:61-69`）。
- **Local API 陷阱**：Payload Local API 默认 `overrideAccess:true`。`order/[id]/page.tsx:53` 使用 `overrideAccess:true` 后手动校验 `isOwner||isAdmin`，属于显式绕过后自检；`actions/orders.ts:114` `payload.create` 传入 `req:{user}` 但未显式 `overrideAccess:false`，依赖 `access.create` 中 `Boolean(req.user)` 放行，需注意后续若收紧策略应显式声明。
- **事务**：`actions/orders.ts` 中创建订单与扣减库存为两次独立操作，无事务包裹，存在超卖窗口。
- **认证**：`lib/auth.ts:12-16` 基于 `payload.auth({headers})`，`setAuthCookie` 使用 `generatePayloadCookie` 写入 httpOnly cookie；`clearAuthCookie` 删除 `${cookiePrefix}-token`。

---

## 6. 前端架构

### 6.1 路由与数据获取
- **RSC 优先**：`layout.tsx:34`、`main/page.tsx:23`、`products/page.tsx:22`、`brands/[slug]/page.tsx:43`、`checkout/page.tsx:22` 均为 Server Components，使用 `getPayload({config})` + `payload.find/findByID`，统一 `dynamic='force-dynamic'` 禁用静态化。
- **首页聚合**：`main/page.tsx:32-47` 并行查询 `brands where slug in BRAND_SLUGS`，再 `Promise.all` 每品牌取 `featured && active` 最多 4 款，组装 `BrandGroup[]` 供 `HotBlocks` 渲染。
- **IGET 已停用（注释保留）**：`main/page.tsx:12` `BRAND_SLUGS` 的 `'iget'`、`BrandBlocks.tsx:32-41` 品牌卡、`HotBlocks.tsx:24` logo fallback、`Header.tsx:14` 导航项、`Footer.tsx:23-25` 链接、`layout.tsx:28-31` SEO 描述均以注释停用；`BrandBlocks.tsx:101` 容器补 `md:justify-center` 使 2 卡居中。产品列表品牌筛选 tab 与 `/brands/iget` 路由未屏蔽。
- **SEO**：`products/[slug]/page.tsx:18` 与 `brands/[slug]/page.tsx:23` 提供 `generateMetadata`。

### 6.2 客户端边界
| 组件 | 类型 | 作用 |
|------|------|------|
| `CartContext.tsx:71` | client | `useSyncExternalStore` + `localStorage('z-vape-cart')` 购物车状态 |
| `Header.tsx:48` | client | 导航、促销条开关、`totalItems` 徽标、登录态/登出 |
| `AgeGate.tsx:34` | client | `useSyncExternalStore` + `localStorage('z-vape-age-verified')` 拦截 |
| `cart/page.tsx:8` | client | 购物车页交互 |
| `CheckoutForm.tsx:37` | client | 地址表单、18+ 勾选、调用 `createOrderAction` |
| `ProductGallery/AddToCart/MobileBottomBar` | client | 详情交互 |

### 6.3 组件清单
`src/app/(frontend)/components/` 包含：`Header/Footer/BannerSection/BannerCarousel/BrandBlocks/BrandShowcase/HotBlocks/IconBlanks/ValueProps/BrandStory/HeroBanner/CategoryCards/FeaturedProducts/ProductCard/ProductGrid/ProductGallery/ProductInfo/AddToCart/MobileBottomBar/AgeGate/CartContext/AuthForm`。其中 `BrandBlocks/HotBlocks/IconBlanks` 为首页实际使用；`BrandShowcase/CategoryCards/HeroBanner` 等为历史/冗余，需清理或归档。

### 6.4 图片（`next/image`）
- `src/app/(frontend)` 内 `<img>` 已全部迁移为 `next/image`，ESLint `@next/next/no-img-element` 与 `no-unused-vars` 归零。
- **尺寸来源**：`src/lib/media.ts` `getMediaDims` / `getProductImageDims` 与 `getMediaUrl` 走**完全相同的 size → fallback 顺序**（`sizes[size].url` → `media.url`），保证声明的 `width/height` 对应实际渲染的文件；`sizes[size].url` 存在却缺 `width` 时返回 `null` 而非退回原图尺寸（避免比例错配）。
- **容器适配**：`aspect-square`/`aspect-3/4` 容器用 `fill` + `sizes`（`ProductCard`、`ProductGallery`、`BrandShowcase`）；固定小图给显式 `width/height` 由 `h-full w-auto` 覆盖（`cart`、`checkout`、`order`、缩略图）；静态 logo/icon 尺寸硬编码在 block 数据里（`BrandBlocks`、`IconBlanks`、`HotBlocks` fallback）。**logo 类图必须带 `w-auto`**，否则 `width` 属性会锁死宽度导致变形。
- **不可信 src 守卫**：购物车 `imageUrl` 持久化于 `localStorage`，可能残留历史路径。`isOptimizableImageSrc` 非白名单时降级 `unoptimized`——`unoptimized` 分支在调用 loader 前返回，从而绕过 `localPatterns` 校验，避免 dev 下整页抛错。用例 `tests/int/guard.int.spec.ts`。
- `BannerSection` 为首页 LCP，带 `priority`。

### 6.5 样式与字体
- `layout.tsx:14-24` 注入 `Inter`（`--font-body`）与 `Playfair_Display`（`--font-heading`）。
- `Header` 金色导航激活态 `text-gold font-bold + bottom border`，`Footer` 居中品牌 + 金色导航 + 客服信息。

### 6.6 Tailwind 类写法约定
- **优先写规范类**：`tailwindcss-intellisense` 的 `suggestCanonicalClasses` 规则会对「可用规范类表达的任意值」报警告级提示。
- 判定依据是 `theme.css` 的 `--spacing: 0.25rem`（= 4px）。换算：`值px ÷ 4 = 间距刻度`。
  ```
  h-[48px]→h-12    h-[56px]→h-14    h-[60px]→h-15    w-[240px]→w-60
  md:left-[30px]→md:left-7.5    md:top-[190px]→md:top-47.5
  md:right-[40px]→md:right-10   md:top-[80px]→md:top-20   md:top-[100px]→md:top-25
  tracking-[0.1em]→tracking-widest    tracking-[0.05em]→tracking-wider
  flex-shrink-0→shrink-0
  ```
- **无规范值的保留任意值**（不受该规则影响）：`text-[10px]/[11px]/[9px]`、`tracking-[0.15em]` 及以上等。
- 权威校验方式（勿手算）：`__unstable__loadDesignSystem(...).canonicalizeCandidates(list, {rem:16})`。

---

## 7. 关键链路

### 7.1 加购 → 结算 → 下单
```
ProductCard/AddToCart --addItem--> CartContext(localStorage)
  -> /cart --Proceed to Checkout--> /checkout (server: require login)
  -> CheckoutForm --createOrderAction--> actions/orders.ts
      ├─ 校验登录/地址/州/行项目
      ├─ 逐行 payload.findByID 检查 status=active & stock>=qty
      ├─ 计算 subtotal/shipping/total (shipping.ts)
      ├─ payload.create orders { orderNumber, customer, items{unitPrice:price}, totals, ageVerified:true }
      └─ best-effort payload.update products stock
  -> /order/[id] (isOwner||isAdmin)
直购分支：/checkout?buy_now=id&qty=n 在 checkout/page.tsx:35-60 服务端预取并校验，失败 redirect /products
```

### 7.2 运费规则
`src/lib/shipping.ts:1-8`
```ts
FLAT_SHIPPING = 10; FREE_SHIPPING_THRESHOLD = 100;
computeShipping(subtotal) = subtotal<=0 ? 0 : subtotal>=100 ? 0 : 10
```

### 7.3 年龄校验
- `AgeGate.tsx:8` 初始化 `verified = localStorage['z-vape-age-verified']==='true'`，未校验则全屏遮罩，确认后写入 localStorage。
- `CheckoutForm` 另有独立 `ageConfirmed` 状态，未勾选则阻断提交并提示。

---

## 8. 构建、运行与部署

### 8.1 本地开发
```bash
cp .env.example .env   # 改为 DATABASE_URL=postgres://...  PAYLOAD_SECRET=...
pnpm install
pnpm dev               # cross-env NODE_OPTIONS=--no-deprecation next dev
# 访问 http://localhost:3000  与  http://localhost:3000/admin
pnpm generate:types    # 修改 collections 后更新 payload-types.ts
pnpm generate:importmap
```

### 8.2 构建
```bash
pnpm build   # cross-env NODE_OPTIONS="--no-deprecation --max-old-space-size=8000" next build
pnpm start
```

### 8.3 Docker
- `Dockerfile:4-72` 多段构建（deps → builder → runner），`standalone` 输出，`server.js` 启动。
- `docker-compose.yml` 当前为 `mongo` 示例，postgres 段被注释；实测项目已切 Postgres，需自行补 `postgres` 服务并将 `DATABASE_URL` 指向 `postgres://postgres:5432/...`。

### 8.4 环境变量
| 变量 | 必需 | 说明 |
|------|------|------|
| `DATABASE_URL` | ✅ | Postgres 连接串 |
| `PAYLOAD_SECRET` | ✅ | JWT/加密密钥 |
| `NEXT_PUBLIC_*` | — | 预留 |

---

## 9. 测试与质量

- **单元/集成**：`vitest.config.mts:10` `include: ['tests/int/**/*.int.spec.ts']`，`jsdom` + `@vitejs/plugin-react` + `vite-tsconfig-paths`。
- **E2E**：`playwright.config.ts:13` `testDir: ./tests/e2e`，单项目 `chromium`，`webServer: pnpm dev` 复用。
- **Lint**：`eslint.config.mjs` + `eslint-config-next`，`pnpm lint`。
- **现状**：`tests/int/` 覆盖 `api` / `sanitizeMediaFilename` / `guard`（共 9 用例）；`tests/e2e/` 用例存在但本地缺 Playwright 浏览器二进制（`chromium-1208` vs 已装 `1234`），需 `pnpm exec playwright install`。`src/migrations/` 为空。

---

## 10. 已知风险与 TODO

| 风险 | 影响 | 建议 |
|------|------|------|
| 库存无事务/无锁 | 并发下单超卖 | 引入 DB 事务或 `SELECT ... FOR UPDATE`，或将扣减移至 `beforeChange` hook 内原子化 |
| `docker-compose.yml` 仍为 mongo 模板 | 新人本地启动困惑 | 取消 postgres 注释，统一为 postgres 示例 |
| `Categories` 缺失与文档不一致 | 运营理解偏差 | 本文档已标注，PRD 决策是否恢复或以标签替代 |
| 冗余组件（BrandShowcase/CategoryCards/HeroBanner 等） | 维护成本 | 清理或移至 `components/_deprecated/` |
| 搜索按钮未接线 | 体验缺口 | `Header.tsx:127` 搜索仅为占位，需接入 `/products?q=` |
| 支付留空 | 无法闭环收款 | 后续接入第三方，补充幂等、回调、退款状态机 |
| `z-vape.md` 历史稿 | 信息过时 | 已标记 Deprecated，以 `docs/prd.md`/`code.md` 为准 |
| IGET 已停用（注释保留） | 后续可能恢复 | 取消 6 处注释即可恢复：`main/page.tsx:12` / `BrandBlocks.tsx:32-41` / `HotBlocks.tsx:24` / `Header.tsx:14` / `Footer.tsx:23-25` / `layout.tsx:28-31`；图片与数据未删 |

---

## 11. 常用命令速查

```bash
pnpm dev          # 开发
pnpm build        # 构建
pnpm start        # 生产启动
pnpm lint         # 代码检查
pnpm payload generate:types    # 更新 payload-types.ts
pnpm payload generate:importmap
pnpm test:int      # vitest
pnpm test:e2e      # playwright
```

---

## 12. 变更记录

- 2026-09-25：清理 `suggestCanonicalClasses` 类 VS Code hint —— 37 处任意值改为等价规范类（10 个文件），涉及 14 种替换；逐组编译 CSS 验证计算值完全等价（`--spacing:0.25rem`=4px）。规则见 `§6.6`。
- 2026-09-25：`src/app/(frontend)` 完成 `<img>` → `next/image` 迁移（17 条 lint warning 归零），`next.config.ts` 补 `/logo/**`、`/icon/**`；`src/lib/media.ts` 新增 `getMediaDims`/`getProductImageDims`/`isOptimizableImageSrc`；新增 `tests/int/guard.int.spec.ts`。
- 2026-09-01：初版，基于 `payload.config.ts`、`payload-types.ts`、`src/collections/*`、`src/app/(frontend)/*` 实测整理；`z-vape.md` 标记 Deprecated。
