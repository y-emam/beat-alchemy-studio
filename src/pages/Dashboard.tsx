
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { AdminAuth } from "@/components/admin/AdminAuth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Play, Pencil, Trash2, Upload, Plus, Mail } from "lucide-react";
import { useBeatsStore, Beat } from "@/hooks/useBeatsStore";
import { formatTime } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { beats, setCurrentBeat, addBeat, updateBeat, deleteBeat } =
    useBeatsStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEditBeat, setCurrentEditBeat] = useState<Beat | null>(null);
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [contactSubmissions, setContactSubmissions] = useState<any[]>([]);
  const [newBeat, setNewBeat] = useState<Partial<Beat>>({
    title: "",
    artist: "Beat Alchemy",
    genre: "",
    bpm: 0,
    isPublished: true,
  });

  // References for file inputs
  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverArtInputRef = useRef<HTMLInputElement>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverArtFile, setCoverArtFile] = useState<File | null>(null);

  // Check for stored admin authentication on mount
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      fetchContactSubmissions();
    }
  }, []);

  // Fetch contact submissions when authenticated
  const fetchContactSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      setContactSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      toast({
        title: "Error",
        description: "Failed to load contact submissions",
        variant: "destructive",
      });
    }
  };

  // Handle admin authentication
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    fetchContactSubmissions();
  };

  // Open edit dialog and set beat to edit
  const handleOpenEditDialog = (beat: Beat) => {
    setCurrentEditBeat(beat);
    setIsEditDialogOpen(true);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (id: string) => {
    setCurrentDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle audio file selection
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAudioFile(file);
      
      // Create an audio element to get the duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(file);
      
      audio.onloadedmetadata = () => {
        setNewBeat(prev => ({
          ...prev,
          duration: audio.duration
        }));
      };
    }
  };

  // Handle cover art file selection
  const handleCoverArtFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverArtFile(e.target.files[0]);
    }
  };

  // Upload files to Supabase storage and create beat record
  const uploadFilesAndCreateBeat = async () => {
    try {
      setIsUploading(true);
      
      if (!audioFile) {
        toast({
          title: "Error",
          description: "Please select an audio file",
          variant: "destructive",
        });
        setIsUploading(false);
        return;
      }

      // Upload audio file
      const audioFileName = `${Date.now()}-${audioFile.name}`;
      const { data: audioData, error: audioError } = await supabase.storage
        .from('beats')
        .upload(audioFileName, audioFile);

      if (audioError) {
        throw new Error(`Audio upload failed: ${audioError.message}`);
      }

      // Get audio URL
      const { data: { publicUrl: audioUrl } } = supabase.storage
        .from('beats')
        .getPublicUrl(audioFileName);

      // Upload cover art if provided
      let coverArtUrl = '/images/beat-cover-1.jpg'; // Default cover art
      if (coverArtFile) {
        const coverArtFileName = `${Date.now()}-${coverArtFile.name}`;
        const { data: coverArtData, error: coverArtError } = await supabase.storage
          .from('cover_art')
          .upload(coverArtFileName, coverArtFile);

        if (coverArtError) {
          throw new Error(`Cover art upload failed: ${coverArtError.message}`);
        }

        // Get cover art URL
        const { data: { publicUrl } } = supabase.storage
          .from('cover_art')
          .getPublicUrl(coverArtFileName);
        coverArtUrl = publicUrl;
      }

      // Create beat record in database
      const beatToAdd = {
        title: newBeat.title || "Untitled Beat",
        artist: newBeat.artist || "Beat Alchemy",
        genre: newBeat.genre || "Hip Hop",
        bpm: newBeat.bpm || 120,
        duration: newBeat.duration || 180,
        is_published: newBeat.isPublished !== undefined ? newBeat.isPublished : true,
        cover_art_url: coverArtUrl,
        audio_url: audioUrl
      };

      const { data: beatData, error: beatError } = await supabase
        .from('beats')
        .insert(beatToAdd)
        .select()
        .single();

      if (beatError) {
        throw new Error(`Beat creation failed: ${beatError.message}`);
      }

      // Add to local state
      const newBeatForStore: Beat = {
        id: beatData.id,
        title: beatData.title,
        artist: beatData.artist,
        genre: beatData.genre,
        bpm: beatData.bpm,
        duration: beatData.duration,
        coverArt: beatData.cover_art_url,
        audioUrl: beatData.audio_url,
        dateCreated: new Date(beatData.date_created),
        isPublished: beatData.is_published
      };

      addBeat(newBeatForStore);
      resetNewBeatForm();
      setIsAddDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Beat uploaded successfully!",
      });
    } catch (error) {
      console.error("Error uploading beat:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload beat",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Reset new beat form
  const resetNewBeatForm = () => {
    setNewBeat({
      title: "",
      artist: "Beat Alchemy",
      genre: "",
      bpm: 0,
      isPublished: true,
      duration: 0
    });
    setAudioFile(null);
    setCoverArtFile(null);
    if (audioInputRef.current) audioInputRef.current.value = "";
    if (coverArtInputRef.current) coverArtInputRef.current.value = "";
  };

  // Update existing beat
  const handleUpdateBeat = async () => {
    if (currentEditBeat) {
      try {
        // Update in Supabase
        const { error } = await supabase
          .from('beats')
          .update({
            title: currentEditBeat.title,
            genre: currentEditBeat.genre,
            bpm: currentEditBeat.bpm,
            is_published: currentEditBeat.isPublished
          })
          .eq('id', currentEditBeat.id);

        if (error) {
          throw new Error(`Beat update failed: ${error.message}`);
        }

        // Update local state
        updateBeat(currentEditBeat.id, currentEditBeat);
        setIsEditDialogOpen(false);
        setCurrentEditBeat(null);
        
        toast({
          title: "Success",
          description: "Beat updated successfully!",
        });
      } catch (error) {
        console.error("Error updating beat:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update beat",
          variant: "destructive",
        });
      }
    }
  };

  // Delete beat
  const handleDeleteBeat = async () => {
    if (currentDeleteId) {
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from('beats')
          .delete()
          .eq('id', currentDeleteId);

        if (error) {
          throw new Error(`Beat deletion failed: ${error.message}`);
        }

        // Delete from local state
        deleteBeat(currentDeleteId);
        setIsDeleteDialogOpen(false);
        setCurrentDeleteId(null);
        
        toast({
          title: "Success",
          description: "Beat deleted successfully!",
        });
      } catch (error) {
        console.error("Error deleting beat:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete beat",
          variant: "destructive",
        });
      }
    }
  };

  // Toggle beat published status
  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('beats')
        .update({
          is_published: !currentStatus
        })
        .eq('id', id);

      if (error) {
        throw new Error(`Status update failed: ${error.message}`);
      }

      // Update local state
      updateBeat(id, { isPublished: !currentStatus });
      
      toast({
        title: "Success",
        description: `Beat ${!currentStatus ? 'published' : 'unpublished'} successfully!`,
      });
    } catch (error) {
      console.error("Error updating beat status:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update beat status",
        variant: "destructive",
      });
    }
  };

  // Mark contact submission as processed
  const toggleContactProcessed = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ processed: !currentStatus })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setContactSubmissions(prevSubmissions =>
        prevSubmissions.map(sub =>
          sub.id === id ? { ...sub, processed: !currentStatus } : sub
        )
      );
      
      toast({
        title: "Status updated",
        description: `Message marked as ${!currentStatus ? 'processed' : 'unprocessed'}`
      });
    } catch (error) {
      console.error("Error updating submission:", error);
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive",
      });
    }
  };

  // Admin logout
  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUsername');
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {!isAuthenticated ? (
          <section className="py-16">
            <AdminAuth onAuthSuccess={handleAuthSuccess} />
          </section>
        ) : (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
                  <p className="text-muted-foreground">
                    Welcome back, {localStorage.getItem('adminUsername') || 'Admin'}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="mr-2" size={16} /> Add New Beat
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>Logout</Button>
                </div>
              </div>

              <Tabs defaultValue="beats" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="beats">Beat Management</TabsTrigger>
                  <TabsTrigger value="contact">Contact Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="beats">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="mb-6">
                      <TabsTrigger value="all">All Beats</TabsTrigger>
                      <TabsTrigger value="published">Published</TabsTrigger>
                      <TabsTrigger value="drafts">Drafts</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                      <BeatTable
                        beats={beats}
                        onPlay={setCurrentBeat}
                        onEdit={handleOpenEditDialog}
                        onDelete={handleOpenDeleteDialog}
                        onTogglePublished={handleTogglePublished}
                      />
                    </TabsContent>

                    <TabsContent value="published">
                      <BeatTable
                        beats={beats.filter((beat) => beat.isPublished)}
                        onPlay={setCurrentBeat}
                        onEdit={handleOpenEditDialog}
                        onDelete={handleOpenDeleteDialog}
                        onTogglePublished={handleTogglePublished}
                      />
                    </TabsContent>

                    <TabsContent value="drafts">
                      <BeatTable
                        beats={beats.filter((beat) => !beat.isPublished)}
                        onPlay={setCurrentBeat}
                        onEdit={handleOpenEditDialog}
                        onDelete={handleOpenDeleteDialog}
                        onTogglePublished={handleTogglePublished}
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>

                <TabsContent value="contact">
                  <ContactMessagesTable 
                    submissions={contactSubmissions} 
                    onToggleProcessed={toggleContactProcessed} 
                  />
                </TabsContent>
              </Tabs>
            </div>
          </section>
        )}
      </main>

      {/* Add Beat Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Beat</DialogTitle>
            <DialogDescription>
              Upload a new beat to your collection
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Beat Title</Label>
              <Input
                id="title"
                placeholder="Enter beat title"
                value={newBeat.title}
                onChange={(e) =>
                  setNewBeat({ ...newBeat, title: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  placeholder="e.g. Hip Hop"
                  value={newBeat.genre}
                  onChange={(e) =>
                    setNewBeat({ ...newBeat, genre: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bpm">BPM</Label>
                <Input
                  id="bpm"
                  type="number"
                  placeholder="e.g. 90"
                  value={newBeat.bpm || ""}
                  onChange={(e) =>
                    setNewBeat({ ...newBeat, bpm: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="audio-file">Audio File</Label>
              <div 
                className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer"
                onClick={() => audioInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={audioInputRef}
                  className="hidden"
                  id="audio-file"
                  accept="audio/mp3,audio/wav"
                  onChange={handleAudioFileChange}
                />
                {audioFile ? (
                  <div className="flex flex-col items-center">
                    <div className="text-green-500 mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto"><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"></path><path d="m9 12 2 2 4-4"></path></svg>
                    </div>
                    <p className="text-sm font-medium">{audioFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                      <br />
                      MP3, WAV (max 20MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cover-art">Cover Art</Label>
              <div 
                className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer"
                onClick={() => coverArtInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={coverArtInputRef}
                  className="hidden"
                  id="cover-art"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleCoverArtFileChange}
                />
                {coverArtFile ? (
                  <div className="flex flex-col items-center">
                    <div className="h-24 w-24 bg-secondary rounded-md overflow-hidden mb-2">
                      <img 
                        src={URL.createObjectURL(coverArtFile)}
                        alt="Cover Preview"
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <p className="text-sm font-medium">{coverArtFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(coverArtFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                      <br />
                      PNG, JPG, WEBP (max 2MB)
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={newBeat.isPublished}
                onCheckedChange={(checked) =>
                  setNewBeat({ ...newBeat, isPublished: checked })
                }
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              resetNewBeatForm();
              setIsAddDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={uploadFilesAndCreateBeat} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Add Beat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Beat Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Beat</DialogTitle>
            <DialogDescription>Update beat information</DialogDescription>
          </DialogHeader>

          {currentEditBeat && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Beat Title</Label>
                <Input
                  id="edit-title"
                  value={currentEditBeat.title}
                  onChange={(e) =>
                    setCurrentEditBeat({
                      ...currentEditBeat,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-genre">Genre</Label>
                  <Input
                    id="edit-genre"
                    value={currentEditBeat.genre}
                    onChange={(e) =>
                      setCurrentEditBeat({
                        ...currentEditBeat,
                        genre: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-bpm">BPM</Label>
                  <Input
                    id="edit-bpm"
                    type="number"
                    value={currentEditBeat.bpm}
                    onChange={(e) =>
                      setCurrentEditBeat({
                        ...currentEditBeat,
                        bpm: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-published"
                  checked={currentEditBeat.isPublished}
                  onCheckedChange={(checked) =>
                    setCurrentEditBeat({
                      ...currentEditBeat,
                      isPublished: checked,
                    })
                  }
                />
                <Label htmlFor="edit-published">Published</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateBeat}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Beat Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Beat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this beat? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBeat}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

// Beat table component
interface BeatTableProps {
  beats: Beat[];
  onPlay: (beat: Beat) => void;
  onEdit: (beat: Beat) => void;
  onDelete: (id: string) => void;
  onTogglePublished: (id: string, currentStatus: boolean) => void;
}

const BeatTable = ({
  beats,
  onPlay,
  onEdit,
  onDelete,
  onTogglePublished,
}: BeatTableProps) => {
  if (beats.length === 0) {
    return (
      <div className="text-center py-12 bg-secondary rounded-lg">
        <h3 className="text-xl font-medium mb-2">No beats found</h3>
        <p className="text-muted-foreground">
          Start by adding a new beat to your collection
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Genre</TableHead>
          <TableHead className="text-center">BPM</TableHead>
          <TableHead className="text-center">Duration</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {beats.map((beat) => (
          <TableRow key={beat.id}>
            <TableCell className="font-medium">{beat.title}</TableCell>
            <TableCell>{beat.genre}</TableCell>
            <TableCell className="text-center">{beat.bpm}</TableCell>
            <TableCell className="text-center">
              {formatTime(beat.duration)}
            </TableCell>
            <TableCell className="text-center">
              <Switch
                checked={beat.isPublished}
                onCheckedChange={() =>
                  onTogglePublished(beat.id, beat.isPublished)
                }
              />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onPlay(beat)}>
                  <Play size={16} />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEdit(beat)}>
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(beat.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

// Contact messages table component
interface ContactMessagesTableProps {
  submissions: any[];
  onToggleProcessed: (id: string, currentStatus: boolean) => void;
}

const ContactMessagesTable = ({
  submissions,
  onToggleProcessed,
}: ContactMessagesTableProps) => {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 bg-secondary rounded-lg">
        <h3 className="text-xl font-medium mb-2">No contact messages yet</h3>
        <p className="text-muted-foreground">Messages from the contact form will appear here</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Message</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id} className={submission.processed ? 'opacity-60' : ''}>
              <TableCell className="font-medium">{submission.name}</TableCell>
              <TableCell>
                <a href={`mailto:${submission.email}`} className="text-primary hover:underline flex items-center gap-1">
                  {submission.email} <Mail size={14} />
                </a>
              </TableCell>
              <TableCell className="max-w-xs truncate">{submission.message}</TableCell>
              <TableCell>{formatDate(submission.created_at)}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center">
                  <Switch
                    checked={submission.processed}
                    onCheckedChange={() =>
                      onToggleProcessed(submission.id, submission.processed)
                    }
                  />
                  <span className="ml-2 text-xs">
                    {submission.processed ? "Processed" : "New"}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Dashboard;
