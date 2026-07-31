import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Button, Modal, Form, Table, Alert, Card, Collapse, Spinner } from "react-bootstrap";
import {
  Upload, Trash2, FileText, X, FileSpreadsheet, FileImage, FileArchive,
  FileAudio, FileVideo, FileJson, FileCode, FileType, Paperclip,
  ChevronDown, ChevronUp, Clock,
  Download,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import AttachmentService from "../Services/Attachment.services";

// ── Types ────────────────────────────────────────────────────────────────

export interface StagedAttachment {
  id: string;           
  file: File;
  description: string;
}

export interface AttachmentsStagingHandle {
  getStagedFiles: () => StagedAttachment[];
  hasFiles: () => boolean;
  
  uploadAll: (tableName: string, recordId: string | number) => Promise<void>;
  clear: () => void;
}

interface AttachmentsStagingProps {
  onChange?: (files: StagedAttachment[]) => void;
  maxSize?: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getFileIcon = (fileName: string) => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf": return <FileText size={18} className="text-danger" />;
    case "xls":
    case "xlsx": return <FileSpreadsheet size={18} className="text-success" />;
    case "doc":
    case "docx": return <FileText size={18} className="text-primary" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif": return <FileImage size={18} className="text-warning" />;
    case "zip":
    case "rar": return <FileArchive size={18} className="text-secondary" />;
    case "mp3":
    case "wav": return <FileAudio size={18} className="text-info" />;
    case "mp4":
    case "mov":
    case "avi": return <FileVideo size={18} className="text-info" />;
    case "json": return <FileJson size={18} className="text-muted" />;
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
    case "html":
    case "css": return <FileCode size={18} className="text-purple-600" />;
    default: return <FileType size={18} className="text-dark" />;
  }
};

// ── Component ─────────────────────────────

const AttachmentsStaging = forwardRef<AttachmentsStagingHandle, AttachmentsStagingProps>(
  ({ onChange, maxSize = 10485760 }, ref) => {
    const [staged, setStaged] = useState<StagedAttachment[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [pendingDescription, setPendingDescription] = useState<string>("");
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [staleToDelete, setStaleToDelete] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [uploadProgressText, setUploadProgressText] = useState<string | null>(null);

    const emitChange = (next: StagedAttachment[]) => {
      setStaged(next);
      onChange?.(next);
    };

    // ── Dropzone (picking a file, before it's added to the staged list) ──
    const onDrop = useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setPendingFile(acceptedFiles[0]);
        setUploadError(null);
      }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      multiple: false,
      maxSize,
      onDropRejected: (fileRejections) => {
        setUploadError(fileRejections[0]?.errors[0]?.message || "File rejected");
      },
    });

    const handleAddToStaged = () => {
      if (!pendingFile) {
        setUploadError("Please select a file to add");
        return;
      }
      const newItem: StagedAttachment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: pendingFile,
        description: pendingDescription,
      };
      emitChange([...staged, newItem]);
      handleCloseModal();
    };

    const handleCloseModal = () => {
      setShowModal(false);
      setPendingFile(null);
      setPendingDescription("");
      setUploadError(null);
    };

    const confirmRemove = (id: string) => {
      setStaleToDelete(id);
      setShowDeleteModal(true);
    };

   const handleDownload = (file: File) => {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

    const handleRemoveConfirmed = () => {
      if (!staleToDelete) return;
      emitChange(staged.filter((s) => s.id !== staleToDelete));
      setShowDeleteModal(false);
      setStaleToDelete(null);
    };

    const updateDescription = (id: string, description: string) => {
      emitChange(staged.map((s) => (s.id === id ? { ...s, description } : s)));
    };

    // ── Imperative API for the parent create-page/modal ───────────────────
    useImperativeHandle(ref, () => ({
      getStagedFiles: () => staged,
      hasFiles: () => staged.length > 0,
      uploadAll: async (tableName: string, recordId: string | number) => {
        if (staged.length === 0) return;
        setUploading(true);
        try {
          for (let i = 0; i < staged.length; i++) {
            const item = staged[i];
            setUploadProgressText(`Uploading ${i + 1} of ${staged.length}...`);

            const formData = new FormData();
            formData.append("File", item.file);
            formData.append("TableName", tableName);
            formData.append("RecordId", Number(recordId).toString());
            if (item.description) formData.append("Description", item.description);
            await AttachmentService.uploadAttachment(formData);
          }
          emitChange([]);
        } finally {
          setUploading(false);
          setUploadProgressText(null);
        }
      },
      clear: () => emitChange([]),
    }));

    return (
      <>
        <Card className="mt-1 shadow-sm border-0" style={{ overflow: "hidden" }}>
          <Card.Header
            className="d-flex justify-content-between align-items-center py-3 px-4"
            style={{ backgroundColor: "#173a6a", borderBottom: "2px solid #e9ecef", cursor: "pointer" }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="d-flex align-items-center gap-2">
              <Paperclip size={18} className="text-white" />
              <h6 className="mb-0 fw-semibold text-white" style={{ fontSize: "0.95rem" }}>
                Attachments
              </h6>
              <span
                className="badge rounded-pill"
                style={{ backgroundColor: "#ffffff", color: "#0d6efd", fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
              >
                {staged.length}
              </span>
              {staged.length > 0 && (
                <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: "0.7rem" }}>
                  Pending upload
                </span>
              )}
            </div>
            <div className="d-flex align-items-center gap-2">
              {isOpen ? <ChevronUp size={18} className="text-white" /> : <ChevronDown size={18} className="text-white" />}
            </div>
          </Card.Header>

          <Collapse in={isOpen}>
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                  Files are attached once you save.
                </small>
                <Button
                  size="sm"
                  className="d-flex align-items-center gap-1"
                  style={{ fontSize: "0.85rem", padding: "0.375rem 0.75rem", backgroundColor: "#173a6a" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  disabled={uploading}
                >
                  <Upload size={12} /> Add
                </Button>
              </div>

              {uploading && (
                <Alert variant="info" className="d-flex align-items-center gap-2 py-2 small mb-3">
                  <Spinner size="sm" animation="border" /> {uploadProgressText}
                </Alert>
              )}

              {staged.length === 0 ? (
                <div className="text-center py-4">
                  <FileText size={40} className="text-muted mb-2" style={{ opacity: 0.3 }} />
                  <p className="text-muted mb-1 small">No files added yet</p>
                  <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                    Click "Add" to attach files — they'll upload after you save
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle" style={{ fontSize: "0.875rem" }}>
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: "5%", padding: "0.5rem" }} className="text-center">#</th>
                        <th style={{ width: "30%", padding: "0.5rem" }}>File Name</th>
                        <th style={{ width: "35%", padding: "0.5rem" }}>Description</th>
                        <th style={{ width: "12%", padding: "0.5rem" }} className="text-center">Size</th>
                        <th style={{ width: "13%", padding: "0.5rem" }} className="text-center">Status</th>
                        <th style={{ width: "10%", padding: "0.5rem" }} className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staged.map((item, idx) => (
                        <tr key={item.id}>
                          <td className="text-center text-muted" style={{ padding: "0.5rem", fontSize: "0.8rem" }}>
                            {idx + 1}
                          </td>
                          <td style={{ padding: "0.5rem" }}>
                            <div className="d-flex align-items-center gap-2">
                              {getFileIcon(item.file.name)}
                              <span className="text-truncate" style={{ maxWidth: "220px" }} title={item.file.name}>
                                {item.file.name}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: "0.5rem" }}>
                            <Form.Control
                              size="sm"
                              type="text"
                              placeholder="Optional description"
                              value={item.description}
                              onChange={(e) => updateDescription(item.id, e.target.value)}
                              disabled={uploading}
                              style={{ fontSize: "0.8rem" }}
                            />
                          </td>
                          <td className="text-center" style={{ padding: "0.5rem", fontSize: "0.85rem" }}>
                            {formatFileSize(item.file.size)}
                          </td>
                          <td className="text-center" style={{ padding: "0.5rem" }}>
                            <span className="badge bg-warning text-dark d-inline-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>
                              <Clock size={11} /> Pending
                            </span>
                          </td>
                        
                          <td style={{ padding: "0.5rem" }}>
                            <div className="d-flex justify-content-center gap-1">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: "30px", height: "30px", padding: 0 }}
                                onClick={() => handleDownload(item.file)}
                                disabled={uploading}
                                title="Download"
                              >
                                <Download size={13} />
                              </Button>
                              <Button
                              variant="outline-danger"
                                size="sm"
                                className="d-flex align-items-center justify-content-center"
                                style={{ width: "30px", height: "30px", padding: 0 }}
                                onClick={() => confirmRemove(item.id)}
                                disabled={uploading}
                                title="Remove"
                              >
                                <Trash2 size={13} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Collapse>
        </Card>

        {/* Add-to-staging Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
          <Modal.Header closeButton className="border-0 pb-2">
            <Modal.Title className="d-flex align-items-center gap-2" style={{ fontSize: "1.1rem" }}>
              <Upload size={22} className="text-primary" />
              <span>Add Attachment</span>
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="px-4 pb-3">
            {uploadError && (
              <Alert variant="danger" dismissible onClose={() => setUploadError(null)} className="py-2">
                {uploadError}
              </Alert>
            )}

            <div
              {...getRootProps()}
              className="border rounded p-4 text-center"
              style={{
                borderStyle: "dashed",
                borderWidth: "2px",
                borderColor: isDragActive ? "#0d6efd" : "#dee2e6",
                backgroundColor: isDragActive ? "#f0f8ff" : "#f8f9fa",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              <input {...getInputProps()} />
              <Upload size={40} className="mb-2" style={{ color: "#6c757d", opacity: 0.5 }} />
              {isDragActive ? (
                <p className="mb-0 text-primary fw-medium small">Drop the file here...</p>
              ) : (
                <>
                  <p className="mb-1 fw-medium small">Drag & drop a file here, or click to browse</p>
                  <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                    Maximum file size: {formatFileSize(maxSize)}
                  </p>
                </>
              )}
            </div>

            {pendingFile && (
              <div className="mt-3 p-2 bg-light rounded border">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    {getFileIcon(pendingFile.name)}
                    <div>
                      <p className="mb-0 fw-medium" style={{ fontSize: "0.9rem" }}>{pendingFile.name}</p>
                      <small className="text-muted">{formatFileSize(pendingFile.size)}</small>
                    </div>
                  </div>
                  
            <div className="d-flex gap-1">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleDownload(pendingFile)}
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: "28px", height: "28px", padding: 0 }}
                      title="Download"
                    >
                      <Download size={14} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setPendingFile(null)}
                      className="d-flex align-items-center justify-content-center"
                      style={{ width: "28px", height: "28px", padding: 0 }}
                      title="Remove"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Form.Group className="mt-3 mb-0">
              <Form.Label className="fw-semibold small mb-1">Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter a description for this file..."
                value={pendingDescription}
                onChange={(e) => setPendingDescription(e.target.value)}
                maxLength={500}
                style={{ fontSize: "0.9rem" }}
              />
              <Form.Text className="text-muted" style={{ fontSize: "0.8rem" }}>
                {pendingDescription.length}/500 characters
              </Form.Text>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0">
            <Button variant="outline-secondary" onClick={handleCloseModal} size="sm" style={{ fontSize: "0.875rem" }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddToStaged}
              disabled={!pendingFile}
              size="sm"
              className="d-flex align-items-center gap-2"
              style={{ fontSize: "0.875rem" }}
            >
              <Upload size={14} /> Add
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Remove Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered size="sm">
          <Modal.Header closeButton className="border-0 pb-2">
            <Modal.Title style={{ fontSize: "1rem" }}>Remove File</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-4 py-3">
            <p className="mb-0 small">Remove this file from the list? It hasn't been uploaded yet.</p>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} size="sm" style={{ fontSize: "0.875rem" }}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleRemoveConfirmed} size="sm" style={{ fontSize: "0.875rem" }}>
              Remove
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
);

AttachmentsStaging.displayName = "AttachmentsStaging";

export default AttachmentsStaging;