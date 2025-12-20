import { useEffect, useRef } from "react";
import { CLD_NAME } from "../../utils/cloudinary.config";
import { Upload } from "lucide-react";

const UploadWidget = ({ setPublicId }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    widgetRef.current = cloudinaryRef.current.createUploadWidget(
      {
        cloudName: CLD_NAME,
        uploadPreset: "sipekad",
      },
      function (err, res) {
        const { public_id: publicId, secure_url } = res.info;
        if (publicId) {
          setPublicId(secure_url);
        }
      }
    );
  }, [setPublicId]);

  return (
    <button
      className="bg-blue-500/50 py-1 rounded-md text-sm w-full mb-4 mt-4 cursor-pointer flex justify-center items-center gap-2"
      onClick={() => widgetRef.current.open()}
    >
      <div className="size-4">
        <Upload className="w-full h-full" />
      </div>
      <p>Update foto</p>
    </button>
  );
};

export default UploadWidget;
