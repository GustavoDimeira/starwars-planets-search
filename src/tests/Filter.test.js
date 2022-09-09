import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import App from '../App';
import testData from '../../cypress/mocks/testData';
import PlanetsProvider from '../context/PlanetsProvider';

describe('Testando a pagina principal', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
      json: () => Promise.resolve(testData),
    }));
  });

  afterEach(() => jest.clearAllMocks());

  it('Campos imput', async () => {
    render(
      <PlanetsProvider>
        <App />
      </PlanetsProvider>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const name = screen.getByTestId('name-filter');
    const column = screen.getByTestId('column-filter');
    const comparison = screen.getByTestId('comparison-filter');
    const value = screen.getByTestId('value-filter');

    expect(name).toHaveTextContent('');
    expect(column).toHaveTextContent('population');
    expect(comparison).toHaveTextContent('maior que');
    expect(value).toHaveTextContent('');
  });
  it('Reenderizar os 10 planetas e fiiltra-los corretamente', async () => {
    render(
      <PlanetsProvider>
        <App />
      </PlanetsProvider>
    );
    // texto
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    expect(screen.getAllByTestId('planetsList').length).toBe(10);

    userEvent.type(screen.getByTestId('name-filter'), 't');
    expect(screen.getAllByTestId('planetsList').length).toBe(3);
    
    // numerico
    const column = screen.getByTestId('column-filter');
    const comparison = screen.getByTestId('comparison-filter');
    const value = screen.getByTestId('value-filter');

    userEvent.selectOptions(column, 'rotation_period');
    expect(column.value).toBe('rotation_period');
    userEvent.selectOptions(comparison, 'igual a');
    expect(comparison.value).toBe('igual a');
    userEvent.clear(value);
    userEvent.type(value, '23');
    expect(value.value).toBe('23');

    const btnAdd = screen.getByRole('button', {  name: /adicionar/i});

    userEvent.click(btnAdd);
    expect(screen.getAllByTestId('planetsList').length).toBe(2);

    userEvent.selectOptions(comparison, 'menor que');
    userEvent.clear(value);
    userEvent.type(value, '1000000000');
    userEvent.click(btnAdd);
    expect(screen.getAllByTestId('planetsList').length).toBe(1);
  });
  it('Botões remover filtro e remover todos, e modificar o filtro por nome depois de ter adicionado filtro(s) numerico', async () => {
    render(
      <PlanetsProvider>
        <App />
      </PlanetsProvider>
    );
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const btnAdd = screen.getByRole('button', {  name: /adicionar/i});

    userEvent.click(btnAdd);
    userEvent.click(btnAdd);

    expect(screen.getAllByTestId('planetsList').length).toBe(8);

    userEvent.click(screen.getByTestId('btnX-0'));
    userEvent.type(screen.getByTestId('name-filter'), 't');
    expect(screen.getAllByTestId('planetsList').length).toBe(3);

    userEvent.click(screen.getByRole('button', {  name: /remover todas filtragens/i}));
    expect(screen.getAllByTestId('planetsList').length).toBe(10);
  });
});
