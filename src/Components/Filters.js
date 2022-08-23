import React, { useState } from 'react';

import PlanetsContext from '../context/PlanetsContext';

export default function Table() {
  const [inputs, changeInput] = useState({
    inputText: '',
  });

  const Filters = (prevState, planets, filterPlanets) => {
    // name Filter
    filterPlanets(planets.filter((planet) => planet.name.includes(prevState.inputText)));
  };

  const updateState = (target, planets, filterPlanets) => {
    changeInput(() => {
      console.log('a');
      return {
        ...inputs,
        [target.name]: target.value,
      };
    });
    changeInput((prevState) => {
      Filters(prevState, planets, filterPlanets);
      return {
        ...prevState,
      };
    });
  };

  return (
    <PlanetsContext.Consumer>
      {({ planets, filterPlanets }) => (
        <div>
          <input
            name="inputText"
            type="text"
            placeholder="..."
            value={ inputs.inputText }
            onChange={ ({ target }) => updateState(target, planets, filterPlanets) }
            data-testid="name-filter"
          />
        </div>
      )}
    </PlanetsContext.Consumer>
  );
}
