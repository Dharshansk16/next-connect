"use client";

import React from "react";
import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { Menu, X, Home, Bell, User, LogIn } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle"; // Your existing component

export default function Navbar() {
  const { isSignedIn, user } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      show: true,
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      show: isSignedIn,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
      show: isSignedIn,
    },
  ];

  const filteredNavItems = navItems.filter((item) => item.show);

  const NavItem = ({ item, mobile = false }) => {
    const IconComponent = item.icon;

    return (
      <Link
        href={item.href}
        onClick={mobile ? () => setIsOpen(false) : undefined}
        className={`
          group relative flex items-center gap-2 px-4 py-2 rounded-lg
          border border-border/50 bg-background/50 backdrop-blur-sm
          hover:border-primary/50 hover:bg-accent/50 
          transition-all duration-200 ease-in-out
          hover:shadow-sm hover:scale-[1.02]
          ${mobile ? "w-full justify-start" : "justify-center"}
        `}
      >
        <IconComponent className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        <span
          className={`text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors ${
            mobile ? "" : "hidden sm:inline"
          }`}
        >
          {item.name}
        </span>
        <div className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </Link>
    );
  };

  const AuthSection = ({ mobile = false }) => (
    <div
      className={`flex items-center gap-3 ${mobile ? "flex-col w-full" : ""}`}
    >
      <ModeToggle />

      {isSignedIn ? (
        <div className={`flex items-center gap-3 ${mobile ? "w-full" : ""}`}>
          <UserButton
            appearance={{
              elements: {
                avatarBox:
                  "h-8 w-8 rounded-lg border border-border/50 hover:border-primary/50 transition-colors",
                userButtonPopoverCard: "shadow-lg border border-border",
                userButtonPopoverActionButton: "hover:bg-accent",
              },
            }}
          />
          {mobile && (
            <span className="text-sm text-muted-foreground">
              {user?.firstName || user?.username || "User"}
            </span>
          )}
        </div>
      ) : (
        <SignInButton mode="modal">
          <Button
            variant="outline"
            size="sm"
            className={`
              flex items-center gap-2 border-border/50 bg-background/50 backdrop-blur-sm
              hover:border-primary/50 hover:bg-accent/50 transition-all duration-200
              hover:shadow-sm hover:scale-[1.02] ${
                mobile ? "w-full justify-center" : ""
              }
            `}
          >
            <LogIn className="h-4 w-4" />
            <span className="font-medium">Sign In</span>
          </Button>
        </SignInButton>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center space-x-2 font-bold text-xl hover:text-primary transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded bg-primary/60" />
            </div>
            <span>Next Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {filteredNavItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex">
            <AuthSection />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent/50 transition-colors"
                >
                  {isOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-lg border-border/40"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                  <SheetDescription className="text-left">
                    Access your account and navigate the app
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col space-y-4 mt-8">
                  {/* Navigation Items */}
                  <div className="space-y-3">
                    {filteredNavItems.map((item) => (
                      <NavItem key={item.name} item={item} mobile />
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border/40 my-4" />

                  {/* Auth Section */}
                  <AuthSection mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
