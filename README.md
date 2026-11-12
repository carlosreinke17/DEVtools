# DEVtools

Hub de utilitários para desenvolvedores e testadores, construído com React Native,
Expo e TypeScript para Android e iOS. As ferramentas serão implementadas para
processar dados localmente sempre que possível.

## Etapa 1

- Base com Expo SDK 58, React Native 0.88 e TypeScript estrito.
- Navegação com Expo Router: início, aparência e página não encontrada.
- Temas claro, escuro e automático (padrão), com preferência salva no dispositivo.
- Tokens de cores, espaçamento e bordas compartilhados.
- Tela inicial com apresentação das futuras categorias. As ferramentas e a busca
  serão implementadas nas próximas etapas.
- Testes de preferência de tema, restauração, mudanças do sistema e falhas de armazenamento.

## Executar

Use Node.js 24 LTS (versão registrada em `.nvmrc`) e npm 11.

```sh
npm ci
npm start
```

Abra o projeto no Expo Go compatível com o SDK 58 usando o QR code do terminal.
O computador e o dispositivo devem ter conectividade entre si durante o desenvolvimento.

```sh
npm run android  # requer emulador Android configurado ou dispositivo conectado
npm run ios      # requer macOS, Xcode e simulador configurado
npm run web      # alternativa para inspecionar a interface no navegador
```

O aplicativo não exige backend, conta, arquivo `.env` ou chave de API nesta etapa.
O servidor Metro é necessário no desenvolvimento; um aplicativo nativo distribuído
inclui seu próprio bundle. A versão web ainda não é uma PWA com cache offline.

## Verificar

```sh
npm run check
npm run export -- --platform all --max-workers 2
```

`npm run check` executa TypeScript, ESLint e testes Jest. A exportação valida os
bundles JavaScript para Android, iOS e web; não produz APK, AAB ou IPA e não
substitui testes em dispositivos. A integração contínua executa essas mesmas verificações.

Se a rede bloquear a consulta de metadados do Expo, use `npm start -- --offline`
para iniciar o Metro. `EXPO_OFFLINE=1` permite usar a tabela de versões incluída
no SDK em outros comandos. A instalação npm ainda precisa de acesso ao registro
quando os pacotes não estão em cache. Não desative verificações TLS.

## Organização

```text
src/
  app/                              # somente rotas e composição dos providers
  features/
    home/presentation/              # apresentação inicial
    settings/presentation/          # escolha de aparência
  shared/
    components/                     # componentes compartilhados
    theme/                          # tokens e estado persistente do tema
tests/                              # testes de comportamento
assets/                             # ícones e splash locais
```

Os algoritmos futuros ficarão em `src/features/tools/<ferramenta>/domain/`, sem
dependência de componentes React. Categorias serão metadados do catálogo para
compartilhar regras entre geração e validação.

As pastas nativas `android/` e `ios/` são geradas pelo Expo quando necessárias.
Configurações nativas devem partir de `app.json` e plugins. Identificadores das
lojas, assinatura e distribuição serão configurados na etapa correspondente.

## Licença

MIT. Consulte [LICENSE](LICENSE).
