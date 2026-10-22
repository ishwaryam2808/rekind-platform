# REKIND — Give Things a Second Life
### An AI-Assisted Modern Community Reuse Platform

> **"One person's unused item can become another person's opportunity."**

REKIND is a full-stack community sustainability and circular economy platform that helps college students, families, and local communities give away, lend, exchange, or sell items they no longer need to neighbors who can use them.

---

## 🌿 Core Highlights & Architecture

- **Visual Brand & Editorial Aesthetics**: Sophisticated warm neutral palette with deep black (`#141210`), rich espresso (`#382B22`), warm wood brown (`#5C4435`), muted terracotta (`#9A634B`), warm sand/tan (`#C2A68C`, `#E6DDD2`), and cream (`#FAF7F2`). Typography balances bold **Manrope** headings, readable **DM Sans** body text, and restrained **Playfair Display** serif italics.
- **Circular Sharing Methods**:
  1. **Donate (Free to Keep)**: High-impact zero-barrier pass-ons.
  2. **Lend (Available to Borrow)**: Semester loans for calculators, textbooks, musical instruments, and tools.
  3. **Exchange (Item Swap)**: Direct mutual swaps with custom proposal workflows.
  4. **Sell (Affordable Second-Hand)**: Modest recovery pricing without commercial markups.
- **AI-Assisted Listing Co-Pilot**: Photo & hint analysis that drafts titles, categorizes items, creates honest descriptions, suggests search tags, and detects similar active listings.
- **Cryptographically Hashed Auth**: Real BCrypt password hashing, JWT tokens, live password-strength meter, show/hide controls, and secure account management.
- **Transparent Verified Impact Ledger**: Zero fake metrics. All impact figures (diverted kilograms, carbon avoided, community dollars saved) are calculated strictly from confirmed completed item handovers recorded in the database ledger.

---

## 🗺️ Website Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | **Home** | Editorial hero, 4 action cards, recently added items, free giveaways, urgent needs board, 3-step workflow, verified impact preview. |
| `/marketplace` | **Marketplace** | Full search, multi-filter (category, sharing method, condition, location, price), sort, responsive cards, pagination. |
| `/item/:id` | **Item Details** | Multi-photo gallery, owner reputation score, safety reminders, request/borrow/swap/buy actions, prevents self-requests. |
| `/post-item` | **Post an Item** | 5-step guided wizard: Photo Upload, Description, Sharing Method, AI Assistance Review, Preview & Confirm. |
| `/community-needs` | **Community Needs Board** | Post needs (textbooks, calculators, dorm furniture), search by urgency, and make direct offers with linked listings. |
| `/share` | **How It Works Guide** | In-depth comparison of Donate vs. Lend vs. Exchange vs. Sell with best-fit recommendations. |
| `/my-activity` | **My Activity** | Manage active listings, accept/decline/complete received requests, track sent requests, view saved items and verified transfers. |
| `/messages` | **Conversations** | Direct chat between givers and requesters with linked item banners and quick reply suggestions. |
| `/notifications` | **Notifications** | Real-time notification center for requests, offers, messages, and completed transfers. |
| `/profile` | **Public Profile** | User avatar, trust score, community badges, verified reuse stats, and active listings. |
| `/settings` | **Account Settings** | Update profile info, location, bio, and change password with live strength verification. |
| `/impact` | **Impact Dashboard** | Verifiable completed transfer ledger, category breakdown, method distribution, and diverted waste analytics. |
| `/auth` | **Sign In & Register** | Secure authentication with live password feedback and one-click demo reviewer test accounts. |

---

## 👥 Reviewer Demo Accounts

You can log in to any of these accounts with the password `Password123!` or click the **One-Click Reviewer Test Logins** buttons on the `/auth` page or user menu:

1. **Maya Sen (Engineering Student & Top Giver)**: `maya.sen@campus.edu`
2. **David Rivera (Community Maker & Woodworker)**: `david.r@community.org`
3. **Amina El-Amin (Family Circle & Book Giver)**: `amina@familycare.net`
4. **Kiran Patel (Robotics Student & Tech Lender)**: `kiran.p@techhub.io`

---

## 🚀 Running the Platform

### Running the Full-Stack Application
The Express server serves both the REST API and the compiled Vite frontend from a single port (`http://localhost:5000`):

```bash
# Start full-stack server
npm start
```
Visit **[http://localhost:5000](http://localhost:5000)** in your browser.

### Development Mode (with Vite HMR)
To run Vite with hot-module replacement and the API server concurrently:

```bash
# Terminal 1: Backend API
npm run dev:server

# Terminal 2: Vite React Frontend (proxied to API on port 5000)
npm run dev:client
```
Visit **[http://localhost:5173](http://localhost:5173)** in your browser.
