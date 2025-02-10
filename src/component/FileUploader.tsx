import { useState, useEffect } from "react";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useDropzone } from "react-dropzone";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB max file size

interface FileUploaderProps {
  label: string;
  accept?: { [name: string]: string[] }; // Accept file types (e.g., { 'image/*': [], 'video/*': [] })
  isMultiple?: boolean; // Whether multiple files are allowed
  onDropFile: (acceptedFiles: File[]) => void;
  error: boolean;
  helperText: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  label,
  accept = { "image/*": [] },
  isMultiple = true,
  onDropFile,
  error,
  helperText,
}) => {
  const [previews, setPreviews] = useState<
    { file: File; url: string | null }[]
  >([]);

  useEffect(() => {
    // Cleanup preview URLs when the component is unmounted
    return () => {
      previews.forEach(({ url }) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      const newPreviews = acceptedFiles.map((file) => {
        if (file.size > MAX_FILE_SIZE) {
          alert(
            `File ${file.name} is too large. Please select a smaller file.`
          );
          return { file, url: null };
        }

        let url: string | null = null;
        try {
          console.log(file.type);
          if (
            file.type.startsWith("image") ||
            file.type.startsWith("video") ||
            file.type.startsWith("audio")
          ) {
            url = URL.createObjectURL(file); // Generate object URL for preview
            console.log(url);
          }
        } catch (error) {
          console.error(
            "Error creating object URL for file:",
            file.name,
            error
          );
        }
        onDropFile(acceptedFiles);
        return { file, url };
      });

      setPreviews(newPreviews);
    },
    maxSize: MAX_FILE_SIZE,
    accept: accept, // Use the formatted accept
    multiple: isMultiple, // Whether multiple files are allowed
  });

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
            {previews.map(({ file, url }, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                {file.type.startsWith("image") ? (
                  <img
                    src={url!}
                    alt={file.name} // Add alt for accessibility
                    style={{ maxWidth: "100%", borderRadius: 8 }}
                  />
                ) : file.type.startsWith("video") ? (
                  <video controls style={{ maxWidth: "100%", borderRadius: 8 }}>
                    <source src={url!} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : file.type.startsWith("audio") ? (
                  <audio controls style={{ maxWidth: "100%", borderRadius: 8 }}>
                    <source src={url!} type={file.type} />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <InsertDriveFileIcon fontSize="large" color="action" />
                    <Typography variant="body2">
                      {file.name} ({file.type})
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        )}
      </Paper>
      {error & <Typography>{helperT}</Typography>}
    </Box>
  );
};

export default FileUploader;
