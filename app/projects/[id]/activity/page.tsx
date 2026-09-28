interface PageProps {
  params: Promise<{ id: string }> | { id: string };
}

export default async function ProjectActivityPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-xl font-bold text-white">Project Activity Audit Trail: {id}</h1>
      <p className="text-sm text-slate-400">Chronological event history placeholder.</p>
    </div>
  );
}
