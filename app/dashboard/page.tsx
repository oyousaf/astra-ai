"use client";

import JobList from "./components/JobList";
import ProtectedRoute from "../components/ProtectedRoute";
import LogoutButton from "../components/LogoutButton";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="p-6 max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-6 border-b border-accent pb-4">
          <h1 className="w-full text-light text-3xl font-bold">📂 Job Tracker</h1>
          <LogoutButton />
        </header>

        <JobList />
      </main>
    </ProtectedRoute>
  );
}
