# Frontend Project

## 📌 Overview
This is the frontend of the application, built with **Angular** and **Angular Material** to provide a modern and responsive user interface. The project follows best practices, including modular architecture and state management.

## 🚀 Technologies Used
- **Angular**: Framework for building web applications
- **Angular Material**: UI components
- **TypeScript**: Superset of JavaScript
- **RxJS**: Reactive programming
- **Tailwind CSS**: Utility-first CSS framework
- **JWT Authentication**: Secure API access

## 🔧 Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/frontend.git
   cd frontend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the development server:**
   ```sh
   npm start
   ```
   The application will be available at `http://localhost:4200/`.

## 📂 Project Structure
```
frontend/
│-- src/
│   ├── app/              # Main application module
│   │   ├── components/   # UI components
│   │   ├── services/     # API communication
│   │   ├── guards/       # Route protection
│   │   ├── interceptors/ # HTTP interceptors (e.g., JWT handling)
│   │   ├── pages/        # Feature modules/pages
│   │   └── app.module.ts # Application module
│   ├── assets/           # Static assets (images, styles, etc.)
│   ├── environments/     # Environment configurations
│   ├── main.ts           # Entry point
│   ├── styles.css        # Global styles
│-- angular.json          # Angular configuration
│-- package.json          # Dependencies and scripts
│-- tsconfig.json         # TypeScript configuration
```

## 🔑 Authentication
This project uses **JWT Authentication**. When the user logs in, a token is stored and sent in every request via an **HTTP Interceptor**:
```typescript
intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = this.authService.getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next.handle(req);
}
```

## ✅ Running Tests
Run unit tests with:
```sh
npm test
```
Run end-to-end tests with:
```sh
npm run e2e
```

## 📜 License
This project is licensed under the **MIT License**.

---
Feel free to contribute and improve this project! 🚀

