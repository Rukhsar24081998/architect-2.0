interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectSettingsPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-xl font-bold text-white">Project Settings: {id}</h1>
      <p className="text-sm text-slate-400">General settings and danger zone placeholder.</p>
    </div>
  );
}
