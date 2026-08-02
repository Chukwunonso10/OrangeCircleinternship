"use client"
import Logout from "@/components/logout";
import React, { useState } from "react";
import {
    CheckSquare,
    Bell,
    Shield,
    Palette,
    MessageSquare,
    LogOut,
    Trash2,
    X,
    ChevronRight,
    Home,
} from "lucide-react";

/**
 * LedgerLite - Settings Module
 * Sidebar sections: Security, Theme, Notifications, Feedback & Support, Account Action
 * Includes Delete Account confirmation flow (password modal -> final confirm modal)
 */

type SettingsSection =
    "security" | "theme" | "notifications" | "feedback" | "account";

const NAV_ITEMS: {
    id: SettingsSection;
    label: string;
    icon: React.ReactNode;
}[] = [
        { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
        { id: "theme", label: "Theme", icon: <Palette className="h-4 w-4" /> },
        {
            id: "notifications",
            label: "Notifications",
            icon: <Bell className="h-4 w-4" />,
        },
        {
            id: "feedback",
            label: "Feedback & Support",
            icon: <MessageSquare className="h-4 w-4" />,
        },
        { id: "account", label: "Account Action", icon: null },
    ];


function Sidebar({
    active,
    onSelect,
}: {
    active: SettingsSection;
    onSelect: (s: SettingsSection) => void;
}) {
    return (
        <aside className="w-64 shrink-0 border-r border-slate-100 bg-white px-6 py-8">
            <h2 className="mb-6 text-xl font-bold text-slate-900">Settings</h2>
            <nav className="space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`relative w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${isActive
                                ? "font-medium text-teal-700"
                                : "text-slate-600 hover:bg-slate-50"
                                }`}
                        >
                            {isActive && (
                                <span className="absolute -left-6 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r bg-teal-600" />
                            )}
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return <h1 className="mb-8 text-2xl font-bold text-slate-900">{children}</h1>;
}

function PasswordField({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div className="mb-6 max-w-lg">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </label>
            <input
                type="password"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
        </div>
    );
}

/* ---------------- Sections ---------------- */

function SecuritySection() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div>
            <SectionHeading>Security</SectionHeading>
            <PasswordField
                label="Old Password"
                value={oldPassword}
                onChange={setOldPassword}
            />
            <PasswordField
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
            />
            <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
            />
            <div className="max-w-lg space-y-3">
                <button className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer">
                    Save Changes
                </button>
                <button className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50 cursor-pointer">
                    Cancel
                </button>
            </div>
        </div>
    );
}

function RadioRow({
    label,
    selected,
    onSelect,
}: {
    label: string;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className="flex w-full max-w-lg items-center justify-between border-b border-slate-100 py-5 text-left"
        >
            <span className="text-sm text-slate-800">{label}</span>
            <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? "border-teal-600" : "border-slate-300"
                    }`}
            >
                {selected && <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />}
            </span>
        </button>
    );
}

function ThemeSection() {
    const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
    return (
        <div>
            <SectionHeading>Theme</SectionHeading>
            <div className="max-w-lg">
                <RadioRow
                    label="Light Mode"
                    selected={theme === "light"}
                    onSelect={() => setTheme("light")}
                />
                <RadioRow
                    label="Dark Mode"
                    selected={theme === "dark"}
                    onSelect={() => setTheme("dark")}
                />
                <RadioRow
                    label="System"
                    selected={theme === "system"}
                    onSelect={() => setTheme("system")}
                />
            </div>
        </div>
    );
}

function ToggleRow({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex w-full max-w-lg items-center justify-between py-3">
            <span className="text-sm text-slate-800">{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={`relative h-7 w-12 rounded-full transition-colors ${checked ? "bg-teal-600" : "bg-slate-200"
                    }`}
                aria-pressed={checked}
            >
                <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "-translate-x-6" : "translate-x-1"
                        }`}
                />
            </button>
        </div>
    );
}

function NotificationsSection() {
    const [lowStockAlert, setLowStockAlert] = useState(true);
    return (
        <div>
            <SectionHeading>Notifications</SectionHeading>
            <ToggleRow
                label="Low Stock Alert"
                checked={lowStockAlert}
                onChange={setLowStockAlert}
            />
        </div>
    );
}

function FeedbackSection() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    return (
        <div>
            <SectionHeading>Feedback &amp; Support</SectionHeading>
            <div className="max-w-lg">
                <div className="mb-6">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Subject
                    </label>
                    <input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                </div>
                <div className="mb-6">
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={7}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                </div>
                <button className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 cursor-pointer">
                    Send
                </button>
            </div>
        </div>
    );
}

function AccountActionSection({
    onLogout,
    onDeleteAccount,
}: {
    onLogout: () => void;
    onDeleteAccount: () => void;
}) {
    return (
        <div>
            <SectionHeading>Account Action</SectionHeading>
            <div className="max-w-lg space-y-3">
                <Logout />
                <button
                    onClick={onDeleteAccount}
                    className="flex w-full items-center gap-2 rounded-full bg-red-600 py-3.5 pl-5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition-colors hover:bg-red-700 cursor-pointer"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                </button>
            </div>
        </div>
    );
}

/* ---------------- Modals ---------------- */

function ModalShell({
    children,
    onClose,
}: {
    children: React.ReactNode;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-5 top-5 text-slate-400 hover:text-slate-600"
                >
                    <X className="h-5 w-5" />
                </button>
                {children}
            </div>
        </div>
    );
}

function ConfirmPasswordModal({
    onCancel,
    onContinue,
}: {
    onCancel: () => void;
    onContinue: (password: string) => void;
}) {
    const [password, setPassword] = useState("");

    return (
        <ModalShell onClose={onCancel}>
            <h3 className="text-xl font-bold text-slate-900">
                Confirm your password
            </h3>
            <p className="mt-1.5 text-sm text-slate-500">
                For your security, please enter your password to continue
            </p>

            <div className="mt-6 mb-8">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Password
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                />
            </div>

            <div className="space-y-3">
                <button
                    onClick={() => onContinue(password)}
                    disabled={!password}
                    className="w-full rounded-full bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-teal-600/20 transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                    Continue
                </button>
                <button
                    onClick={onCancel}
                    className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </ModalShell>
    );
}

function DeleteAccountModal({
    onCancel,
    onDelete,
}: {
    onCancel: () => void;
    onDelete: () => void;
}) {
    return (
        <ModalShell onClose={onCancel}>
            <h3 className="text-xl font-bold text-slate-900">Delete Account?</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
                This action will permanently delete your account, business
                information&apos;s, sales, expenses, and inventory records. This action
                cannot be undone.
            </p>

            <div className="mt-8 space-y-3">
                <button
                    onClick={onCancel}
                    className="w-full rounded-full border border-slate-200 py-3.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-slate-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onDelete}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-3.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition-colors hover:bg-red-700"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Account
                </button>
            </div>
        </ModalShell>
    );
}

/* ---------------- Root ---------------- */

type DeleteFlowStep = "none" | "password" | "confirm";

export default function LedgerLiteSettings() {
    const [activeSection, setActiveSection] =
        useState<SettingsSection>("security");
    const [deleteStep, setDeleteStep] = useState<DeleteFlowStep>("none");



    const closeDeleteFlow = () => setDeleteStep("none");

    return (
        <div className="min-h-screen w-full bg-slate-50">

            <div className="mx-auto flex max-w-6xl">
                <Sidebar active={activeSection} onSelect={setActiveSection} />

                <main className="flex-1 px-10 py-10">
                    {activeSection === "security" && <SecuritySection />}
                    {activeSection === "theme" && <ThemeSection />}
                    {activeSection === "notifications" && <NotificationsSection />}
                    {activeSection === "feedback" && <FeedbackSection />}
                    {activeSection === "account" && (
                        <AccountActionSection
                            onLogout={() => {
                                /* wire up real logout here */
                            }}
                            onDeleteAccount={() => setDeleteStep("password")}
                        />
                    )}
                </main>
            </div>

            {deleteStep === "password" && (
                <ConfirmPasswordModal
                    onCancel={closeDeleteFlow}
                    onContinue={() => setDeleteStep("confirm")}
                />
            )}
            {deleteStep === "confirm" && (
                <DeleteAccountModal
                    onCancel={closeDeleteFlow}
                    onDelete={() => {
                        /* wire up real account deletion here */
                        closeDeleteFlow();
                    }}
                />
            )}
        </div>
    );
}
