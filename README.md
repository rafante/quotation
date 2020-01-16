# Descrição

Este é um template para aplicações com (List/Detail) em SAPUI5. Novas aplicações deverão ser criadas com base neste projeto.

Este template foi criado, inicialmente, para atender ao aplicativo de Criação de Cotações da Patrimar, por isto os nomes técnicos estarão referenciando tal.

Pacote: **br.com.patrimar.criacotacao**

**Este template passará por melhorias contínuas.**

# Getting started

Para utilizar o template, basta seguir os seguintes passos:

- Clonar este repositório
- Executar o comando **npm install** (ou **yarn**) para instalar as dependências contidas no [package.json](package.json)
- Iniciar o aplicativo com uma das seguintes opções
  - Executar o comando **npm run dev** (ouv **yarn run dev**) para utilizar o backend de desenvolvimento oficial
  - Executar o comando **npm run mock** (ou **yarn run mock**) para utilizar o mockserver

**Obs.:** Ao executar os comandos acima, um serviço será inicializado e o navegador deverá abrir automaticamente em um emulador do FIORI Launchpad.

# Mockserver (Dados fictícios)

Para facilitar os testes, é possível utilizar o mockserver standard do SAPUI5. Basta que na pasta [localService](webapp/localService) exista o arquivo [mockserver.js](webapp/localService/mockserver.js), o [metadata.xml](webapp/localService/zsd_odata_price_cockpit_srv/metadata.xml) e os arquivos JSON com os dados fictícios (ex.: [mockdata/CriaCotacaoSet.json](webapp/localService/mockdata/CriaCotacaoSet.json)).

Executar **npm run mock** (ou **yarn run mock**) para inicializar o mockserver.

Com as configurações acima, sempre que o aplicativo precisar consultar dados no "backend", ele irá buscar, automaticamente, dos dados mockados.

# Padrão MVC

- **Model:** ./webapp/model/**Nome**Model.js
  - Deverá conter a lógica de negócio, sem controle de tela.
- **View:** ./webapp/view/**Nome**.view.xml
  - Deverá conter apenas elementos de tela, sem lógicas ou condições ternárias complexas.
- **Controller:** ./webapp/controller/**Nome**.controller.js

  - Deverá intermediar os dados entre a camada de Visão (View) e Modelo (Model), sem lógica de negócio diretamente em seu conteúdo.

- **Fragments:** ./webapp/fragment/**Nome**.fragment.xml
  - Deverá conter partes de visões que possam ser reaproveitados em uma ou mais visões, ou quando fizer sentido uma separação para melhor manutenção.

# Testes automatizados

Para executar os testes automatizados, utilizar o comando **npm run test** (ou **yarn run test**).

São utilizados os frameworks padrões de SAPUI5 para testes unitários (QUnit) e de integração (OPA).

O template está configurado com um coverage threshold de 80% (ver arquivo [Gruntfile.js](Gruntfile.js)), sendo assim, testes deverão cobrir pelo menos 80% do código.

# GitLab CI/CD

O template já vem com uma configuração padrão de CI/CD utilizando o GitLab (ver arquivo [.gitlab-ci.yml](.gitlab-ci.yml)).
