# DEVtools

Hub de utilitários para desenvolvedores e testadores, construído com React Native,
Expo e TypeScript para Android e iOS. As ferramentas serão implementadas para
processar dados localmente sempre que possível.

## Etapa 1

- Base com Expo SDK 58, React Native 0.88 e TypeScript estrito.
- Navegação com Expo Router: início, aparência e página não encontrada.
- Temas claro, escuro e automático (padrão), com preferência salva no dispositivo.
- Tokens de cores, espaçamento e bordas compartilhados.
- Estrutura inicial das telas e identidade visual compartilhada.
- Testes de preferência de tema, restauração, mudanças do sistema e falhas de armazenamento.

## Etapa 2

- Catálogo com 17 entradas nas categorias Geradores, Validadores,
  Formatadores / Conversores e Texto / String.
- Busca local por nome, descrição e termos relacionados, ignorando acentos,
  diferenças entre maiúsculas/minúsculas e espaços extras.
- Filtros de categoria, busca e favoritos podem ser combinados, com contagens
  de resultados e ações para recuperar buscas sem resultado.
- Favoritos persistidos no dispositivo, compartilhados entre catálogo e detalhes.
- Rota própria `/tools/<id>` para cada ferramenta, incluindo abertura direta na web.
- As ferramentas estão identificadas como **Em breve**; esta etapa entrega o
  catálogo e a navegação. Os algoritmos começam pelo CPF na Etapa 3.

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
    catalog/
      domain/                       # registro, categorias, busca e ids de favoritos
      presentation/                 # catálogo, detalhes e componentes
      state/                        # favoritos persistidos
    settings/presentation/          # escolha de aparência
  shared/
    components/                     # componentes compartilhados
    theme/                          # tokens e estado persistente do tema
tests/                              # testes de comportamento
assets/                             # ícones e splash locais
```

As rotas dinâmicas em `src/app/tools/` usam o mesmo registro do catálogo para
gerar páginas estáticas. Ao adicionar uma ferramenta, cadastre seu id estável,
categoria, nome, descrição, palavras-chave e disponibilidade no registro.

Os algoritmos futuros ficarão em `src/features/tools/<ferramenta>/domain/`, sem
dependência de componentes React. Categorias serão metadados do catálogo para
compartilhar regras entre geração e validação.

As pastas nativas `android/` e `ios/` são geradas pelo Expo quando necessárias.
Configurações nativas devem partir de `app.json` e plugins. Identificadores das
lojas, assinatura e distribuição serão configurados na etapa correspondente.

## Licença

MIT. Consulte [LICENSE](LICENSE).
