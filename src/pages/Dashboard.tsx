
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Play, Pencil, Trash2, Upload, Plus } from 'lucide-react';
import { useBeatsStore, Beat } from '@/hooks/useBeatsStore';
import { formatTime } from '@/lib/utils';

const Dashboard = () => {
  const { beats, setCurrentBeat, addBeat, updateBeat, deleteBeat } = useBeatsStore();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEditBeat, setCurrentEditBeat] = useState<Beat | null>(null);
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null);
  const [newBeat, setNewBeat] = useState<Partial<Beat>>({
    title: '',
    artist: 'Beat Alchemy',
    genre: '',
    bpm: 0,
    isPublished: true,
  });

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
  
  // Add new beat
  const handleAddBeat = () => {
    const beatToAdd: Beat = {
      id: Date.now().toString(),
      title: newBeat.title || 'Untitled Beat',
      artist: newBeat.artist || 'Beat Alchemy',
      genre: newBeat.genre || 'Hip Hop',
      bpm: newBeat.bpm || 120,
      duration: 180, // Default 3 minutes
      coverArt: '/images/beat-cover-1.jpg', // Default cover
      audioUrl: '/audio/beat-1.mp3', // Default audio
      dateCreated: new Date(),
      isPublished: newBeat.isPublished !== undefined ? newBeat.isPublished : true,
    };
    
    addBeat(beatToAdd);
    setIsAddDialogOpen(false);
    setNewBeat({
      title: '',
      artist: 'Beat Alchemy',
      genre: '',
      bpm: 0,
      isPublished: true,
    });
  };
  
  // Update existing beat
  const handleUpdateBeat = () => {
    if (currentEditBeat) {
      updateBeat(currentEditBeat.id, currentEditBeat);
      setIsEditDialogOpen(false);
      setCurrentEditBeat(null);
    }
  };
  
  // Delete beat
  const handleDeleteBeat = () => {
    if (currentDeleteId) {
      deleteBeat(currentDeleteId);
      setIsDeleteDialogOpen(false);
      setCurrentDeleteId(null);
    }
  };
  
  // Toggle beat published status
  const handleTogglePublished = (id: string, currentStatus: boolean) => {
    updateBeat(id, { isPublished: !currentStatus });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">Beat Dashboard</h1>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2" size={16} /> Add New Beat
              </Button>
            </div>
            
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
                  beats={beats.filter(beat => beat.isPublished)} 
                  onPlay={setCurrentBeat}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleOpenDeleteDialog}
                  onTogglePublished={handleTogglePublished}
                />
              </TabsContent>
              
              <TabsContent value="drafts">
                <BeatTable 
                  beats={beats.filter(beat => !beat.isPublished)} 
                  onPlay={setCurrentBeat}
                  onEdit={handleOpenEditDialog}
                  onDelete={handleOpenDeleteDialog}
                  onTogglePublished={handleTogglePublished}
                />
              </TabsContent>
            </Tabs>
          </div>
        </section>
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
                onChange={(e) => setNewBeat({...newBeat, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="genre">Genre</Label>
                <Input 
                  id="genre" 
                  placeholder="e.g. Hip Hop" 
                  value={newBeat.genre}
                  onChange={(e) => setNewBeat({...newBeat, genre: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="bpm">BPM</Label>
                <Input 
                  id="bpm" 
                  type="number" 
                  placeholder="e.g. 90" 
                  value={newBeat.bpm || ''}
                  onChange={(e) => setNewBeat({...newBeat, bpm: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="audio-file">Audio File</Label>
              <div className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop<br/>
                  MP3, WAV (max 20MB)
                </p>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cover-art">Cover Art</Label>
              <div className="border border-dashed border-border rounded-lg p-6 text-center cursor-pointer">
                <Upload className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop<br/>
                  PNG, JPG, WEBP (max 2MB)
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="published" 
                checked={newBeat.isPublished}
                onCheckedChange={(checked) => setNewBeat({...newBeat, isPublished: checked})}
              />
              <Label htmlFor="published">Publish immediately</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBeat}>Add Beat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Beat Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Beat</DialogTitle>
            <DialogDescription>
              Update beat information
            </DialogDescription>
          </DialogHeader>
          
          {currentEditBeat && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Beat Title</Label>
                <Input 
                  id="edit-title" 
                  value={currentEditBeat.title}
                  onChange={(e) => setCurrentEditBeat({...currentEditBeat, title: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-genre">Genre</Label>
                  <Input 
                    id="edit-genre" 
                    value={currentEditBeat.genre}
                    onChange={(e) => setCurrentEditBeat({...currentEditBeat, genre: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-bpm">BPM</Label>
                  <Input 
                    id="edit-bpm" 
                    type="number" 
                    value={currentEditBeat.bpm}
                    onChange={(e) => setCurrentEditBeat({...currentEditBeat, bpm: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-published" 
                  checked={currentEditBeat.isPublished}
                  onCheckedChange={(checked) => setCurrentEditBeat({...currentEditBeat, isPublished: checked})}
                />
                <Label htmlFor="edit-published">Published</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
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
              Are you sure you want to delete this beat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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

const BeatTable = ({ beats, onPlay, onEdit, onDelete, onTogglePublished }: BeatTableProps) => {
  if (beats.length === 0) {
    return (
      <div className="text-center py-12 bg-secondary rounded-lg">
        <h3 className="text-xl font-medium mb-2">No beats found</h3>
        <p className="text-muted-foreground">Start by adding a new beat to your collection</p>
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
            <TableCell className="text-center">{formatTime(beat.duration)}</TableCell>
            <TableCell className="text-center">
              <Switch 
                checked={beat.isPublished}
                onCheckedChange={() => onTogglePublished(beat.id, beat.isPublished)}
              />
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onPlay(beat)}
                >
                  <Play size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(beat)}
                >
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

export default Dashboard;
