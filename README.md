# 🐉 Dragon Ball Z RPG Online

Este repositório contém o código-fonte de um RPG online multiplayer baseado na franquia Dragon Ball. O projeto foi arquitetado com foco em **altíssima performance** e baixa latência, garantindo uma experiência fluida para múltiplos jogadores em tempo real.

---

## 📂 Estrutura do Projeto

O ecossistema é dividido em duas frentes principais:

* **`client/`**: O "coração" visual. Desenvolvido com **Vue.js**, focado em uma interface reativa, leve e que responde instantaneamente às ações do jogador.
* **`server/`**: O "cérebro" do jogo. Construído com **Fastify** e **TypeScript**, aproveitando a estrutura de plugins e o baixo overhead do framework para processar regras de negócio e lógica de combate com o máximo de velocidade.

---

## 🚀 Tech Stack

| Camada | Tecnologia | Motivação |
| :--- | :--- | :--- |
| **Frontend** | Vue.js | Reatividade eficiente para barras de HP/Ki e inventários. |
| **Backend** | **Fastify** + TS | Performance superior e validação de esquemas ultrarrápida. |
| **Banco de Dados** | MySQL | Persistência robusta para dados de personagens e itens. |
| **Comunicação** | WebSockets | Troca de pacotes em tempo real para movimentação e chat. |

---

## 🛠️ Escopo e Funcionalidades

As atividades de desenvolvimento abrangem todo o ciclo de vida do jogo:

* **Modelagem de Dados**: Estruturação otimizada no MySQL para personagens, tabelas de experiência (XP), atributos e persistência de mapas.
* **Lógica de Jogo (Core)**: Implementação de APIs via Fastify para mecânicas de combate, cálculo de danos e progressão de RPG.
* **Interface (UI/UX)**: Desenvolvimento visual inspirado na estética de Dragon Ball, focado na jogabilidade via navegador.
* **Infraestrutura**: Configuração de rotinas de deploy e ajustes de performance no servidor Node.js.

---

## 📅 Metodologia de Trabalho

* **Carga Horária**: Dedicação diária de 4 horas, de segunda a sexta-feira.
* **Relatórios**: Atualizações semanais sobre o progresso e commits realizados.
* **Segurança**: Código mantido em repositório privado (Git) para garantir a integridade dos ativos dos contratantes.

---

## 👥 Equipe

* **Desenvolvedor Fullstack**: Samuel Dias Felix.
* **Contratantes**: Jefferson Henrique Silva de Oliveira e Karlos Eduardo Ferreira Pereira da Silva.

---

## 📄 Licença e Propriedade

Após a conclusão e quitação do projeto, a propriedade intelectual do código customizado pertence aos **Contratantes**. Ressalta-se que a marca "Dragon Ball Z" e seus personagens são propriedade da **Toei Animation/Bandai Namco**.
