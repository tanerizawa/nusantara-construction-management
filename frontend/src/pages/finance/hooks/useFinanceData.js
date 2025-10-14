/**
 * useFinanceData Hook
 * Custom hook for managing finance master data (subsidiaries, projects, filters)
 */

import { useState, useEffect } from "react";
import { subsidiariesAPI, projectsAPI } from "../../../services/api";

export const useFinanceData = () => {
  // Subsidiaries state
  const [subsidiaries, setSubsidiaries] = useState([]);
  const [loadingSubsidiaries, setLoadingSubsidiaries] = useState(false);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Filter state
  const [selectedSubsidiary, setSelectedSubsidiary] = useState("all");
  const [selectedProject, setSelectedProject] = useState("all");

  /**
   * Fetch all subsidiaries
   */
  const fetchSubsidiaries = async () => {
    try {
      setLoadingSubsidiaries(true);
      const response = await subsidiariesAPI.getAll();

      if (response.success && response.data) {
        setSubsidiaries(response.data);
      } else {
        console.error("Failed to fetch subsidiaries:", response.message);
      }
    } catch (error) {
      console.error("Error fetching subsidiaries:", error);
    } finally {
      setLoadingSubsidiaries(false);
    }
  };

  /**
   * Fetch all projects
   * Filter to only show unfinished projects (not completed or cancelled)
   */
  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await projectsAPI.getAll({ limit: 100 });

      if (response.success && response.data) {
        // Filter only unfinished projects
        const unfinishedProjects = response.data.filter(
          project => project.status !== 'completed' && project.status !== 'cancelled'
        );
        setProjects(unfinishedProjects);
        setFilteredProjects(unfinishedProjects);
      } else {
        console.error("Failed to fetch projects:", response.error);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  /**
   * Filter projects by subsidiary
   */
  const filterProjectsBySubsidiary = (subsidiaryId) => {
    if (subsidiaryId === "all") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) => project.subsidiaryId === subsidiaryId
      );
      setFilteredProjects(filtered);
    }

    setSelectedProject("all");
  };

  /**
   * Handle subsidiary selection change
   */
  const handleSubsidiaryChange = (subsidiaryId) => {
    setSelectedSubsidiary(subsidiaryId);
    filterProjectsBySubsidiary(subsidiaryId);
  };

  /**
   * Handle project selection change
   */
  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
  };

  /**
   * Get subsidiary information by ID
   */
  const getSubsidiaryInfo = (subsidiaryId) => {
    if (!subsidiaryId) return null;
    return subsidiaries.find((sub) => sub.id === subsidiaryId);
  };

  /**
   * Get project information by ID
   */
  const getProjectInfo = (projectId) => {
    if (!projectId) return null;
    return projects.find((proj) => proj.id === projectId);
  };

  /**
   * Get subsidiary from transaction
   */
  const getSubsidiaryFromTransaction = (transaction) => {
    if (!transaction?.project) return null;

    const subsidiaryId = transaction.project.subsidiaryId;
    const subsidiary = subsidiaries.find((sub) => sub.id === subsidiaryId);

    return subsidiary
      ? {
          id: subsidiary.id,
          name: subsidiary.name,
          type: subsidiary.type,
        }
      : null;
  };

  // Load initial data on mount
  useEffect(() => {
    fetchSubsidiaries();
    fetchProjects();
  }, []);

  // Update filtered projects when subsidiary changes
  useEffect(() => {
    filterProjectsBySubsidiary(selectedSubsidiary);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubsidiary]);

  return {
    // Data
    subsidiaries,
    projects,
    filteredProjects,

    // Loading states
    loadingSubsidiaries,
    loadingProjects,

    // Filter state
    selectedSubsidiary,
    selectedProject,

    // Actions
    fetchSubsidiaries,
    fetchProjects,
    handleSubsidiaryChange,
    handleProjectChange,
    filterProjectsBySubsidiary,

    // Helpers
    getSubsidiaryInfo,
    getProjectInfo,
    getSubsidiaryFromTransaction,
  };
};
