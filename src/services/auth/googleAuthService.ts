import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { GoogleAuthProfile } from '../../types/auth';

declare const process:
  | {
      env?: Record<string, string | undefined>;
    }
  | undefined;

type GoogleSignInModule = typeof import('@react-native-google-signin/google-signin');

let configuredClientId: string | null = null;

function getExtraGoogleWebClientId(): string | undefined {
  const extra = Constants.expoConfig?.extra as
    | { googleSignIn?: { webClientId?: string } }
    | undefined;
  return extra?.googleSignIn?.webClientId;
}

export function getGoogleWebClientId(): string | null {
  const envClientId =
    typeof process !== 'undefined' ? process.env?.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID : undefined;
  const clientId = envClientId || getExtraGoogleWebClientId();
  return clientId && clientId.trim().length > 0 ? clientId.trim() : null;
}

async function loadGoogleSignIn(): Promise<GoogleSignInModule> {
  return import('@react-native-google-signin/google-signin');
}

function getFriendlyGoogleError(error: unknown, module: GoogleSignInModule): string {
  if (!module.isErrorWithCode(error)) {
    return 'Nao foi possivel concluir o login com Google.';
  }

  if (error.code === module.statusCodes.SIGN_IN_CANCELLED) {
    return 'Login com Google cancelado.';
  }

  if (error.code === module.statusCodes.IN_PROGRESS) {
    return 'Ja existe um login com Google em andamento.';
  }

  if (error.code === module.statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services indisponivel ou desatualizado neste aparelho.';
  }

  return 'Nao foi possivel concluir o login com Google.';
}

export async function signInWithGoogle(): Promise<GoogleAuthProfile> {
  if (Platform.OS === 'web') {
    throw new Error('Login com Google nativo esta disponivel apenas no app mobile.');
  }

  const webClientId = getGoogleWebClientId();
  if (!webClientId) {
    throw new Error(
      'Configure EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ou extra.googleSignIn.webClientId para ativar o Google Login.'
    );
  }

  const module = await loadGoogleSignIn();

  if (configuredClientId !== webClientId) {
    module.GoogleSignin.configure({
      webClientId,
      scopes: ['profile', 'email'],
      offlineAccess: false,
    });
    configuredClientId = webClientId;
  }

  try {
    await module.GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const response = await module.GoogleSignin.signIn();

    if (!module.isSuccessResponse(response)) {
      throw new Error('Login com Google cancelado.');
    }

    const { user } = response.data;
    if (!user.email) {
      throw new Error('A conta Google nao retornou email.');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || user.email,
      photoUrl: user.photo,
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'Login com Google cancelado.') {
      throw error;
    }

    throw new Error(getFriendlyGoogleError(error, module));
  }
}
