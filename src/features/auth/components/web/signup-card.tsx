import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import type { AuthCardHandle } from '../../types';
import { AuthCard, PrimaryButton, SwitchNotice } from './auth-card';
import { Field } from './field';

export interface SignupCardProps {
  onSwitchToLogin: () => void;
}

/**
 * Card "Criar conta" (`#card-cadastro`): formulário de cadastro.
 * TODO: validar os dados e criar a conta (comportamento ainda não
 * implementado no site; todos os módulos permanecem aqui).
 */
export const SignupCard = forwardRef<AuthCardHandle, SignupCardProps>(
  function SignupCard({ onSwitchToLogin }, ref) {
    const nomeRef = useRef<TextInput>(null);
    const [nome, setNome] = useState('');
    const [documento, setDocumento] = useState('');
    const [email, setEmail] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    useImperativeHandle(
      ref,
      () => ({
        focusFirstField: () => nomeRef.current?.focus(),
      }),
      []
    );

    return (
      <AuthCard title="Criar conta" subtitle="Preencha os dados para começar a usar.">
        <Field
          ref={nomeRef}
          label="Nome ou razão social"
          value={nome}
          onChangeText={setNome}
          placeholder="Como você quer ser chamado"
          autoComplete="name"
        />
        <Field
          label="CPF ou CNPJ"
          value={documento}
          onChangeText={setDocumento}
          placeholder="000.000.000-00"
          inputMode="numeric"
        />
        <Field
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="voce@empresa.com"
          inputMode="email"
          autoComplete="email"
        />
        <Field
          label="Senha"
          value={novaSenha}
          onChangeText={setNovaSenha}
          placeholder="Mínimo de 8 caracteres"
          secure
          autoComplete="new-password"
        />
        <Field
          label="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          placeholder="Repita a senha"
          secure
          autoComplete="new-password"
        />
        <PrimaryButton onPress={() => {
          // TODO: validar os dados e criar a conta.
        }}
        >
          Criar conta
        </PrimaryButton>
        <SwitchNotice
          notice="Já tem conta?"
          linkLabel="Entrar"
          onSwitch={onSwitchToLogin}
        />
      </AuthCard>
    );
  }
);
