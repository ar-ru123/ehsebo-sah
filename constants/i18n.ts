/**
 * Internationalization (i18n) configuration
 * Supports Arabic and English
 */

export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // App name
    appName: 'احسبه صح',
    
    // Auth screen
    welcome: 'مرحباً',
    loginWithGoogle: 'تسجيل الدخول عبر Google',
    logout: 'تسجيل الخروج',
    loggedInAs: 'مسجل الدخول كـ',
    
    // Main screen
    mainTitle: 'إدارة الميزانية',
    totalBudget: 'القيمة الكلية',
    totalBudgetPlaceholder: 'أدخل القيمة الكلية بالدولار',
    
    // Expense categories
    medicalExpenses: 'مصروفات علاج',
    salaries: 'مرتبات',
    carRental: 'إيجار السيارة',
    otherExpenses: 'مصروفات أخرى',
    
    // Remaining
    remaining: 'المتبقي',
    
    // Currency
    usd: 'دولار',
    rub: 'روبل',
    
    // Actions
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    confirm: 'تأكيد',
    
    // Save dialog
    saveRecord: 'حفظ السجل',
    recordName: 'اسم السجل',
    recordNamePlaceholder: 'أدخل اسم السجل',
    recordNameRequired: 'اسم السجل مطلوب',
    
    // History screen
    history: 'السجلات',
    noRecords: 'لا توجد سجلات محفوظة',
    recordSaved: 'تم حفظ السجل بنجاح',
    recordDeleted: 'تم حذف السجل',
    deleteConfirm: 'هل أنت متأكد من حذف هذا السجل؟',
    
    // Progress
    spent: 'تم الإنفاق',
    of: 'من',
    
    // Errors
    error: 'خطأ',
    errorSaving: 'حدث خطأ أثناء الحفظ',
    errorLoading: 'حدث خطأ أثناء التحميل',
    errorDeleting: 'حدث خطأ أثناء الحذف',
    
    // Validation
    invalidAmount: 'المبلغ غير صحيح',
    totalExceeded: 'المصروفات تتجاوز القيمة الكلية',
  },
  
  en: {
    // App name
    appName: 'Ehsebo Sah',
    
    // Auth screen
    welcome: 'Welcome',
    loginWithGoogle: 'Login with Google',
    logout: 'Logout',
    loggedInAs: 'Logged in as',
    
    // Main screen
    mainTitle: 'Budget Management',
    totalBudget: 'Total Budget',
    totalBudgetPlaceholder: 'Enter total budget in USD',
    
    // Expense categories
    medicalExpenses: 'Medical Expenses',
    salaries: 'Salaries',
    carRental: 'Car Rental',
    otherExpenses: 'Other Expenses',
    
    // Remaining
    remaining: 'Remaining',
    
    // Currency
    usd: 'USD',
    rub: 'RUB',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    confirm: 'Confirm',
    
    // Save dialog
    saveRecord: 'Save Record',
    recordName: 'Record Name',
    recordNamePlaceholder: 'Enter record name',
    recordNameRequired: 'Record name is required',
    
    // History screen
    history: 'History',
    noRecords: 'No saved records',
    recordSaved: 'Record saved successfully',
    recordDeleted: 'Record deleted',
    deleteConfirm: 'Are you sure you want to delete this record?',
    
    // Progress
    spent: 'Spent',
    of: 'of',
    
    // Errors
    error: 'Error',
    errorSaving: 'Error saving record',
    errorLoading: 'Error loading records',
    errorDeleting: 'Error deleting record',
    
    // Validation
    invalidAmount: 'Invalid amount',
    totalExceeded: 'Expenses exceed total budget',
  },
};

export type TranslationKey = keyof typeof translations.ar;

/**
 * Get translation for a key
 */
export function t(key: TranslationKey, language: Language): string {
  return translations[language][key];
}
