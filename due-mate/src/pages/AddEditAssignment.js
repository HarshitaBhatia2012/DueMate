import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FormInput from '../components/FormInput';
import { useAssignments } from '../context/AssignmentContext';
import '../styles/AddEditAssignment.css';

const AddEditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const { assignments, addAssignment, updateAssignment } = useAssignments();

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    due_date: '',
    description: '',
  });

  useEffect(() => {
    if (isEditing) {
      const assignmentToEdit = assignments.find(a => a.id === id);
      if (assignmentToEdit) {
        setFormData({
          title: assignmentToEdit.title,
          subject: assignmentToEdit.subject,
          due_date: new Date(assignmentToEdit.due_date).toISOString().split('T')[0],
          description: assignmentToEdit.description || '',
        });
      }
    }
  }, [id, isEditing, assignments]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...formData,
      due_date: new Date(formData.due_date).toISOString()
    };

    try {
      if (isEditing) {
        await updateAssignment(id, formattedData);
      } else {
        await addAssignment(formattedData);
      }
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to save assignment. Please try again.');
    }
  };

  return (
    <div className="page-container dashboard-layout">
      <Navbar />
      
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content form-page-main">
          <div className="form-header">
            <Link to="/dashboard" className="back-link">
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="form-title">
              {isEditing ? 'Edit Assignment' : 'Add New Assignment'}
            </h1>
            <p className="form-subtitle">
              Fill in the details below to track your task.
            </p>
          </div>
          
          <div className="form-card card">
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="grid-item-full">
                  <FormInput
                    id="title"
                    label="Assignment Title"
                    placeholder="e.g., Read Chapter 5: Organic Chemistry"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid-item">
                  <FormInput
                    id="subject"
                    label="Subject / Course"
                    placeholder="e.g., Chemistry 101"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid-item">
                  <FormInput
                    id="due_date"
                    type="date"
                    label="Due Date"
                    value={formData.due_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="grid-item-full">
                  <FormInput
                    id="description"
                    type="textarea"
                    label="Description & Notes"
                    placeholder="Add any specific requirements, links, or notes for this assignment..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <Link to="/dashboard" className="btn btn-outline">
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} />
                  {isEditing ? 'Update Assignment' : 'Save Assignment'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddEditAssignment;
