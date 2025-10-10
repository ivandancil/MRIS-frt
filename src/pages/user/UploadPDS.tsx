import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import { useState } from "react";
import Tesseract from "tesseract.js";
import Header from "../../components/Header";

function UploadPDS() {
  const [_, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadResponse, setUploadResponse] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    processImage(file);
    resizeImage(file);
  };

  const resizeImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 400;
        const maxHeight = 400;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);

        const resizedDataUrl = canvas.toDataURL("image/jpeg");
        setPreviewUrl(resizedDataUrl);

        // Convert base64 to blob and upload
        fetch(resizedDataUrl)
          .then(res => res.blob())
          .then(blob => {
            const resizedFile = new File([blob], file.name, { type: "image/jpeg" });
            uploadToServer(resizedFile);
          });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processImage = (file: File) => {
    setLoading(true);
    Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setText(text);
      })
      .catch((err) => {
        console.error("OCR failed:", err);
        setText("❌ OCR failed. Try a clearer image.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const uploadToServer = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8000/api/upload-pds", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setUploadResponse(data);
    } catch (err) {
      console.error("Upload failed:", err);
      setUploadResponse({ error: "Upload failed" });
    }
  };

  return (
    <Box sx={{ padding: "20px" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Upload Scanned Document"
          subtitle="Extract text using OCR and upload securely."
        />
      </Box>

      <Paper 
        sx={{ 
          padding: "24px", 
          maxWidth: "900px", 
          margin: "20px auto" 
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: "20px" }}
        />

        {loading && (
          <Box display="flex" alignItems="center" gap="10px">
            <CircularProgress size={20} sx={{ mt: 2 }} />
            <Typography>Processing image...</Typography>
          </Box>
        )}

        {(previewUrl || text) && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "20px" }}>
            {previewUrl && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "50%",
                  maxWidth: "400px",
                }}
              >
                <img
                  src={previewUrl}
                  alt="PDS Preview"
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              </Box>
            )}

            {text && (
              <Box
                sx={{
                  width: "50%",
                  backgroundColor: "#f7f7f7",
                  padding: "16px",
                  borderRadius: "8px",
                  maxHeight: "535px",
                  overflowY: "auto",
                  mt: 2
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: "12px" }}>
                  Extracted Text (OCR):
                </Typography>
                <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>{text}</pre>
              </Box>
            )}
          </Box>
        )}

        {uploadResponse?.url && (
          <Box sx={{ marginTop: "20px", color: "green" }}>
            <Typography>✅ Uploaded successfully!</Typography>
            <Typography>
              <strong>Public URL:</strong>{" "}
              <a
                href={uploadResponse.url}
                target="_blank"
                rel="noreferrer"
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {uploadResponse.url}
              </a>
            </Typography>
          </Box>
        )}

        {uploadResponse?.error && (
          <Box sx={{ marginTop: "20px", color: "red" }}>
            <Typography>❌ {uploadResponse.error}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default UploadPDS;
