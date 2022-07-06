import { useRef, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = "https://test-storage-upload.herokuapp.com";

const DROP_ZONE_ID = "DropZone";

const ImageUploader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string[]>([]);
  const [file, setFile] = useState<null | File>();
  const [isDroppingFile, setIsDroppingFile] = useState(false);

  const fileIn = useRef<null | HTMLInputElement>(null);
  const dropZoneRef = useRef<null | HTMLDivElement>(null);

  const addFile = (event: any) => {
    let newFile = event.target.files;
    if (newFile.length !== 0) {
      event.target.file = undefined;
      setFile(newFile[0]);
    }
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDroppingFile(false);
  };

  const handleDragIn = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDroppingFile(true);
  };

  const handleDrag = (event: DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isDroppingFile) setIsDroppingFile(true);
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDroppingFile(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  useEffect(() => {
    const tempZoneRef = dropZoneRef?.current;
    if (tempZoneRef) {
      tempZoneRef.addEventListener("dragenter", handleDragIn);
      tempZoneRef.addEventListener("dragleave", handleDragOut);
      tempZoneRef.addEventListener("dragover", handleDrag);
      tempZoneRef.addEventListener("drop", handleDrop);
    }

    return () => {
      tempZoneRef?.removeEventListener("dragenter", handleDragIn);
      tempZoneRef?.removeEventListener("dragleave", handleDragOut);
      tempZoneRef?.removeEventListener("dragover", handleDrag);
      tempZoneRef?.removeEventListener("drop", handleDrop);
    };
  }, []);

  const fileInfo = file ? (
    <div>
      <span className="mr-1">{file.name}</span>
      <span>({Math.round(file.size / 1000)} kb)</span>
    </div>
  ) : null;

  const deploy = () => {
    if (!file) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    axios
      .post("/file-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setFile(null);
        setUploadedImage([...uploadedImage, res.data.url]);
      })
      .catch((err) => console.log("ERROR", err));

    setIsLoading(false);
  };

  return (
    <div
      className={
        isLoading
          ? "md:mx-6 cursor-not-allowed opacity-50 pointer-events-none"
          : "md:mx-6"
      }
    >
      <div className="relative h-40">
        <div
          id={DROP_ZONE_ID}
          ref={dropZoneRef}
          className={[
            "w-full h-full absolute top-0 rounded",
            isDroppingFile
              ? "bg-dropzone-active opacity-90 cursor-copy z-10"
              : "bg-dropzone",
          ].join(" ")}
        >
          <div
            className={[
              "border-2 rounded shadow-sm flex justify-between items-center relative px-3 h-40",
              file ? "" : "border-dashed",
              isDroppingFile || file ? "border-blue-300" : "",
            ].join(" ")}
          >
            <div className="flex justify-center items-center w-full text-sm md:text-lg whitespace-nowrap">
              {file ? fileInfo : <p>Drag and drop your file here</p>}
              <span>, or</span>
              <button
                className="text-blue-400 ml-1"
                onClick={() => fileIn.current?.click()}
              >
                browse
              </button>
            </div>

            <input
              ref={fileIn}
              className="hidden"
              type="file"
              id="file=upload"
              key="file=upload"
              onChange={addFile}
              multiple={false}
            />
          </div>
        </div>
      </div>

      {file && (
        <div className="flex justify-end mt-3">
          <button
            disabled={isLoading}
            className="text-xs text-white font-bold uppercase rounded px-3 py-1 bg-red-500 hover:bg-red-600 mr-2"
            onClick={() => setFile(null)}
          >
            discard
          </button>
          <button
            disabled={isLoading}
            className="text-xs text-white font-bold uppercase rounded px-3 py-1 bg-green-500 hover:bg-green-600"
            onClick={deploy}
          >
            upload
          </button>
        </div>
      )}

      {uploadedImage.length ? (
        <div className="mt-6">
          {uploadedImage.map((image) => (
            <div>
              <a target="_blank" href={image} className="text-blue-400">
                {image}
              </a>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageUploader;
