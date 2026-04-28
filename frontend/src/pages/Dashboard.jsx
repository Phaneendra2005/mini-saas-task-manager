import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';
import api from '../services/api';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed'

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get('/api/tasks');
      setTasks(data.tasks);
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    const title = newTitle.trim();
    if (!title) {
      setError('Task title cannot be empty.');
      return;
    }
    if (title.length > 500) {
      setError('Task title must be 500 characters or fewer.');
      return;
    }

    setError('');
    setAdding(true);

    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = { id: tempId, title, status: 'pending', createdAt: new Date().toISOString() };
    setTasks((prev) => [optimisticTask, ...prev]);
    setNewTitle('');

    try {
      const { data } = await api.post('/api/tasks', { title });
      setTasks((prev) => prev.map((t) => (t.id === tempId ? data.task : t)));
    } catch (err) {
      // Rollback optimistic update
      setTasks((prev) => prev.filter((t) => t.id !== tempId));
      setNewTitle(title);
      showToast(err.response?.data?.error || 'Failed to create task.');
    } finally {
      setAdding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTask();
  };

  const handleToggle = async (id) => {
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t
      )
    );
    try {
      const { data } = await api.patch(`/api/tasks/${id}`);
      setTasks((prev) => prev.map((t) => (t.id === id ? data.task : t)));
    } catch (err) {
      // Rollback
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t
        )
      );
      showToast(err.response?.data?.error || 'Failed to update task.');
    }
  };

  const handleDelete = async (id) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    // Optimistic update
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await api.delete(`/api/tasks/${id}`);
    } catch (err) {
      // Rollback
      if (taskToDelete) setTasks((prev) => [taskToDelete, ...prev]);
      showToast(err.response?.data?.error || 'Failed to delete task.');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h2 className="font-display text-4xl font-semibold text-gray-100">
            My Tasks
          </h2>
          <p className="font-body text-sm text-gray-500 mt-1">
            {tasks.length === 0
              ? 'No tasks yet — add one below'
              : `${pendingCount} pending · ${completedCount} completed`}
          </p>
        </div>

        {/* Add task input */}
        <div className="flex gap-3 mb-6 animate-fade-in">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => { setNewTitle(e.target.value); setError(''); }}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task… (press Enter)"
              maxLength={500}
              disabled={adding}
              className={`input-field pr-12 ${error ? 'border-blush-500/70 focus:border-blush-400 focus:ring-blush-400/20' : ''}`}
            />
            {newTitle && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-600">
                {newTitle.length}/500
              </span>
            )}
          </div>
          <button
            onClick={handleAddTask}
            disabled={adding || !newTitle.trim()}
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            {adding ? (
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
            Add
          </button>
        </div>

        {/* Inline input error */}
        {error && (
          <p className="text-xs text-blush-400 font-body mb-4 -mt-2 pl-1 animate-scale-in">{error}</p>
        )}

        {/* Filter tabs */}
        {tasks.length > 0 && (
          <div className="flex gap-1 mb-5 p-1 bg-ink-800 rounded-xl w-fit border border-ink-700">
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-body font-medium capitalize transition-all duration-200
                  ${filter === f
                    ? 'bg-amber-400 text-ink-950'
                    : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                {f}
                {f === 'all' && tasks.length > 0 && (
                  <span className={`ml-1.5 ${filter === f ? 'opacity-60' : 'opacity-40'}`}>
                    {tasks.length}
                  </span>
                )}
                {f === 'pending' && pendingCount > 0 && (
                  <span className={`ml-1.5 ${filter === f ? 'opacity-60' : 'opacity-40'}`}>
                    {pendingCount}
                  </span>
                )}
                {f === 'completed' && completedCount > 0 && (
                  <span className={`ml-1.5 ${filter === f ? 'opacity-60' : 'opacity-40'}`}>
                    {completedCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Task list */}
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <svg className="animate-spin text-amber-400" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <span className="text-sm font-body text-gray-600">Loading your tasks…</span>
              </div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-700 flex items-center justify-center mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-600">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                  <rect x="9" y="3" width="6" height="4" rx="1" />
                </svg>
              </div>
              <p className="font-display text-lg text-gray-500">
                {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
              </p>
              <p className="font-body text-sm text-gray-600 mt-1">
                {filter === 'all' ? 'Add your first task above' : 'Switch to a different filter'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl
            border animate-slide-in z-50 max-w-sm
            ${toast.type === 'error'
              ? 'bg-blush-500/15 border-blush-500/30 text-blush-300'
              : 'bg-sage-500/15 border-sage-500/30 text-sage-300'
            }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
            {toast.type === 'error' ? (
              <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
            ) : (
              <><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></>
            )}
          </svg>
          <span className="text-xs font-body">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-current opacity-50 hover:opacity-100">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
