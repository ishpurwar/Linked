"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWeb3 } from "../lib/Web3Provider";

export default function Navigation() {
  const pathname = usePathname();
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();

  const navItems = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/createprofile", label: "Create Profile", icon: "👤" },
    { href: "/match", label: "Discover", icon: "💝" },
    { href: "/test", label: "Test Functions", icon: "🧪" },
  ];

  return (
    <nav className="glass border-b border-purple-500/20 sticky top-0 z-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 group animate-scale-in"
          >
            <span className="text-3xl animate-float">💕</span>
            <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
              Linked
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group animate-slide-up ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-300 hover:text-white hover:bg-purple-600/20 hover:shadow-lg hover:shadow-purple-500/10"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="group-hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4 animate-scale-in">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block glass-purple px-3 py-2 rounded-lg">
                  <p className="text-xs text-purple-300">Connected</p>
                  <p className="text-sm font-medium text-white">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-purple text-white px-6 py-2 rounded-lg text-sm font-medium"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap animate-slide-up ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25"
                    : "text-gray-300 hover:text-white hover:bg-purple-600/20"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
