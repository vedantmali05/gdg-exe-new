import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CLASSES, ICONS } from "../utils/constants";

interface HeaderProps {
    heading?: string;
}

const Header: React.FC<HeaderProps> = ({ heading = "Your GDG on Campus Tasks" }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string): boolean => location.pathname === path;

    return (
        <header className="position-sticky top bg-white p-4 flex items-center justify-between font-roboto border-b border-gray-200 shadow-sm">
            <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">{heading}</h1>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => navigate("/community")}
                    className={`
                        ${CLASSES.buttonSecondary} 
                        border border-blue-600 rounded-b-full rounded-t-full
                        ${isActive("/community") ? "bg-blue-100 font-semibold" : ""}
                    `}
                >
                    {ICONS.communityImg ?? "👩‍🎓"}
                    <span className="hidden md:inline">Community</span>
                </button>

                <button
                    onClick={() => navigate("/tasks")}
                    className={`
                        ${CLASSES.buttonSecondary} 
                        border border-blue-600 rounded-b-full rounded-t-full
                        ${isActive("/tasks") ? "bg-blue-100 font-semibold" : ""}
                    `}
                >
                    {ICONS.tasksImg ?? "✅"}
                    <span className="hidden md:inline">Tasks</span>
                </button>

                <button
                    onClick={() => navigate("/assistant")}
                    className={`
                        ${CLASSES.buttonSecondary} 
                        border border-blue-600 rounded-b-full rounded-t-full
                        ${isActive("/assistant") ? "bg-blue-100 font-semibold" : ""}
                    `}
                >
                    {ICONS.assistantImg ?? "🤖"}
                    <span className="hidden md:inline">Checklists</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
