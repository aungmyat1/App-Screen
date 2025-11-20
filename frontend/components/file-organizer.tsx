"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

interface Folder {
  id: string;
  name: string;
  parentId: string | null;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  folderId: string | null;
  tags: string[];
  uploadedAt: Date;
}

export function FileOrganizer() {
  const [folders, setFolders] = useState<Folder[]>([
    { id: "1", name: "Mobile Apps", parentId: null },
    { id: "2", name: "Web Apps", parentId: null },
    { id: "3", name: "Games", parentId: null },
  ]);
  
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "UI", color: "blue" },
    { id: "2", name: "Marketing", color: "green" },
    { id: "3", name: "Design", color: "purple" },
  ]);
  
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "app-homepage.png",
      size: 2048000,
      type: "image/png",
      folderId: "1",
      tags: ["1", "2"],
      uploadedAt: new Date(),
    },
    {
      id: "2",
      name: "login-screen.png",
      size: 1024000,
      type: "image/png",
      folderId: "1",
      tags: ["1"],
      uploadedAt: new Date(Date.now() - 86400000),
    },
  ]);
  
  const [newFolderName, setNewFolderName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: Folder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      parentId: null,
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName("");
  };

  const createTag = () => {
    if (!newTagName.trim()) return;
    
    const colors = ["blue", "green", "purple", "red", "yellow", "pink"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newTag: Tag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: randomColor,
    };
    
    setTags([...tags, newTag]);
    setNewTagName("");
  };

  const toggleTagSelection = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  const moveFileToFolder = (fileId: string, folderId: string | null) => {
    setFiles(files.map(file => 
      file.id === fileId ? { ...file, folderId } : file
    ));
  };

  const addTagToFile = (fileId: string, tagId: string) => {
    setFiles(files.map(file => {
      if (file.id === fileId) {
        const newTags = file.tags.includes(tagId) 
          ? file.tags.filter(id => id !== tagId) 
          : [...file.tags, tagId];
        return { ...file, tags: newTags };
      }
      return file;
    }));
  };

  const filteredFiles = files.filter(file => {
    const folderMatch = selectedFolder ? file.folderId === selectedFolder : true;
    const tagMatch = selectedTags.length > 0 
      ? selectedTags.every(tagId => file.tags.includes(tagId)) 
      : true;
    return folderMatch && tagMatch;
  });

  const getFolderName = (folderId: string | null) => {
    if (!folderId) return "Uncategorized";
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : "Unknown";
  };

  const getTagName = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.name : "Unknown";
  };

  const getTagColor = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    return tag ? tag.color : "gray";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Folders</CardTitle>
            <CardDescription>Organize your files into folders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button onClick={createFolder}>
                <Icons.plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-1">
              <Button
                variant={selectedFolder === null ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedFolder(null)}
              >
                <Icons.folderOpen className="mr-2 h-4 w-4" />
                All Files
              </Button>
              
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <Icons.folder className="mr-2 h-4 w-4" />
                  {folder.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>Tag your files for easy searching</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <Button onClick={createTag}>
                <Icons.plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className={`cursor-pointer hover:opacity-80 ${
                    selectedTags.includes(tag.id) ? `bg-${tag.color}-500` : ""
                  }`}
                  onClick={() => toggleTagSelection(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>
              {selectedFolder 
                ? `Files in ${getFolderName(selectedFolder)}` 
                : "All files"}
              {selectedTags.length > 0 && (
                <span> • Filtered by: {selectedTags.map(getTagName).join(", ")}</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12">
                <Icons.image className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium">No files found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try changing your filters or upload some files.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredFiles.map((file) => (
                  <Card key={file.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 border rounded-md p-2">
                            <Icons.image className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-medium truncate max-w-[160px]">{file.name}</h3>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB • {getFolderName(file.folderId)}
                            </p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <Icons.moreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Icons.download className="mr-2 h-4 w-4" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Icons.share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Move to</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => moveFileToFolder(file.id, null)}>
                              Uncategorized
                            </DropdownMenuItem>
                            {folders.map(folder => (
                              <DropdownMenuItem 
                                key={folder.id}
                                onClick={() => moveFileToFolder(file.id, folder.id)}
                              >
                                {folder.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {file.tags.map(tagId => (
                          <Badge
                            key={tagId}
                            variant="outline"
                            className={`cursor-pointer hover:opacity-80 ${
                              selectedTags.includes(tagId) ? `border-${getTagColor(tagId)}-500` : ""
                            }`}
                            onClick={() => addTagToFile(file.id, tagId)}
                          >
                            {getTagName(tagId)}
                          </Badge>
                        ))}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-6 text-xs">
                              <Icons.plus className="mr-1 h-3 w-3" />
                              Add tag
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {tags.map(tag => (
                              <DropdownMenuItem 
                                key={tag.id}
                                onClick={() => addTagToFile(file.id, tag.id)}
                              >
                                {tag.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}