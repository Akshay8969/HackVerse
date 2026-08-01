const Loader = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <div className={`${sizes[size]} border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin`} />
      {text && <p className="text-gray-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
};

export default Loader;
