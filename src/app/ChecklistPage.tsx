
"use client";

import { useState, useEffect, useRef } from "react";
import { dummyChecklistAreaList } from "../utils/data";
import Todo from "./tasks/Todo";
import { CLASSES, STORAGE_KEYS } from "../utils/constants";
import Dialog from "../components/Dialog";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/browserStorage";
import { generateChecklist } from "../utils/api";

type ChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
};

type Checklist = {
  id: string;
  name: string;
  items: ChecklistItem[];
};

const ChecklistPage = () => {
  const checklistInputRef = useRef<HTMLInputElement>(null);

  const [assistantChecklist, setAssistantChecklist] = useState<Checklist | []>([]);
  const [allChecklists, setAllChecklists] = useState<Checklist[]>([]);
  
  const [activeChecklistMetaData, setActiveChecklistMetaData] = useState<Partial<Checklist> | "">("");
  const [activeChecklistItems, setActiveChecklistItems] = useState<Checklist | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isWait, setIsWait] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const stored = getFromLocalStorage(STORAGE_KEYS.checklists) || [];
    setAllChecklists(stored);
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!activeChecklistItems) return;
    console.log(activeChecklistItems);
  }, [activeChecklistItems]);

  const getAssistantChecklist = async (prompt: string) => {
    setIsWait(true);
    if (checklistInputRef.current) checklistInputRef.current.value = "";

    let response = await generateChecklist(prompt);
    let rawText = response.trim();

    if (rawText.startsWith("```")) {
      rawText = rawText.replace(/^```(json)?/, "").replace(/```$/, "").trim();
    }

    try {
      const cleanedChecklist: Checklist = JSON.parse(rawText);
      setIsWait(false);
      setAssistantChecklist(cleanedChecklist);
      console.log(cleanedChecklist);
    } catch (e) {
      console.error("Failed to parse JSON:", e, rawText);
      return null;
    }
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen mb-10 bg-white">
        {/* Column 1: AI Recommendations */}
        <div className="md:w-2/3 w-full flex flex-col border-r border-gray-200">
          <div className="flex-1 overflow-y-auto p-4 mb-18">
            {isWait ? (
              <p className="m-auto flex items-center justify-center">Loading...</p>
            ) : (
              <>
                {assistantChecklist?.length === 0 ? (
                  <div className="text-gray-500 italic">
                    AI-generated checklist will appear here...
                  </div>
                ) : (
                  <Todo
                    initialTodos={(assistantChecklist as Checklist).items}
                    isAssistantChecklist={true}
                    assistantChecklistName={dummyChecklistAreaList.name}
                    setAllChecklists={setAllChecklists}
                  />
                )}
              </>
            )}
          </div>

          {/* Sticky Bottom Input */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                ref={checklistInputRef}
                placeholder="Ask AI to suggest..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && (e.target as HTMLInputElement).value !== "") {
                    await getAssistantChecklist((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => {
                  const value = checklistInputRef?.current?.value;
                  if (value) getAssistantChecklist(value);
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Your Checklists */}
        <div className="md:w-1/3 w-full flex flex-col">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <h2 className="text-lg font-semibold">Your checklists</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-gray-600 text-sm">
              {allChecklists.length === 0 ? (
                <p className="text-gray-500 italic">
                  You don't have any saved checklists yet.
                </p>
              ) : (
                allChecklists.map((checklist) => (
                  <div
                    key={checklist.id}
                    onClick={() => {
                      saveToLocalStorage(STORAGE_KEYS.activeChecklist, checklist.items);
                      setActiveChecklistMetaData({ id: checklist.id, name: checklist.name });
                      setActiveChecklistItems(checklist);
                      setIsDialogOpen(true);
                    }}
                    className="mb-4 p-3 border border-gray-200 rounded-md hover:shadow transition cursor-pointer"
                  >
                    <h3 className="text-sm font-medium text-gray-800 mb-1">{checklist.name}</h3>
                    <p className="text-xs text-gray-500">{checklist.items.length} items</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        isActive={isDialogOpen}
        onCancel={() => {
          saveToLocalStorage(STORAGE_KEYS.activeChecklist, []);
          setIsDialogOpen(false);
          setActiveChecklistItems(null);
          setActiveChecklistMetaData({});
        }}
        cancelButtonLabel="Close"
        closeOnScrimClick={false}
        primaryAction={
          <button
            className={CLASSES.buttonPrimary}
            onClick={() => {
              const storedChecklists: Checklist[] =
                getFromLocalStorage(STORAGE_KEYS.checklists) || [];
              const updatedChecklists = storedChecklists.map((list) => {
                if (list.id === activeChecklistMetaData?.id) {
                  return {
                    id: activeChecklistMetaData.id!,
                    name: activeChecklistMetaData.name!,
                    items: getFromLocalStorage(STORAGE_KEYS.activeChecklist),
                  };
                }
                return list;
              });

              saveToLocalStorage(STORAGE_KEYS.checklists, updatedChecklists);
              setAllChecklists(updatedChecklists);
              saveToLocalStorage(STORAGE_KEYS.activeChecklist, []);
              setIsDialogOpen(false);
              setActiveChecklistItems(null);
              setActiveChecklistMetaData({});
            }}
          >
            Save
          </button>
        }
        content={
          activeChecklistItems && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{activeChecklistMetaData.name}</h2>
                <button
                  onClick={() => {
                    const stored: Checklist[] =
                      getFromLocalStorage(STORAGE_KEYS.checklists) || [];
                    const updated = stored.filter(
                      (c) => c.id !== activeChecklistMetaData.id
                    );
                    saveToLocalStorage(STORAGE_KEYS.checklists, updated);

                    setAllChecklists(updated);
                    setActiveChecklistItems(null);
                    setIsDialogOpen(false);
                  }}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete Checklist
                </button>
              </div>

              <Todo
                storageKey={STORAGE_KEYS.activeChecklist}
                initialTodos={activeChecklistItems.items}
                isChecklist={true}
              />
            </div>
          )
        }
      />
    </>
  );
};

export default ChecklistPage;
