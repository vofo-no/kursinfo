export default function CoursesTableSkeleton() {
  return (
    <div
      className="overflow-x-auto print:overflow-x-visible relative animate-pulse"
      role="status"
    >
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>

      <span className="sr-only">Laster...</span>
    </div>
  );
}
