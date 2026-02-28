import SideBar from "./Sidebar";
import NavBar from "./Navbar";

const AppLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f7fb" }}>
      <SideBar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <NavBar />
        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
