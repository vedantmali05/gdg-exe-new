
import { useState, useEffect } from 'react';
import PrivateTodo from './PrivateTodo';
import PublicTodo from './PublicTodo';
import TaskTimeline from './TaskTimeline';
import Header from '../../components/Header';
import Tabs from '../../components/Tabs';
import { getFromLocalStorage } from '../../utils/browserStorage';
import { CLASSES, STORAGE_KEYS } from '../../utils/constants';

interface Tab {
  id: string;
  label: string;
}

const TaskPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('timeline');
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        const savedTab = getFromLocalStorage(STORAGE_KEYS.activeTaskPageTab) || 'timeline';
        setActiveTab(savedTab);
        setIsClient(true);
    }, []);

    // Define your tabs data
    const taskTabs: Tab[] = [
        { id: 'timeline', label: 'Task Timeline' },
        { id: 'public', label: 'Public Todo' },
        { id: 'private', label: 'Private Todo' },
    ];

    const renderTabContent = (): JSX.Element => {
        switch (activeTab) {
            case 'timeline':
                return <TaskTimeline />;
            case 'public':
                return <PublicTodo />;
            case 'private':
                return <PrivateTodo />;
            default:
                return <TaskTimeline />;
        }
    };
    
    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Header />
            <section className={CLASSES.mainSec}>
                <div className="w-full bg-gray-50">
                    {/* Use the reusable Tabs component */}
                    <Tabs
                        tabs={taskTabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Tab Content */}
                    <div className='tab-content px-4 overflow-auto h-auto pb-28'>
                        {renderTabContent()}
                    </div>
                </div>
            </section>
        </>
    );
}

export default TaskPage;
