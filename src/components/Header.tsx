"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CLASSES, ICONS } from "../utils/constants";

interface HeaderProps {
    heading?: string;
}

const Header: React.FC<HeaderProps> = ({ heading = "Your GDG on Campus Tasks" }) => {
    const pathname = usePathname();

    const isActive = (path: string): boolean => pathname === path;

    return (
        <header className="position-sticky top bg-white p-4 flex items-center justify-between font-roboto border-b border-gray-200 shadow-sm">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">{heading}</h1>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href="/community"
                    className={`
                        ${CLASSES.buttonSecondary}
                        border border-blue-600 rounded-b-full rounded-t-full
                        ${isActive("/community") ? "bg-blue-100 font-semibold" : ""}
                    `}
                >
                    {ICONS.communityImg ?? "👩‍🎓"}
                    <span className="hidden md:inline">Community</span>
                </Link>

                <Link
                    href="/tasks"
                    className={`
                        ${CLASSES.buttonSecondary}
                        border border-blue-600 rounded-b-full rounded-t-full
                        ${isActive("/tasks") ? "bg-blue-100 font-semibold" : ""}
                    `}
                >
                    {ICONS.tasksImg ?? "✅"}
                    <span className="hidden md:inline">Tasks</span>
                </Link>

                <Link
                    href="/assistant"
                    className={`
                        ${CLASSES.buttonSecondary}
                        border border-blue-600 rounded-b-full rounded-t-full
                        ${isActive("/assistant") ? "bg-blue-100 font-semibold" : ""}
                    `}
                >
                    {ICONS.assistantImg ?? "🤖"}
                    <span className="hidden md:inline">Checklists</span>
                </Link>
            </div>
        </header>
    );
};

export default Header;
