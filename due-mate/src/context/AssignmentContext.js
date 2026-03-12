import React, { createContext, useState, useContext, useEffect } from 'react';
import { assignmentService } from '../services/api';
import { useAuth } from './AuthContext';

const AssignmentContext = createContext();

export const useAssignments = () => useContext(AssignmentContext);

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchAssignments = async () => {
    if (!isAuthenticated) {
      setAssignments([]);
      return;
    }
    
    setLoading(true);
    try {
      const data = await assignmentService.getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [isAuthenticated]);

  const addAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentService.createAssignment(assignmentData);
      setAssignments(prev => [newAssignment, ...prev]);
      return newAssignment;
    } catch (error) {
      console.error('Error adding assignment:', error);
      throw error;
    }
  };

  const updateAssignment = async (id, updatedData) => {
    try {
      const updated = await assignmentService.updateAssignment(id, updatedData);
      setAssignments(prev => 
        prev.map(a => a.id === id ? updated : a)
      );
      return updated;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  };

  const toggleStatus = async (id) => {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    try {
      const newStatus = assignment.status === 'pending' ? 'completed' : 'pending';
      const updated = await assignmentService.updateAssignment(id, { 
        ...assignment, 
        status: newStatus 
      });
      setAssignments(prev => 
        prev.map(a => a.id === id ? updated : a)
      );
    } catch (error) {
      console.error('Error toggling assignment status:', error);
    }
  };

  const deleteAssignment = async (id) => {
    try {
      await assignmentService.deleteAssignment(id);
      setAssignments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  };

  return (
    <AssignmentContext.Provider value={{
      assignments,
      loading,
      addAssignment,
      updateAssignment,
      deleteAssignment,
      toggleStatus,
      refreshAssignments: fetchAssignments
    }}>
      {children}
    </AssignmentContext.Provider>
  );
};
