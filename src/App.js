import React from 'react';
import './App.css';

import Table from './Components/Table';
import PlanetsProvider from './context/PlanetsProvider';
import Filters from './Components/Filters';

function App() {
  return (
    <div>
      <PlanetsProvider>
        <Filters />
        <Table />
      </PlanetsProvider>
    </div>
  );
}

export default App;
