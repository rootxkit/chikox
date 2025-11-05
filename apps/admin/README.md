# Chikox Admin Dashboard

A modern admin dashboard built with Next.js 14, Ant Design, and TypeScript.

## Features

### Authentication
- 🔐 JWT-based authentication
- 🍪 HttpOnly cookies for refresh tokens
- 🛡️ Role-based access control (ADMIN, SUPER_ADMIN only)
- 🔄 Auto-redirect for unauthorized users

### Dashboard
- 📊 Real-time statistics cards
- 👥 User count metrics
- 📈 Growth rate indicators
- 🎯 Quick action shortcuts

### User Management
- 📋 Sortable and filterable user table
- 🔍 Search functionality
- 👤 User details with avatars
- 🏷️ Role-based tags
- ⚡ Quick actions (Edit, Delete)
- 📅 Date formatting with tooltips

### Settings
- ⚙️ General settings configuration
- 🔔 Notification preferences
- 🔒 Security settings

### UI/UX
- 🎨 Ant Design component library
- 📱 Fully responsive design
- 🌙 Modern gradient backgrounds
- 📐 Clean sidebar navigation
- 🔄 Collapsible sidebar
- 👤 User dropdown menu
- ⚡ Fast and smooth transitions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI Library**: Ant Design 5.x
- **State Management**: SWR for data fetching
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **TypeScript**: Full type safety
- **Icons**: Ant Design Icons

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- Running API server (apps/server)
- Admin user account with ADMIN or SUPER_ADMIN role

### Installation

```bash
# From monorepo root
npm install

# Or from admin directory
cd apps/admin
npm install
```

### Configuration

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Development

```bash
# From monorepo root
npm run dev:admin

# Or from admin directory
npm run dev
```

The admin dashboard will be available at: http://localhost:3002

### Build

```bash
npm run build
npm run start
```

## Usage

### Login

1. Navigate to http://localhost:3002
2. You'll be redirected to the login page
3. Enter admin credentials:
   - Email: admin@example.com
   - Password: your-admin-password
4. After successful login, you'll be redirected to the dashboard

### Dashboard

The main dashboard displays:
- Total users count
- Active users count
- Admin users count
- Growth rate percentage
- Recent activity
- Quick actions

### User Management

Navigate to **Dashboard > Users** to:
- View all users in a table
- Search for specific users
- Filter by role (USER, ADMIN, SUPER_ADMIN)
- Sort by creation date
- Edit user details (coming soon)
- Delete users (coming soon)

### Settings

Navigate to **Dashboard > Settings** to:
- Update site name and description
- Toggle email notifications
- Toggle push notifications
- Change password (coming soon)

## Authentication Flow

1. User enters credentials on login page
2. Credentials sent to `/api/auth/login`
3. Server validates and returns:
   - Access token (stored in localStorage)
   - User object (stored in localStorage)
   - Refresh token (HttpOnly cookie)
4. Access token added to all API requests via Axios interceptor
5. On 401 response, user is logged out and redirected to login

## API Integration

The admin uses the following API endpoints:

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/users/me` - Get current user

### Users
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)

## Security

- ✅ Admin-only access enforced on all dashboard routes
- ✅ JWT token verification on every API call
- ✅ HttpOnly cookies prevent XSS attacks
- ✅ Automatic logout on token expiration
- ✅ Role checking before rendering admin features

## Project Structure

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Main dashboard
│   │   │   ├── users/
│   │   │   │   └── page.tsx       # User management
│   │   │   └── settings/
│   │   │       └── page.tsx       # Settings
│   │   ├── login/
│   │   │   └── page.tsx           # Login page
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Redirect to login
│   ├── components/
│   │   └── DashboardLayout.tsx    # Dashboard layout with sidebar
│   ├── hooks/
│   │   ├── useAuth.ts             # Authentication hook
│   │   └── useUsers.ts            # Users data hook
│   ├── lib/
│   │   └── api.ts                 # API client and endpoints
│   └── __tests__/
│       └── login.test.tsx         # Tests
├── package.json
├── tsconfig.json
├── next.config.js
└── vitest.config.ts
```

## Components

### DashboardLayout
Provides the main layout structure with:
- Collapsible sidebar navigation
- Top header with user menu
- Content area for pages
- Responsive design

### Login Page
Features:
- Email/password form with validation
- Ant Design form components
- Error handling
- Gradient background
- Auto-redirect if already authenticated

### Dashboard Page
Displays:
- Statistics cards (Total Users, Active Users, Admins, Growth)
- Recent activity section
- Quick actions card

### Users Page
Includes:
- Searchable data table
- Role-based filtering
- Sortable columns
- User avatars
- Action buttons

## Customization

### Theme

Modify the theme in `src/app/layout.tsx`:

```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',  // Primary color
      borderRadius: 6            // Border radius
    }
  }}
>
```

### Sidebar Menu

Update menu items in `src/components/DashboardLayout.tsx`:

```typescript
const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard'
  },
  // Add more items...
];
```

## Testing

```bash
npm test
```

Tests are written with Vitest and cover:
- Authentication logic
- Form validation
- Role checking

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```bash
docker build -t chikox-admin .
docker run -p 3002:3002 chikox-admin
```

### Environment Variables

Set these in your deployment platform:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Troubleshooting

### "Unauthorized" on Login

- Ensure the API server is running
- Check that user has ADMIN or SUPER_ADMIN role
- Verify CORS settings allow requests from admin domain

### Users Not Loading

- Check API server is accessible
- Verify JWT token is valid
- Ensure user has admin permissions

### Styles Not Loading

- Clear `.next` cache: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Restart dev server

## Future Enhancements

- [ ] User creation and editing
- [ ] User deletion with confirmation
- [ ] Bulk user operations
- [ ] Export users to CSV
- [ ] Email notification system
- [ ] Activity logs and audit trail
- [ ] Role management
- [ ] Permission system
- [ ] Dark mode support
- [ ] Charts and analytics
- [ ] Real-time updates with WebSocket

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## License

MIT
