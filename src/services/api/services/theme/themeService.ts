export const fetchTenantTheme = async (): Promise</* TenantTheme */ any[]> => {
  // In real implementation, this would be:
  // return axios.get('/api/tenant-themes').then(res => res.data);

  return Promise.resolve([
    {
      id: "green_theme",
      name: "Eco Green",
      palette: {
        primary: { main: "#008037" },
        secondary: { main: "#FFC107" },
      },
    },
    {
      id: "blue_theme",
      name: "Corporate Blue",
      palette: {
        primary: { main: "#1976D2" },
        secondary: { main: "#7B1FA2" },
      },
      typography: {
        fontFamily: "Roboto, sans-serif",
      },
    },
    {
      id: "market_theme",
      name: "Marketplace",
      palette: {
        primary: { main: "#00C853" },
        secondary: { main: "#FF6D00" },
      },
    },
  ]);
};
