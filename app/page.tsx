"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Wallet,
  PiggyBank,
  Moon,
  Sun,
  Download,
  Upload,
  Search,
  CreditCard,
  Trash2,
  Edit,
  Settings,
  DollarSign,
  Repeat,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"

interface Transaction {
  id: string
  amount: number
  description: string
  category: string
  type: "income" | "expense"
  date: string
  account: string
  recurring?: boolean
  recurringFrequency?: "weekly" | "monthly" | "yearly"
  tags?: string[]
}

interface Budget {
  category: string
  limit: number
  spent: number
  period: "monthly" | "yearly"
}

interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  description?: string
}

interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "credit" | "investment"
  balance: number
  currency: string
}

interface Bill {
  id: string
  name: string
  amount: number
  dueDate: string
  category: string
  isPaid: boolean
  recurring: boolean
}

interface Investment {
  id: string
  symbol: string
  name: string
  shares: number
  purchasePrice: number
  currentPrice: number
}

interface Debt {
  id: string
  name: string
  totalAmount: number
  remainingAmount: number
  interestRate: number
  minimumPayment: number
  dueDate: string
}

const DEFAULT_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Groceries",
  "Investment",
  "Debt Payment",
  "Other",
]

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
  "#FF7C7C",
  "#8DD1E1",
  "#D084D0",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
]

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"]

export default function FinanceDashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [debts, setDebts] = useState<Debt[]>([])
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES)
  const [currency, setCurrency] = useState("USD")

  // Dialog states
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)
  const [isAddBudgetOpen, setIsAddBudgetOpen] = useState(false)
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [isAddBillOpen, setIsAddBillOpen] = useState(false)
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false)
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterAccount, setFilterAccount] = useState("all")
  const [filterDateRange, setFilterDateRange] = useState("all")

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      const savedTransactions = localStorage.getItem("finance-transactions")
      const savedBudgets = localStorage.getItem("finance-budgets")
      const savedGoals = localStorage.getItem("finance-goals")
      const savedAccounts = localStorage.getItem("finance-accounts")
      const savedBills = localStorage.getItem("finance-bills")
      const savedInvestments = localStorage.getItem("finance-investments")
      const savedDebts = localStorage.getItem("finance-debts")
      const savedCategories = localStorage.getItem("finance-categories")
      const savedCurrency = localStorage.getItem("finance-currency")
      const savedDarkMode = localStorage.getItem("finance-darkmode")

      if (savedTransactions) {
        setTransactions(JSON.parse(savedTransactions))
      } else {
        // Sample data
        const sampleTransactions: Transaction[] = [
          {
            id: "1",
            amount: 3500,
            description: "Salary",
            category: "Other",
            type: "income",
            date: "2024-01-15",
            account: "checking",
          },
          {
            id: "2",
            amount: -120,
            description: "Grocery Shopping",
            category: "Groceries",
            type: "expense",
            date: "2024-01-14",
            account: "checking",
          },
          {
            id: "3",
            amount: -45,
            description: "Gas Station",
            category: "Transportation",
            type: "expense",
            date: "2024-01-13",
            account: "checking",
          },
          {
            id: "4",
            amount: -80,
            description: "Restaurant",
            category: "Food & Dining",
            type: "expense",
            date: "2024-01-12",
            account: "credit",
          },
          {
            id: "5",
            amount: -200,
            description: "Electric Bill",
            category: "Bills & Utilities",
            type: "expense",
            date: "2024-01-11",
            account: "checking",
            recurring: true,
            recurringFrequency: "monthly",
          },
        ]
        setTransactions(sampleTransactions)
      }

      if (savedAccounts) {
        setAccounts(JSON.parse(savedAccounts))
      } else {
        const sampleAccounts: Account[] = [
          { id: "checking", name: "Main Checking", type: "checking", balance: 2500, currency: "USD" },
          { id: "savings", name: "Emergency Fund", type: "savings", balance: 10000, currency: "USD" },
          { id: "credit", name: "Credit Card", type: "credit", balance: -850, currency: "USD" },
          { id: "investment", name: "Investment Account", type: "investment", balance: 15000, currency: "USD" },
        ]
        setAccounts(sampleAccounts)
      }

      if (savedBudgets) {
        setBudgets(JSON.parse(savedBudgets))
      } else {
        const sampleBudgets: Budget[] = [
          { category: "Food & Dining", limit: 400, spent: 280, period: "monthly" },
          { category: "Transportation", limit: 200, spent: 145, period: "monthly" },
          { category: "Entertainment", limit: 150, spent: 90, period: "monthly" },
          { category: "Groceries", limit: 300, spent: 220, period: "monthly" },
        ]
        setBudgets(sampleBudgets)
      }

      if (savedGoals) {
        setGoals(JSON.parse(savedGoals))
      } else {
        const sampleGoals: Goal[] = [
          {
            id: "1",
            name: "Emergency Fund",
            targetAmount: 15000,
            currentAmount: 10000,
            deadline: "2024-12-31",
            category: "Savings",
            description: "6 months of expenses",
          },
          {
            id: "2",
            name: "Vacation",
            targetAmount: 3000,
            currentAmount: 1200,
            deadline: "2024-08-01",
            category: "Travel",
            description: "Europe trip",
          },
          {
            id: "3",
            name: "New Car",
            targetAmount: 25000,
            currentAmount: 5000,
            deadline: "2025-06-01",
            category: "Transportation",
            description: "Down payment for new car",
          },
        ]
        setGoals(sampleGoals)
      }

      if (savedBills) {
        setBills(JSON.parse(savedBills))
      } else {
        const sampleBills: Bill[] = [
          {
            id: "1",
            name: "Rent",
            amount: 1200,
            dueDate: "2024-02-01",
            category: "Bills & Utilities",
            isPaid: false,
            recurring: true,
          },
          {
            id: "2",
            name: "Internet",
            amount: 80,
            dueDate: "2024-02-05",
            category: "Bills & Utilities",
            isPaid: true,
            recurring: true,
          },
          {
            id: "3",
            name: "Phone",
            amount: 60,
            dueDate: "2024-02-10",
            category: "Bills & Utilities",
            isPaid: false,
            recurring: true,
          },
        ]
        setBills(sampleBills)
      }

      if (savedInvestments) {
        setInvestments(JSON.parse(savedInvestments))
      } else {
        const sampleInvestments: Investment[] = [
          { id: "1", symbol: "AAPL", name: "Apple Inc.", shares: 10, purchasePrice: 150, currentPrice: 175 },
          { id: "2", symbol: "GOOGL", name: "Alphabet Inc.", shares: 5, purchasePrice: 2500, currentPrice: 2650 },
          { id: "3", symbol: "MSFT", name: "Microsoft Corp.", shares: 8, purchasePrice: 300, currentPrice: 320 },
        ]
        setInvestments(sampleInvestments)
      }

      if (savedDebts) {
        setDebts(JSON.parse(savedDebts))
      } else {
        const sampleDebts: Debt[] = [
          {
            id: "1",
            name: "Student Loan",
            totalAmount: 25000,
            remainingAmount: 18000,
            interestRate: 4.5,
            minimumPayment: 300,
            dueDate: "2024-02-15",
          },
          {
            id: "2",
            name: "Credit Card",
            totalAmount: 5000,
            remainingAmount: 850,
            interestRate: 18.9,
            minimumPayment: 50,
            dueDate: "2024-02-01",
          },
        ]
        setDebts(sampleDebts)
      }

      if (savedCategories) {
        setCategories(JSON.parse(savedCategories))
      }

      if (savedCurrency) {
        setCurrency(savedCurrency)
      }

      if (savedDarkMode) {
        setDarkMode(JSON.parse(savedDarkMode))
      }
    }

    loadData()
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("finance-transactions", JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem("finance-budgets", JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    localStorage.setItem("finance-goals", JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem("finance-accounts", JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    localStorage.setItem("finance-bills", JSON.stringify(bills))
  }, [bills])

  useEffect(() => {
    localStorage.setItem("finance-investments", JSON.stringify(investments))
  }, [investments])

  useEffect(() => {
    localStorage.setItem("finance-debts", JSON.stringify(debts))
  }, [debts])

  useEffect(() => {
    localStorage.setItem("finance-categories", JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem("finance-currency", currency)
  }, [currency])

  useEffect(() => {
    localStorage.setItem("finance-darkmode", JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Add functions
  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      amount: transaction.type === "expense" ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
    }
    setTransactions((prev) => [newTransaction, ...prev])

    // Update account balance
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === transaction.account ? { ...account, balance: account.balance + newTransaction.amount } : account,
      ),
    )

    setIsAddTransactionOpen(false)
  }

  const addBudget = (category: string, limit: number, period: "monthly" | "yearly") => {
    const spent = transactions
      .filter((t) => t.category === category && t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    setBudgets((prev) => [...prev.filter((b) => b.category !== category), { category, limit, spent, period }])
    setIsAddBudgetOpen(false)
  }

  const addGoal = (goal: Omit<Goal, "id">) => {
    const newGoal = { ...goal, id: Date.now().toString() }
    setGoals((prev) => [...prev, newGoal])
    setIsAddGoalOpen(false)
  }

  const addAccount = (account: Omit<Account, "id">) => {
    const newAccount = { ...account, id: Date.now().toString() }
    setAccounts((prev) => [...prev, newAccount])
    setIsAddAccountOpen(false)
  }

  const addBill = (bill: Omit<Bill, "id">) => {
    const newBill = { ...bill, id: Date.now().toString() }
    setBills((prev) => [...prev, newBill])
    setIsAddBillOpen(false)
  }

  const addInvestment = (investment: Omit<Investment, "id">) => {
    const newInvestment = { ...investment, id: Date.now().toString() }
    setInvestments((prev) => [...prev, newInvestment])
    setIsAddInvestmentOpen(false)
  }

  const addDebt = (debt: Omit<Debt, "id">) => {
    const newDebt = { ...debt, id: Date.now().toString() }
    setDebts((prev) => [...prev, newDebt])
    setIsAddDebtOpen(false)
  }

  // Export/Import functions
  const exportData = () => {
    const data = {
      transactions,
      budgets,
      goals,
      accounts,
      bills,
      investments,
      debts,
      categories,
      currency,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `finance-data-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        if (data.transactions) setTransactions(data.transactions)
        if (data.budgets) setBudgets(data.budgets)
        if (data.goals) setGoals(data.goals)
        if (data.accounts) setAccounts(data.accounts)
        if (data.bills) setBills(data.bills)
        if (data.investments) setInvestments(data.investments)
        if (data.debts) setDebts(data.debts)
        if (data.categories) setCategories(data.categories)
        if (data.currency) setCurrency(data.currency)
        alert("Data imported successfully!")
      } catch (error) {
        alert("Error importing data. Please check the file format.")
      }
    }
    reader.readAsText(file)
  }

  // Calculate summary statistics
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))
  const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.shares * inv.currentPrice, 0)
  const totalDebt = debts.reduce((sum, debt) => sum + debt.remainingAmount, 0)
  const netWorth = totalBalance + totalInvestmentValue - totalDebt

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory
    const matchesAccount = filterAccount === "all" || transaction.account === filterAccount

    let matchesDate = true
    if (filterDateRange !== "all") {
      const transactionDate = new Date(transaction.date)
      const now = new Date()
      switch (filterDateRange) {
        case "week":
          matchesDate = now.getTime() - transactionDate.getTime() <= 7 * 24 * 60 * 60 * 1000
          break
        case "month":
          matchesDate =
            transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()
          break
        case "year":
          matchesDate = transactionDate.getFullYear() === now.getFullYear()
          break
      }
    }

    return matchesSearch && matchesCategory && matchesAccount && matchesDate
  })

  // Prepare chart data
  const categoryData = categories
    .map((category) => {
      const categoryExpenses = transactions
        .filter((t) => t.category === category && t.type === "expense")
        .reduce((sum, t) => sum + Math.abs(t.amount), 0)
      return { name: category, value: categoryExpenses }
    })
    .filter((item) => item.value > 0)

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const month = date.toLocaleString("default", { month: "short" })

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return transactionDate.getMonth() === date.getMonth() && transactionDate.getFullYear() === date.getFullYear()
    })

    const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const expenses = Math.abs(
      monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    )

    return { month, income, expenses, savings: income - expenses }
  }).reverse()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personal Finance Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">Complete financial management solution</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label>
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsSettingsOpen(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Net Worth</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netWorth >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(netWorth)}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalBalance >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(totalBalance)}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Investments</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalInvestmentValue)}</div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Debt</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{formatCurrency(totalDebt)}</div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Monthly Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(monthlyData[monthlyData.length - 1]?.savings || 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="bills">Bills</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="debts">Debts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Transactions */}
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="dark:text-white">Recent Transactions</CardTitle>
                    <CardDescription className="dark:text-gray-300">Your latest financial activity</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddTransactionOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
                          >
                            {transaction.type === "income" ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium dark:text-white">{transaction.description}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">{transaction.category}</Badge>
                              {transaction.recurring && (
                                <Badge variant="outline">
                                  <Repeat className="w-3 h-3 mr-1" />
                                  Recurring
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-medium ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Bills */}
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="dark:text-white">Upcoming Bills</CardTitle>
                    <CardDescription className="dark:text-gray-300">Bills due soon</CardDescription>
                  </div>
                  <Button onClick={() => setIsAddBillOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bills.slice(0, 5).map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${bill.isPaid ? "bg-green-100 dark:bg-green-900" : "bg-yellow-100 dark:bg-yellow-900"}`}
                          >
                            {bill.isPaid ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium dark:text-white">{bill.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium dark:text-white">{formatCurrency(bill.amount)}</p>
                          <Badge variant={bill.isPaid ? "default" : "destructive"}>
                            {bill.isPaid ? "Paid" : "Due"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spending by Category */}
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Spending by Category</CardTitle>
                  <CardDescription className="dark:text-gray-300">Breakdown of your expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Amount"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Savings Trend */}
              <Card className="dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="dark:text-white">Monthly Savings Trend</CardTitle>
                  <CardDescription className="dark:text-gray-300">Your savings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), ""]} />
                      <Area type="monotone" dataKey="savings" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">All Transactions</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Complete history of your financial transactions
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddTransactionOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-500" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterAccount} onValueChange={setFilterAccount}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by account" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Accounts</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${transaction.type === "income" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"}`}
                        >
                          {transaction.type === "income" ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">{transaction.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{transaction.category}</Badge>
                            <Badge variant="outline">{accounts.find((a) => a.id === transaction.account)?.name}</Badge>
                            {transaction.recurring && (
                              <Badge variant="outline">
                                <Repeat className="w-3 h-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`text-lg font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {transaction.amount >= 0 ? "+" : ""}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budgets">
            <Card className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">Budget Overview</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Track your spending against set budgets
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddBudgetOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Set Budget
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {budgets.map((budget) => {
                    const percentage = (budget.spent / budget.limit) * 100
                    const isOverBudget = percentage > 100

                    return (
                      <div key={budget.category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-medium dark:text-white">{budget.category}</h3>
                            <Badge variant="outline">{budget.period}</Badge>
                          </div>
                          <span
                            className={`text-sm ${isOverBudget ? "text-red-600" : "text-gray-600 dark:text-gray-400"}`}
                          >
                            {formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}
                          </span>
                        </div>
                        <Progress value={Math.min(percentage, 100)} className="w-full" />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{percentage.toFixed(1)}% used</span>
                          <span>{formatCurrency(budget.limit - budget.spent)} remaining</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals">
            <Card className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">Financial Goals</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Track progress toward your financial objectives
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddGoalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {goals.map((goal) => {
                    const percentage = (goal.currentAmount / goal.targetAmount) * 100
                    const daysLeft = Math.ceil(
                      (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                    )

                    return (
                      <Card key={goal.id} className="dark:bg-gray-700">
                        <CardHeader>
                          <CardTitle className="text-lg dark:text-white">{goal.name}</CardTitle>
                          <CardDescription className="dark:text-gray-300">{goal.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="dark:text-gray-300">Progress</span>
                              <span className="dark:text-gray-300">{percentage.toFixed(1)}%</span>
                            </div>
                            <Progress value={percentage} className="w-full" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="dark:text-gray-300">Current: {formatCurrency(goal.currentAmount)}</span>
                            <span className="dark:text-gray-300">Target: {formatCurrency(goal.targetAmount)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge variant={daysLeft > 0 ? "default" : "destructive"}>
                              {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
                            </Badge>
                            <Badge variant="outline">{goal.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts">
            <Card className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">Account Overview</CardTitle>
                  <CardDescription className="dark:text-gray-300">Manage your financial accounts</CardDescription>
                </div>
                <Button onClick={() => setIsAddAccountOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Account
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {accounts.map((account) => (
                    <Card key={account.id} className="dark:bg-gray-700">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg dark:text-white">{account.name}</CardTitle>
                        <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                          {account.type === "checking" && <Wallet className="w-4 h-4 text-blue-600" />}
                          {account.type === "savings" && <PiggyBank className="w-4 h-4 text-blue-600" />}
                          {account.type === "credit" && <CreditCard className="w-4 h-4 text-blue-600" />}
                          {account.type === "investment" && <TrendingUp className="w-4 h-4 text-blue-600" />}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div
                          className={`text-2xl font-bold ${account.balance >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(account.balance)}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <Badge variant="outline" className="capitalize">
                            {account.type}
                          </Badge>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{account.currency}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bills">
            <Card className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">Bill Management</CardTitle>
                  <CardDescription className="dark:text-gray-300">
                    Track and manage your recurring bills
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddBillOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bill
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <div
                      key={bill.id}
                      className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-full ${bill.isPaid ? "bg-green-100 dark:bg-green-900" : "bg-yellow-100 dark:bg-yellow-900"}`}
                        >
                          {bill.isPaid ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium dark:text-white">{bill.name}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{bill.category}</Badge>
                            {bill.recurring && (
                              <Badge variant="outline">
                                <Repeat className="w-3 h-3 mr-1" />
                                Recurring
                              </Badge>
                            )}
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Due: {new Date(bill.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-medium dark:text-white">{formatCurrency(bill.amount)}</p>
                          <Badge variant={bill.isPaid ? "default" : "destructive"}>
                            {bill.isPaid ? "Paid" : "Due"}
                          </Badge>
                        </div>
                        <Button
                          variant={bill.isPaid ? "outline" : "default"}
                          size="sm"
                          onClick={() => {
                            setBills((prev) => prev.map((b) => (b.id === bill.id ? { ...b, isPaid: !b.isPaid } : b)))
                          }}
                        >
                          {bill.isPaid ? "Mark Unpaid" : "Mark Paid"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments">
            <Card className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">Investment Portfolio</CardTitle>
                  <CardDescription className="dark:text-gray-300">Track your investment performance</CardDescription>
                </div>
                <Button onClick={() => setIsAddInvestmentOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Investment
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investments.map((investment) => {
                    const totalValue = investment.shares * investment.currentPrice
                    const totalCost = investment.shares * investment.purchasePrice
                    const gainLoss = totalValue - totalCost
                    const gainLossPercent = (gainLoss / totalCost) * 100

                    return (
                      <div
                        key={investment.id}
                        className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                      >
                        <div>
                          <p className="font-medium dark:text-white">{investment.symbol}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{investment.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{investment.shares} shares</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium dark:text-white">{formatCurrency(totalValue)}</p>
                          <p className={`text-sm ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {gainLoss >= 0 ? "+" : ""}
                            {formatCurrency(gainLoss)} ({gainLossPercent.toFixed(2)}%)
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatCurrency(investment.currentPrice)} per share
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium dark:text-white">Total Portfolio Value</span>
                    <span className="text-xl font-bold text-green-600">{formatCurrency(totalInvestmentValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debts">
            <Card className="dark:bg-gray-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="dark:text-white">Debt Management</CardTitle>
                  <CardDescription className="dark:text-gray-300">Track and manage your debts</CardDescription>
                </div>
                <Button onClick={() => setIsAddDebtOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Debt
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {debts.map((debt) => {
                    const payoffProgress = ((debt.totalAmount - debt.remainingAmount) / debt.totalAmount) * 100

                    return (
                      <div key={debt.id} className="p-4 border rounded-lg dark:border-gray-700">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-medium dark:text-white">{debt.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {debt.interestRate}% APR • Min payment: {formatCurrency(debt.minimumPayment)}
                            </p>
                          </div>
                          <Badge variant="destructive">Due: {new Date(debt.dueDate).toLocaleDateString()}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="dark:text-gray-300">Payoff Progress</span>
                            <span className="dark:text-gray-300">{payoffProgress.toFixed(1)}%</span>
                          </div>
                          <Progress value={payoffProgress} className="w-full" />
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                            <span>Remaining: {formatCurrency(debt.remainingAmount)}</span>
                            <span>Total: {formatCurrency(debt.totalAmount)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-red-800 dark:text-red-200">Total Debt Remaining</span>
                    <span className="text-xl font-bold text-red-600">{formatCurrency(totalDebt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <TransactionDialog
          open={isAddTransactionOpen}
          onOpenChange={setIsAddTransactionOpen}
          onSubmit={addTransaction}
          accounts={accounts}
          categories={categories}
        />

        <BudgetDialog
          open={isAddBudgetOpen}
          onOpenChange={setIsAddBudgetOpen}
          onSubmit={addBudget}
          categories={categories}
        />

        <GoalDialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen} onSubmit={addGoal} categories={categories} />

        <AccountDialog
          open={isAddAccountOpen}
          onOpenChange={setIsAddAccountOpen}
          onSubmit={addAccount}
          currencies={CURRENCIES}
        />

        <BillDialog open={isAddBillOpen} onOpenChange={setIsAddBillOpen} onSubmit={addBill} categories={categories} />

        <InvestmentDialog open={isAddInvestmentOpen} onOpenChange={setIsAddInvestmentOpen} onSubmit={addInvestment} />

        <DebtDialog open={isAddDebtOpen} onOpenChange={setIsAddDebtOpen} onSubmit={addDebt} />

        <SettingsDialog
          open={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          categories={categories}
          setCategories={setCategories}
          currency={currency}
          setCurrency={setCurrency}
          currencies={CURRENCIES}
        />
      </div>
    </div>
  )
}

// Dialog Components
function TransactionDialog({
  open,
  onOpenChange,
  onSubmit,
  accounts,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (transaction: Omit<Transaction, "id">) => void
  accounts: Account[]
  categories: string[]
}) {
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
    date: new Date().toISOString().split("T")[0],
    account: "",
    recurring: false,
    recurringFrequency: "monthly" as "weekly" | "monthly" | "yearly",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.amount && formData.description && formData.category && formData.account) {
      onSubmit({
        amount: Number.parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        type: formData.type,
        date: formData.date,
        account: formData.account,
        recurring: formData.recurring,
        recurringFrequency: formData.recurringFrequency,
      })
      setFormData({
        amount: "",
        description: "",
        category: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
        account: "",
        recurring: false,
        recurringFrequency: "monthly",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New Transaction</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Enter the details of your transaction</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type" className="dark:text-white">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "income" | "expense") => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount" className="dark:text-white">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="dark:text-white">
              Description
            </Label>
            <Input
              id="description"
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="dark:text-white">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="account" className="dark:text-white">
                Account
              </Label>
              <Select
                value={formData.account}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, account: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="date" className="dark:text-white">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, recurring: checked }))}
            />
            <Label htmlFor="recurring" className="dark:text-white">
              Recurring Transaction
            </Label>
          </div>

          {formData.recurring && (
            <div>
              <Label htmlFor="frequency" className="dark:text-white">
                Frequency
              </Label>
              <Select
                value={formData.recurringFrequency}
                onValueChange={(value: "weekly" | "monthly" | "yearly") =>
                  setFormData((prev) => ({ ...prev, recurringFrequency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full">
            Add Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function BudgetDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (category: string, limit: number, period: "monthly" | "yearly") => void
  categories: string[]
}) {
  const [category, setCategory] = useState("")
  const [limit, setLimit] = useState("")
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (category && limit) {
      onSubmit(category, Number.parseFloat(limit), period)
      setCategory("")
      setLimit("")
      setPeriod("monthly")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Set Category Budget</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Set a spending limit for a category</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="budget-category" className="dark:text-white">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget-limit" className="dark:text-white">
              Budget Limit
            </Label>
            <Input
              id="budget-limit"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="budget-period" className="dark:text-white">
              Period
            </Label>
            <Select value={period} onValueChange={(value: "monthly" | "yearly") => setPeriod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Set Budget
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function GoalDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (goal: Omit<Goal, "id">) => void
  categories: string[]
}) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    category: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.targetAmount && formData.deadline && formData.category) {
      onSubmit({
        name: formData.name,
        targetAmount: Number.parseFloat(formData.targetAmount),
        currentAmount: Number.parseFloat(formData.currentAmount) || 0,
        deadline: formData.deadline,
        category: formData.category,
        description: formData.description,
      })
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        category: "",
        description: "",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add Financial Goal</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Set a new financial goal to track</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="goal-name" className="dark:text-white">
              Goal Name
            </Label>
            <Input
              id="goal-name"
              placeholder="e.g., Emergency Fund"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target-amount" className="dark:text-white">
                Target Amount
              </Label>
              <Input
                id="target-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.targetAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetAmount: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="current-amount" className="dark:text-white">
                Current Amount
              </Label>
              <Input
                id="current-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentAmount: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal-deadline" className="dark:text-white">
                Deadline
              </Label>
              <Input
                id="goal-deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData((prev) => ({ ...prev, deadline: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="goal-category" className="dark:text-white">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="goal-description" className="dark:text-white">
              Description (Optional)
            </Label>
            <Textarea
              id="goal-description"
              placeholder="Describe your goal..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Goal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function AccountDialog({
  open,
  onOpenChange,
  onSubmit,
  currencies,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (account: Omit<Account, "id">) => void
  currencies: string[]
}) {
  const [formData, setFormData] = useState({
    name: "",
    type: "checking" as "checking" | "savings" | "credit" | "investment",
    balance: "",
    currency: "USD",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.balance) {
      onSubmit({
        name: formData.name,
        type: formData.type,
        balance: Number.parseFloat(formData.balance),
        currency: formData.currency,
      })
      setFormData({
        name: "",
        type: "checking",
        balance: "",
        currency: "USD",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New Account</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Add a new financial account</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account-name" className="dark:text-white">
              Account Name
            </Label>
            <Input
              id="account-name"
              placeholder="e.g., Main Checking"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="account-type" className="dark:text-white">
                Account Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: "checking" | "savings" | "credit" | "investment") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="account-currency" className="dark:text-white">
                Currency
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="account-balance" className="dark:text-white">
              Initial Balance
            </Label>
            <Input
              id="account-balance"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.balance}
              onChange={(e) => setFormData((prev) => ({ ...prev, balance: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Add Account
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function BillDialog({
  open,
  onOpenChange,
  onSubmit,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (bill: Omit<Bill, "id">) => void
  categories: string[]
}) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    category: "",
    recurring: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name && formData.amount && formData.dueDate && formData.category) {
      onSubmit({
        name: formData.name,
        amount: Number.parseFloat(formData.amount),
        dueDate: formData.dueDate,
        category: formData.category,
        isPaid: false,
        recurring: formData.recurring,
      })
      setFormData({
        name: "",
        amount: "",
        dueDate: "",
        category: "",
        recurring: true,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New Bill</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Add a bill to track</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="bill-name" className="dark:text-white">
              Bill Name
            </Label>
            <Input
              id="bill-name"
              placeholder="e.g., Electric Bill"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bill-amount" className="dark:text-white">
                Amount
              </Label>
              <Input
                id="bill-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="bill-due-date" className="dark:text-white">
                Due Date
              </Label>
              <Input
                id="bill-due-date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bill-category" className="dark:text-white">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="bill-recurring"
              checked={formData.recurring}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, recurring: checked }))}
            />
            <Label htmlFor="bill-recurring" className="dark:text-white">
              Recurring Bill
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Add Bill
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function InvestmentDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (investment: Omit<Investment, "id">) => void
}) {
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    shares: "",
    purchasePrice: "",
    currentPrice: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.symbol && formData.name && formData.shares && formData.purchasePrice && formData.currentPrice) {
      onSubmit({
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        shares: Number.parseFloat(formData.shares),
        purchasePrice: Number.parseFloat(formData.purchasePrice),
        currentPrice: Number.parseFloat(formData.currentPrice),
      })
      setFormData({
        symbol: "",
        name: "",
        shares: "",
        purchasePrice: "",
        currentPrice: "",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add Investment</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Add a new investment to your portfolio</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="investment-symbol" className="dark:text-white">
                Symbol
              </Label>
              <Input
                id="investment-symbol"
                placeholder="e.g., AAPL"
                value={formData.symbol}
                onChange={(e) => setFormData((prev) => ({ ...prev, symbol: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="investment-shares" className="dark:text-white">
                Shares
              </Label>
              <Input
                id="investment-shares"
                type="number"
                step="0.001"
                placeholder="0"
                value={formData.shares}
                onChange={(e) => setFormData((prev) => ({ ...prev, shares: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="investment-name" className="dark:text-white">
              Company Name
            </Label>
            <Input
              id="investment-name"
              placeholder="e.g., Apple Inc."
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="purchase-price" className="dark:text-white">
                Purchase Price
              </Label>
              <Input
                id="purchase-price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.purchasePrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, purchasePrice: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="current-price" className="dark:text-white">
                Current Price
              </Label>
              <Input
                id="current-price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentPrice}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentPrice: e.target.value }))}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Add Investment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DebtDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (debt: Omit<Debt, "id">) => void
}) {
  const [formData, setFormData] = useState({
    name: "",
    totalAmount: "",
    remainingAmount: "",
    interestRate: "",
    minimumPayment: "",
    dueDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.name &&
      formData.totalAmount &&
      formData.remainingAmount &&
      formData.interestRate &&
      formData.minimumPayment &&
      formData.dueDate
    ) {
      onSubmit({
        name: formData.name,
        totalAmount: Number.parseFloat(formData.totalAmount),
        remainingAmount: Number.parseFloat(formData.remainingAmount),
        interestRate: Number.parseFloat(formData.interestRate),
        minimumPayment: Number.parseFloat(formData.minimumPayment),
        dueDate: formData.dueDate,
      })
      setFormData({
        name: "",
        totalAmount: "",
        remainingAmount: "",
        interestRate: "",
        minimumPayment: "",
        dueDate: "",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add Debt</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Add a debt to track</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="debt-name" className="dark:text-white">
              Debt Name
            </Label>
            <Input
              id="debt-name"
              placeholder="e.g., Student Loan"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="total-amount" className="dark:text-white">
                Total Amount
              </Label>
              <Input
                id="total-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.totalAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, totalAmount: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="remaining-amount" className="dark:text-white">
                Remaining Amount
              </Label>
              <Input
                id="remaining-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.remainingAmount}
                onChange={(e) => setFormData((prev) => ({ ...prev, remainingAmount: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="interest-rate" className="dark:text-white">
                Interest Rate (%)
              </Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.interestRate}
                onChange={(e) => setFormData((prev) => ({ ...prev, interestRate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="minimum-payment" className="dark:text-white">
                Minimum Payment
              </Label>
              <Input
                id="minimum-payment"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.minimumPayment}
                onChange={(e) => setFormData((prev) => ({ ...prev, minimumPayment: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="debt-due-date" className="dark:text-white">
              Next Payment Due
            </Label>
            <Input
              id="debt-due-date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Add Debt
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SettingsDialog({
  open,
  onOpenChange,
  categories,
  setCategories,
  currency,
  setCurrency,
  currencies,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: string[]
  setCategories: (categories: string[]) => void
  currency: string
  setCurrency: (currency: string) => void
  currencies: string[]
}) {
  const [newCategory, setNewCategory] = useState("")

  const addCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      setNewCategory("")
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove))
  }

  const clearAllData = () => {
    if (confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Settings</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Manage your app preferences</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Currency Settings */}
          <div>
            <Label className="text-base font-medium dark:text-white">Default Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Management */}
          <div>
            <Label className="text-base font-medium dark:text-white">Manage Categories</Label>
            <div className="mt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCategory()}
                />
                <Button onClick={addCategory}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <button onClick={() => removeCategory(category)} className="ml-1 hover:text-red-500">
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div>
            <Label className="text-base font-medium dark:text-white">Data Management</Label>
            <div className="mt-2 space-y-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-gray-800">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-300">
                      This action cannot be undone. This will permanently delete all your financial data including
                      transactions, budgets, goals, and accounts.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={clearAllData}>Yes, delete everything</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
