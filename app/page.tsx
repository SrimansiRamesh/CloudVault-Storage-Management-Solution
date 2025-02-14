import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to the Next.js Authentication App</h1>
      <div className="flex space-x-4">
        <a href="/sign-in" className="text-blue-500 hover:underline">Sign In</a>
        <a href="/sign-up" className="text-blue-500 hover:underline">Sign Up</a>
      </div>
    </main>
  );
}
