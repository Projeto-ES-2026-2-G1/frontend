import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { router } from 'expo-router';
import { logIn } from '../service';
import type { AuthCardHandle } from '../types';
import { ActionLink, AuthCard, PrimaryButton, SwitchNotice } from './auth-card';
import { Field } from './field';

export interface LoginCardProps {
  onSwitchToSignup: () => void;
}

/**
 * Card "Entrar" (`#card-login`): formulário de login que foca
 * o primeiro campo vazio, igual à validação feita no site.
 */
export const LoginCard = forwardRef<AuthCardHandle, LoginCardProps>(
  function LoginCard({ onSwitchToSignup }, ref) {
    const usuarioRef = useRef<TextInput>(null);
    const senhaRef = useRef<TextInput>(null);
    const [usuario, setUsuario] = useState('');
    const [senha, setSenha] = useState('');

    useImperativeHandle(
      ref,
      () => ({
        focusFirstField: () => usuarioRef.current?.focus(),
      }),
      []
    );

    function handleSubmit() {
      const campoVazio = !usuario.trim()
        ? usuarioRef.current
        : !senha.trim()
          ? senhaRef.current
          : null;

      if (campoVazio) {
        campoVazio.focus();
        return;
      }

      // Provisório: a autenticação real virá da API (ver TODO no auth.service).
      logIn();
      router.replace('/dashboard');
    }

    return (
      <AuthCard
        title="Entrar"
        subtitle="Acesse sua conta com CPF, CNPJ ou e-mail."
      >
        <Field
          ref={usuarioRef}
          label="CPF, CNPJ ou e-mail"
          value={usuario}
          onChangeText={setUsuario}
          placeholder="000.000.000-00"
          autoComplete="username"
        />
        <Field
          ref={senhaRef}
          label="Senha"
          value={senha}
          onChangeText={setSenha}
          placeholder="Mínimo de 8 caracteres"
          secure
          autoComplete="password"
        />
        {/* TODO: fluxo de recuperação de senha (como no site, ainda não leva a lugar nenhum). */}
        <ActionLink center>Esqueci minha senha</ActionLink>
        <PrimaryButton onPress={handleSubmit}>Entrar</PrimaryButton>
        <SwitchNotice
          notice="Ainda não tem conta?"
          linkLabel="Criar conta"
          onSwitch={onSwitchToSignup}
        />
      </AuthCard>
    );
  }
);
