import React from "react";
import Header from "../components/Header";
import { CLASSES } from "../utils/constants";
import ChecklistPage from "./ChecklistPage";

const Assistant: React.FC = () => {
  return (
    <>
      <Header heading="Ask Gemini for Checklists" />
      <ChecklistPage />
    </>
  );
};

export default Assistant;
