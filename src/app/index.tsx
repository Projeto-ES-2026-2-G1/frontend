import React from 'react';
import { useRouter } from 'expo-router';
import TelaLoginMobile from '../screens/TelaLoginMobile';

export default function LoginRoute() {
  const router = useRouter();

  return (
    <TelaLoginMobile 
      onLogin={() => {
        router.push('/home');
      }} 
    />
  );
}