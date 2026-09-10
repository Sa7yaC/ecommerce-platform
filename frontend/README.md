# Aura — Premium E-Commerce Frontend

A modern, production-quality frontend interface designed for the multi-tenant Django REST Framework e-commerce platform.

The visual direction draws inspiration from the [Vault eCommerce App UI/UX Case Study](https://www.behance.net/gallery/242019575/Vault-eCommerce-App-UIUX-Case-Study): spacious, minimal, editorial, image-led, warm off-white background (`#F7F7F5`), crisp white surfaces, refined black typography (`#111111`), subtle borders (`#E7E7E3`), and black pill-shaped primary buttons.

Strict adherence to backend capabilities: All implemented functionality is backed by real Django REST Framework endpoints. No unsupported features (no wishlist, no fake reviews, no fake payment gateways, no fake analytics charts).

---

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 + Google Font [Manrope](https://fonts.google.com/specimen/Manrope)
- **Routing**: React Router 7
- **Data Fetching & Cache**: TanStack Query (React Query)
- **HTTP Client**: Axios with JWT Bearer auto-attachment, automatic token refresh queue, and `X-Tenant-Id` header handling
- **Icons**: Lucide React

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Running Django backend (`http://127.0.0.1:8000`)

### 2. Backend Setup
From the repository root, start the Django development server:
```bash
# Windows
.\venv\Scripts\python.exe manage.py runserver 127.0.0.1:8000

# Linux/macOS
source venv/bin/activate
python manage.py runserver 127.0.0.1:8000
```

### 3. Frontend Setup
Navigate to the `frontend` directory:
```bash
cd frontend

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```
The frontend will start at `http://localhost:5173`.

---

## Environment Variables

Configure API base URL by creating a `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```
If not specified, defaults to `http://127.0.0.1:8000/api`.

---

## Available Application Routes

### Customer Storefront
| Route | Access | Description |
| :--- | :--- | :--- |
| `/` | Public | Editorial home with hero, category collections, and new arrivals |
| `/products` | Authenticated | Search, category filtering, and product grid |
| `/products/:id` | Authenticated | Product details, stock availability, and Add to Cart |
| `/cart` | Public/Local | Persistent local cart with item quantities and subtotal |
| `/checkout` | Authenticated | Shipping address, order notes, and order creation |
| `/orders/success` | Authenticated | Confirmation with returned `#ORD-XXXXXXXX` reference |
| `/orders` | Authenticated | Customer's order history (`/orders/my_orders/`) |
| `/orders/:id` | Authenticated | Customer order breakdown and restrained timeline |

### Authentication
| Route | Access | Description |
| :--- | :--- | :--- |
| `/login` | Public | Sign in with username & password, returns JWT and role |
| `/register` | Public | Customer/staff/owner account registration with tenant assignment |

### Staff & Store Owner Operations Dashboard
| Route | Access | Description |
| :--- | :--- | :--- |
| `/dashboard` | Staff / Store Owner | Operational metrics, stock summary, and recent orders |
| `/dashboard/products` | Staff / Store Owner | Catalog table with search, category filtering, stock indicators |
| `/dashboard/products/new` | Staff / Store Owner | Create product form matching DRF serializer schema |
| `/dashboard/products/:id/edit` | Staff / Store Owner | Edit product fields and delete product with confirmation |
| `/dashboard/orders` | Staff / Store Owner | Order fulfillment table with backend status tabs |
| `/dashboard/orders/:id` | Staff / Store Owner | Manage order, update status (`pending` -> `delivered`), and assign staff (Owner only) |

---

## Roles and Permissions

The frontend enforces strict role-based routing:
- **`customer`**: Can browse products, manage local cart, place orders, view their own order history and order details. Cannot access any `/dashboard/*` route.
- **`staff`**: Can access the dashboard, view orders, update order status for their assigned orders or pending orders, view and create/update products. Cannot access store owner-only staff assignment.
- **`store_owner`**: Full operational privileges, product management, viewing all tenant orders, updating order status, and assigning staff members to orders.

---

## Multi-Tenancy Behavior

- Every request automatically attaches the authenticated user's `X-Tenant-Id` header and JWT Bearer token.
- The UI dynamically displays the active tenant's `store_name` (e.g. "Test Store", "Demo Store") in the navigation, hero, and dashboard headers, with an elegant fallback to "Aura".
- Isolated tenant catalog and orders ensure users never see another vendor's data.

---

## Production Build

To test or generate the production build:
```bash
npm run build
npm run preview
```
All TypeScript types and bundle assets are validated with zero errors.
