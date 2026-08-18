import { FileBrowser } from "@/components/files/file-browser";

interface PageProps {
  params: Promise<{ folderId: string }>;
}

export default async function FolderPage({ params }: PageProps) {
  const { folderId } = await params;

  return <FileBrowser folderId={folderId} />;
}
