// src/paths.js
import {
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  Factory as ManufacturingIcon,
  AccountBalance as FinancialIcon,
  People as CustomersIcon,
  Login as LoginIcon,
  Home as HomeIcon,
  Category as ProductsIcon,
  Person as UsersIcon,
  PersonAdd as UserAddIcon,
  Info as UserInfoIcon,
} from '@mui/icons-material';

export const paths = {
  home: {
    path: '/',
    title: 'الرئيسية',
    icon: HomeIcon,
    favicon: '/favicons/home.ico',
  },
  login: {
    path: '/login',
    title: 'تسجيل الدخول',
    icon: LoginIcon,
    favicon: '/favicons/login.ico',
  },
  dashboard: {
    path: '/dashboard',
    title: 'لوحة التحكم',
    icon: DashboardIcon,
    favicon: '/favicons/dashboard.ico',
  },
  products: {
    path: '/products',
    title: 'المنتجات',
    icon: ProductsIcon,
    favicon: '/favicons/products.ico',
  },
  itemCodes: {
    list: {},
  },
  orders: {
    list: {
      path: '/orders',
      title: 'الطلبات',
      icon: OrdersIcon,
      favicon: '/favicons/orders.ico',
    },
    create: {
      path: '/orders/create',
      title: 'إنشاء طلب',
      icon: OrdersIcon,
      favicon: '/favicons/order-create.ico',
    },
    details: {
      path: '/orders/[id]',
      title: 'تفاصيل الطلب',
      icon: OrdersIcon,
      favicon: '/favicons/order-details.ico',
    },
  },
  inventory: {
    path: '/inventory',
    title: 'المخزن',
    icon: InventoryIcon,
    favicon: '/favicons/inventory.ico',
  },
  manufacturing: {
    path: '/manufacturing',
    title: 'التصنيع',
    icon: ManufacturingIcon,
    favicon: '/favicons/manufacturing.ico',
  },
  financial: {
    path: '/financial',
    title: 'المالية',
    icon: FinancialIcon,
    favicon: '/favicons/financial.ico',
  },
  customers: {
    path: '/customers',
    title: 'العملاء',
    icon: CustomersIcon,
    favicon: '/favicons/customers.ico',
  },
  users: {
    list: {
      path: '/users',
      title: 'قائمة المستخدمين',
      icon: UsersIcon,
      favicon: '/favicons/users.ico',
    },
    create: {
      path: '/users/create',
      title: 'إضافة مستخدم',
      icon: UserAddIcon,
      favicon: '/favicons/user-add.ico',
    },
    details: {
      path: '/users/[id]',
      title: 'تفاصيل المستخدم',
      icon: UserInfoIcon,
      favicon: '/favicons/user-info.ico',
    },
  },
};
