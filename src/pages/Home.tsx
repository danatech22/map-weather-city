// src/pages/HomePage.tsx

import { Link } from "react-router";
import { ArrowRight, Briefcase, Code, Mail } from "lucide-react"; // For nice icons, run: npm install lucide-react

// --- You can replace this with your actual data ---
const userProfile = {
  name: "Shittu Temitope Daniel",
  title: "Frontend Developer",
  bio: "Passionate about building fast, accessible, and beautiful user interfaces. Turning complex problems into simple, elegant solutions. Currently exploring the power of server components and modern web APIs.",
  avatarUrl:
    "https://res.cloudinary.com/dvsqdnbmd/image/upload/v1689586348/uhu7otb9xoplit88kjzz.jpg",
  email: "danatech22@gmail.com",
  skills: [
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "Figma",
    "Node.js",
    "React Native",
  ],
};

export default function HomePage() {
  const skills: string[] = userProfile.skills;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 transition-colors duration-300">
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        {/* Main Profile Card */}
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl md:p-12">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left">
            {/* Profile Image */}
            <div className="mb-6 md:mb-0 md:mr-8">
              <img
                src={userProfile.avatarUrl}
                alt="Profile Picture"
                className="h-32 w-32 rounded-full border-4 border-blue-200 object-cover shadow-md"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900">
                {userProfile.name}
              </h1>
              <p className="mt-2 flex items-center justify-center gap-2 text-xl font-medium text-blue-600 md:justify-start">
                <Briefcase size={20} />
                {userProfile.title}
              </p>
              <a
                href={`mailto:${userProfile.email}`}
                className="mt-2 inline-flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600 md:justify-start"
              >
                <Mail size={16} />
                {userProfile.email}
              </a>
              <p className="mt-4 text-base text-gray-600">{userProfile.bio}</p>
            </div>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <h2 className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-700 md:justify-start">
              <Code size={24} />
              My Skills
            </h2>
            <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/cities/start"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Go to the Map With Weather City Project
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        <footer className="py-6 text-center text-sm text-gray-400">
          <p>
            Designed with ❤️ for my interview project.
            <br />
            Lagos, Nigeria |{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </footer>
      </main>
    </div>
  );
}
