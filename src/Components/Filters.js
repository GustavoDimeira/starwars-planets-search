import React, { useState } from 'react';

import PlanetsContext from '../context/PlanetsContext';

let resultFilter;

const columnsFixed = ['population', 'orbital_period', 'diameter',
  'rotation_period', 'surface_water'];
let columns = [...columnsFixed];

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
    target, removing) => {
    if (target !== textFilter) {
      filterByNumericValues.forEach((singNumericFilter) => {
        finalFilterFunction(singNumericFilter);
      });
    } else {
      let temp = [...filterByNumericValues];
      if (!removing) {
        temp = [...filterByNumericValues,
          {
            column: newNumberFilter.column,
            comparison: newNumberFilter.comparison,
            value: newNumberFilter.value,
          },
        ];
      }
      columns = [...columnsFixed];
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
    const removing = numericFilterInfo[2];
    // name Filter
    resultFilter = planets.filter((planet) => planet.name.includes(target));
    // number filter
    if (changeNumberFilter && !removing) {
      changeNumberFilter((prev) => [
        ...prev,
        {
          column: newNumberFilter.column,
          comparison: newNumberFilter.comparison,
          value: newNumberFilter.value,
        },
      ]);
    }
    numberFilter(filterByNumericValues, target, removing);
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

  const removeItem = (index, filterByNumericValues, changeNumberFilter, filterInfos) => {
    filterByNumericValues.splice(index, 1);
    changeNumberFilter(filterByNumericValues);
    const numericFilterInfo = [changeNumberFilter, filterByNumericValues, true];
    filters(filterInfos[0], filterInfos[1], undefined, numericFilterInfo);
  };

  const removeAll = (planets, filterPlanets, changeNumberFilter) => {
    filterPlanets(planets);
    changeNumberFilter([]);
    columns = [...columnsFixed];
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
            disabled={ !columns[0] }
          >
            Adicionar
          </button>
          {
            filterByNumericValues.map((singleFilter, i) => {
              const filterInfos = [planets, filterPlanets];
              return (
                <div
                  key={ i }
                  data-testid="filter"
                >
                  <p>
                    { singleFilter.column }
                    <br />
                    { singleFilter.comparison }
                    <br />
                    { singleFilter.value }
                  </p>
                  <button
                    type="button"
                    onClick={ () => {
                      removeItem(i, filterByNumericValues,
                        changeNumberFilter, filterInfos);
                    } }
                  >
                    X
                  </button>
                </div>
              );
            })
          }
          <button
            type="button"
            data-testid="button-remove-filters"
            onClick={ () => removeAll(planets, filterPlanets, changeNumberFilter) }
          >
            Remover todas filtragens
          </button>
        </div>
      )}
    </PlanetsContext.Consumer>
  );
}
