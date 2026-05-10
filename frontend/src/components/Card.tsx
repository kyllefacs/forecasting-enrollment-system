export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">

      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {title}
      </h2>

      {children}

    </div>
  );
}