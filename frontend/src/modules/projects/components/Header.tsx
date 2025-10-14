export const Header = () => {
  return (
    <header className="flex items-center justify-between border-b border-base-200 bg-base-200/40 px-6 py-4">
      <h1 className="text-2xl font-semibold">Test project</h1>
      <div className="flex items-center gap-2">
        <div className="avatar placeholder">
          <div className="w-8 rounded-full bg-primary text-sm font-semibold text-primary-content">
            A
          </div>
        </div>
      </div>
    </header>
  );
};
