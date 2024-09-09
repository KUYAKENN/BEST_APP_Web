import React, { useState, useEffect } from 'react';
import Navbar from './Navbar'; // Import the reusable Navbar component
import '../index.css';

const Directory = () => {
  const [entries, setEntries] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Load entries from local storage on component mount
  useEffect(() => {
    const storedEntries = JSON.parse(localStorage.getItem('directoryEntries')) || [];
    setEntries(storedEntries);
  }, []);

  // Save entries to local storage whenever they change
  useEffect(() => {
    localStorage.setItem('directoryEntries', JSON.stringify(entries));
  }, [entries]);

  // Add a new entry to the directory
  const addEntry = (entry, pictureFile) => {
    const newEntry = {
      ...entry,
      id: entries.length > 0 ? entries[entries.length - 1].id + 1 : 1, // Generate new ID
      picture: pictureFile ? URL.createObjectURL(pictureFile) : '', // Convert picture to a temporary URL
    };
    setEntries([...entries, newEntry]);
    setShowAddModal(false);
  };

  // Edit an existing entry
  const editEntry = (updatedEntry, pictureFile) => {
    const updatedEntries = entries.map((entry) =>
      entry.id === updatedEntry.id
        ? {
            ...updatedEntry,
            picture: pictureFile ? URL.createObjectURL(pictureFile) : updatedEntry.picture,
          }
        : entry
    );
    setEntries(updatedEntries);
    setShowEditModal(false);
  };

  // Delete an entry
  const deleteEntry = (id) => {
    const updatedEntries = entries.filter((entry) => entry.id !== id);
    setEntries(updatedEntries);
  };

  // Filter entries based on search query
  const filteredEntries = entries.filter(
    (entry) =>
      entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Use Navbar component */}
      <Navbar />

      {/* Directory Management Section */}
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main mb-4 md:mb-0"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-main text-white px-6 py-2 rounded-md font-semibold hover:bg-bu transition-colors w-full md:w-auto"
          >
            Add Entry
          </button>
        </div>

        {/* Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex items-center mb-4">
                {entry.picture ? (
                  <img
                    src={entry.picture}
                    alt="User"
                    className="h-16 w-16 rounded-full object-cover mr-4"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                    No Image
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{entry.name}</h3>
                  <p className="text-sm text-gray-500">{entry.position}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{entry.background}</p>
              <p className="text-sm text-gray-500 mb-4">{entry.email}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedEntry(entry);
                    setShowEditModal(true);
                  }}
                  className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Entry Modal */}
      {showAddModal && <EntryModal closeModal={() => setShowAddModal(false)} saveEntry={addEntry} />}

      {/* Edit Entry Modal */}
      {showEditModal && (
        <EntryModal
          closeModal={() => setShowEditModal(false)}
          saveEntry={editEntry}
          entry={selectedEntry}
        />
      )}
    </div>
  );
};

// Modal Component for Adding and Editing Entries
const EntryModal = ({ closeModal, saveEntry, entry }) => {
  const [formData, setFormData] = useState(
    entry || {
      name: '',
      position: '',
      email: '',
      background: '',
      educationalAttainment: '', // New field for educational attainment
      research: [''], // Updated to be an array for multiple research entries
      picture: '',
    }
  );
  const [pictureFile, setPictureFile] = useState(null); // State for picture file

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    setPictureFile(e.target.files[0]); // Set the picture file state
  };

  const handleResearchChange = (index, value) => {
    const newResearch = [...formData.research];
    newResearch[index] = value;
    setFormData({ ...formData, research: newResearch });
  };

  const addResearchField = () => {
    setFormData({ ...formData, research: [...formData.research, ''] });
  };

  const removeResearchField = (index) => {
    const newResearch = formData.research.filter((_, i) => i !== index);
    setFormData({ ...formData, research: newResearch });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEntry(formData, pictureFile);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full mx-4 overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold text-center mb-4">{entry ? 'Edit Entry' : 'Add Entry'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Background</label>
            <input
              type="text"
              name="background"
              value={formData.background}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Educational Attainment</label>
            <input
              type="text"
              name="educationalAttainment"
              value={formData.educationalAttainment}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Research</label>
            {formData.research.map((research, index) => (
              <div key={index} className="flex items-center mb-2">
                <textarea
                  name="research"
                  value={research}
                  onChange={(e) => handleResearchChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
                  rows="2"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeResearchField(index)}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addResearchField}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Research
            </button>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-main text-white px-4 py-2 rounded-md hover:bg-bu transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Directory;
