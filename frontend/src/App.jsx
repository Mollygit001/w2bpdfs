import { useState } from "react";
import { ArrowDownToLine, UploadCloud } from "lucide-react";

function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("selected");
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("processing");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://w2bpdfs.onrender.com/convert", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to convert PDF");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `dark-${file.name}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setStatus("done");
    } catch (error) {
      console.error("Conversion error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4 font-sans">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6 border-4 border-white p-4 shadow-[8px_8px_0px_#00FF85]">
        PDF Dark Mode Converter
      </h1>

      <div className="w-full max-w-md bg-zinc-800 p-6 border-4 border-white shadow-[6px_6px_0px_#00FF85]">
        <label
          htmlFor="pdf-upload"
          className="flex flex-col items-center justify-center text-center border-2 border-dashed border-white py-10 px-4 cursor-pointer hover:bg-zinc-700 transition-all"
        >
          <UploadCloud className="w-10 h-10 mb-2 text-lime-400" />
          <span className="text-lg font-semibold">
            {file ? file.name : "Click or drag to upload PDF"}
          </span>
          <input
            type="file"
            id="pdf-upload"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || status === "processing"}
          className="w-full mt-4 py-2 bg-lime-400 text-black font-bold border-2 border-white shadow-[4px_4px_0px_#ffffff] hover:scale-105 transition-all"
        >
          {status === "processing" ? "Converting..." : "Convert to Dark Mode"}
        </button>

        {status === "done" && (
          <p className="mt-4 text-lime-400 text-center">✅ Converted & Downloaded!</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-red-500 text-center">❌ Error during conversion</p>
        )}
      </div>
    </div>
  );
}

export default App;
