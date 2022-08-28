import React, { useState } from 'react';

import PlanetsContext from '../context/PlanetsContext';

let resultFilter;

let columns = ['population', 'orbital_period', 'diameter',
  'rotation_period', 'surface_water'];

export default function Table() {
  const [textFilter, changeText] = useState('');
  const [newNumberFilter, changeNewFilter] = useState({
    column: 'population',
    comparison: 'maior que',
    value: 0,
  });

  // faz a logica que aplica um filtro individual(numerico), no resultado da ultima filtragem && impede que filtros repetidos sejam usados

  const finalFilterFunction = (singNumericFilter) => {
    columns = columns.filter((column) => column !== singNumericFilter.column);
    changeNewFilter({
      ...newNumberFilter,
      column: columns[0],
    });
    switch (singNumericFilter.comparison) {
    case 'maior que':
      resultFilter = resultFilter.filter((p) => Number(p[singNumericFilter.column])
      > Number(singNumericFilter.value));
      break;
    case 'menor que':
      resultFilter = resultFilter.filter((p) => Number(p[singNumericFilter.column])
      < Number(singNumericFilter.value));
      break;
    default:
      resultFilter = resultFilter.filter((p) => Number(p[singNumericFilter.column])
      === Number(singNumericFilter.value));
      break;
    }
  };

  // ve se a ultima atualização de estado foi pelo click, ou escrita, e depois passa por cada filtro chamando a função

  const numberFilter = (filterByNumericValues = [],
    target) => {
    if (target !== textFilter) {
      filterByNumericValues.forEach((singNumericFilter) => {
        finalFilterFunction(singNumericFilter);
      });
    } else {
      const temp = [...filterByNumericValues,
        {
          column: newNumberFilter.column,
          comparison: newNumberFilter.comparison,
          value: newNumberFilter.value,
        },
      ];
      temp.forEach((singNumericFilter) => {
        finalFilterFunction(singNumericFilter);
      });
    }
  };

  // seta o filtro de texto, muda o valor do obj dos filtros numerios e define o valor final do filtro
  const filters = (planets, filterPlanets, target = textFilter,
    numericFilterInfo) => {
    const filterByNumericValues = numericFilterInfo[1];
    const changeNumberFilter = numericFilterInfo[0];
    // name Filter
    resultFilter = planets.filter((planet) => planet.name.includes(target));
    // number filter
    if (changeNumberFilter) {
      changeNumberFilter((prev) => [
        ...prev,
        {
          column: newNumberFilter.column,
          comparison: newNumberFilter.comparison,
          value: newNumberFilter.value,
        },
      ]);
    }
    numberFilter(filterByNumericValues, target);
    filterPlanets(resultFilter);
  };
  // chamado ao clicar no botão
  const updateNumericFiltersArray = (planets, filterPlanets,
    changeNumberFilter, filterByNumericValues) => {
    const numericFilterInfo = [changeNumberFilter, filterByNumericValues];
    filters(planets, filterPlanets, undefined, numericFilterInfo);
  };

  const updateNumberFilterState = ({ target }) => {
    changeNewFilter({
      ...newNumberFilter,
      [target.name]: target.value,
    });
  };

  const updateTextState = (target, planets, filterPlanets, filterByNumericValues) => {
    changeText(() => target.value);
    const numericFilterInfo = [undefined, filterByNumericValues];
    filters(planets, filterPlanets, target.value, numericFilterInfo);
  };

  return (
    <PlanetsContext.Consumer>
      {({ planets, filterPlanets, changeNumberFilter, filterByNumericValues }) => (
        <div>
          <input
            name="inputText"
            type="text"
            placeholder="Planet Name"
            value={ textFilter }
            onChange={ ({ target }) => updateTextState(target, planets, filterPlanets,
              filterByNumericValues) }
            data-testid="name-filter"
          />
          <select
            name="column"
            type="dropdown"
            data-testid="column-filter"
            value={ newNumberFilter.column }
            onChange={ (target) => updateNumberFilterState(target) }
          >
            {
              columns.map((column, i) => <option key={ i }>{ column }</option>)
            }
          </select>
          <select
            name="comparison"
            type="dropdown"
            data-testid="comparison-filter"
            value={ newNumberFilter.comparison }
            onChange={ (target) => updateNumberFilterState(target) }
          >
            <option>maior que</option>
            <option>menor que</option>
            <option>igual a</option>
          </select>
          <input
            name="value"
            type="number"
            data-testid="value-filter"
            placeholder="Insira um numero"
            value={ newNumberFilter.value }
            onChange={ (target) => updateNumberFilterState(target) }
          />
          <button
            name="numericFilter"
            type="button"
            data-testid="button-filter"
            onClick={ () => {
              updateNumericFiltersArray(planets, filterPlanets,
                changeNumberFilter, filterByNumericValues);
            } }
          >
            Adicionar
          </button>
        </div>
      )}
    </PlanetsContext.Consumer>
  );
}
