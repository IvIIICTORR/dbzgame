Módulo: Conversations (conversation.controller.ts)
[ ] Listar conversas privadas (list): Retornar histórico de chats 1:1.

[ ] Listar grupos (list): Implementar lógica para buscar conversas com type: 'group'.

[ ] Iniciar conversa privada (start): Criar o canal inicial entre dois jogadores (quando envia a primeira mensagem).

Módulo: Messages (message.controller.ts)
[ ] Listar mensagens (list): Buscar o histórico de uma conversa ou grupo específico (usar paginação/limit).

[ ] Enviar mensagem (send): Persistir a mensagem no banco e emitir via Socket.

[ ] Deletar mensagem (delete): Remoção de mensagens enviada.