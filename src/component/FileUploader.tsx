import { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max file size

interface FileUploaderProps {
  label: string;
  accept?: { [name: string]: string[] }; // Accept file types (e.g., { 'image/*': [], 'video/*': [] })
  isMultiple?: boolean; // Whether multiple files are allowed
  defaultFileUrl?: string;
  onDropFile: (acceptedFiles: File[]) => void;
  error?: boolean;
  helperText?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  accept = { "image/*": [] },
  isMultiple = true,
  defaultFileUrl,
  onDropFile,
  error,
  helperText,
}) => {
  const [previews, setPreviews] = useState<
    { file: File | null; url: string | null }[]
  >([]);

  useEffect(() => {
    // Cleanup preview URLs when the component is unmounted
    return () => {
      previews.forEach(({ url }) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  useEffect(() => {
    if (defaultFileUrl) {
      setPreviews([{ file: null, url: 'http://localhost:5000/'+defaultFileUrl }]); // Set existing file preview
    }
  }, [defaultFileUrl]);

const { getRootProps, getInputProps } = useDropzone({
  onDrop: (acceptedFiles) => {
    // Revoke previous object URLs to free memory
    previews.forEach(({ url }) => {
      if (url) URL.revokeObjectURL(url);
    });

    // Process new files
    const newPreviews = acceptedFiles.map((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Please select a smaller file.`);
        return { file, url: null };
      }

      let url: string | null = null;
      if (file.type.startsWith("image") || file.type.startsWith("video") || file.type.startsWith("audio")) {
        url = URL.createObjectURL(file); // Generate object URL for preview
      }

      return { file, url };
    });

    // Clear old previews and update state with new files
    setPreviews([]);
    setTimeout(() => setPreviews(newPreviews), 0); // Small delay ensures React updates properly

    // Pass new files to parent component
    onDropFile(acceptedFiles);
  },
  maxSize: MAX_FILE_SIZE,
  accept: accept,
  multiple: isMultiple,
});


  const previewDiv = previews?.length > 0 && (
    <Box sx={{ mt: 2 }}>
      {previews.map(({ file, url }, index) => {
        const fileType = file?.type || "";
        const acceptedTypes = Object.keys(accept).join(",");
  
        const isImage = acceptedTypes.includes("image/") || fileType.startsWith("image/");
        const isVideo = acceptedTypes.includes("video/") || fileType.startsWith("video/");
        const isAudio = acceptedTypes.includes("audio/") || fileType.startsWith("audio/");
        console.log(acceptedTypes.includes("audio/"), fileType.startsWith("audio/"))
        return (
          <Box key={index} sx={{ mb: 2 }}>
            {isImage && url ? (
              <img
                src={url}
                alt="Uploaded file preview"
                style={{ maxWidth: "100%", borderRadius: 8 }}
              />
            ) : isVideo && url ? (
              <video controls style={{ maxWidth: "100%", borderRadius: 8 }}>
                <source src={url} type={fileType} />
                Your browser does not support the video tag.
              </video>
            ) : isAudio && url ? (
              <audio controls style={{ maxWidth: "100%", borderRadius: 8 }}>
                <source src={url} type={fileType} />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InsertDriveFileIcon fontSize="large" color="action" />
                <Typography variant="body2">{file?.name || "Uploaded file"}</Typography>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );  

  return (
    <Box sx={{ mx: "auto", my: 1 }}>
      {/* Dropzone area */}
      <Paper
        {...getRootProps()}
        sx={{
          border: "2px dashed rgb(203 203 203)",
          padding: "20px",
          cursor: "pointer",
          borderRadius: "4px",
          color: "#717171",
          "&:hover": {
            borderColor: "rgb(0, 0, 0)",
          },
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="h6">{label}</Typography>
        <Typography variant="body2">
          Drag & drop files here, or click to select
        </Typography>
        {previews.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {previewDiv}

          </Box>
        )}
      </Paper>
      {error && (<Typography>{helperText}</Typography>)}
    </Box>
  );
};

export default FileUploader;
