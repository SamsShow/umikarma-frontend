# UmiKarma Frontend

> AI-enhanced reputation for the decentralized world

## 🌟 Overview

UmiKarma is a Sybil-resistant, AI-powered reputation system that aggregates on-chain and off-chain activity into a unified karma score for contributors. This MVP frontend demonstrates the core features of the UmiKarma system.

## ✨ Features

- **🛡️ Sybil-Resistant Scoring**: Advanced algorithms prevent gaming and ensure authentic reputation
- **🔗 Multi-Platform Aggregation**: GitHub contributions, DAO participation, and forum activity in one score
- **🤖 AI-Powered Analysis**: GPT models analyze and summarize contributions intelligently
- **🏛️ DAO Integration Ready**: Use karma for governance, task gating, and reward allocation
- **📊 Transparent Metrics**: Clear breakdown of how reputation scores are calculated
- **⬇️ Exportable Proof**: Generate verifiable reputation certificates

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd umikarma-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── KarmaCard.tsx          # User reputation display
│   ├── ContributionList.tsx   # Activity feed with AI summaries
│   └── WelcomeScreen.tsx      # Landing page
├── App.tsx                    # Main application component
├── index.css                  # Tailwind styles
└── index.tsx                  # React entry point
```

## 🎯 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Build Tool**: Create React App

## 🧪 Demo Features (MVP)

### Core Components
- **Wallet Connection Simulation**: Mock wallet connectivity
- **Reputation Dashboard**: View karma score, trust factor, and contributions
- **AI Summaries**: Simulated AI analysis of GitHub PRs and DAO participation
- **DAO Access Control**: Examples of reputation-gated features
- **Export Functionality**: Download reputation proofs as JSON

### Mock Data
The MVP includes realistic mock data demonstrating:
- GitHub contribution analysis
- DAO governance participation
- Forum discussion impact
- AI-generated contribution summaries

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🛠️ Development

### Adding New Components
1. Create component in `src/components/`
2. Follow TypeScript interface patterns
3. Use Tailwind CSS classes with `karma-*` custom styles
4. Import and use in main `App.tsx`

### Customizing Styles
- Primary colors: `karma-*` palette (defined in `tailwind.config.js`)
- Custom components: `.karma-card`, `.karma-gradient`, `.karma-text-gradient`
- Animation classes: `animate-float`, `animate-gradient`

## 🌐 Future Integration

This frontend is designed to integrate with:
- **Umi Network**: Move smart contracts for reputation storage
- **GitHub API**: Real contribution data
- **OpenAI API**: Actual AI summarization
- **DAO Platforms**: Snapshot, Tally, custom governance contracts

## 📊 Karma Score Calculation

```typescript
interface KarmaScore {
  total: number;           // 0-100 overall score
  trustFactor: number;     // 0-1 identity verification
  contributions: {
    github: number;        // Code contributions weight
    dao: number;          // Governance participation
    forum: number;        // Community discussions
  };
  recency: number;        // Time decay factor
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue shades for main UI elements
- **Karma**: Cyan/blue gradient for reputation elements
- **Status**: Green (high), Yellow (medium), Red (low)

### Components
- **Cards**: Consistent `.karma-card` styling
- **Gradients**: Brand gradient for key elements
- **Animations**: Subtle hover and loading states

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Automatic deployments from Git
- **Netlify**: Drag & drop or Git integration
- **IPFS**: Decentralized hosting
- **Traditional**: Any static hosting service

## 🔮 Roadmap

### Phase 1 (Current MVP)
- ✅ React frontend with mock data
- ✅ Responsive design
- ✅ Component-based architecture

### Phase 2 (Next Steps)
- [ ] Real wallet connectivity (WalletConnect)
- [ ] GitHub API integration
- [ ] AI summarization backend
- [ ] Move smart contracts on Umi Network

### Phase 3 (Advanced Features)
- [ ] ZK proof generation
- [ ] Social platform integration (Lens, Farcaster)
- [ ] Dynamic NFT reputation badges
- [ ] Cross-chain reputation portability

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: Coming soon
- **API Reference**: Coming soon
- **Umi Network**: https://umi.network
- **Demo**: https://umikarma-demo.vercel.app (coming soon)

---

Built with ❤️ for the decentralized future
