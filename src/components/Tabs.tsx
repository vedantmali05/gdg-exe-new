import React from "react";
import { STORAGE_KEYS } from "../utils/constants";
import { saveToLocalStorage } from "../utils/browserStorage";

interface Tab {
    id: string;
    label: string;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (newTabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <div className="flex justify-center border-b bg-white border-gray-200 px-4 mb-4 z-10 sticky top-0">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`px-6 py-3 text-sm font-medium focus:outline-none transition-colors duration-200
                        ${activeTab === tab.id
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                    onClick={() => {
                        onTabChange(tab.id);
                        saveToLocalStorage(STORAGE_KEYS.activeTaskPageTab, tab.id);
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default Tabs;
