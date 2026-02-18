const IframeRequest = ({ url, className }) => {
  return (
    <div
      className={`rounded-lg overflow-hidden shadow-sm bg-white border border-gray-200 ${className}`}
    >
      <iframe
        src={url}
        title="Preview PDF"
        width="100%"
        height="100%"
        className="block min-h-[500px]"
      ></iframe>
    </div>
  );
};

export default IframeRequest;
