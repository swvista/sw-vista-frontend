import React, { useState, useEffect } from "react";
import {
  getAllClubsDetails,
  deleteClub,
  createClub,
  getClubDetails,
  updateClub,
} from "../../utils/authService";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiUsers, 
  FiEye,
  FiSearch,
  FiFilter,
  FiImage
} from "react-icons/fi";
import PageHeader from "../../Components/PageHeader";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Club form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [addingClub, setAddingClub] = useState(false);

  // Edit Club states
  const [editClubId, setEditClubId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [updatingClub, setUpdatingClub] = useState(false);

  // Sheet states
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await getAllClubsDetails();
        setClubs(response.data);
        setFilteredClubs(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  // Filter clubs based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredClubs(clubs);
    } else {
      const filtered = clubs.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        club.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClubs(filtered);
    }
  }, [searchTerm, clubs]);

  const handleDelete = async (id) => {
    const clubToDelete = clubs.find((club) => club.id === id);
    if (clubToDelete.member_count > 0) {
      toast.error("Cannot delete a club with members. Please remove all members first.");
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this club?")) {
      try {
        await deleteClub(id);
        const updatedClubs = clubs.filter((club) => club.id !== id);
        setClubs(updatedClubs);
        setFilteredClubs(updatedClubs);
        toast.success("Club deleted successfully!");
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while deleting the club.");
      }
    }
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    setAddingClub(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const newClub = await createClub(formData);
      const updatedClubs = [...clubs, newClub.data];
      setClubs(updatedClubs);
      setFilteredClubs(updatedClubs);
      toast.success("Club added successfully!");
      
      // Reset form
      setName("");
      setDescription("");
      setImage(null);
      setIsAddSheetOpen(false);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add club.");
    } finally {
      setAddingClub(false);
    }
  };

  const openEditClub = async (id) => {
    setEditClubId(id);
    try {
      const response = await getClubDetails(id);
      setEditName(response.data.name);
      setEditDescription(response.data.description);
      setEditImage(null);
      setIsEditSheetOpen(true);
    } catch (error) {
      console.error("Error fetching club:", error);
      toast.error("Failed to load club details.");
    }
  };

  const handleUpdateClub = async (e) => {
    e.preventDefault();
    setUpdatingClub(true);
    
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    if (editImage) formData.append("image", editImage);

    try {
      const updatedClub = await updateClub(editClubId, formData);
      const updatedClubs = clubs.map((club) => 
        club.id === editClubId ? updatedClub.data : club
      );
      setClubs(updatedClubs);
      setFilteredClubs(updatedClubs);
      toast.success("Club updated successfully!");
      setIsEditSheetOpen(false);
      setEditClubId(null);
    } catch (error) {
      console.error("Error updating club:", error);
      toast.error("Failed to update club.");
    } finally {
      setUpdatingClub(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading clubs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h2>
          <p className="text-slate-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      
      <div className="mx-auto sm:p-6 md:p-10">
        {/* Header Section */}
          <PageHeader user={"Username"} />
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Clubs Dashboard
              </h1>
              <p className="text-slate-600 mt-2">
                Manage and organize your community clubs
              </p>
            </div>
            
            <Sheet open={isAddSheetOpen} onOpenChange={setIsAddSheetOpen}>
              <SheetTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                  <FiPlus size={18} className="mr-2" />
                  Add New Club
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-xl">
                    <FiPlus className="text-blue-600" />
                    Add New Club
                  </SheetTitle>
                </SheetHeader>
                <form onSubmit={handleAddClub} className="space-y-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Club Name *
                    </label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter club name"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Description *
                    </label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the club's purpose and activities"
                      rows="4"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Club Image
                    </label>
                    <div className="relative">
                      <Input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                        className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <FiImage className="absolute right-3 top-3 text-slate-400" size={18} />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddSheetOpen(false)}
                      disabled={addingClub}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={addingClub}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      {addingClub ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        <>
                          <FiPlus size={16} className="mr-2" />
                          Add Club
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                type="text"
                placeholder="Search clubs by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Clubs</p>
                  <p className="text-2xl font-bold text-slate-800">{clubs.length}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FiUsers className="text-blue-600" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Active Clubs</p>
                  <p className="text-2xl font-bold text-slate-800">{clubs.filter(club => club.member_count > 0).length}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <FiEye className="text-green-600" size={20} />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Members</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {clubs.reduce((sum, club) => sum + (club.member_count || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <FiUsers className="text-purple-600" size={20} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Club Grid */}
        {filteredClubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 text-6xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              {searchTerm ? "No clubs found" : "No clubs yet"}
            </h3>
            <p className="text-slate-500">
              {searchTerm 
                ? `No clubs match "${searchTerm}". Try a different search term.`
                : "Get started by creating your first club!"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200 group hover:-translate-y-1"
              >
                <div className="relative">
                  <img
                    src={`localhost:11000/vista${club.image}`}
                    alt={club.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-slate-600">
                    {club.member_count || 0} members
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-1">
                    {club.name}
                  </h2>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {club.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/clubs/${club.id}`}
                      state={{ club }}
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
                    >
                      <FiEye size={16} />
                      View Details
                    </Link>
                    
                    <div className="flex items-center gap-2">
                      <Sheet open={isEditSheetOpen && editClubId === club.id} onOpenChange={(open) => {
                        if (!open) {
                          setIsEditSheetOpen(false);
                          setEditClubId(null);
                        }
                      }}>
                        <SheetTrigger asChild>
                          <button
                            onClick={() => openEditClub(club.id)}
                            className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit club"
                          >
                            <FiEdit3 size={16} />
                          </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                          <SheetHeader>
                            <SheetTitle className="flex items-center gap-2 text-xl">
                              <FiEdit3 className="text-blue-600" />
                              Edit Club
                            </SheetTitle>
                          </SheetHeader>
                          <form onSubmit={handleUpdateClub} className="space-y-6 mt-6">
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Club Name *
                              </label>
                              <Input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Description *
                              </label>
                              <Textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows="4"
                                className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Club Image
                              </label>
                              <div className="relative">
                                <Input
                                  type="file"
                                  onChange={(e) => setEditImage(e.target.files[0])}
                                  accept="image/*"
                                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                                <FiImage className="absolute right-3 top-3 text-slate-400" size={18} />
                              </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setIsEditSheetOpen(false);
                                  setEditClubId(null);
                                }}
                                disabled={updatingClub}
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={updatingClub}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                              >
                                {updatingClub ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Updating...
                                  </>
                                ) : (
                                  <>
                                    <FiEdit3 size={16} className="mr-2" />
                                    Update Club
                                  </>
                                )}
                              </Button>
                            </div>
                          </form>
                        </SheetContent>
                      </Sheet>
                      
                      <button
                        onClick={() => handleDelete(club.id)}
                        className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete club"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;