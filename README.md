# SQLInsights 🚀

Transform your natural language queries into powerful SQL statements and stunning visualizations instantly.

## Features

- **Natural Language to SQL**: Convert plain English queries into optimized SQL statements
- **Multi-Database Support**: Connect to MySQL, PostgreSQL, SQL Server, Oracle, SQLite, and cloud databases
- **Real-time Visualizations**: Generate interactive charts, graphs, and data tables instantly
- **Secure Connections**: Enterprise-grade security with encrypted connections and no data storage
- **Responsive Design**: Beautiful, mobile-first interface that works on all devices
- **Privacy First**: No query results or sensitive data are permanently stored

## Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern React component library
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons

### Backend & Database Support
- **MySQL** - World's most popular open source database
- **PostgreSQL** - Advanced open source relational database
- **Microsoft SQL Server** - Enterprise database platform
- **Oracle Database** - Enterprise-class database
- **SQLite** - Lightweight, serverless database
- **Amazon Aurora** - MySQL and PostgreSQL compatible
- **Google Cloud SQL** - Fully managed relational database
- **Azure SQL Database** - Cloud database service

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Git** - Version control

## Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** or **pnpm**
- **Git**

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/sqlinsights.git
   cd sqlinsights
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

\`\`\`
sqlinsights/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   ├── support/          # Support page
│   └── upcoming/         # Upcoming features page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── navigation.tsx    # Navigation component
├── lib/                  # Utility functions
├── public/               # Static assets
├── dashboard.tsx         # Main dashboard component
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md            # Project documentation
\`\`\`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Add your environment variables here
# Example:
# DATABASE_URL="your-database-connection-string"
# API_KEY="your-api-key"
\`\`\`

### Database Configuration

The application supports multiple database types. Configure your database connection through the UI:

1. Select your database type from the dropdown
2. Fill in the connection details (host, port, username, password, etc.)
3. Test the connection
4. Start querying!

## 🎨 Customization

### Styling

The project uses Tailwind CSS for styling. You can customize:

- **Colors**: Edit `tailwind.config.ts` to change the color palette
- **Components**: Modify components in the `components/` directory
- **Global Styles**: Update `app/globals.css` for global styling changes

### Adding New Database Support

To add support for a new database:

1. Add the database option to the select dropdown in `dashboard.tsx`
2. Implement the connection fields in the `renderConnectionFields()` function
3. Add the default port in the `getDefaultPort()` function

## 📊 Supported Visualizations

- **Bar Charts** - Compare categorical data
- **Line Charts** - Show trends over time
- **Pie Charts** - Display proportional data
- **Data Tables** - Present raw query results
- **More coming soon!** - Scatter plots, heatmaps, and more

## 🔒 Security & Privacy

- **No Data Storage**: Query results are processed in real-time and immediately discarded
- **Secure Connections**: All database connections use encryption
- **Metadata Only**: We only access table schema information, not your actual data
- **Session-Based**: Connection information is purged when you close the application

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 Scripts

\`\`\`bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Type checking
npm run type-check   # Run TypeScript compiler
\`\`\`

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
\`\`\`bash
# Kill the process using port 3000
npx kill-port 3000
# Or use a different port
npm run dev -- -p 3001
\`\`\`

**Module not found errors**
\`\`\`bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

**TypeScript errors**
\`\`\`bash
# Check for type errors
npm run type-check
\`\`\`

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🗺️ Roadmap

- [ ] AI-powered query optimization
- [ ] Real-time collaboration
- [ ] Advanced chart types (heatmaps, scatter plots)
- [ ] API integration
- [ ] Export functionality (PDF, CSV, PNG)
- [ ] Query history and saved queries
- [ ] User authentication and profiles
- [ ] Mobile app

## 💝 Support

If you find this project helpful, consider supporting us:

- ⭐ Star this repository
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 🤝 Contribute to the codebase

### Crypto Donations

- **Bitcoin (BTC)**: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
- **Ethereum (ETH)**: `0x742d35Cc6634C0532925a3b8D4C9db96590b5b8e`
- **Binance Coin (BNB)**: `bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23`

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Thanks to the [shadcn/ui](https://ui.shadcn.com/) team for the amazing component library
- [Vercel](https://vercel.com) for the excellent deployment platform
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- All contributors who help make this project better

---

<div align="center">
  <p>Made with ❤️ by the SQLInsights team</p>
  <p>
    <a href="https://github.com/yourusername/sqlinsights">⭐ Star us on GitHub</a> •
    <a href="https://github.com/yourusername/sqlinsights/issues">🐛 Report Bug</a> •
    <a href="https://github.com/yourusername/sqlinsights/issues">💡 Request Feature</a>
  </p>
</div>
