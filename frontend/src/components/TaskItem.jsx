import { useState } from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleToggle = async () => {
    if (isToggling) return;
    setIsToggling(true);
    try {
      await onToggle(task.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const isCompleted = task.status === 'completed';

  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 animate-slide-in
        ${isCompleted
          ? 'bg-ink-800/40 border-ink-700/50'
          : 'bg-ink-800 border-ink-600 hover:border-amber-400/30'
        }`}
    >
      {/* Checkbox / toggle button */}
      <button
        onClick={handleToggle}
        disabled={isToggling}
        aria-label={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400/40
          ${isCompleted
            ? 'bg-sage-500 border-sage-500'
            : 'border-ink-600 hover:border-amber-400 bg-transparent'
          }
          ${isToggling ? 'opacity-50' : ''}`}
      >
        {isCompleted && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Task title */}
      <span
        className={`flex-1 text-sm font-body transition-all duration-300 min-w-0 break-words
          ${isCompleted ? 'line-through text-gray-500' : 'text-gray-100'}`}
      >
        {task.title}
      </span>

      {/* Status badge */}
      <span
        className={`flex-shrink-0 text-xs font-mono px-2.5 py-1 rounded-full hidden sm:block
          ${isCompleted
            ? 'bg-sage-500/15 text-sage-400'
            : 'bg-amber-400/10 text-amber-400'
          }`}
      >
        {isCompleted ? 'done' : 'pending'}
      </span>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Delete task"
        className={`flex-shrink-0 opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg
          flex items-center justify-center text-gray-600 hover:text-blush-400
          hover:bg-blush-500/10 transition-all duration-200 focus:opacity-100
          focus:outline-none focus:ring-2 focus:ring-blush-500/30
          ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isDeleting ? (
          <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
          </svg>
        ) : (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default TaskItem;
