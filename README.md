# gestionStock

## Recent Fixes - Database & Currency Compatibility ✅

All database-frontend compatibility issues have been resolved:
- ✅ Currency now displays in **DH (Moroccan Dirham)** instead of €
- ✅ Database uses **DECIMAL(10,2)** for accurate price calculations
- ✅ All dashboards show **"Valeur Stock"** card with proper formatting
- ✅ French number formatting: `48 086,19 DH`
- ✅ Backend API includes stock value calculations

### Quick Migration
```bash
# Update existing database
mysql -u root -p stock_db < Backend/fix_price_precision.sql
```

### Documentation
- 📖 [Quick Fix Guide](QUICK_FIX_GUIDE.md) - Fast reference
- 📊 [Compatibility Report](COMPATIBILITY_ERRORS_REPORT.md) - Detailed analysis
- 🔧 [Implementation Details](CURRENCY_FIX_DOCUMENTATION.md) - Technical specs

---

## Stock Management System

A comprehensive inventory management system with role-based access control.

### Features
- Multi-user support (Admin, Manager, Employee)
- Product management with categories and suppliers
- Stock tracking and movements
- Order management
- Real-time analytics and dashboards
- Currency: Moroccan Dirham (DH)
