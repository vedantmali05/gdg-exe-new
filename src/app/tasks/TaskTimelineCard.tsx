import React from 'react';
import { dummyUsers } from '../../utils/data'; // Adjust the path as per your project structure
import { formatDate } from '../../utils/dates';

interface TaskData {
    id: string | number;
    title: string;
    description?: string;
    status: string;
    startDate: string | Date;
    endDate: string | Date;
    assignedTo: string | number;
    assignedBy: string | number;
}

interface TaskTimelineCardProps {
    data: TaskData;
    [key: string]: any; // For the rest props
}

const TaskTimelineCard: React.FC<TaskTimelineCardProps> = ({ data, ...rest }) => {
    const {
        id,
        title,
        description,
        status,
        startDate,
        endDate,
        assignedTo,
        assignedBy,
    } = data;

    // Find assignee and creator names from dummyUsers
    const assignedToName = dummyUsers.find(user => user.id === assignedTo);
    const assignedByName = dummyUsers.find(user => user.id === assignedBy);

    let statusClasses = '';
    switch (status.toLowerCase()) {
        case 'pending':
            statusClasses = 'bg-yellow-50 text-yellow-800';
            break;
        case 'in progress':
            statusClasses = 'bg-blue-50 text-blue-800';
            break;
        case 'done':
            statusClasses = 'bg-green-50 text-green-800';
            break;
        default:
            statusClasses = 'bg-blue-50 text-blue-800'; // Default to in-progress style
    }


    return (
        <div
            className="
            w-full
        relative
        bg-white
        rounded-lg
        shadow-sm
        p-4
        border
        border-yellow-300
        grid
        gap-4
        items-start
        cursor-pointer
        hover:bg-gray-50
        hover:scale-101
      "
      {...rest}
        >
            {/* Sticky Left Content */}
            <div className="flex flex-col space-y-1 sticky left-2 w-fit">
                <h3 className="font-semibold text-gray-800 text-lg">
                    {title || "Untitled Task"}
                </h3>
                <div className='flex items-center space-x-2'>
                    <p className="text-sm text-gray-600 mb-0">
                        {formatDate(startDate, "Mon dd")} <>&rarr;</> {formatDate(endDate, "Mon dd")}
                    </p>
                    <span
                        className={`${statusClasses}  block w-fit px-3 py-1 text-xs font-semibold rounded-full capitalize whitespace-nowrap`}
                    >
                        {status}
                    </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    <b>{assignedByName ? assignedByName.name : 'Unknown'}</b> assigned <b>{assignedToName ? assignedToName.name : 'Unknown'}</b>
                </p>
            </div>
        </div>

    );
};

export default TaskTimelineCard;