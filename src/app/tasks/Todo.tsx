
import { useEffect, useState, useCallback } from 'react';
import { CLASSES, ICONS, STORAGE_KEYS } from '../../utils/constants';
import { getFromLocalStorage, saveToLocalStorage } from "../../utils/browserStorage.js"
import { toast } from 'react-toastify';

interface User {
    name?: string;
}

interface TodoItem {
    id: number;
    title: string;
    completed: boolean;
    assignedTo?: string;
    assignedBy?: string;
}

interface ChecklistItem {
    id: string;
    name: string;
    items: TodoItem[];
}

interface TodoProps {
    storageKey: string;
    initialTodos?: (TodoItem | string)[];
    showAssignmentFields?: boolean;
    isAssistantChecklist?: boolean;
    isChecklist?: boolean;
    assistantChecklistName?: string;
    setAllChecklists?: (checklists: ChecklistItem[]) => void;
}

const Todo: React.FC<TodoProps> = ({
    storageKey,
    initialTodos = [],
    showAssignmentFields = false,
    isAssistantChecklist = false,
    isChecklist = false,
    assistantChecklistName = "Generated Checklist",
    setAllChecklists
}) => {
    const [todos, setTodos] = useState<(TodoItem | string)[]>(isAssistantChecklist ? initialTodos : []);

    const [newTodoTitle, setNewTodoTitle] = useState<string>('');
    const [newTodoAssignedTo, setNewTodoAssignedTo] = useState<string>('');
    const [newTodoAssignedBy, setNewTodoAssignedBy] = useState<string>('');

    const [isTitleInvalid, setIsTitleInvalid] = useState<boolean>(false);
    const [isAssignedToInvalid, setIsAssignedToInvalid] = useState<boolean>(false);
    const [isAssignedByInvalid, setIsAssignedByInvalid] = useState<boolean>(false);

    // Get users from localStorage
    const [users, setUsers] = useState<(User | string)[]>([]);

    useEffect(() => {
        if (!isAssistantChecklist) {
            try {
                const saved = getFromLocalStorage(storageKey);
                setTodos(saved ? saved : initialTodos);
            } catch {
                console.error(`Failed to parse todos from localStorage for key: ${storageKey}. Returning initial.`);
                setTodos(initialTodos);
            }
        }
        
        try {
            const savedUsers = getFromLocalStorage(STORAGE_KEYS.users) || [];
            setUsers(savedUsers);
        } catch (e) {
            console.error('Failed to load users from localStorage:', e);
            setUsers([]);
        }
    }, [storageKey, isAssistantChecklist]);

    useEffect(() => {
        if (isAssistantChecklist) {
            setTodos(initialTodos);
        }
    }, [initialTodos, isAssistantChecklist]);

    useEffect(() => {
        if (isAssistantChecklist) return;
        try {
            saveToLocalStorage(storageKey, todos);
        } catch (e) {
            console.error(`Failed to save todos for key: ${storageKey}:`, e);
        }
    }, [todos, storageKey, isAssistantChecklist]);

    const handleAddTodo = useCallback(() => {
        let isValid = true;
        setIsTitleInvalid(false);
        setIsAssignedToInvalid(false);
        setIsAssignedByInvalid(false);

        if (!newTodoTitle.trim()) {
            setIsTitleInvalid(true);
            isValid = false;
        }

        if (showAssignmentFields) {
            if (!newTodoAssignedTo.trim()) {
                setIsAssignedToInvalid(true);
                isValid = false;
            }
            if (!newTodoAssignedBy.trim()) {
                setIsAssignedByInvalid(true);
                isValid = false;
            }
        }

        if (isValid) {
            const newTodo: TodoItem = {
                id: Date.now(),
                title: newTodoTitle.trim(),
                completed: false,
            };

            if (showAssignmentFields) {
                newTodo.assignedTo = newTodoAssignedTo.trim();
                newTodo.assignedBy = newTodoAssignedBy.trim();
            }

            setTodos((prev) => [newTodo, ...prev]);
            setNewTodoTitle('');
            if (showAssignmentFields) {
                setNewTodoAssignedTo('');
                setNewTodoAssignedBy('');
            }
        } else {
            setTimeout(() => setIsTitleInvalid(false), 2000);
            if (showAssignmentFields) {
                setTimeout(() => setIsAssignedToInvalid(false), 2000);
                setTimeout(() => setIsAssignedByInvalid(false), 2000);
            }
        }
    }, [newTodoTitle, newTodoAssignedTo, newTodoAssignedBy, showAssignmentFields]);

    const handleDeleteTodo = useCallback((index: number) => {
        setTodos((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const toggleTodoCompletion = useCallback((index: number) => {
        if (isAssistantChecklist) return;
        setTodos((prev) => prev.map((todo, i) => {
            if (i !== index) return todo;
            if (typeof todo === 'string') return todo;
            return {
                ...todo,
                completed: !todo.completed
            };
        }));
    }, [isAssistantChecklist]);

    const handleInputKey = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTodo();
        }
        if ((e.target as HTMLElement).id === 'todo-title-input') setIsTitleInvalid(false);
        if ((e.target as HTMLElement).id === 'assigned-to-input') setIsAssignedToInvalid(false);
        if ((e.target as HTMLElement).id === 'assigned-by-input') setIsAssignedByInvalid(false);
    }, [handleAddTodo]);

    const renderTodoItem = useCallback((todo: TodoItem | string, index: number) => {
        const title = typeof todo === 'string' ? todo : todo?.title ?? '[Untitled]';

        return (
            <li
                key={index}
                className="flex items-center justify-between py-3 px-4 group hover:bg-gray-50 transition-colors duration-150"
            >
                <div
                    className="flex items-start gap-3 cursor-pointer w-full"
                    onClick={() => toggleTodoCompletion(index)}
                >
                    <input
                        type="checkbox"
                        id={`${storageKey}-todo-${index}`}
                        className="hidden cursor-pointer"
                        checked={typeof todo === 'object' ? todo.completed : false}
                        onChange={() => { toggleTodoCompletion(index) }}
                    />
                    <label
                        htmlFor={`${storageKey}-todo-${index}`}
                        className={`w-5 h-5 border-2 rounded flex cursor-pointer items-center justify-center flex-shrink-0 transition-all duration-200
                        border-gray-400
                        ${isAssistantChecklist && "border-gray-100"}
                        ${typeof todo === 'object' && todo.completed && 'bg-blue-500 border-blue-500'}`
                        }
                    >
                        {typeof todo === 'object' && todo.completed && ICONS.check}
                    </label>

                    <div className="flex flex-col">
                        <p className={`text-base ${typeof todo === 'object' && todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                            style={{ lineHeight: '18px' }}>
                            {title}
                        </p>
                        {typeof todo === 'object' && showAssignmentFields && (todo.assignedBy || todo.assignedTo) && (
                            <p className="text-sm text-gray-500 mt-1">
                                {todo.assignedBy && (
                                    <>
                                        Assigned By: <b className='font-semibold'>{todo.assignedBy}</b>
                                    </>
                                )}
                                {todo.assignedBy && todo.assignedTo && <span className="mx-1">·</span>}
                                {todo.assignedTo && (
                                    <>
                                        Assigned To: <b className='font-semibold'>{todo.assignedTo}</b>
                                    </>
                                )}
                            </p>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => handleDeleteTodo(index)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-2xl p-1 -mr-1 focus:outline-none focus:ring-2 focus:ring-red-200 rounded"
                    aria-label="Delete Todo"
                    title="Delete Todo"
                >
                    ❌
                </button>
            </li>
        );
    }, [handleDeleteTodo, toggleTodoCompletion, showAssignmentFields, storageKey]);

    return (
        <div className="max-w-xl mx-auto p-0 bg-white rounded-lg overflow-hidden border border-gray-200 font-sans text-gray-800">
            {isAssistantChecklist ? (
                <div className="flex gap-4 px-4 py-5 text-sm text-blue-700 bg-blue-50 border-b border-blue-200 font-medium">
                    <p className='w-full'>
                        AI Generated Checklist<br />
                        {todos.length !== 0 && 'You may remove unnecessary items now.'}
                    </p>
                    {todos.length !== 0 && (
                        <button
                            className={CLASSES.buttonPrimary}
                            onClick={() => {
                                if (!todos || todos.length === 0) return;

                                let formattedTodos = todos.map((item, index) => ({
                                    id: `${index + 1}`,
                                    title: typeof item === 'string' ? item : item.title,
                                    completed: false
                                }));

                                let allChecklists = getFromLocalStorage(STORAGE_KEYS.checklists) || [];
                                allChecklists.push({
                                    id: Date.now(),
                                    name: assistantChecklistName,
                                    items: formattedTodos
                                });

                                saveToLocalStorage(STORAGE_KEYS.checklists, allChecklists);
                                setTodos([]);
                                toast.success("Checklist saved successfully! 🎉", {
                                    position: "top-right"
                                });

                                if (setAllChecklists) setAllChecklists(allChecklists);
                            }}
                        >
                            Save
                        </button>
                    )}
                </div>
            ) : (
                <div className="flex flex-row sm:flex-row gap-2 p-4 border-b border-gray-200 items-start sm:items-end">
                    <div className="flex-1 flex flex-col gap-2">
                        <input
                            type="text"
                            id="todo-title-input"
                            placeholder="Add a new todo..."
                            className={`w-full px-4 py-2 text-base border ${isTitleInvalid ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 placeholder-gray-400 rounded-md`}
                            value={newTodoTitle}
                            onChange={(e) => setNewTodoTitle(e.target.value)}
                            onKeyDown={handleInputKey}
                        />
                        {showAssignmentFields && (
                            <div className="flex flex-col sm:flex-row gap-2">
                                <select
                                    id="assigned-to-input"
                                    className={`flex-1 px-4 py-2 text-sm border ${isAssignedToInvalid ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 rounded-md bg-white`}
                                    value={newTodoAssignedTo}
                                    onChange={(e) => setNewTodoAssignedTo(e.target.value)}
                                    onKeyDown={handleInputKey}
                                >
                                    <option value="">Select Assigned To</option>
                                    {users.map((user, index) => (
                                        <option key={index} value={(user as User).name || user as string}>
                                            {(user as User).name || user as string}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    id="assigned-by-input"
                                    className={`flex-1 px-4 py-2 text-sm border ${isAssignedByInvalid ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'} focus:outline-none focus:ring-2 rounded-md bg-white`}
                                    value={newTodoAssignedBy}
                                    onChange={(e) => setNewTodoAssignedBy(e.target.value)}
                                    onKeyDown={handleInputKey}
                                >
                                    <option value="">Select Assigned By</option>
                                    {users.map((user, index) => (
                                        <option key={index} value={(user as User).name || user as string}>
                                            {(user as User).name || user as string}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                    <button
                        className="w-fit px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-colors duration-200"
                        onClick={handleAddTodo}
                        aria-label="Add Todo"
                        title="Add Todo"
                    >
                        Add Todo
                    </button>
                </div>
            )}

            <ul className="divide-y divide-gray-200">
                {todos.length > 0 ? (
                    todos.map(renderTodoItem)
                ) : (
                    <li className="text-center text-gray-500 py-6 text-base italic">
                        {!isAssistantChecklist && !isChecklist && "Your todo list is empty. Add a new todo!"}
                        {isAssistantChecklist && !isChecklist && "Request Gemini for a checklist..."}
                        {!isAssistantChecklist && isChecklist && "Your checklist is empty. Add an item!"}
                    </li>
                )}
            </ul>
        </div>
    );
};

export default Todo;
