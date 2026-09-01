> **Deprecated** — 本文档为早期实现规划稿，已归档。正式文档见 `docs/prd.md`（产品）与 `docs/code.md`（技术），`AGENTS.md` 为协作规范。

# [Deprecated] Z-VAPE — E-Commerce Implementation Plan

Premium vape e-commerce site for the Australian market.  
Domain: z-vape.com

---

## Phase 1: Data Layer (Completed)

### Collections (7)

| Collection | Slug | Admin Group | Purpose |
|---|---|---|---|
| **Users** | `users` | Commerce | Customer accounts with auth, roles, shipping addresses |
| **Media** | `media` | — | Image/file uploads (existing) |
| **Brands** | `brands` | Catalog | IGET, Alibarbar, Snowplus Cash |
| **Products** | `products` | Catalog | Individual SKUs with brand, flavour, puff count |
| **Categories** | `categories` | Catalog | Disposable Vapes, Pod Systems, E-Liquids, Accessories |
| **Orders** | `orders` | Commerce | Order records with items, shipping, status tracking |
| **Pages** | `pages` | Content | Static pages (About, Terms, Privacy, etc.) |

### Globals (2)

| Global | Slug | Admin Group | Purpose |
|---|---|---|---|
| **Header** | `header` | Site Settings | Brand name, navigation menu items |
| **Footer** | `footer` | Site Settings | Brand description, customer service, social links, footer links |

### Database

- **Adapter**: PostgreSQL (`@payloadcms/db-postgres`)
- **ID Type**: UUID (`idType: 'uuid'`) — all collections use UUID primary keys
- **Rich Text**: Lexical editor

---

## Data Model Details

### Brands

```
name          (text, required)
slug          (auto from name)
description   (textarea)
logo          (upload → media)
bannerImage   (upload → media)
sortOrder     (number, default 0)
```

### Products

```
name              (text, required)
slug              (auto from name)
brand             (relationship → brands, required)
category          (relationship → categories)
description       (richText)
images            (array of uploads → media, min 1)
price             (number, required, AUD)
compareAtPrice    (number, optional — for discounts)
flavour           (text)
puffCount         (number — e.g. 5000, 8000)
nicotineStrength  (text — e.g. "5%", "20mg")
sku               (text, unique)
stock             (number, default 0)
featured          (checkbox)
newArrival        (checkbox)
status            (select: draft/active/archived)
timestamps        (auto)
```

### Categories

```
name          (text, required)
slug          (auto from name)
description   (textarea)
image         (upload → media)
sortOrder     (number, default 0)
```

### Users (extended)

```
email             (auto from auth)
password          (auto from auth)
name              (text, required)
phone             (text)
roles             (select: admin/editor/customer, default customer, saveToJWT)
shippingAddress   (group)
  ├── line1       (text)
  ├── line2       (text)
  ├── city        (text)
  ├── state       (select: NSW/VIC/QLD/SA/WA/TAS/NT/ACT)
  └── postcode    (text)
```

### Orders

```
orderNumber       (text, unique, required)
customer          (relationship → users)
items             (array, min 1)
  ├── product     (relationship → products)
  ├── quantity    (number, min 1)
  └── unitPrice   (number)
subtotal          (number)
shipping          (number, default 0)
total             (number, required)
status            (select: pending/paid/shipped/delivered/cancelled/refunded)
shippingAddress   (group)
  ├── name        (text, required)
  ├── phone       (text)
  ├── line1       (text, required)
  ├── line2       (text)
  ├── city        (text, required)
  ├── state       (select: NSW/VIC/QLD/SA/WA/TAS/NT/ACT)
  └── postcode    (text, required)
notes             (textarea)
timestamps        (auto)
```

---

## Files Created/Modified

```
src/
├── collections/
│   ├── Brands.ts          ← NEW
│   ├── Products.ts        ← NEW
│   ├── Categories.ts      ← NEW
│   ├── Orders.ts          ← NEW
│   ├── Pages.ts           ← NEW
│   ├── Users.ts           ← MODIFIED (extended fields)
│   └── Media.ts           ← unchanged
├── globals/
│   ├── Header.ts          ← NEW
│   └── Footer.ts          ← NEW
├── payload.config.ts      ← MODIFIED (registered all + UUID)
└── payload-types.ts       ← REGENERATED
```

---

## Phase 2: Tailwind + Design System (Next)

- Install Tailwind CSS 4
- Set up design tokens (dark theme, gold accents)
- Fonts: Playfair Display (headings) + Inter (body)
- Replace `styles.css` with `globals.css`

## Phase 3: Frontend Layout Shell

- `Header.tsx` — nav bar with brand logo, menu, search icon
- `Footer.tsx` — brand info, links, social, contact
- `layout.tsx` — fonts, Header, Footer wrapper

## Phase 4: Homepage Sections

- `HeroBanner.tsx` — full-width hero with CTA
- `BrandShowcase.tsx` — 3 brand cards (IGET, Alibarbar, Snowplus Cash)
- `CategoryCards.tsx` — category grid
- `FeaturedProducts.tsx` — product grid from `featured: true`
- `ValueProps.tsx` — trust badges (Fast AU Shipping, 100% Authentic, Age Verified)
- `BrandStory.tsx` — full-width CTA banner

## Phase 5: Product Pages

- `/products` — all products listing with brand/category filters
- `/products/[slug]` — product detail with image gallery, add to cart
- `/categories/[slug]` — category product listing

## Phase 6: Cart + Age Gate

- Age verification modal (18+ check, localStorage persistence)
- Client-side cart (React Context + localStorage)
- Cart drawer slide-out component
- No payment integration yet

## Phase 7: Seed Data

- 3 brands with logos
- 4 categories
- Sample products across brands/categories

---

## Admin Panel URLs

| Resource | URL |
|---|---|
| Brands | `/admin/collections/brands` |
| Products | `/admin/collections/products` |
| Categories | `/admin/collections/categories` |
| Orders | `/admin/collections/orders` |
| Pages | `/admin/collections/pages` |
| Users | `/admin/collections/users` |
| Header | `/admin/globals/header` |
| Footer | `/admin/globals/footer` |
