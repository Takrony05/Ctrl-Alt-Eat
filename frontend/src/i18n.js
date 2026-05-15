import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "login_title": "Welcome Back",
      "email_placeholder": "Email Address",
      "password_placeholder": "Password",
      "login_button": "Log In",
      "signup_text": "Don't have an account? Sign Up",
      "no_account_text": "Need an account?",
      "create_account": "Create Account",
      "menu_title": "Our Menu",
      "cart_title": "Your Cart",
      "checkout_title": "Checkout",
      "pay_with": "Pay With",
      "order_history": "Order History",
      "dashboard_title": "Chef Dashboard",
      "logout": "Logout",
      "total": "Total",
      "place_order": "Place Order",
      "order_ready": "Your order is ready to be picked up!",
      "status_pending": "Pending",
      "status_ready": "Ready",
      "add_to_cart": "Add to Cart",
      "main_meal": "Main Meal",
      "dessert": "Dessert",
      "drink": "Drink",
      "light_mode": "Light Mode",
      "dark_mode": "Dark Mode",
      "arabic": "عربي",
      "english": "English",
      "empty_cart": "Your cart is empty.",
      "go_back": "Go Back",
      "preparing_order": "Your order is being prepared...",
      "welcome_user": "Welcome, {{name}}!",
      "role_chef": "Chef",
      "role_customer": "Customer",
      "mark_ready": "Mark Ready",
      "no_orders": "No active orders.",
      "order_id": "Order #",
      "items": "Items:",
      "addons": "Add-ons:"
    }
  },
  ar: {
    translation: {
      "login_title": "مرحباً بك",
      "email_placeholder": "البريد الإلكتروني",
      "password_placeholder": "كلمة المرور",
      "login_button": "تسجيل الدخول",
      "signup_text": "ليس لديك حساب؟ سجل الآن",
      "no_account_text": "تحتاج إلى حساب؟",
      "create_account": "إنشاء حساب",
      "menu_title": "القائمة",
      "cart_title": "سلة المشتريات",
      "checkout_title": "الدفع",
      "pay_with": "ادفع بواسطة",
      "order_history": "سجل الطلبات",
      "dashboard_title": "لوحة الشيف",
      "logout": "تسجيل خروج",
      "total": "الإجمالي",
      "place_order": "تأكيد الطلب",
      "order_ready": "طلبك جاهز للاستلام!",
      "status_pending": "قيد التحضير",
      "status_ready": "جاهز",
      "add_to_cart": "أضف للسلة",
      "main_meal": "وجبة رئيسية",
      "dessert": "حلوى",
      "drink": "مشروب",
      "light_mode": "وضع النهار",
      "dark_mode": "وضع الليل",
      "arabic": "عربي",
      "english": "English",
      "empty_cart": "سلتك فارغة.",
      "go_back": "رجوع",
      "preparing_order": "جاري تحضير طلبك...",
      "welcome_user": "مرحباً، {{name}}!",
      "role_chef": "شيف",
      "role_customer": "عميل",
      "mark_ready": "تعيين كـ جاهز",
      "no_orders": "لا توجد طلبات نشطة.",
      "order_id": "طلب #",
      "items": "العناصر:",
      "addons": "إضافات:"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
