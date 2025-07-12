import React from "react";

export const CLASSES: Record<string, string> = {
  textInput: "w-full flex-grow mt-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
  menuItem: "block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200 text-base font-medium w-full",
  buttonPrimary: "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75",
  buttonSecondary: "flex gap-2 px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-75",
  buttonNegative: "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75",
  buttonNegativeSecondary: "px-4 py-2 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 focus:ring-opacity-75",
  iconImg: "w-6 h-6",
  mainSec: "min-h-screen mt-0.5 bg-gray-50 overflow-auto",
};

export const STORAGE_KEYS: Record<string, string> = {
  users: "users",
  timelineTasks: "timelineTasks",
  publicTodos: "publicTodos",
  privateTodos: "privateTodos",
  activeTaskPageTab: "activeTaskPageTab",
  checklists: "checklists",
  activeChecklist: "activeChecklist",
};

export const ICONS: Record<string, JSX.Element> = {
  cross: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
  ),
  hamburger: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6H20M4 12H20M4 18H20"></path>
    </svg>
  ),
  check: (
    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  ),
};

export const USER_DOMAINS: string[] = [
  "Organizer",
  "Core Committee",
  "Web Development",
  "Android Development",
  "DSA",
  "Cybersecurity",
  "AI/ML",
  "Git & GitHub",
  "Non-Technical",
];

export const USER_POSITIONS: string[] = [
  "Core Member",
  "Domain Executive",
  "Domain Member",
  "Organizer",
];
