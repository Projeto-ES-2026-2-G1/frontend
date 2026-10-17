import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { BrandColors, FontFamily, useResponsive } from '@shared';
import type { AuthCardHandle } from '../types';
import { CheckIcon } from './icons';
import { LoginCard } from './login-card';
import { SignupCard } from './signup-card';

/** Lista de benefícios do painel institucional (lado esquerdo). */
const BENEFITS = [
  'Receitas e despesas sempre em dia',
  'Fluxo de caixa claro para decidir melhor',
  'Relatórios prontos em poucos cliques',
];

/** Font-size `clamp(36px, 3.4vw, 48px)` do h1 da apresentação. */
function getHeadlineFontSize(width: number): number {
  return Math.min(Math.max(36, width * 0.034), 48);
}

/**
 * Tela de login / cadastro (login.html + login.css + login.js).
 * Dois painéis (apresentação à esquerda, cards de acesso à direita)
 * com a troca de cards animada do original.
 */
export function LoginScreen() {
  const { width, isLoginStacked } = useResponsive();
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState<'login' | 'cadastro'>('login');
  const loginCardRef = useRef<AuthCardHandle>(null);
  const signupCardRef = useRef<AuthCardHandle>(null);

  // ---------- Animação de entrada do card (troca entre os cards) ----------
  const entrance = useSharedValue(1);
  const animatedCard = useAnimatedStyle(() => ({
    opacity: entrance.value,
    transform: [{ translateY: interpolate(entrance.value, [0, 1], [10, 0]) }],
  }));

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Reexecuta a animação de entrada (cancelada se o usuário preferir
    // menos movimento) e leva o foco ao primeiro campo.
    /* eslint-disable react-hooks/immutability -- shared values do Reanimated são mutáveis por design */
    if (reducedMotion) {
      entrance.value = 1;
    } else {
      entrance.value = 0;
      entrance.value = withTiming(1, {
        duration: 280,
        easing: Easing.out(Easing.ease),
      });
    }
    /* eslint-enable react-hooks/immutability */

    const destino = active === 'login' ? loginCardRef.current : signupCardRef.current;
    destino?.focusFirstField();
  }, [active, entrance, reducedMotion]);

  const headlineFontSize = getHeadlineFontSize(width);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.page}
          contentContainerStyle={[styles.pageContent, !isLoginStacked && styles.pageWide]}
        >
          {/* Painel verde de apresentação (esquerda) */}
          <View
            style={[
              styles.showcase,
              !isLoginStacked && styles.showcaseWide,
              isLoginStacked && styles.showcaseStacked,
            ]}
          >
            <Text style={styles.brand}>Gestão na Mão</Text>

            <View
              style={[
                styles.showcaseContent,
                !isLoginStacked && styles.showcaseContentWide,
                isLoginStacked && styles.showcaseContentStacked,
              ]}
            >
              <Text
                style={[
                  styles.headline,
                  {
                    fontSize: headlineFontSize,
                    lineHeight: headlineFontSize * 1.12,
                    letterSpacing: -0.01 * headlineFontSize,
                    maxWidth: headlineFontSize * 11,
                  },
                ]}
              >
                Seu financeiro na palma da mão.
              </Text>
              <Text style={styles.headlineSupport}>
                Controle receitas, despesas e fluxo de caixa do seu negócio em um
                só lugar, de forma simples e organizada.
              </Text>

              <View style={styles.benefits}>
                {BENEFITS.map((benefit) => (
                  <View key={benefit} style={styles.benefitItem}>
                    <CheckIcon />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Área dos cards de acesso (direita) */}
          <View style={[styles.access, !isLoginStacked && styles.accessWide]}>
            <Animated.View
              style={[
                styles.card,
                isLoginStacked && styles.cardStacked,
                animatedCard,
                active === 'login' ? styles.cardVisible : styles.cardHidden,
              ]}
            >
              <LoginCard onSwitchToSignup={() => setActive('cadastro')} />
            </Animated.View>

            <Animated.View
              style={[
                styles.card,
                isLoginStacked && styles.cardStacked,
                animatedCard,
                active === 'cadastro' ? styles.cardVisible : styles.cardHidden,
              ]}
            >
              <SignupCard onSwitchToLogin={() => setActive('login')} />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BrandColors.lightGray,
  },
  kav: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  // `.pagina`: min-height 100vh; em telas larguras, grid 1fr 1fr.
  pageContent: {
    minHeight: '100%',
  },
  pageWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },

  // ---------- Painel verde (esquerda) ----------
  showcase: {
    // Em telas largas: grid 1fr 1fr (metade da largura, altura cheia).
    padding: 56,
    paddingHorizontal: 64,
    backgroundColor: BrandColors.darkGreen,
  },
  showcaseWide: {
    flex: 1,
  },
  showcaseStacked: {
    // Media query ≤900px: padding 32px 24px.
    padding: 32,
    paddingHorizontal: 24,
  },
  brand: {
    fontFamily: FontFamily.title,
    fontSize: 26,
    lineHeight: 26 * 1.2,
    color: BrandColors.white,
  },
  showcaseContent: {
    maxWidth: 560,
  },
  // `.apresentacao__conteudo`: margin-block auto + padding-block 48px.
  showcaseContentWide: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 48,
  },
  // Media query ≤900px: padding-block 40px 24px; margin-block 0.
  showcaseContentStacked: {
    paddingVertical: 40,
    marginBottom: 24,
  },
  headline: {
    fontFamily: FontFamily.title,
    color: BrandColors.white,
  },
  headlineSupport: {
    marginTop: 24,
    maxWidth: 34 * 19,
    fontFamily: FontFamily.body,
    fontSize: 19,
    lineHeight: 19 * 1.55,
    color: 'rgba(232, 234, 229, 0.85)',
  },
  benefits: {
    marginTop: 28,
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  benefitText: {
    fontFamily: FontFamily.body,
    fontSize: 17,
    color: BrandColors.lightGray,
  },

  // ---------- Cards (direita) ----------
  access: {
    // Media query ≤900px: padding 32px 16px 48px.
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  accessWide: {
    // `.acesso`: grid com place-items center + padding 48px 32px.
    flex: 1,
    padding: 48,
    paddingHorizontal: 32,
  },
  card: {
    width: '100%',
    maxWidth: 445,
    borderRadius: 24,
    padding: 48,
    paddingHorizontal: 40,
    backgroundColor: BrandColors.white,
    // box-shadow: 0 12px 28px rgba(0, 65, 46, 0.10)
    boxShadow: '0 12px 28px rgba(0, 65, 46, 0.10)',
  },
  cardStacked: {
    padding: 36,
    paddingHorizontal: 24,
  },
  cardVisible: {
    display: 'flex',
  },
  cardHidden: {
    display: 'none',
  },
});
