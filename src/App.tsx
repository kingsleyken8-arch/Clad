import { motion } from "framer-motion";
import {
  Play,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Home,
  ListTodo,
  ArrowLeftRight,
  CreditCard,
  Wallet,
  Banknote,
  Building2,
  Bell as BellMini,
  Settings,
  Plus,
  MoreHorizontal,
  Check,
} from "lucide-react";
import { Button } from "./components/ui/button";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260319_015952_e1deeb12-8fb7-4071-a42a-60779fc64ab6.mp4";

export default function App() {
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar />
      <Hero />
    </div>
  );
}

/* ----------------------------- NAVBAR ----------------------------- */
function Navbar() {
  return (
    <nav className="relative z-20 flex items-center justify-between px-6 py-5 font-body md:px-12 lg:px-20">
      <span className="text-xl font-semibold tracking-tight text-foreground">
        ✦ Nexora
      </span>
      <div className="hidden items-center gap-8 md:flex">
        {["Home", "Pricing", "About", "Contact"].map((l) => (
          <a
            key={l}
            href="#"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {l}
          </a>
        ))}
      </div>
      <Button className="rounded-full px-5 text-sm font-medium">Get started</Button>
    </nav>
  );
}

/* ----------------------------- HERO ----------------------------- */
function Hero() {
  return (
    <section className="relative flex flex-1 flex-col overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={VIDEO_SRC}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="relative z-10 flex w-full flex-1 flex-col items-center overflow-hidden px-4 pt-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-1.5 font-body text-sm text-muted-foreground"
        >
          Now with GPT-5 support ✨
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-xl text-center font-display text-5xl leading-[0.95] tracking-tight text-foreground md:text-6xl lg:text-[5rem]"
        >
          The Future of <span className="italic">Smarter</span> Automation
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 max-w-[650px] text-center font-body text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Automate your busywork with intelligent agents that learn, adapt, and
          execute—so your team can focus on what matters most.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-5 flex items-center gap-3"
        >
          <Button className="rounded-full px-6 py-5 font-body text-sm font-medium">
            Book a demo
          </Button>
          <Button
            variant="ghost"
            className="h-11 w-11 rounded-full border-0 bg-background shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:bg-background/80"
          >
            <Play className="h-4 w-4 fill-foreground" />
          </Button>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 w-full max-w-5xl"
        >
          <div
            className="overflow-hidden rounded-2xl p-3 md:p-4"
            style={{
              background: "rgba(255, 255, 255, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "var(--shadow-dashboard)",
            }}
          >
            <Dashboard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ----------------------------- DASHBOARD ----------------------------- */
function Dashboard() {
  return (
    <div className="pointer-events-none select-none overflow-hidden rounded-xl bg-background text-[11px] text-foreground">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-foreground text-[10px] font-semibold text-background">
            N
          </span>
          <span className="font-semibold">Nexora</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </div>
        <div className="flex w-64 items-center justify-between rounded-md border border-border bg-secondary/60 px-2 py-1 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Search className="h-3 w-3" /> Search
          </span>
          <span className="rounded border border-border bg-background px-1 text-[9px]">⌘K</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium text-background">
            Move Money
          </span>
          <Bell className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[9px] font-semibold text-accent-foreground">
            JB
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-40 shrink-0 border-r border-border p-2">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: ListTodo, label: "Tasks", badge: "10" },
            { icon: ArrowLeftRight, label: "Transactions" },
            { icon: CreditCard, label: "Payments", chevron: true },
            { icon: CreditCard, label: "Cards" },
            { icon: Banknote, label: "Capital" },
            { icon: Building2, label: "Accounts", chevron: true },
          ].map((it) => (
            <div
              key={it.label}
              className={`flex items-center justify-between rounded-md px-2 py-1.5 ${
                it.active ? "bg-secondary font-medium text-foreground" : "text-muted-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <it.icon className="h-3.5 w-3.5" /> {it.label}
              </span>
              {it.badge && (
                <span className="rounded-full bg-foreground px-1.5 text-[9px] text-background">
                  {it.badge}
                </span>
              )}
              {it.chevron && <ChevronRight className="h-3 w-3" />}
            </div>
          ))}
          <div className="mt-3 px-2 text-[9px] uppercase tracking-wide text-muted-foreground">
            Workflows
          </div>
          {[
            { icon: ArrowLeftRight, label: "Trake rutes" },
            { icon: Wallet, label: "Payments" },
            { icon: BellMini, label: "Notifications" },
            { icon: Settings, label: "Settings" },
          ].map((it) => (
            <div
              key={it.label}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-muted-foreground"
            >
              <it.icon className="h-3.5 w-3.5" /> {it.label}
            </div>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 bg-secondary/30 p-4">
          <div className="text-sm font-semibold">Welcome, Jane</div>

          {/* Action buttons */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-medium text-accent-foreground">
              Send
            </span>
            {["Request", "Transfer", "Deposit", "Pay Bill", "Create Invoice"].map((b) => (
              <span
                key={b}
                className="rounded-full border border-border bg-background px-3 py-1 text-[10px]"
              >
                {b}
              </span>
            ))}
            <span className="ml-1 text-[10px] text-muted-foreground">Customize</span>
          </div>

          {/* Two cards */}
          <div className="mt-4 flex gap-3">
            <BalanceCard />
            <AccountsCard />
          </div>

          {/* Transactions */}
          <TransactionsTable />
        </main>
      </div>
    </div>
  );
}

function BalanceCard() {
  return (
    <div className="flex-1 basis-0 rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        Mercury Balance
        <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-accent text-accent-foreground">
          <Check className="h-2.5 w-2.5" />
        </span>
      </div>
      <div className="mt-1 text-lg font-semibold">
        $8,450,190<span className="text-xs text-muted-foreground">.32</span>
      </div>
      <div className="mt-1 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span>Last 30 Days</span>
        <span className="text-green-600">+$1.8M</span>
        <span className="text-red-500">-$900K</span>
      </div>
      {/* Area chart */}
      <svg viewBox="0 0 320 80" className="mt-2 h-20 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="balfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C40,55 60,30 100,38 C140,46 160,14 200,22 C240,30 270,8 320,16 L320,80 L0,80 Z"
          fill="url(#balfill)"
        />
        <path
          d="M0,60 C40,55 60,30 100,38 C140,46 160,14 200,22 C240,30 270,8 320,16"
          fill="none"
          stroke="hsl(var(--accent))"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
}

function AccountsCard() {
  const rows = [
    { name: "Credit", amount: "$98,125.50" },
    { name: "Treasury", amount: "$6,750,200.00" },
    { name: "Operations", amount: "$1,592,864.82" },
  ];
  return (
    <div className="flex-1 basis-0 rounded-lg border border-border bg-background p-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">Accounts</span>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Plus className="h-3 w-3" />
          <MoreHorizontal className="h-3 w-3" />
        </div>
      </div>
      <div className="mt-1">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between py-3 text-xs">
            <span className="text-muted-foreground">{r.name}</span>
            <span className="font-medium">{r.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransactionsTable() {
  const rows = [
    { d: "Mar 18", desc: "AWS", amt: "-$5,200", status: "Pending", tone: "amber" },
    { d: "Mar 17", desc: "Client Payment", amt: "+$125,000", status: "Completed", tone: "green" },
    { d: "Mar 16", desc: "Payroll", amt: "-$85,450", status: "Completed", tone: "green" },
    { d: "Mar 15", desc: "Office Supplies", amt: "-$1,200", status: "Completed", tone: "green" },
  ];
  return (
    <div className="mt-4 rounded-lg border border-border bg-background p-3">
      <div className="font-medium">Recent Transactions</div>
      <table className="mt-2 w-full text-left text-[10px]">
        <thead className="text-muted-foreground">
          <tr>
            <th className="py-1 font-normal">Date</th>
            <th className="py-1 font-normal">Description</th>
            <th className="py-1 font-normal">Amount</th>
            <th className="py-1 text-right font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.desc} className="border-t border-border">
              <td className="py-1.5 text-muted-foreground">{r.d}</td>
              <td className="py-1.5">{r.desc}</td>
              <td className={`py-1.5 ${r.amt.startsWith("+") ? "text-green-600" : ""}`}>
                {r.amt}
              </td>
              <td className="py-1.5 text-right">
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] ${
                    r.tone === "amber"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {r.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
