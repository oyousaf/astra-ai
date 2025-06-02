import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col px-4 sm:px-8 mx-auto items-center justify-center min-h-screen bg-gradient-to-br from-[#d8b4fe] via-accent/40 to-[#facc15]/20">
      <Image
        src="/logo.svg"
        alt="Astra AI Logo"
        width={300}
        height={150}
        className="mb-6 drop-shadow-lg"
      />
      <h1 className="text-5xl font-extrabold mb-3 text-center">
        Track Every Application.
        <br /> Land Your Dream Job.
      </h1>
      <p className="text-lg text-white mb-8 text-center max-w-xl">
        <br />
        Empower your career trajectory with Astra AI—a sophisticated,
        intelligent job application tracker designed to streamline your search,
        elevate your organisational capabilities, and ensure you seize every
        professional opportunity. Harness AI-driven insights and enjoy seamless
        management of your applications, all within an intuitively crafted
        platform.
      </p>
      <div className="flex gap-4 mb-10">
        <Link href="/login">
          <button className="px-6 py-2 rounded-xl bg-violet-700 hover:bg-violet-600 text-white font-bold shadow transition cursor-pointer">
            Log In
          </button>
        </Link>
        <Link href="/register">
          <button className="px-6 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold shadow transition cursor-pointer">
            Register
          </button>
        </Link>
      </div>
      <div className="flex flex-wrap gap-6 justify-center mt-8">
        <div className="px-4 py-2 rounded-lg bg-white/80 font-semibold shadow">
          🔔 Automated intelligent reminders
        </div>
        <div className="px-4 py-2 rounded-lg bg-white/80 text-secondary font-semibold shadow">
          📝 Personalised notes & dynamic application statuses
        </div>
        <div className="px-4 py-2 rounded-lg bg-white/80 text-accent font-semibold shadow">
          🔒 Robust privacy, secure storage, and AI-empowered analytics
        </div>
      </div>
    </main>
  );
}
