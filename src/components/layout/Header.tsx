interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export function Header({ title, onBack }: HeaderProps) {
  return (
    <div className="navbar bg-base-100 sticky top-0 z-10">
      {onBack && (
        <div className="navbar-start">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>
      )}
      <div className={onBack ? 'navbar-center' : 'navbar-start'}>
        <span className="text-lg font-bold">{title}</span>
      </div>
    </div>
  );
}
