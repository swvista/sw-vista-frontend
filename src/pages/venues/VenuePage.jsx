import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/api/venue/';

const VenuePage = () => {
  const [venues, setVenues] = useState([]);
  const [editingVenue, setEditingVenue] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    capacity: '',
    latitude: '',
    longitude: '',
    image: null, // Changed back to image
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await axios.get(API_URL);
      setVenues(response.data);
    } catch (error) {
      console.error("Error fetching venues:", error);
      toast.error("Failed to fetch venues.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] }); // Changed back to image
  };

  const handleAddVenue = () => {
    setEditingVenue(null);
    setFormData({
      name: '',
      address: '',
      description: '',
      capacity: '',
      latitude: '',
      longitude: '',
      image: null, // Changed back to image
    });
    setIsFormOpen(true);
  };

  const handleEditVenue = (venue) => {
    setEditingVenue(venue);
    setFormData({
      name: venue.name,
      address: venue.address,
      description: venue.description,
      capacity: venue.capacity,
      latitude: venue.latitude,
      longitude: venue.longitude,
      image: null, // Image won't be pre-filled for edit, user needs to re-upload if changed
    });
    setIsFormOpen(true);
  };

  const handleDeleteVenue = async (id) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      try {
        await axios.delete(`${API_URL}${id}/`);
        toast.success("Venue deleted successfully!");
        fetchVenues();
      } catch (error) {
        console.error("Error deleting venue:", error);
        toast.error("Failed to delete venue.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        data.append(key, formData[key]);
      }
    }

    try {
      if (editingVenue) {
        await axios.put(`${API_URL}${editingVenue.id}/`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Venue updated successfully!");
      } else {
        await axios.post(API_URL, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Venue created successfully!");
      }
      setIsFormOpen(false);
      fetchVenues();
    } catch (error) {
      console.error("Error saving venue:", error);
      toast.error("Failed to save venue.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Venue Management</h1>
      <button onClick={handleAddVenue} className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4">
        <FiPlus className="inline-block mr-2" /> Add Venue
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {venues.map((venue) => (
          <div key={venue.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={venue.image ? `http://localhost:8000${venue.image}` : 'https://via.placeholder.com/300x200?text=No+Image'} 
              alt={venue.name} 
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{venue.name}</h2>
              <p className="text-gray-600 text-sm mb-2">{venue.address}</p>
              <p className="text-gray-700 text-base mb-4">Capacity: {venue.capacity}</p>
              <div className="flex justify-end space-x-2">
                <button onClick={() => handleEditVenue(venue)} className="text-blue-600 hover:text-blue-900">
                  <FiEdit2 size={20} />
                </button>
                <button onClick={() => handleDeleteVenue(venue.id)} className="text-red-600 hover:text-red-900">
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{editingVenue ? 'Edit Venue' : 'Add Venue'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-md" rows="3" required></textarea>
              <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleInputChange} className="w-full p-2 border rounded-md" required />
              <input type="number" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleInputChange} step="any" className="w-full p-2 border rounded-md" />
              <input type="number" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleInputChange} step="any" className="w-full p-2 border rounded-md" />
              <input type="file" name="image" onChange={handleFileChange} className="w-full p-2 border rounded-md" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenuePage;