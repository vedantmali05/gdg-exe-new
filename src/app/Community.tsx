import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFromLocalStorage, saveToLocalStorage } from "../utils/browserStorage";
import { STORAGE_KEYS, CLASSES, USER_DOMAINS, USER_POSITIONS } from "../utils/constants";
import Dialog from "../components/Dialog";
import Header from "../components/Header";

// Types
interface User {
  id: string;
  name: string;
  position: string;
  domain: string;
}

interface GroupedUsers {
  Organizer: User[];
  "Core Committee": User[];
  Others: Record<string, User[]>;
}

interface SectionProps {
  title: string;
  users: User[];
  noMembersMessage: string;
  openEditDialog: (user: User) => void;
}

const groupUsers = (users: User[]): GroupedUsers => {
  const grouped: GroupedUsers = {
    Organizer: [],
    "Core Committee": [],
    Others: {},
  };

  users.forEach((user) => {
    if (user.domain === "Organizer") {
      grouped.Organizer.push(user);
    } else if (user.domain === "Core Committee") {
      grouped["Core Committee"].push(user);
    } else {
      if (!grouped.Others[user.domain]) {
        grouped.Others[user.domain] = [];
      }
      grouped.Others[user.domain].push(user);
    }
  });

  USER_DOMAINS.forEach((domain) => {
    if (domain !== "Organizer" && domain !== "Core Committee" && !grouped.Others[domain]) {
      grouped.Others[domain] = [];
    }
  });

  return grouped;
};

const Community: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [groupedUsers, setGroupedUsers] = useState<GroupedUsers | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", position: "", domain: "" });

  useEffect(() => {
    const storedUsers: User[] = getFromLocalStorage(STORAGE_KEYS.users) || [];
    setUsers(storedUsers);
    setGroupedUsers(groupUsers(storedUsers));
  }, []);

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, position: user.position, domain: user.domain });
    setIsDialogOpen(true);
  };

  const handleFormChange = (field: keyof typeof editForm, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!editForm.name.trim() || !editForm.position.trim() || !editForm.domain.trim()) {
      toast.error("Please fill in all required fields before saving.");
      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === selectedUser?.id ? { ...user, ...editForm } : user
    );
    setUsers(updatedUsers);
    saveToLocalStorage(STORAGE_KEYS.users, updatedUsers);
    setGroupedUsers(groupUsers(updatedUsers));
    setIsDialogOpen(false);
  };

  const handleDelete = () => {
    const updatedUsers = users.filter((user) => user.id !== selectedUser?.id);
    setUsers(updatedUsers);
    saveToLocalStorage(STORAGE_KEYS.users, updatedUsers);
    setGroupedUsers(groupUsers(updatedUsers));
    setIsDialogOpen(false);
  };

  if (!groupedUsers) return <p className="p-8 text-lg text-gray-600">Loading community members...</p>;

  return (
    <>
      <Header heading="Our GDG On Campus Community" />
      <div className="overflow-y-auto bg-gray-50 p-8">
        <Dialog
          isActive={isDialogOpen}
          onCancel={() => setIsDialogOpen(false)}
          cancelButtonLabel="Cancel"
          primaryAction={
            <button
              className={`${CLASSES.buttonPrimary} px-6 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200`}
              onClick={handleSave}
            >
              Save Changes
            </button>
          }
          content={
            <div className="space-y-5 p-2">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800">Edit User Info</h2>
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors duration-200 flex items-center space-x-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 3a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Delete User</span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    id="name"
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 text-gray-800"
                    type="text"
                    value={editForm.name}
                    onChange={(e) => handleFormChange("name", e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    id="position"
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-gray-800"
                    value={editForm.position}
                    onChange={(e) => handleFormChange("position", e.target.value)}
                  >
                    <option value="" disabled className="text-gray-400">Select Position</option>
                    {USER_POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <select
                    id="domain"
                    className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white text-gray-800"
                    value={editForm.domain}
                    onChange={(e) => handleFormChange("domain", e.target.value)}
                  >
                    <option value="" disabled className="text-gray-400">Select Domain</option>
                    {USER_DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>{domain}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Section
            title="Organizers"
            users={groupedUsers.Organizer}
            noMembersMessage="No members currently assigned as Organizers."
            openEditDialog={openEditDialog}
          />
          <Section
            title="Core Committee"
            users={groupedUsers["Core Committee"]}
            noMembersMessage="No members currently assigned to the Core Committee."
            openEditDialog={openEditDialog}
          />
          {USER_DOMAINS.filter(
            (domain) => domain !== "Organizer" && domain !== "Core Committee"
          ).map((domain) => (
            <Section
              key={domain}
              title={domain}
              users={groupedUsers.Others[domain]}
              noMembersMessage={`No active members in ${domain} domain currently.`}
              openEditDialog={openEditDialog}
            />
          ))}
        </div>
      </div>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

const Section: React.FC<SectionProps> = ({ title, users, noMembersMessage, openEditDialog }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
    <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-3">
      {title}
    </h2>
    {users?.length > 0 ? (
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-150 cursor-pointer group border border-gray-200"
            onClick={() => openEditDialog(user)}
          >
            <div className="flex flex-col">
              <span className="text-base font-medium text-gray-700">{user.name}</span>
              <span className="text-xs text-gray-500">{user.position}</span>
            </div>
            <span className="text-gray-400 text-sm opacity-100 group-hover:opacity-100 transition-opacity duration-200">
              Edit
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic text-sm p-3 bg-gray-50 rounded-md border border-gray-200">{noMembersMessage}</p>
    )}
  </div>
);

export default Community;
