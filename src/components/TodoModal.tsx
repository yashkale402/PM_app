"use client";

import React, { useState } from "react";

// Type definition for your todo items
type Todo = {
  id: number;
  priority: "high" | "medium" | "low";
  name: string;
  description: string;
  note: string;
  status: "active" | "rest" | "done";
  createdAt: string; // e.g. "2023-09-15"
};

export default function TodosPage() {
  // Mock data
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      priority: "low",
      name: "Design a To-Do list UI",
      description:
        "Description: Design a To-Do list UI featuring a form with fields for task name, description, note, priorities, status, as well as an 'Add To-Do' button. The design should have a modern aesthetic with a black theme.",
      note: "This is an example note.",
      status: "active",
      createdAt: "2023-09-15",
    },
    {
      id: 2,
      priority: "medium",
      name: "Design a To-Do list UI",
      description:
        "Description: Second example data for the 'Rest' category. Same requirements as above but with different priority.",
      note: "Some note here.",
      status: "rest",
      createdAt: "2023-09-10",
    },
    {
      id: 3,
      priority: "high",
      name: "Design a To-Do list UI",
      description:
        "Description: Third example data for the 'Done' category. Demonstrates a high priority task.",
      note: "Completed tasks can remain displayed.",
      status: "done",
      createdAt: "2023-09-01",
    },
  ]);

  // Form fields
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formStatus, setFormStatus] = useState<"active" | "rest" | "done">("active");
  const [formPriority, setFormPriority] = useState<"high" | "medium" | "low">("low");

  // Add a new todo item
  function handleAddTodo() {
    if (!formName) {
      alert("Name is required.");
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      priority: formPriority,
      name: formName,
      description: formDescription,
      note: formNote,
      status: formStatus,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTodos([...todos, newTodo]);
    // Reset form
    setFormName("");
    setFormDescription("");
    setFormNote("");
    setFormStatus("active");
    setFormPriority("low");
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Content container */}
      <main className="flex-grow px-5 md:px-40 py-5 w-full max-w-screen-xl mx-auto">
        <div className="w-full max-w-[512px]">
          <h1 className="text-4xl font-black mb-4">New to-do</h1>

          {/* Form */}
          <div className="mb-6">
            {/* Name */}
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Name</p>
              <input
                className="w-full rounded-xl bg-[#212121] border border-[#474747] text-white p-3 focus:outline-none"
                placeholder="Write a name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Description</p>
              <textarea
                className="w-full rounded-xl bg-[#212121] border border-[#474747] text-white p-3 focus:outline-none min-h-[100px]"
                placeholder="Write a description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            {/* Note */}
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Note</p>
              <textarea
                className="w-full rounded-xl bg-[#212121] border border-[#474747] text-white p-3 focus:outline-none min-h-[80px]"
                placeholder="Leave a note"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Status</p>
              <select
                className="w-full rounded-xl bg-[#212121] border border-[#474747] text-white p-3 focus:outline-none"
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value as "active" | "rest" | "done")}
              >
                <option value="active">Active</option>
                <option value="rest">Rest</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Priority */}
            <div className="mb-4">
              <p className="text-white text-base font-medium pb-2">Priority</p>
              <div className="flex gap-3">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    className="cursor-pointer accent-white"
                    name="priority"
                    checked={formPriority === "low"}
                    onChange={() => setFormPriority("low")}
                  />
                  <span className="text-white text-sm">Low</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    className="cursor-pointer accent-white"
                    name="priority"
                    checked={formPriority === "medium"}
                    onChange={() => setFormPriority("medium")}
                  />
                  <span className="text-white text-sm">Medium</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    className="cursor-pointer accent-white"
                    name="priority"
                    checked={formPriority === "high"}
                    onChange={() => setFormPriority("high")}
                  />
                  <span className="text-white text-sm">High</span>
                </label>
              </div>
            </div>

            {/* Add To-Do Button */}
            <button
              className="w-full bg-white text-black font-bold h-12 rounded-xl"
              onClick={handleAddTodo}
            >
              Add To-Do
            </button>
          </div>
        </div>

        {/* Display To-Dos by Status */}
        <TodoListSection title="Active" status="active" todos={todos} />
        <TodoListSection title="Rest" status="rest" todos={todos} />
        <TodoListSection title="Done" status="done" todos={todos} />
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-center justify-center py-8 text-center gap-5 border-t border-[#303030]">
        <div className="flex gap-6 text-[#ababab]">
          <a href="#" className="text-base">Help</a>
          <a href="#" className="text-base">Status</a>
          <a href="#" className="text-base">Privacy</a>
          <a href="#" className="text-base">Terms</a>
        </div>
        <p className="text-[#ababab] text-base">@2023 Task Manager</p>
      </footer>
    </div>
  );
}

// Display a list of to-dos for a given status
function TodoListSection({ title, status, todos }: { title: string; status: "active" | "rest" | "done"; todos: Todo[] }) {
  const list = todos.filter((t) => t.status === status);

  return (
    <div className="mt-10">
      <h2 className="text-white text-[22px] font-bold mb-3">{title}</h2>
      {list.map((todo) => (
        <div key={todo.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#141414] px-4 min-h-[72px] py-3 justify-between mb-3 rounded-lg border border-[#303030]">
          <div className="flex flex-col">
            <p className="text-sm text-gray-500 mb-1">#{todo.priority}</p>
            <p className="text-white text-base font-medium leading-normal">{todo.name}</p>
            <p className="text-[#ababab] text-sm leading-normal">
              {todo.description}
            </p>
            {todo.note && (
              <p className="text-[#666666] text-sm italic mt-1">
                Note: {todo.note}
              </p>
            )}
            <p className="text-[#666666] text-xs mt-1">Created: {todo.createdAt}</p>
          </div>
          <div className="shrink-0">
            <button className="bg-[#303030] text-white px-3 py-1 rounded-xl hover:bg-[#474747] transition">
              View
            </button>
          </div>
        </div>
      ))}
      {list.length === 0 && (
        <p className="text-gray-500">No {title.toLowerCase()} todos.</p>
      )}
    </div>
  );
}
