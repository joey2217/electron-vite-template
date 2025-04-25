export default function Header() {
  return (
    <header className="titleBarContainer">
      <div className="titleBar header">
        <span>ElectronViteTemplate</span>
        <div className="draggable draggable-area"></div>
        {import.meta.env.DEV && <button onClick={window.mainAPI.toggleDevtools}>devtools</button>}
      </div>
    </header>
  );
}
