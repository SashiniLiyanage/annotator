import './App.css';
import Canvas from './components/Canvas'
import config from './config.json'

function App() {

  const file = config["file"]
  return (
    <div className="App">
      <Canvas file={file}/>
    </div>
  );
}

export default App;
