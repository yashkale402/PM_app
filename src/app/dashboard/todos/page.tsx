"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import NavDashboard from "@/components/NavDashboard";

// Type for Todo
type Todo = {
  _id: string;
  priority: "high" | "medium" | "low";
  task: string;
  description: string;
  note: string;
  status: "active" | "rest" | "done";
  createdAt: string; // e.g. "2023-09-15"
  user: string; // Added user field
  id?: string; // For fallback
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formStatus, setFormStatus] = useState<"active" | "rest" | "done">("active");
  const [formPriority, setFormPriority] = useState<"high" | "medium" | "low">("low");
  const [modalTodo, setModalTodo] = useState<Todo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track which category is expanded
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchTodosFromDB();
  }, []);

  async function handleDeleteTodo(id: string) {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete todo");
      }

      // Remove deleted todo from state
      setTodos((prev) => prev.filter((t) => t._id !== id));

      // Close modal after deleting
      setModalTodo(null);

      // Show success message
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error deleting todo.");
    }
  }

  async function fetchTodosFromDB() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/todos/all");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch todos");
      }
      const data = await res.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Error fetching todos");
      toast.error(error instanceof Error ? error.message : "Error fetching todos.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddTodo() {
    if (!formName) {
      toast.error("Name is required.");
      return;
    }

    const body = {
      task: formName,
      description: formDescription,
      note: formNote,
      status: formStatus,
      priority: formPriority,
    };

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create todo.");
      }

      const data = await res.json();
      setTodos([data.todo, ...todos]);

      // Reset form and close modal
      resetForm();
      setShowAddModal(false);

      toast.success("Todo added successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Error creating todo.");
    }
  }

  function resetForm() {
    setFormName("");
    setFormDescription("");
    setFormNote("");
    setFormStatus("active");
    setFormPriority("low");
  }

  function getTodosByStatus(status: "active" | "rest" | "done") {
    return todos.filter((t) => t.status === status);
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col relative">
      <NavDashboard />
      <main className="flex-grow px-5 md:px-40 py-5 w-full max-w-screen-xl mx-auto">
        <div className="w-full max-w-7xl flex items-center justify-between">
          <h1 className="text-4xl font-black mb-4">To-Do List</h1>
          <button onClick={() => setShowAddModal(true)} className="bg-[#303030] text-white px-3 py-1 rounded-xl hover:bg-[#474747] transition">
            <span className="text-xl">Add To-Do</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <p className="text-gray-400">Loading your todo list...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-48">
            <div className="text-red-400 text-center">
              <p className="mb-2">{error}</p>
              <button 
                onClick={fetchTodosFromDB} 
                className="bg-[#303030] text-white px-3 py-1 rounded-xl hover:bg-[#474747] transition"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : todos.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-48">
            <p className="text-gray-400 mb-4">You don't have any todos yet.</p>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="bg-[#303030] text-white px-3 py-1 rounded-xl hover:bg-[#474747] transition"
            >
              Create Your First Todo
            </button>
          </div>
        ) : (
          /* Todo Lists */
          ["active", "rest", "done"].map((status) => (
            <TodoListSection
              key={status}
              title={status.charAt(0).toUpperCase() + status.slice(1)}
              status={status as "active" | "rest" | "done"}
              todos={getTodosByStatus(status as "active" | "rest" | "done")}
              expanded={expandedCategory === status}
              onExpand={() =>
                setExpandedCategory(expandedCategory === status ? null : status)
              }
              onView={(todo) => setModalTodo(todo)}
              totalCount={
                getTodosByStatus(status as "active" | "rest" | "done").length
              }
            />
          ))
        )}
      </main>

      {/* Todo View/Delete Modal */}
      {modalTodo && (
        <TodoModal
          todo={modalTodo}
          onClose={() => setModalTodo(null)}
          onDelete={(id) => handleDeleteTodo(id)}
        />
      )}

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Add New To-Do</h2>

            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Name</p>
              <input
                className="w-full rounded-xl bg-[#212121] border border-[#474747] text-white p-3"
                placeholder="Write a name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">
                Description
              </p>
              <textarea
                className="w-full rounded-xl bg-[#212121] border border-[#474747] text-white p-3 min-h-[100px]"
                placeholder="Write a description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Note</p>
              <textarea
                className="w-full rounded-xl bg-[#212121] border border-[#474747] text-white p-3 min-h-[80px]"
                placeholder="Leave a note"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Status</p>
              <select
                className="w-full rounded-xl bg-[#212121] border border-[#474747] text-white p-3"
                value={formStatus}
                onChange={(e) =>
                  setFormStatus(e.target.value as "active" | "rest" | "done")
                }
              >
                <option value="active">Active</option>
                <option value="rest">Rest</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Priority</p>
              <div className="flex gap-3">
                {["low", "medium", "high"].map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      className="cursor-pointer accent-white"
                      name="priority"
                      checked={formPriority === priority}
                      onChange={() =>
                        setFormPriority(priority as "low" | "medium" | "high")
                      }
                    />
                    <span className="text-white text-sm capitalize">
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
              >
                Close
              </button>
              <button
                className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200 transition"
                onClick={handleAddTodo}
              >
                Add To-Do
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);

  // Extract date in YYYY-MM-DD format
  const formattedDate = date.toISOString().split("T")[0];

  // Extract time in HH:MM AM/PM format
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // AM/PM format
  });

  return { formattedDate, formattedTime };
}

// The rest of the component remains the same
function TodoListSection({
  title,
  status,
  todos,
  expanded,
  onExpand,
  onView,
  totalCount,
}: {
  title: string;
  status: "active" | "rest" | "done";
  todos: Todo[];
  expanded: boolean;
  onExpand: () => void;
  onView: (todo: Todo) => void;
  totalCount: number;
}) {
  return (
    <div className="mt-10">
      <h2 className="text-white text-[22px] font-bold mb-3">{title}</h2>
      {todos.map((todo) => {
        const { formattedDate, formattedTime } = formatDateTime(todo.createdAt);

        return (
          <div
            key={todo._id || todo.id}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#141414] px-4 min-h-[72px] py-3 justify-between mb-3 rounded-lg border border-[#303030]"
          >
            <div className="flex flex-col">
              <p
                className={`text-sm ${
                  todo.priority === "low"
                    ? "text-green-600"
                    : todo.priority === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                } mb-1`}
              >
                #{todo.priority}
              </p>

              <p className="text-white text-2xl font-bold capitalize leading-normal">
                {todo.task}
              </p>
              {todo.note && (
                <p className="text-[#666666] text-sm italic mt-1">
                  Note: {todo.note}
                </p>
              )}
              <p className="text-[#666666] text-xs mt-1">
                Created: {formattedDate}
              </p>
              <p className="text-[#666666] text-xs mt-1">
                Time: {formattedTime}
              </p>
            </div>
            <div className="shrink-0">
              <button
                className="bg-[#303030] text-white px-3 py-1 rounded-xl hover:bg-[#474747] transition"
                onClick={() => onView(todo)}
              >
                View
              </button>
            </div>
          </div>
        );
      })}
      {todos.length === 0 && (
        <p className="text-gray-500">No {title.toLowerCase()} todos.</p>
      )}
      {totalCount > 2 && (
        <button
          className="text-blue-400 hover:underline"
          onClick={() => alert("Show all page")}
        >
          View More
        </button>
      )}
    </div>
  );
}

function TodoModal({
  todo,
  onClose,
  onDelete,
}: {
  todo: Todo;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const { formattedDate, formattedTime } = formatDateTime(todo.createdAt);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-2 capitalize">{todo.task}</h2>
        <p className="text-sm text-gray-300 mb-2">{todo.description}</p>
        {todo.note && (
          <p className="text-xs text-gray-500 italic mb-2">Note: {todo.note}</p>
        )}
        <p className="text-xs text-gray-500">Priority: {todo.priority}</p>
        <p className="text-xs text-gray-500">Status: {todo.status}</p>
        <p className="text-[#666666] text-xs mt-1">Created: {formattedDate}</p>
        <p className="text-[#666666] text-xs mt-1">Time: {formattedTime}</p>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={() => onDelete(todo._id || (todo.id as string))}
          >
            Delete
          </button>
          <button
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}