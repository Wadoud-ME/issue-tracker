# 🚀 Issue Tracker

A modern, full-stack Issue Tracker application designed for speed, simplicity, and a great user experience. Built with Next.js 16, Tailwind CSS, and TypeScript, this project focuses on delivering a highly responsive interface through Optimistic UI patterns and robust state management.

## ✨ Key Features

- ⚡️ **Optimistic UI**: Instant feedback on creating, updating, and deleting issues without waiting for server roundtrips.
- 🎨 **Dark Mode**: Fully responsive design with a seamless toggle between Light (Purple) and Dark (Blue) themes using `next-themes`.
- 🔍 **Advanced Filtering**: Real-time client-side search by Title/ID and filtering by Status.
- 📂 **Space Management**: Organize issues into distinct "Spaces" (projects) with dynamic routing.
- 🔔 **Interactive Feedback**: Integrated toast notifications (`sonner`) for success and error states.
- 🛠 **Full Stack**: Utilizes Next.js Server Actions for secure and efficient backend logic.
- 🗄️ **Database**: Powered by Prisma ORM (currently configured for SQLite, easily adaptable to PostgreSQL).

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide React (Icons)
- **State Management**: Zustand
- **Database ORM**: Prisma
- **Theming**: next-themes
- **Notifications**: Sonner

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Wadoud-ME/issue-tracker.git
cd issue-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Environment Variables**

Create a `.env` file in the root directory and add your database connection string. For local development with SQLite:
```env
DATABASE_URL="file:./dev.db"
```

4. **Initialize the Database**

Run the Prisma migration to create your database tables:
```bash
npx prisma migrate dev --name init
```

5. **Run the development server**
```bash
npm run dev
```

6. **Open the app**

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure
```
├── app/
│   ├── actions.ts              # Server Actions (Backend Logic)
│   ├── layout.tsx              # Root Layout & Providers
│   ├── page.tsx                # Landing Page
│   └── spaces/
│       ├── [id]/
│       │   └── page.tsx        # Dynamic Issue Board Page
│       └── page.tsx            # Spaces List Page
├── components/
│   ├── issue/
│   │   ├── CreateIssueModal.tsx
│   │   └── IssueRow.tsx
│   ├── sidebar/
│   │   ├── AddClassificationModal.tsx
│   │   ├── FloatingToggle.tsx
│   │   ├── Navbar.tsx
│   │   └── SidebarList.tsx
│   └── ThemeProvider.tsx
├── lib/
│   ├── db.ts                   # Prisma Client Singleton
│   ├── api.ts                  # API Helper Functions
│   └── utils.ts                # Utility Functions (cn helper)
├── prisma/
│   ├── schema.prisma           # Database Schema
│   └── migrations/             # Database Migration History
├── stores/
│   └── useStore.ts             # Global State Management (Zustand)
├── types/
│   └── index.ts                # TypeScript Type Definitions
└── README.md
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Wadoud-ME/issue-tracker/issues).

## 📄 License

This project is licensed under the MIT License.