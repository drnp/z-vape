# Z-VAPE 产品需求文档（PRD）

> 域名：`z-vape.com`｜市场：澳大利亚｜品类：电子烟及相关配件｜形态：Payload CMS + Next.js 电商独立站  
> 本文为产品层面文档，技术实现见 `docs/code.md`；历史规划稿 `z-vape.md` 已标记为 Deprecated，仅作归档参考。

---

## 1. 项目定位

### 1.1 愿景
打造面向澳洲成年用户的**高端电子烟品牌集合站**，以 Alibarbar / Snowplus Cash 为核心品牌，提供正品保障、快速履约与合规的年龄校验体验。

> **IGET 已停用**（2026-09-25）：首页与全站导航中的 IGET 内容已通过注释方式停用，静态资源与 `brands/products` 数据均保留，可随时恢复。

### 1.2 价值主张
- **正品保障**：仅上架 `status=active` 商品，支持 `compareAtPrice` 划线价与 `newArrival/featured` 运营位。
- **口味与规格透明**：`flavour / puffCount / nicotineStrength / sku` 四要素面向消费者清晰展示。
- **履约可预期**：`FLAT_SHIPPING=AUD 10`，满 `AUD 100` 包邮，购物车与结算页实时计算。
- **合规可信**：全站 Age Gate + 结算二次确认，订单落库 `ageVerified=true`。

### 1.3 非目标（当前阶段不做）
- 在线支付（支付留空，后续接入第三方，见 §7.4）
- 物流单号/履约跟踪、优惠券/会员体系、评价系统

---

## 2. 目标用户

| 人群 | 特征 | 核心诉求 |
|------|------|----------|
| 成年复购用户 | 已有品牌偏好，关注口味与库存 | 快速找到对应品牌/口味、库存可信 |
| 口味探索者 | 关注新品与价格 | 新品角标、划线价、品牌故事 |
| 运营/客服 | 使用 Payload Admin 管理商品与订单 | 高效上架、订单状态流转、客服信息可配置 |

> 全站强制 18+ 校验，未成年人不得访问与下单。

---

## 3. 品牌与商品策略

### 3.1 品牌
- 当前主品牌：**Alibarbar / Snowplus**（`src/app/(frontend)/main/page.tsx:12` `BRAND_SLUGS`）
- **IGET 已停用**：`BRAND_SLUGS` 中 `'iget'`、`BrandBlocks` 品牌卡、`HotBlocks` logo fallback、`Header/Footer` 导航均已注释保留（恢复时取消注释即可）；`products/page.tsx` 品牌筛选 tab 与 `/brands/iget` 动态路由保留。
- 品牌实体 `brands` 含 `logo / bannerImage / sortOrder`，首页 `HotBlocks` 按品牌分组展示精选商品。

### 3.2 商品
- 商品实体 `products` 字段见 `code.md §4`，运营关键字段：
  - `status: draft | active | archived` 仅 `active` 对外可见（`products/page.tsx:43`、`products/[slug]/page.tsx:45`）
  - `featured` 驱动首页精选（`main/page.tsx:39`），`newArrival` 驱动 `ProductCard` 角标
  - `stock` 用于下单前校验与下单后 best-effort 扣减（`actions/orders.ts:89-105`）
- 分类：`z-vape.md` 曾规划 `Categories` 集合，**实测未落地**（`payload.config.ts:35` 未注册）。当前分类能力由 `Brand` 承载，`/products?brand=slug` 与 `/brands/[slug]` 即为分类页。

---

## 4. 信息架构与站点地图

```
/
├── /products                商品总览，支持 ?brand=slug 过滤
├── /products/[slug]         商品详情（图集 + 信息 + 加购/直购）
├── /brands/[slug]           品牌馆（品牌头图/描述 + 该品牌商品网格）
├── /cart                    购物车（数量增减、删除、清空）
├── /checkout                结算页（地址 + 18+ 确认 + 订单摘要）
│     └── ?buy_now=id&qty=n  直购分支（绕过购物车）
├── /order/[id]              订单确认页（仅本人或 admin 可见）
├── /verification            验真页（静态）
├── /support                 支持页（静态）
├── /contact                 联系页（静态）
├── /login /register         登录/注册
└── /admin                   Payload Admin（Catalog / Commerce / Content / Site Settings）
```

全局常驻：`Header`（金色通栏 + 导航 + 搜索占位 + 登录态 + 购物车徽标）、`Footer`（品牌导航 + 客服邮箱/电话）、`AgeGate` 弹窗、`CartProvider`。

---

## 5. 核心用户旅程

### 5.1 浏览与发现
1. 进入 `/` 依次看到 `BannerSection`（全宽 Banner）→ `BrandBlocks`（品牌入口，Alibarbar / Snowplus）→ `HotBlocks`（各品牌至多 4 款精选）→ `IconBlanks`（信任背书）。
2. 点击品牌进入 `/brands/[slug]`，或点击商品进入 `/products/[slug]`。

### 5.2 加购与购物车
- 详情页 `AddToCart`（桌面）与 `MobileBottomBar`（移动端吸底）均写入 `CartContext`（`localStorage: z-vape-cart`）。
- `/cart` 支持 `Minus/Plus` 增减、`Trash2` 删除、`Clear Cart` 清空，`Order Summary` 展示 `totalItems / subtotal`。

### 5.3 结算与下单
- `/checkout` 要求登录，未登录则 `redirect('/login?redirect=/checkout...')`（`checkout/page.tsx:29`）。
- 直购：`/checkout?buy_now=productId` 会在服务端校验 `status=active && stock>0`，否则回跳 `/products`。
- 表单：`Full Name / Phone / Address Line 1/2 / City / State(AU) / Postcode`，`State` 仅限 `NSW/VIC/QLD/SA/WA/TAS/NT/ACT`。
- 必须勾选「我已年满 18 岁」方可提交；提交后调用 `createOrderAction`，成功则（非直购）清空购物车并跳 `/order/[id]`。

### 5.4 订单确认
- `/order/[id]` 校验 `isOwner || isAdmin`，否则 `notFound()`（`order/[id]/page.tsx:66-69`）。
- 展示 `orderNumber`、行项目、运费/总计、收货地址；支付文案为“团队将联系并安排付款”（离线支付占位）。

---

## 6. 功能清单（已实现 vs 规划）

| 模块 | 状态 | 说明 |
|------|------|------|
| 商品/品牌/订单/用户/Media/Pages/Header/Footer 数据层 | ✅ 已实现 | 见 `code.md §4` |
| 首页四段式（Banner/品牌/精选/背书） | ✅ 已实现 | `main/page.tsx` |
| 商品列表/详情/品牌馆 | ✅ 已实现 | `products/*` `brands/[slug]` |
| 购物车（localStorage） | ✅ 已实现 | `CartContext.tsx` |
| Age Gate 弹窗 | ✅ 已实现 | `AgeGate.tsx` |
| 登录/注册/登出 | ✅ 已实现 | `actions/auth.ts` + `lib/auth.ts` |
| 结算与订单创建（含库存校验、运费计算） | ✅ 已实现 | `actions/orders.ts` |
| 订单确认页权限控制 | ✅ 已实现 | `order/[id]/page.tsx` |
| 在线支付 | ⬜ 留空 | 后续接入第三方（Stripe/Afterpay 等），见 §7.4 |
| Categories 集合 | ⬜ 未落地 | 由 Brand 替代，需 PRD 决策是否恢复 |
| 优惠券/会员/评价/物流跟踪 | ⬜ 未规划 | 下一阶段路线图 |

---

## 7. 关键业务规则

### 7.1 年龄合规
- **双重校验**：全站 `AgeGate`（`localStorage: z-vape-age-verified`）仅为前端拦截；**结算页强制勾选**并落库 `orders.ageVerified=true`（`orders.ts:144-151`、`CheckoutForm.tsx:198-209`）。
- 文案：弹窗与结算页均提示“含尼古丁，成瘾性物质”。

### 7.2 价格与库存
- 货币：AUD，前端统一 `toFixed(2)`。
- 划线价：`compareAtPrice` 存在时展示删除线（`ProductCard.tsx:63`）。
- 库存：下单前 `stock < quantity` 阻断；下单后 best-effort 扣减（`actions/orders.ts:145-155`），**无事务/无并发锁**（技术债，见 `code.md §10`）。

### 7.3 运费
- `lib/shipping.ts:1`：`FLAT_SHIPPING=10`，`FREE_SHIPPING_THRESHOLD=100`，`subtotal<=0` 运费为 0。
- 购物车摘要仅展示小计；结算与订单页展示 `subtotal + shipping = total`，`shipping===0` 显示 `FREE`。

### 7.4 支付（留空）
- 当前 `CheckoutForm.tsx:212` 文案为“Payment is confirmed offline. Your order will be created and our team will contact you to arrange payment.”
- 订单 `status` 初始 `pending`，后续由 Admin 手动流转 `pending → paid → shipped → delivered`（或 `cancelled/refunded`）。
- 后续接入第三方时，需新增：支付意图创建、回调/ webhook、幂等订单号、库存事务化。

### 7.5 地址
- `Users.shippingAddress` 与 `Orders.shippingAddress` 均为 AU 结构，`Orders.shippingAddress` 要求 `name/line1/city/postcode` 必填（`orders.ts:101-138`）。

---

## 8. 运营后台

- **分组**：`Catalog`（Brands/Products）、`Commerce`（Users/Orders）、`Content`（Pages）、`Site Settings`（Header/Footer Globals）。
- **访问**：`/admin`，`Users.roles` 含 `admin/editor/customer`，`Orders` 读权限为 `admin 全量 / customer 仅本人`（`orders.ts:14-21`）。
- **内容**：`Pages` 用于 About/Terms/Privacy 等静态页（`content: richText` + `featuredImage`），`Header/Footer` Globals 驱动全站导航与页脚。

---

## 9. 设计与体验

- **视觉**：深蓝底 `#000019` + 金色 `#daa34a` 体系（`globals.css:3-26`），`Playfair Display` 标题 + `Inter` 正文，`section-padding` 响应式容器（`globals.css:82-103`）。
- **导航**：`Header.tsx:11` 固定导航 `Home / Alibarbar / SnowPlus / Verification / Support / Contact`（`iGet` 项已注释停用），吸顶 + 金色促销条（可关闭）。
- **空状态**：购物车与结算空态均提供 `Continue Shopping → /products`。

---

## 10. 指标与埋点建议

- 转化漏斗：`首页→商品详情→加购→购物车→结算→下单成功`
- 关键指标：加购率、结算转化率、直购占比、品牌偏好分布、客单价、免运订单占比
- 合规指标：Age Gate 通过率、结算 18+ 勾选率

---

## 11. 路线图

| 阶段 | 内容 | 优先级 |
|------|------|--------|
| R1 | 支付接入（第三方）、订单幂等与库存事务化 | P0 |
| R2 | 物流单号与状态通知、Admin 订单流转优化 | P0 |
| R3 | 优惠券/满减/包邮策略可配置化 | P1 |
| R4 | 搜索与筛选（口味/口数/尼古丁浓度/价格区间） | P1 |
| R5 | 评价与问答、SEO（sitemap/结构化数据） | P2 |
| R6 | 评估是否恢复 `Categories` 集合或以标签体系替代 | P2 |

---

## 12. 附录

- **术语**：SKU（库存单位）、puffCount（口数）、nicotineStrength（尼古丁浓度）、compareAtPrice（划线价）
- **依赖文档**：`docs/code.md`、`z-vape.md`（Deprecated）、`payload-types.ts`
- **合规提示**：本 PRD 不构成法律建议，澳洲电子烟销售需遵守当地法规，支付与物流接入前需完成法务与合规评审。
