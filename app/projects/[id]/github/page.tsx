interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectGitHubPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-xl font-bold text-white">GitHub Integration & PRs: {id}</h1>
      <p className="text-sm text-slate-400">Branches, commits, and pull requests placeholder.</p>
    </div>
  );
}
