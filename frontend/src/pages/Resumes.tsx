import { useState } from "react";
import { Dropzone } from "../components/dnd";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface Resume {
  id: string;
  name: string;
  uploadDate: string;
}

const mockResumes: Resume[] = [
  { id: "1", name: "Resume_v1.pdf", uploadDate: "2023-10-26" },
  { id: "2", name: "Resume_v2.docx", uploadDate: "2023-10-27" },
  { id: "3", name: "Frontend_Resume.pdf", uploadDate: "2023-10-28" },
];

function ResumesContent() {
  const [resumes, setResumes] = useState<Resume[]>(mockResumes);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      setConfirmOpen(true);
    }
  };

  const handleUploadConfirm = () => {
    if (selectedFile) {
      const newResume: Resume = {
        id: (resumes.length + 1).toString(),
        name: selectedFile.name,
        uploadDate: new Date().toISOString().split("T")[0],
      };
      setResumes([...resumes, newResume]);
    }
    setConfirmOpen(false);
    setSelectedFile(null);
  };

  const handleUploadCancel = () => {
    setConfirmOpen(false);
    setSelectedFile(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-8 p-8 relative">
      <div className="absolute inset-0 -z-10 gradient-mesh-1 opacity-25" />
      <div className="space-y-2">
        <h1 className="text-5xl tracking-tight">My Resumes</h1>
        <p className="text-lg font-light text-muted-foreground">
          Manage and version your resume library
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <Dropzone onDrop={handleDrop} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.map((resume) => (
          <Card key={resume.id}>
            <CardHeader>
              <CardTitle className="text-lg">{resume.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Uploaded on: {resume.uploadDate}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm">
                  View
                </Button>
                <Button variant="destructive" size="sm">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Upload</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to upload "{selectedFile?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleUploadCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUploadConfirm}>
              Upload
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function Resumes() {
  return <ResumesContent />;
}
