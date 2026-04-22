# 🎮 Kaycee Auth Server - Features

## ✨ NEW: Remote System Control

### **Fitur Baru:**
1. ✅ **Remote Lock/Unlock** - Control extension dari admin dashboard
2. ✅ **Custom Lock Message** - Set pesan yang ditampilkan saat system locked
3. ✅ **Real-time Status** - Monitor system status secara real-time
4. ✅ **Modern UI** - Dashboard admin yang simpel dan menarik

---

## 🔐 Remote System Control

### **Lock System:**
- Admin bisa lock semua extension secara remote
- User tidak bisa login saat system locked
- Custom message ditampilkan ke user

### **Unlock System:**
- Admin bisa unlock system kapan saja
- User langsung bisa login lagi

---

## 📡 API Endpoints

### **Public Endpoints:**

#### `GET /api/system_status`
Check if system is active or locked

**Response (Active):**
```json
{
  "success": true,
  "locked": false,
  "status": "active"
}
```

**Response (Locked):**
```json
{
  "success": false,
  "locked": true,
  "message": "System is under maintenance"
}
```

---

### **Admin Endpoints:**

#### `POST /api/admin/system`
Control system status (requires admin key)

**Lock System:**
```json
{
  "action": "lock",
  "message": "System maintenance until 10 PM"
}
```

**Unlock System:**
```json
{
  "action": "unlock"
}
```

**Get Status:**
```json
{
  "action": "get_status"
}
```

---

## 🎨 Admin Dashboard

### **URL:**
```
https://your-server.vercel.app/admin.html?key=YOUR_ADMIN_KEY
```

### **Features:**
- 📊 Real-time statistics
- 🔐 System lock/unlock control
- 💬 Custom lock message
- 👥 Recent users list
- 🎨 Modern, responsive UI

### **Stats Displayed:**
- Total users
- Active today
- Banned users
- New this week

---

## 🗄️ Database Schema

### **New Table: system_settings**
```sql
CREATE TABLE system_settings (
    id              SERIAL PRIMARY KEY,
    setting_key     TEXT UNIQUE NOT NULL,
    setting_value   TEXT,
    description     TEXT,
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by      TEXT
);
```

### **Default Settings:**
- `system_status`: 'active' or 'locked'
- `lock_message`: Message shown when locked

---

## 🚀 Deployment

### **Update Database:**
Run the updated `schema.sql` in Supabase SQL Editor to add the new table.

### **Environment Variables:**
No new env vars needed! Uses existing:
- `DATABASE_URL`
- `ADMIN_KEY`

---

## 🧪 Testing

### **Test System Status:**
```bash
curl https://your-server.vercel.app/api/system_status
```

### **Test Lock System:**
```bash
curl -X POST https://your-server.vercel.app/api/admin/system \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: YOUR_ADMIN_KEY" \
  -d '{"action":"lock","message":"Maintenance mode"}'
```

### **Test Unlock System:**
```bash
curl -X POST https://your-server.vercel.app/api/admin/system \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: YOUR_ADMIN_KEY" \
  -d '{"action":"unlock"}'
```

---

## 📱 Extension Integration

Extension akan otomatis cek system status saat login. Jika locked, user akan melihat lock message.

**No code changes needed in extension!** Login API sudah otomatis cek system status.

---

## 🎯 Use Cases

1. **Maintenance Mode** - Lock system saat update server
2. **Emergency Stop** - Lock system jika ada masalah
3. **Scheduled Downtime** - Lock dengan custom message
4. **Testing** - Lock untuk testing tanpa ganggu production users

---

**Enjoy the new remote control feature!** 🚀
