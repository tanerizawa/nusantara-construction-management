// Team statistics calculations
export const calculateTeamStats = (teamMembers) => {
  const totalMembers = teamMembers.length;
  const activeMembers = teamMembers.filter(m => m.status === 'active').length;
  const totalCost = teamMembers.reduce((sum, m) => sum + m.totalCost, 0);
  const totalHours = teamMembers.reduce((sum, m) => sum + m.totalHours, 0);
  const avgPerformance = teamMembers.reduce((sum, m) => sum + m.performance, 0) / totalMembers;
  const avgAllocation = teamMembers.reduce((sum, m) => sum + m.allocation, 0) / totalMembers;
  
  return {
    totalMembers,
    activeMembers,
    totalCost,
    totalHours,
    avgPerformance: avgPerformance || 0,
    avgAllocation: avgAllocation || 0
  };
};

// Filter team members
export const filterTeamMembers = (teamMembers, searchTerm, filterRole) => {
  return teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });
};

// Count roles in team
export const countRoles = (teamMembers, roles) => {
  const roleCounts = { ...roles };
  teamMembers.forEach(member => {
    if (roleCounts[member.role]) {
      roleCounts[member.role].count++;
    }
  });
  return roleCounts;
};
