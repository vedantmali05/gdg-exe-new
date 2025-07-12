import { Fragment, useEffect, useRef, useState } from 'react';
import { CLASSES, STORAGE_KEYS } from '../../utils/constants';
import { formatDate } from '../../utils/dates';
import { saveToLocalStorage } from '../../utils/browserStorage';
import { toast, ToastContainer } from 'react-toastify';
import { dummyTimelineTasks } from '../../utils/data';
import TaskTimelineCard from './TaskTimelineCard';
import Dialog from '../../components/Dialog';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  assignedBy: string;
  assignedTo: string;
}

interface User {
  id: string;
  name: string;
}

const TaskTimeline: React.FC = () => {
  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const tasks = JSON.parse(localStorage.getItem(STORAGE_KEYS.timelineTasks) || '[]');
    return tasks || [];
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
    return users || [];
  });

  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const taskTitleRef = useRef<HTMLInputElement>(null);
  const taskDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const taskStartDateRef = useRef<HTMLInputElement>(null);
  const taskEndDateRef = useRef<HTMLInputElement>(null);
  const taskAssignedByRef = useRef<HTMLSelectElement>(null);
  const taskAssignedToRef = useRef<HTMLSelectElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (taskTitleRef.current) taskTitleRef.current.value = editingTask?.title || '';
    if (taskDescriptionRef.current) taskDescriptionRef.current.value = editingTask?.description || '';
    if (taskStartDateRef.current) taskStartDateRef.current.value = editingTask?.startDate || '';
    if (taskEndDateRef.current) taskEndDateRef.current.value = editingTask?.endDate || '';
    if (taskAssignedByRef.current) taskAssignedByRef.current.value = editingTask?.assignedBy || '';
    if (taskAssignedToRef.current) taskAssignedToRef.current.value = editingTask?.assignedTo || '';
  }, [isAddTaskDialogOpen]); // runs every time dialog opens

  // Get the most past startDate and most new endDate
  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const hasTasks = Array.isArray(allTasks) && allTasks.length > 0;

  let rawStart = hasTasks
    ? new Date(Math.min(...allTasks.map(task => new Date(task.startDate).getTime())))
    : firstOfMonth;

  let rawEnd = hasTasks
    ? new Date(Math.max(...allTasks.map(task => new Date(task.endDate).getTime())))
    : lastOfMonth;

  // ➕ Extend 3 days before and after
  rawStart.setDate(rawStart.getDate() - 3);
  rawEnd.setDate(rawEnd.getDate() + 3);

  const startDate = formatDate(rawStart);
  const endDate = formatDate(rawEnd);

  // Generate an array of dates from startDate to endDate
  const dateArray: string[] = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  while (currentDate <= end) {
    dateArray.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  useEffect(() => {
    const today = formatDate(new Date());
    const todayIndex = dateArray.indexOf(today);

    if (todayIndex !== -1 && scrollContainerRef.current) {
      const cellWidth = 265;
      const scrollOffset = todayIndex * cellWidth - scrollContainerRef.current.offsetWidth / 2 + cellWidth / 2;

      scrollContainerRef.current.scrollTo({
        left: scrollOffset,
        behavior: 'smooth',
      });
    }
  }, [allUsers]);

  function groupTasksForTimeline(tasks: Task[]): Task[][] {
    // Helper function to check if two tasks overlap
    function tasksOverlap(task1: Task, task2: Task): boolean {
      const start1 = new Date(task1.startDate);
      const end1 = new Date(task1.endDate);
      const start2 = new Date(task2.startDate);
      const end2 = new Date(task2.endDate);

      // Two ranges overlap if start1 <= end2 && start2 <= end1
      return start1 <= end2 && start2 <= end1;
    }

    // Sort tasks by start date for better placement
    const sortedTasks = tasks.slice().sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    const rows: Task[][] = [];

    for (const task of sortedTasks) {
      let placed = false;

      // Try to place the task in an existing row
      for (const row of rows) {
        const canPlaceInRow = row.every(existingTask => !tasksOverlap(task, existingTask));

        if (canPlaceInRow) {
          row.push(task);
          placed = true;
          break;
        }
      }

      // If task couldn't be placed in any existing row, create a new row
      if (!placed) {
        rows.push([task]);
      }
    }

    return rows;
  }

  function getTaskByStartDate(tasks: Task[], targetDate: string | Date): Task | undefined {
    // Convert targetDate to "YYYY-MM-DD" format for comparison
    const targetDateStr = typeof targetDate === 'string'
      ? targetDate
      : targetDate.toISOString().split('T')[0];

    // Find and return the task with matching start date
    return tasks.find(task => task.startDate === targetDateStr);
  }

  function getTimelineRow(taskArray: Task[]): JSX.Element[] {
    const rows: JSX.Element[] = [];
    let i = 0;

    while (i < dateArray.length) {
      let content: JSX.Element = <></>; // Initialize with an empty fragment
      let gridColSpan = 1;
      let styling: React.CSSProperties = { gridColumn: `span ${gridColSpan}` };
      const currentDate = dateArray[i]; // Get the current date for this iteration
      const task = getTaskByStartDate(taskArray, currentDate); // Find a task starting on the current date
      let className = "cell";

      if (task) {
        // Calculate span: difference between start and end date + 1
        const startDate = new Date(task.startDate);
        const endDate = new Date(task.endDate);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        gridColSpan = diffDays;

        styling = {
          gridColumn: `span ${gridColSpan}`,
          display: 'flex',
        };

        content = (
          <TaskTimelineCard
            data={task}
            onClick={() => {
              setEditingTask(task);
              setIsAddTaskDialogOpen(true);
            }}
          />
        ); // Use the TaskCard component
        // Skip the days covered by this task
        i += diffDays;
      } else {
        // No task, move to next day
        i++;
      }

      rows.push(
        <div
          className={className}
          key={`cell-${i}`}
          style={styling}
        >
          {content}
        </div>
      );
    }

    return rows;
  }

  const groupedTasks = groupTasksForTimeline(allTasks);

  function addNewTask(newTask: Task): void {
    const newTaskList = [...allTasks, newTask];
    saveToLocalStorage(STORAGE_KEYS.timelineTasks, newTaskList);
    setAllTasks(newTaskList);
  }

  function updateTask(updatedTask: Task): void {
    const updatedTaskList = allTasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );

    saveToLocalStorage(STORAGE_KEYS.timelineTasks, updatedTaskList);
    setAllTasks(updatedTaskList);
  }

  function deleteTask(taskId: number): void {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    const updatedTasks = allTasks.filter(task => task.id !== taskId);
    saveToLocalStorage(STORAGE_KEYS.timelineTasks, updatedTasks);
    setAllTasks(updatedTasks);
    setIsAddTaskDialogOpen(false);
    setEditingTask(null);
    toast.success('Task deleted successfully', {
      position: "bottom-left",
      autoClose: 2000,
    });
  }

  return (
    <>
      <section className='task-timeline'>
        {/* Header Section goes here */}
        <section className='flex flex-col md:flex-row items-start md:items-center justify-between p-4'>
          <div className='mb-2 md:mb-0'>
            <h2 className='text-2xl font-bold text-gray-800'>Event Tasks</h2>
            <p className='text-gray-600'>All GDG On Campus ongoing tasks....</p>
          </div>
          <button
            className='px-6 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75'
            onClick={() => setIsAddTaskDialogOpen(true)}
          >
            Add New Task
          </button>
        </section>

        {/* Timeline section */}
        <section
          ref={scrollContainerRef}
          className="overflow-x-auto border border-gray-200 rounded-2xl pb-2"
        >
          <div
            className="min-w-max grid bg-gray-50"
            style={{
              gridTemplateColumns: `repeat(${dateArray.length}, minmax(120px, 1fr))`,
              rowGap: '.4rem',
            }}
          >
            {/* Date Row */}
            {dateArray.map((date, index) => (
              <div
                key={index}
                className={`p-2 text-center min-w-65 text-sm font-medium border-r border-b border-gray-300
                  ${new Date(date).toDateString() === new Date().toDateString() ? 'bg-gray-300' : 'bg-gray-100'}`}
              >
                <div>
                  {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })},{' '}
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div>{new Date(date).toDateString() === new Date().toDateString() && <>(Today)</>}</div>
              </div>
            ))}

            {allTasks.length === 0 ? (
              <div className='cell sticky left-[50%] translate-x-[-50%] bg-white w-full min-h-20 flex items-center justify-center text-center'>
                You don't have any tasks. <br /> Add New Task to view here.
              </div>
            ) : (
              <></>
            )}

            {/* Task Rows */}
            {groupedTasks.map((taskGroup, rowIndex) => (
              <Fragment key={`row-${rowIndex}`}>
                {getTimelineRow(taskGroup)}
              </Fragment>
            ))}
          </div>
        </section>
      </section>
      {/* Add Task Dialog */}
      <Dialog
        isActive={isAddTaskDialogOpen}
        content={
          <div className='p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold'>
                {!editingTask ? (
                  <>➕ Add New Task</>
                ) : (
                  <>✏️ Edit Task</>
                )}
              </h3>
              {editingTask && (
                <button
                  className={`${CLASSES.buttonNegativeSecondary} ml-4`}
                  onClick={() => deleteTask(editingTask.id)}
                >
                  🗑️ Delete Task
                </button>
              )}
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Task Title</label>
                <input
                  type='text'
                  className={CLASSES.textInput}
                  placeholder='Enter task title'
                  required
                  ref={taskTitleRef}
                />
              </div>
              {editingTask && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex items-center gap-4">
                    {['pending', 'in progress', 'done'].map((status) => (
                      <label
                        key={status}
                        className="peer-checked-status relative"
                      >
                        <input
                          type="radio"
                          name="taskStatus"
                          value={status}
                          defaultChecked={editingTask.status === status}
                          onChange={() => (editingTask.status = status)}
                          className="hidden peer"
                        />
                        <div
                          className={`
                            px-3 py-1.5 rounded-full cursor-pointer border text-sm capitalize transition-colors
                            border-gray-300 bg-gray-100 text-gray-700
                          `}
                        >
                          {status}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Description</label>
                <textarea
                  className={CLASSES.textInput}
                  placeholder='Enter task description'
                  rows={3}
                  required
                  ref={taskDescriptionRef}
                ></textarea>
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Start Date</label>
                <input
                  type='date'
                  className={CLASSES.textInput}
                  required
                  ref={taskStartDateRef}
                  min={formatDate(new Date(new Date().setMonth(new Date().getMonth() - 2)), 'YYYY-MM-DD')}
                  max={formatDate(new Date(new Date().setMonth(new Date().getMonth() + 5)), 'YYYY-MM-DD')}
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>End Date</label>
                <input
                  type='date'
                  className={CLASSES.textInput}
                  required
                  ref={taskEndDateRef}
                  min={formatDate(new Date(new Date().setMonth(new Date().getMonth() - 2)), 'YYYY-MM-DD')}
                  max={formatDate(new Date(new Date().setMonth(new Date().getMonth() + 5)), 'YYYY-MM-DD')}
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Assigned By</label>
                <select
                  className={CLASSES.textInput}
                  required
                  ref={taskAssignedByRef}
                >
                  <option value=''>Select User</option>
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Assigned To</label>
                <select
                  className={CLASSES.textInput}
                  required
                  ref={taskAssignedToRef}
                >
                  <option value=''>Select User</option>
                  {allUsers.map((user) => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
              </div>
            </form>
          </div>
        }
        primaryAction={
          <button
            className={CLASSES.buttonPrimary}
            onClick={() => {
              const taskData: Task = {
                id: editingTask ? editingTask.id : Date.now(),
                title: taskTitleRef.current!.value,
                description: taskDescriptionRef.current!.value,
                status: editingTask ? editingTask.status : 'pending',
                startDate: taskStartDateRef.current!.value || formatDate(Date.now()),
                endDate: taskEndDateRef.current!.value || formatDate(Date.now()),
                assignedBy: taskAssignedByRef.current!.value,
                assignedTo: taskAssignedToRef.current!.value,
              };

              if (!taskData.title || !taskData.assignedBy || !taskData.assignedTo) {
                toast.error("Title, Assigned By, and Assigned To are mandatory", { position: "bottom-left", autoClose: 2000 });
                return;
              }

              if (new Date(taskData.endDate) < new Date(taskData.startDate)) {
                toast.error("End date cannot be before start date", { position: "bottom-left", autoClose: 2000 });
                return;
              }

              if (editingTask) {
                updateTask(taskData);
              } else {
                addNewTask(taskData);
              }

              setIsAddTaskDialogOpen(false);
              setEditingTask(null);
            }}
          >
            Save Task
          </button>
        }
        onCancel={() => {
          setIsAddTaskDialogOpen(false);
          setEditingTask(null);
        }}
        closeOnScrimClick={false}
      />
      <ToastContainer />
    </>
  );
};

export default TaskTimeline;
