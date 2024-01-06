import './App.css';


function Root({children}) {
  return (
    <div className="App">
      <header className="App-header" id={'full-size'}>
        {children}
      </header>
    </div>
  );
}

export default Root;
