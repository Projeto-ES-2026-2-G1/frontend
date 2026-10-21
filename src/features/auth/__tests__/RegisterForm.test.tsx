import React from 'react';
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import renderer, { act } from 'react-test-renderer';
import { Alert, Text, TextInput, TouchableOpacity } from 'react-native';
import { registerUser } from '../api/registerApi';
import { RegisterForm } from '../components/RegisterForm';

jest.mock('../api/registerApi', () => ({
  registerUser: jest.fn(),
}));

describe('RegisterForm', () => {
  const mockedRegisterUser = jest.mocked(registerUser);

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderForm = () => {
    let component: renderer.ReactTestRenderer;

    act(() => {
      component = renderer.create(<RegisterForm />);
    });

    return component!;
  };

  const changeInput = (
    component: renderer.ReactTestRenderer,
    placeholder: string,
    value: string,
  ) => {
    const input = component.root
      .findAllByType(TextInput)
      .find((candidate) => candidate.props.placeholder === placeholder);

    if (!input) {
      throw new Error(`Campo "${placeholder}" não encontrado.`);
    }

    input.props.onChangeText(value);
  };

  it('renderiza o título e o botão de cadastro', () => {
    const component = renderForm();
    const renderedTree = JSON.stringify(component.toJSON());

    expect(renderedTree).toContain('Criar Conta');
    expect(renderedTree).toContain('Cadastrar');
  });

  it('avisa quando algum campo obrigatório não foi preenchido', async () => {
    const component = renderForm();
    const button = component.root.findByType(TouchableOpacity);

    await act(async () => {
      button.props.onPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Atenção',
      'Por favor, preencha todos os campos.',
    );
    expect(mockedRegisterUser).not.toHaveBeenCalled();
  });

  it('não envia o cadastro quando um dos campos obrigatórios está vazio', async () => {
    const component = renderForm();
    const button = component.root.findByType(TouchableOpacity);

    act(() => {
      changeInput(component, 'Nome Completo', 'Maria Souza');
      changeInput(component, 'E-mail', 'maria@email.com');
      changeInput(component, 'CPF ou CNPJ', '52998224725');
      changeInput(component, 'Senha (Mínimo de 8 caracteres)', 'senha123');
    });

    await act(async () => {
      button.props.onPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Atenção',
      'Por favor, preencha todos os campos.',
    );
    expect(mockedRegisterUser).not.toHaveBeenCalled();
  });

  it('envia os dados quando todos os campos estão preenchidos', async () => {
    mockedRegisterUser.mockResolvedValue({ token: 'token-valido' });
    const component = renderForm();
    const button = component.root.findByType(TouchableOpacity);

    act(() => {
      changeInput(component, 'Nome Completo', 'Maria Souza');
      changeInput(component, 'E-mail', 'maria@email.com');
      changeInput(component, 'CPF ou CNPJ', '52998224725');
      changeInput(component, 'Telefone', '11999998888');
      changeInput(component, 'Senha (Mínimo de 8 caracteres)', 'senha123');
    });

    await act(async () => {
      button.props.onPress();
    });

    expect(mockedRegisterUser).toHaveBeenCalledWith({
      name: 'Maria Souza',
      email: 'maria@email.com',
      password: 'senha123',
      cpfCnpj: '52998224725',
      phone: '11999998888',
    });
    expect(Alert.alert).toHaveBeenCalledWith(
      'Sucesso!',
      'Usuário cadastrado com sucesso.',
    );
  });

  it('exibe um erro quando a API rejeita o cadastro', async () => {
    mockedRegisterUser.mockRejectedValue(new Error('E-mail já cadastrado.'));
    const component = renderForm();
    const button = component.root.findByType(TouchableOpacity);

    act(() => {
      changeInput(component, 'Nome Completo', 'Maria Souza');
      changeInput(component, 'E-mail', 'maria@email.com');
      changeInput(component, 'CPF ou CNPJ', '52998224725');
      changeInput(component, 'Telefone', '11999998888');
      changeInput(component, 'Senha (Mínimo de 8 caracteres)', 'senha123');
    });

    await act(async () => {
      button.props.onPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'Erro no cadastro',
      'E-mail já cadastrado.',
    );
    expect(Alert.alert).not.toHaveBeenCalledWith(
      'Sucesso!',
      'Usuário cadastrado com sucesso.',
    );
  });

  it('desabilita o botão enquanto o cadastro está em andamento', async () => {
    let resolveRegistration!: (response: Awaited<ReturnType<typeof registerUser>>) => void;
    mockedRegisterUser.mockReturnValue(
      new Promise((resolve) => {
        resolveRegistration = resolve;
      }),
    );

    const component = renderForm();
    const button = component.root.findByType(TouchableOpacity);

    act(() => {
      changeInput(component, 'Nome Completo', 'Maria Souza');
      changeInput(component, 'E-mail', 'maria@email.com');
      changeInput(component, 'CPF ou CNPJ', '52998224725');
      changeInput(component, 'Telefone', '11999998888');
      changeInput(component, 'Senha (Mínimo de 8 caracteres)', 'senha123');
    });

    await act(async () => {
      button.props.onPress();
      await Promise.resolve();
    });

    const loadingButton = component.root.findByType(TouchableOpacity);
    expect(loadingButton.props.disabled).toBe(true);
    expect(loadingButton.findByType(Text).props.children).toBe('Cadastrando...');

    await act(async () => {
      resolveRegistration({ token: 'token-valido' });
    });

    const readyButton = component.root.findByType(TouchableOpacity);
    expect(readyButton.props.disabled).toBe(false);
    expect(readyButton.findByType(Text).props.children).toBe('Cadastrar');
  });
});
