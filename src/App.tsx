import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from "react-dnd-html5-backend";
import './App.css';
import Playground from './Playground';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Playground />
    </DndProvider>
  );
}

export default App;
