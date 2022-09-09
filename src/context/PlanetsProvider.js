import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import PlanetsContext from './PlanetsContext';

function PlanetsProvider({ children }) {
  const [planets, addPlanets] = useState([{}]);
  const [filterdPlanets, filterPlanets] = useState([{}]);
  const [filterByNumericValues, changeNumberFilter] = useState([]);

  useEffect(() => {
    fetch('https://swapi-trybe.herokuapp.com/api/planets/')
      .then((request) => request.json())
      .then((data) => data.results)
      .then((array) => {
        array.forEach((planet) => delete planet.residents);
        return array;
      })
      .then((final) => {
        addPlanets(final);
        filterPlanets(final);
      });
  }, []);

  const context = {
    planets,
    filterPlanets,
    filterdPlanets,
    filterByNumericValues,
    changeNumberFilter,
  };

  return (
    <PlanetsContext.Provider value={ context }>
      { children }
    </PlanetsContext.Provider>
  );
}

export default PlanetsProvider;

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
