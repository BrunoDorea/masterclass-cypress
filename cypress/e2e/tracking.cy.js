/// <reference types='cypress' />

describe('Consulta de Encomenda no Chat', () => {
    const trackingCode = {
        'entregue': 'PD123456785BR',
        'despachada': 'BR987654321BR',
        'emRota': 'QW112233445BR',
        'naoEncontrado': 'AB123456789XY',
    }

    it('Deve indicar que a encomenda já foi entregue', () => {
        cy.viewport('iphone-xr')

        cy.visit('/')

        cy.get('button[aria-label="Open Chat"]').should('be.visible').click()

        cy.contains('.rcb-bot-message', 'Olá! Tudo bem? Posso te ajudar a consultar o status da sua encomenda?').should('be.visible')

        cy.contains('.rcb-options', 'Sim, por favor!').click()

        cy.contains('.rcb-bot-message', 'Ótimo! Por favor, digite o código de rastreio da sua encomenda:').should('be.visible')

        cy.get('textarea[placeholder^="Escreva sua mensagem"').type(trackingCode.entregue)

        cy.get('.rcb-send-button').click()

        cy.contains('.rcb-bot-message', `Confirmando: você informou o código de rastreio ${trackingCode.entregue}. Está tudo certo?`).should('be.visible')

        cy.contains('.rcb-options', 'Sim, está certo!').click()


        cy.contains('.rcb-bot-message', 'Perfeito! Estou consultando as informações nos Correios... Só um instante. 📦🔍').should('be.visible')

        cy.contains('.rcb-bot-message', 'Boa notícia! Sua encomenda já foi entregue com sucesso. 🎉 Se precisar de algo mais, é só me chamar!', { timeout: 10000 }).should('be.visible')
    })
})