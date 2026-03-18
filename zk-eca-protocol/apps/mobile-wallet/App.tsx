import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createIssuerChallenge } from '@repo/crypto-core';

const challengePreview = createIssuerChallenge();

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mobile Wallet</Text>
      <Text style={styles.subtitle}>
        Carteira para armazenar a chave e gerar prova de idade (ZKP).
      </Text>
      <Text style={styles.code}>challenge: {challengePreview}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#334155',
  },
  code: {
    marginTop: 14,
    fontSize: 12,
    color: '#0f172a',
  },
});
