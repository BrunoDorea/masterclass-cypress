/// <reference types='cypress' />

describe('Consulta de Encomenda no Chat', () => {
    const tracking = [
        { status: 'já foi entregue', code: 'PD123456785BR', mensagem: 'Boa notícia! Sua encomenda já foi entregue com sucesso. 🎉 Se precisar de algo mais, é só me chamar!' },
        { status: 'está a caminho', code: 'BR987654321BR', mensagem: 'A sua encomenda já foi despachada e está a caminho! 🚚' },
        { status: 'está em rota de entrega', code: 'QW112233445BR', mensagem: 'Ótima notícia! Sua encomenda está em rota de entrega e chega ainda hoje. Fique de olho! 👀📦' }
    ]

    tracking.forEach((function (cenario) {
        it(`Deve indicar que a encomenda ${cenario.status}`, () => {
            cy.abrirChatBot()
            cy.verificarMensagem('Olá! Tudo bem? Posso te ajudar a consultar o status da sua encomenda?')
            cy.selecionarOpcao('Sim, por favor!')
            cy.verificarMensagem('Ótimo! Por favor, digite o código de rastreio da sua encomenda:')
            cy.enviarMensagem(cenario.code)
            cy.verificarMensagem(`Confirmando: você informou o código de rastreio ${cenario.code}. Está tudo certo?`)
            cy.selecionarOpcao('Sim, está certo!')
            cy.verificarMensagem('Perfeito! Estou consultando as informações nos Correios... Só um instante. 📦🔍')
            cy.verificarMensagem(cenario.mensagem, 10000)
        })
    }))


    it('Deve indicar que a encomenda não foi encontrada', () => {
        const trackingNaoEncontrado = {
                status: 'não foi encontrada',
                code: '123456789BR',
                mensagem: 'Hmm... Não encontrei uma encomenda com os dados informados.'
            }
        cy.abrirChatBot()
        cy.verificarMensagem('Olá! Tudo bem? Posso te ajudar a consultar o status da sua encomenda?')
        cy.selecionarOpcao('Sim, por favor!')
        cy.verificarMensagem('Ótimo! Por favor, digite o código de rastreio da sua encomenda:')
        cy.enviarMensagem(trackingNaoEncontrado.code)
        cy.verificarMensagem(`Confirmando: você informou o código de rastreio ${trackingNaoEncontrado.code}. Está tudo certo?`)
        cy.selecionarOpcao('Sim, está certo!')
        cy.verificarMensagem('Perfeito! Estou consultando as informações nos Correios... Só um instante. 📦🔍')
        cy.verificarMensagem(trackingNaoEncontrado.mensagem, 10000)
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