/// <reference types='cypress' />

describe('Consulta de Encomenda no Chat', () => {
    const trackingCode = {
        'entregue': 'PD123456785BR',
        'despachada': 'BR987654321BR',
        'emRota': 'QW112233445BR',
        'naoEncontrado': 'AB123456789XY',
    }

    it('Deve indicar que a encomenda já foi entregue', () => {
        cy.abrirChatBot()
        cy.verificarMensagem('Olá! Tudo bem? Posso te ajudar a consultar o status da sua encomenda?')
        cy.selecionarOpcao('Sim, por favor!')
        cy.verificarMensagem('Ótimo! Por favor, digite o código de rastreio da sua encomenda:')
        cy.enviarMensagem(trackingCode.entregue)
        cy.verificarMensagem(`Confirmando: você informou o código de rastreio ${trackingCode.entregue}. Está tudo certo?`)
        cy.selecionarOpcao('Sim, está certo!')
        cy.verificarMensagem('Perfeito! Estou consultando as informações nos Correios... Só um instante. 📦🔍')
        cy.verificarMensagem('Boa notícia! Sua encomenda já foi entregue com sucesso. 🎉 Se precisar de algo mais, é só me chamar!', 10000)
    })

    it('Deve indicar que a encomenda está a caminho', () => {
        cy.abrirChatBot()
        cy.verificarMensagem('Olá! Tudo bem? Posso te ajudar a consultar o status da sua encomenda?')
        cy.selecionarOpcao('Sim, por favor!')
        cy.verificarMensagem('Ótimo! Por favor, digite o código de rastreio da sua encomenda:')
        cy.enviarMensagem(trackingCode.despachada)
        cy.verificarMensagem(`Confirmando: você informou o código de rastreio ${trackingCode.despachada}. Está tudo certo?`)
        cy.selecionarOpcao('Sim, está certo!')
        cy.verificarMensagem('Perfeito! Estou consultando as informações nos Correios... Só um instante. 📦🔍')
        cy.verificarMensagem('A sua encomenda já foi despachada e está a caminho! 🚚', 10000)
    })

    it('Deve indicar que a encomenda está em rota de entrega', () => {
        cy.abrirChatBot()
        cy.verificarMensagem('Olá! Tudo bem? Posso te ajudar a consultar o status da sua encomenda?')
        cy.selecionarOpcao('Sim, por favor!')
        cy.verificarMensagem('Ótimo! Por favor, digite o código de rastreio da sua encomenda:')
        cy.enviarMensagem(trackingCode.emRota)
        cy.verificarMensagem(`Confirmando: você informou o código de rastreio ${trackingCode.emRota}. Está tudo certo?`)
        cy.selecionarOpcao('Sim, está certo!')
        cy.verificarMensagem('Perfeito! Estou consultando as informações nos Correios... Só um instante. 📦🔍')
        cy.verificarMensagem('Ótima notícia! Sua encomenda está em rota de entrega e chega ainda hoje. Fique de olho! 👀📦', 10000)
    })

    it('Deve indicar que a encomenda não foi encontrada', () => {
        cy.abrirChatBot()
        cy.verificarMensagem('Olá! Tudo bem? Posso te ajudar a consultar o status da sua encomenda?')
        cy.selecionarOpcao('Sim, por favor!')
        cy.verificarMensagem('Ótimo! Por favor, digite o código de rastreio da sua encomenda:')
        cy.enviarMensagem(trackingCode.naoEncontrado)
        cy.verificarMensagem(`Confirmando: você informou o código de rastreio ${trackingCode.naoEncontrado}. Está tudo certo?`)
        cy.selecionarOpcao('Sim, está certo!')
        cy.verificarMensagem('Perfeito! Estou consultando as informações nos Correios... Só um instante. 📦🔍')
        cy.verificarMensagem('Hmm... Não encontrei uma encomenda com os dados informados.', 10000)
        cy.selecionarOpcao('Encerrar atendimento')
        cy.verificarMensagem('Obrigado por falar comigo! 😊 Se precisar de mais alguma coisa, é só chamar.')
    })
})

Cypress.Commands.add('abrirChatBot', () => {
    cy.viewport('iphone-xr')
    cy.visit('/')
    cy.get('button[aria-label="Open Chat"]').should('be.visible').click()
    cy.get('.rcb-chat-header span').should('be.visible').and('have.text', 'Sensei')
})

Cypress.Commands.add('verificarMensagem', (mensagem, timeout = 4000) => {
    cy.contains('.rcb-bot-message', mensagem, { timeout: timeout }).should('be.visible')
})

Cypress.Commands.add('selecionarOpcao', (opcao) => {
    cy.contains('.rcb-options', opcao).click()
})

Cypress.Commands.add('enviarMensagem', (mensagem) => {
    cy.get('textarea[placeholder^="Escreva sua mensagem"').type(mensagem)
    cy.get('.rcb-send-button').click()
})