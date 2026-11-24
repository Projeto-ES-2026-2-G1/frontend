import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { router } from 'expo-router';
import { logIn } from '../../service';
import type { AuthCardHandle } from '../../types';
import {
  ActionLink,
  AuthCard,
  FeedbackBanner,
  PrimaryButton,
  SwitchNotice,
} from './auth-card';
import { Field } from './field';

export interface LoginCardProps {
  onSwitchToSignup: () => void;
  onForgotPassword?: () => void;
  successNotice?: string | null;
  onDismissNotice?: () => void;
}

/**
 * Card "Entrar" (`#card-login`): formulário de login que foca
 * o primeiro campo vazio, igual à validação feita no site.
 */
export const LoginCard = forwardRef<AuthCardHandle, LoginCardProps>(
  function LoginCard(
    { onSwitchToSignup, onForgotPassword, successNotice, onDismissNotice },
    ref
  ) {
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

    function handleUsuarioChange(value: string) {
      setUsuario(value);
      if (successNotice) {
        onDismissNotice?.();
      }
    }

    function handleSenhaChange(value: string) {
      setSenha(value);
      if (successNotice) {
        onDismissNotice?.();
      }
    }

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
        {successNotice ? (
          <FeedbackBanner variant="success" message={successNotice} />
        ) : null}

        <Field
          ref={usuarioRef}
          label="CPF, CNPJ ou e-mail"
          value={usuario}
          onChangeText={handleUsuarioChange}
          placeholder="000.000.000-00"
          autoComplete="username"
        />
        <Field
          ref={senhaRef}
          label="Senha"
          value={senha}
          onChangeText={handleSenhaChange}
          placeholder="Mínimo de 8 caracteres"
          secure
          autoComplete="password"
          onSubmitEditing={handleSubmit}
        />
        <ActionLink center onPress={onForgotPassword}>
          Esqueci minha senha
        </ActionLink>
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
