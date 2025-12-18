const IframeRequest = ({ url, className }) => {
  return (
    <div className={`mt-6 border border-slate-300 rounded-lg overflow-hidden shadow-sm ${className}`}>
      <iframe
        src={url}
        title="Preview PDF"
        width="100%"
        height="500px"
        className="rounded-md"
      ></iframe>
    </div>
  );
};

export default IframeRequest;
