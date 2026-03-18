# Zk-ECA: Protocolo de Identidade Descentralizada e Privacidade (Lei Felca)

O **Zk-ECA** é um middleware de identidade autossoberana (SSI) projetado para resolver o conflito entre a necessidade de verificação de idade (exigida pela Lei Felca/ECA Digital) e o direito à privacidade (garantido pela LGPD).

---

## 1. O Problema

Com a entrada em vigor da **Lei nº 15.211/2025**, plataformas digitais são obrigadas a verificar a idade dos usuários de forma eficaz.

A solução padrão da indústria tem sido a coleta massiva de **CPFs** e **biometria facial**, criando bancos de dados vulneráveis e aumentando a vigilância estatal e corporativa.

---

## 2. A Solução: Zero-Knowledge Proofs (ZKP)

O **Zk-ECA** permite que um usuário prove que possui um atributo (ex: `"Idade > 18"`) sem revelar o dado bruto (data de nascimento ou CPF).

- A plataforma recebe um **"Sim"**
- O Governo não sabe onde o usuário logou
- O Usuário mantém seus documentos apenas no próprio dispositivo

---

## 3. Visão Geral da Arquitetura (C4 Model)

### A. O Emissor (Trusted Proxy)

Servidor que atua como ponte entre bases oficiais (Gov.br, Receita Federal) e o usuário.

- **Função:** Valida o documento uma única vez e emite uma *Verifiable Credential (VC)* assinada digitalmente para o celular do usuário  
- **Segurança:** Não armazena logs da consulta após a emissão  

---

### B. O Portador (Zk-ECA Wallet)

Aplicativo mobile (**React Native**) que funciona como uma carteira digital.

- **Storage:** Armazenamento no *Secure Enclave* (iOS) ou *StrongBox* (Android)  
- **ZKP Engine:** Gera provas matemáticas de que os requisitos da plataforma (ex: idade mínima) são atendidos  

---

### C. O Verificador (Plataforma/App)

SDK integrado por terceiros (Discord, Instagram, Games).

- **Função:** Valida a assinatura da prova recebida sem ter acesso aos dados sensíveis  

---

## 4. Design Patterns & Engenharia

- **Adapter Pattern:** Interface única para diferentes provedores de identidade (Gov.br, CNH, Passaporte)  
- **Strategy Pattern:** Permite escolher entre diferentes algoritmos criptográficos (ex: EdDSA para velocidade ou BBS+ para assinaturas anônimas)  
- **Proxy Pattern:** O Emissor atua como um proxy para evitar que o governo rastreie o IP do usuário final durante a validação  
- **Clean Architecture:** Separação total entre a lógica de criptografia (Core), o armazenamento (Data) e a interface (UI)  

---

## 5. Viabilidade e Desafios

### Viabilidade Técnica

Alta. Bibliotecas como **Hyperledger Aries**, **SpruceID** e **Circom** já permitem a implementação de ZKP em dispositivos móveis modernos com baixo impacto de performance.

---

### Desafios de Implementação

- **Adoção (Efeito de Rede):** Plataformas precisam aceitar o Zk-ECA como método válido. Isso exige parcerias ou conformidade técnica com padrões do W3C  
- **O Problema do Oráculo:** Garantir que o "Emissor" é confiável e não foi fraudado  
- **UX:** Simplificar o processo de "gerar uma prova" para que um usuário leigo consiga usar sem atrito  

---

## 6. Acordância com a Lei (Compliance)

- **Lei Felca (ECA Digital):** O Zk-ECA atende ao requisito de "método eficaz de verificação" ao utilizar dados de bases oficiais para a emissão da credencial inicial  
- **LGPD (Lei Geral de Proteção de Dados):** Maximiza o princípio da **Minimização de Dados**. O compartilhamento de informações sensíveis é reduzido a zero, eliminando riscos de vazamento para a plataforma verificadora  
- **Marco Civil da Internet:** Mantém a responsabilidade do usuário, pois a identidade real está vinculada a uma chave criptográfica que pode ser requisitada judicialmente se houver crime  

---

## 7. Licença

Este projeto é distribuído sob a **Licença MIT**.

O código é aberto para auditoria pública, garantindo que o software faz exatamente o que promete: **proteger a privacidade**.
