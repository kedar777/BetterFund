import React, { useState } from "react";
import axios from "axios";

const MultiFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files)); // convert FileList to Array
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setStatus("Please select files");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/api/files/multi-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setStatus(response.data);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
    }
  };

  return (
    <div className="p-4 border rounded w-96 mx-auto">
      <input type="file" multiple onChange={handleFileChange} />
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded"
        onClick={handleUpload}
      >
        Upload Files
      </button>
      <p className="mt-2">{status}</p>
    </div>
  );
};

export default MultiFileUpload;
