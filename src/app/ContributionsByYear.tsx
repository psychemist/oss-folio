"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  GitPullRequest,
  GitCommit,
  Star,
  ExternalLink,
  ChevronDown,
} from "lucide-react";

type PR = { title: string; url: string; createdAt: string };

type Contribution = {
  repo: string;
  owner: string;
  repoName: string;
  description: string;
  repoURL: string;
  stars: number;
  prsMerged: number;
  commits: number;
  lastContribution: string;
  prs?: PR[];
};

export default function ContributionsByYear({
  contributions,
  username,
}: {
  contributions: Contribution[];
  username: string;
}) {
  // Group by the year of each repo's most recent contribution.
  const byYear = contributions.reduce<Record<number, Contribution[]>>(
    (acc, repo) => {
      const year = new Date(repo.lastContribution).getFullYear();
      (acc[year] ||= []).push(repo);
      return acc;
    },
    {}
  );

  // Newest year first (2026 today; auto-advances to 2027 etc.).
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  // Only the newest year starts expanded; the rest are collapsed until clicked.
  const [expanded, setExpanded] = useState<Record<number, boolean>>(() =>
    years.length ? { [years[0]]: true } : {}
  );

  const toggle = (year: number) =>
    setExpanded((prev) => ({ ...prev, [year]: !prev[year] }));

  return (
    <div className="space-y-8">
      {years.map((year) => {
        const repos = byYear[year];
        const isOpen = !!expanded[year];
        return (
          <section key={year}>
            <button
              type="button"
              onClick={() => toggle(year)}
              aria-expanded={isOpen}
              className="w-full flex items-center gap-3 text-left mb-6 group"
            >
              <ChevronDown
                className={`w-5 h-5 text-neutral-500 transition-transform ${
                  isOpen ? "rotate-0" : "-rotate-90"
                }`}
              />
              <h2 className="text-2xl font-bold flex items-center gap-3">
                {year}
                <span className="text-sm font-medium text-neutral-500 bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 rounded-full">
                  {repos.length}{" "}
                  {repos.length === 1 ? "project" : "projects"}
                </span>
              </h2>
            </button>

            {isOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {repos.map((repo, idx) => (
                  <RepoCard key={idx} repo={repo} username={username} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function RepoCard({
  repo,
  username,
}: {
  repo: Contribution;
  username: string;
}) {
  return (
    <div className="group p-6 bg-neutral-900 border border-neutral-800 rounded-xl hover:border-neutral-600 transition-colors flex flex-col h-full">
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
      <div className="mb-6 flex-grow">
        <p className="text-neutral-400 text-sm line-clamp-3 break-words">
          {repo.description || "No description provided."}
        </p>
      </div>

      {/* PR Links */}
      {repo.prs && repo.prs.length > 0 && (
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Merged PRs
          </h4>
          <ul className="space-y-1.5">
            {repo.prs.slice(0, 3).map((pr, i) => (
              <li key={i} className="flex items-start gap-2">
                <GitPullRequest className="w-3.5 h-3.5 mt-0.5 text-purple-500 shrink-0" />
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
            {repo.prs.length > 3 && (
              <li className="text-xs pt-1">
                <a
                  href={`https://github.com/${repo.owner}/${repo.repoName}/pulls?q=is:pr+is:merged+author:${username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  + {repo.prs.length - 3} more
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
  );
}
