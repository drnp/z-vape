# AGENTS.md — Z-VAPE Payload CMS

> 本文件为 Agent 协作规范，定义项目结构、约定与执行清单。产品与技术细节见 `docs/prd.md` / `docs/code.md`，历史稿 `z-vape.md` 已 Deprecated。

---

## 1. 项目速览

- **定位**：澳洲电子烟独立站 `z-vape.com`，品牌集合（IGET / Alibarbar / Snowplus Cash）
- **栈**：Next.js 16 + React 19 + Payload CMS 3.88 + PostgreSQL（`idType: uuid`）+ Tailwind 4 + sharp
- **包管理**：`pnpm@11.3.0`，Node `^18.20.2 || >=20.9.0`
- **输出**：`next.config.ts:9` `output: 'standalone'`，Docker 多段构建

---

## 2. 目录与职责

| 路径 | 职责 | 说明 |
|------|------|------|
| `src/payload.config.ts` | CMS 总配置 | 注册 collections/globals，`postgresAdapter`，`lexicalEditor` |
| `src/payload-types.ts` | 生成类型 | 勿手改，`pnpm payload generate:types` 更新 |
| `src/collections/` | 集合定义 | `Users/Media/Brands/Products/Orders/Pages` |
| `src/globals/` | 全局配置 | `Header/Footer` |
| `src/hooks/` | Hook | `sanitizeMediaFilename.ts` 文件名哈希 |
| `src/lib/` | 工具 | `auth.ts` 鉴权、`shipping.ts` 运费 |
| `src/app/(payload)/` | Admin & API | Payload 管理后台与 `/api/*` |
| `src/app/(frontend)/` | 消费者端 | App Router 页面、组件、Server Actions |
| `src/components/` | Admin 组件 | `Logo.tsx` 供 `payload.config.ts:30` 引用 |
| `public/assets/` | 静态资源 | logo / banner |
| `docs/` | 文档 | `prd.md` / `code.md` |
| `Dockerfile` / `docker-compose.yml` | 部署 | 需将 compose 的 postgres 段取消注释以匹配实测 DB |

---

## 3. 核心约定

### 3.1 数据与权限
- 所有集合主键为 `uuid`（`payload.config.ts:43`）。
- `Orders` 行级权限：`create` 需登录，`read` 仅本人或 `admin`，`update/delete` 仅 `admin`（`Orders.ts:13-23`）。
- Local API 默认 `overrideAccess:true`，如需按用户权限执行必须显式 `overrideAccess:false`；`order/[id]/page.tsx:53` 为绕过后手动校验的特例，新增代码应优先显式声明。

### 3.2 前后端边界
- 优先 Server Components（`getPayload` 直查），`dynamic='force-dynamic'` 已在关键页统一设置。
- 仅必要时使用 `'use client'`：`CartContext/Header/AgeGate/cart/page/CheckoutForm/ProductGallery/AddToCart`。
- 购物车与 AgeGate 使用 `useSyncExternalStore` + `localStorage` 持久化，SSR 快照为空/通过。

### 3.3 样式
- 设计令牌在 `globals.css:3-26`，禁止内联硬编码色值，复用 `bg-gold / text-gold / border-border / section-padding`。
- 字体：`Inter` + `Playfair Display`（`layout.tsx:14-24`）。

### 3.4 金额与库存
- 货币 AUD，展示统一 `toFixed(2)`。
- 运费：`FLAT_SHIPPING=10`，满 `100` 包邮（`lib/shipping.ts`）。
- 库存：下单前校验、成功后 best-effort 扣减；并发场景存在超卖风险，新增支付/库存逻辑需引入事务。

---

## 4. 常用命令

```bash
pnpm install
pnpm dev              # 开发，http://localhost:3000  /admin
pnpm build            # 生产构建
pnpm start            # 生产启动
pnpm lint             # eslint
pnpm payload generate:types      # 更新 payload-types.ts
pnpm payload generate:importmap  # 更新 importMap
pnpm test:int          # vitest (tests/int/**/*.int.spec.ts)
pnpm test:e2e          # playwright (tests/e2e)
```

环境变量：`DATABASE_URL`（postgres）、`PAYLOAD_SECRET` 必需；`.env.example` 仍为 mongo 示例，需手动改为 postgres。

---

## 5. Agent 执行清单

### 5.1 修改集合/全局后
1. `pnpm payload generate:types` 更新 `payload-types.ts`
2. 如涉及 Admin UI，同步更新 `payload-types.ts` 引用与 `docs/code.md §4`
3. 检查 `Orders` 等含 `access` 的集合是否需补充 `overrideAccess:false` 用例

### 5.2 修改前端路由/组件后
1. 确认 `layout.tsx` 的 `Header/Footer/AgeGate/CartProvider` 是否受影响
2. 检查空状态、移动端吸底（`MobileBottomBar`）、面包屑与 `generateMetadata`
3. 涉及金额时复用 `lib/shipping.ts`，勿重复计算运费

### 5.3 新增依赖
- 优先 `pnpm add`，更新 `package.json` 后同步 `pnpm-lock.yaml`
- 如为 Payload 插件，需在 `payload.config.ts:50` `plugins: []` 注册并补充文档

### 5.4 文档
- 产品变更 → 更新 `docs/prd.md`
- 技术变更 → 更新 `docs/code.md`（含 `文件:行号` 锚点）
- 勿直接编辑 `z-vape.md`（已归档）

---

## 6. 已知约束与 TODO

- `Categories` 集合未落地，分类由 `Brand` 承载（见 `docs/code.md §4.8`）。
- `docker-compose.yml` postgres 服务被注释，需手动启用。
- 支付留空，后续接入第三方时需补充幂等、回调与状态机（`docs/prd.md §7.4`）。
- 冗余前端组件（`BrandShowcase/CategoryCards/HeroBanner` 等）待清理。
- 库存扣减无事务，搜索按钮为占位。

---

## 7. 工具链

- 对库/框架用法有疑问时，使用 Context7 MCP：`resolve-library-id` → `query-docs`（参考 `~/.config/opencode/AGENTS.md`）。
- Payload 官方技能：`.claude/skills/payload/SKILL.md`（含 FIELDS/COLLECTIONS/HOOKS/ACCESS 等参考）。

---

## 8. 禁止事项

- 手改 `payload-types.ts` / `importMap.js`
- 在 Local API 中不带 `req` 调用 `payload.create/update`（破坏事务原子性）
- 在 hook 内无 `context` 守卫地写回同集合（无限循环）
- 未校验 `status=active` 与 `stock` 即展示/下单商品

---

*维护者：Z-VAPE — 更新时同步 `docs/prd.md` / `docs/code.md`*
