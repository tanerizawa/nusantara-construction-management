/**
 * useFinancialReports Hook
 * Custom hook for managing financial reports
 */

import { useState, useCallback } from "react";
import { financeAPI } from "../../../services/api";

export const useFinancialReports = (
  selectedSubsidiary = "all",
  selectedProject = "all"
) => {
  const [financialReports, setFinancialReports] = useState({
    incomeStatement: {},
    balanceSheet: {},
    cashFlow: {},
    summary: {},
  });
  const [reportsLoading, setReportsLoading] = useState(false);
  const [activeDetailedReport, setActiveDetailedReport] = useState(null);

  /**
   * Fetch financial reports
   */
  const fetchFinancialReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const params = {};

      if (selectedSubsidiary !== "all") {
        params.subsidiary_id = selectedSubsidiary;
      }

      if (selectedProject !== "all") {
        params.project_id = selectedProject;
      }

      const response = await financeAPI.getFinancialReports(params);

      if (response.success) {
        setFinancialReports(response.data);
      }
    } catch (error) {
      console.error("Error fetching financial reports:", error);
      setFinancialReports({
        incomeStatement: {},
        balanceSheet: {},
        cashFlow: {},
        summary: {},
      });
    } finally {
      setReportsLoading(false);
    }
  }, [selectedSubsidiary, selectedProject]);

  /**
   * Toggle detailed report view
   */
  const toggleDetailedReport = (reportType) => {
    setActiveDetailedReport((prev) =>
      prev === reportType ? null : reportType
    );
  };

  /**
   * Close detailed report
   */
  const closeDetailedReport = () => {
    setActiveDetailedReport(null);
  };

  return {
    financialReports,
    reportsLoading,
    activeDetailedReport,
    fetchFinancialReports,
    toggleDetailedReport,
    closeDetailedReport,
  };
};
