import data from "@/data/contributions.json";
import { format } from "date-fns";
import {
  GitPullRequest,
  GitCommit,
  Star,
  FolderOpen,
  Calendar,
  ExternalLink,
} from "lucide-react";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Home() {
  const { username, generatedAt, summary, contributions } = data;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-800 pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight flex items-center gap-4">
              <GithubIcon className="w-10 h-10 text-neutral-400" />
              {username}'s Open Source Portfolio
            </h1>
            <p className="text-neutral-400 mt-2 text-lg">
              A comprehensive view of my open-source contributions and impact.
            </p>
          </div>
          <div className="text-sm text-neutral-500 flex items-center gap-2 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
            <Calendar className="w-4 h-4" />
            Last updated: {format(new Date(generatedAt), "MMM d, yyyy")}
          </div>
        </header>

        {/* Summary Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Projects"
            value={summary.totalProjects}
            icon={<FolderOpen className="w-6 h-6 text-blue-400" />}
          />
          <MetricCard
            title="Total PRs Merged"
            value={summary.totalPRsMerged}
            icon={<GitPullRequest className="w-6 h-6 text-green-400" />}
          />
          <MetricCard
            title="Total Commits"
            value={summary.totalCommits}
            icon={<GitCommit className="w-6 h-6 text-purple-400" />}
          />
        </section>

        {/* Contributions List */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Recent Contributions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions.map((repo, idx) => (
              <div
                key={idx}
                className="group p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-600 transition-colors flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <a
                    href={repo.repoURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-semibold text-blue-400 hover:text-blue-300 transition-colors break-words flex items-center gap-2"
                  >
                    {repo.repoName}
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <div className="flex items-center gap-1 text-sm text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4" />
                    {repo.stars}
                  </div>
                </div>

                <p className="text-neutral-400 text-sm mb-6 flex-grow line-clamp-3">
                  {repo.description || "No description provided."}
                </p>

                {/* PR Links */}
                {(repo as any).prs && (repo as any).prs.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Merged PRs</h4>
                    <ul className="space-y-1.5">
                      {(repo as any).prs.slice(0, 3).map((pr: any, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <GitPullRequest className="w-3.5 h-3.5 mt-0.5 text-green-500 shrink-0" />
                          <a
                            href={pr.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-neutral-300 hover:text-neutral-100 hover:underline line-clamp-1"
                            title={pr.title}
                          >
                            {pr.title}
                          </a>
                        </li>
                      ))}
                      {(repo as any).prs.length > 3 && (
                        <li className="text-xs pt-1">
                          <a
                            href={`https://github.com/${repo.owner}/${repo.repoName}/pulls?q=is:pr+is:merged+author:${username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                          >
                            + {(repo as any).prs.length - 3} more
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-auto border-t border-neutral-800 pt-4 flex items-center justify-between text-sm text-neutral-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1" title="Merged PRs">
                      <GitPullRequest className="w-4 h-4" />
                      {repo.prsMerged}
                    </span>
                    <span className="flex items-center gap-1" title="Commits">
                      <GitCommit className="w-4 h-4" />
                      {repo.commits}
                    </span>
                  </div>
                  <span className="text-xs">
                    {format(new Date(repo.lastContribution), "MMM yyyy")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex items-center gap-4">
      <div className="p-4 bg-neutral-800/50 rounded-xl">{icon}</div>
      <div>
        <h3 className="text-neutral-400 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold text-neutral-50 mt-1">{value}</p>
      </div>
    </div>
  );
}
