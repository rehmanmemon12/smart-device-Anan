# Smart Device Dashboard

A complete Smart Device Dashboard assessment solution featuring a web application (Angular 17) and a mobile application (Ionic/Angular) for monitoring and controlling smart home devices.

## 📁 Project Structure

```
assesm/
├── api/          # JSON Server mock API
├── web/          # Angular 17+ web application
├── mobile/       # Ionic with Angular mobile app
└── shared/       # Shared TypeScript interfaces
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### 1. Start the Mock API Server

```bash
cd api
npm install
npm start
```

The API will run on `http://localhost:3000`

### 2. Run the Web Application

```bash
cd web
npm install
ng serve
```

Open `http://localhost:4200` in your browser.

### 3. Run the Mobile Application

```bash
cd mobile
npm install
ionic serve
```

Open `http://localhost:8100` in your browser (or scan QR for mobile preview).

---

## 🐳 Running with Docker

You can run the entire project (API, Web, and Mobile) using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed

### Start all services
```bash
docker-compose up --build
```

### Services Access:
- **Web App**: `http://localhost:4200`
- **Mobile Preview**: `http://localhost:8100`
- **Mock API**: `http://localhost:3000`

---

## ✨ Features

### Web Application
| Feature | Description |
|---------|-------------|
| **Login** | Mock authentication with localStorage token |
| **Devices List** | Grid view with search, filter, status badges |
| **Device Detail** | ON/OFF toggle, brightness slider, live feedback |
| **Alerts Page** | Offline (>15 min) and low battery (<20%) devices |
| **States** | Loading spinners, error messages, empty states |

### Mobile Application
| Feature | Description |
|---------|-------------|
| **Login** | Native-style Ionic form |
| **Devices List** | Pull-to-refresh, search, status indicators |
| **Device Detail** | Ion-toggle, ion-range controls |
| **States** | Ion-skeleton, ion-refresher |

---

## 🔐 Login Credentials

Use **any email and password** to sign in. The mock authentication accepts all credentials.

Example:
- Email: `admin@anansky.com`
- Password: `admin123`

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Web Frontend | Angular 17 (standalone components, lazy loading) |
| Mobile Frontend | Ionic 7 + Angular + Capacitor |
| API | JSON Server (mock REST API) |
| Styling | SCSS with modern gradients and animations |
| State | RxJS Observables |
| Auth | Mock JWT with localStorage |

---

## 🎯 Assumptions & Trade-offs

### Assumptions
1. **Mock API** - JSON Server is sufficient for demonstrating API integration patterns
2. **No real auth** - Assessment specifies mock login is acceptable
3. **Device timestamps** - Using static timestamps in mock data; real app would use real-time updates
4. **Browser testing** - Mobile app tested in browser mode (Ionic serve)

### Trade-offs
| Decision | Rationale |
|----------|-----------|
| Separate projects | Better UX optimization per platform, cleaner separation of concerns |
| JSON Server | Fast setup, real REST endpoints, no backend code needed |
| Local storage auth | Simple, meets requirements without over-engineering |
| No unit tests | Time constraint - focused on delivering complete features |
| SCSS over Tailwind | More control for custom designs, no additional dependencies |

---

## 📱 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/devices` | List all devices |
| GET | `/devices/:id` | Get device details |
| PATCH | `/devices/:id` | Update device (ON/OFF, brightness) |

---

## 🎨 Design Philosophy

- **Modern aesthetic** - Gradient headers, card-based layouts, subtle shadows
- **Clear hierarchy** - Visual distinction between status indicators
- **Responsive** - Works on all screen sizes
- **Accessible** - Clear labels, sufficient contrast, touch-friendly

---

## 📋 Mock Data

The API includes **12 devices** with varied:
- Types: light, thermostat, sensor, camera, fan, doorbell, etc.
- Statuses: online/offline
- Battery levels: 8% to 100%
- Locations: Living Room, Bedroom, Kitchen, Garage, etc.

---

## 🔧 Build Commands

```bash
# Build web for production
cd web && ng build

# Build mobile for production
cd mobile && ionic build

# Build mobile for iOS/Android
cd mobile && ionic capacitor build ios
cd mobile && ionic capacitor build android
```

---

## 📝 License

Assessment project for Anan Sky - Product Engineer role.
