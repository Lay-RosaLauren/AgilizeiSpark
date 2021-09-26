/// <reference types="cypress" />

import { format } from '../support/utils.js'
// cy.viewport
// arquivos de config 
// configs por linha de comando

context('Dev Finances Agilizei', () => {

  // hooks
  // trechos que executam antes e depois do teste
  // before -> antes de todos os testes 
  // beforEach -> antes de cada teste
  // after -> depois de todos os testes 
  // afterEach -> depois de cada teste

  beforeEach(() => {
    cy.visit('https://dev-finance.netlify.app/#')
    cy.get('#data-table tbody tr').should('have.length', 0)
  });
    
  it('Cadastrar entradas', () => {
      //entender o Fluxo manualmente
      //mapear os elementos que vamos interagir
      //descrever as interações com o cypress
      //adicionar as asserções necessárias
 
      

      cy.get('#transaction .button').click()  // id * class
      cy.get('#description').type('Mesada')  // id
      cy.get('[name=amount]').type('20') // atributos
      cy.get('[type=date]').type('2021-03-21') // atributos
      cy.get('button').contains('Salvar').click() // tipo e valor

      cy.get('#data-table tbody tr').should('have.length', 1)
      // os dados que foram cadastrados
    });
    
    
    it('Cadastrar saídas', () => {
      
      cy.get('#transaction .button').click()  // id * class
      cy.get('#description').type('Mesada')  // id
      cy.get('[name=amount]').type(-20) // atributos
      cy.get('[type=date]').type('2021-03-21') // atributos
      cy.get('button').contains('Salvar').click() // tipo e valor

      cy.get('#data-table tbody tr').should('have.length', 1)
    });

    
    it('Remover entradas e saídas', () => {
      const entrada = 'Mesada'
      const saida   = 'KinderOvo'

      cy.get('#transaction .button').click()  // id * class
      cy.get('#description').type(entrada)  // id
      cy.get('[name=amount]').type(100) // atributos
      cy.get('[type=date]').type('2021-03-21') // atributos
      cy.get('button').contains('Salvar').click() // tipo e valor

      cy.get('#transaction .button').click()  // id * class
      cy.get('#description').type(saida)  // id
      cy.get('[name=amount]').type(-35) // atributos
      cy.get('[type=date]').type('2021-03-21') // atributos
      cy.get('button').contains('Salvar').click() // tipo e valor

      //estratégia 1: voltar para o elemento pai (tr) e avançar para um td attr
      cy.get('td.description')
        .contains(entrada)
        .parent()
        .find('img[onclick*=remove]')
        .click()

        //estratégia 2: buscar todos os irmãos, e buscar o que tem img + attr
        cy.get('td.description')
          .contains(saida)
          .siblings()
          .children('img[onclick*=remove')
          .click()

        cy.get('#data-table tbody tr').should('have.length', 0)
    })

    it.only('Validar saldo com diversas transações', () => {
      const entrada = 'Mesada'
      const saida   = 'KinderOvo'

      cy.get('#transaction .button').click()  // id * class
      cy.get('#description').type(entrada)  // id
      cy.get('[name=amount]').type(100) // atributos
      cy.get('[type=date]').type('2021-03-21') // atributos
      cy.get('button').contains('Salvar').click() // tipo e valor

      cy.get('#transaction .button').click()  // id * class
      cy.get('#description').type(saida)  // id
      cy.get('[name=amount]').type(-35) // atributos
      cy.get('[type=date]').type('2021-03-21') // atributos
      cy.get('button').contains('Salvar').click() // tipo e valor
      // capturar as linhas com as transações e as colunas com valores
      // capturar o texto dessas colunas
      // formatar esses valores das linhas

      // somar os valores de entradas e saídas

      
      // capturar o texto do total
      // comparar o somatório de entradas e despesas com o total

      let incomes = 0
      let expenses = 0

      cy.get('#data-table tbody tr')
        .each(($el, index, $list) => {
          // cy.log(index)
          cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
            if(text.includes('-')){
              expenses = expenses + format(text)
            } else {
              incomes = incomes + format(text)
            }

            cy.log(`entradas`, incomes)
            cy.log(`saidas`, expenses)

              // cy.log(text)
              // cy.log(format(text))
            })

        })
        cy.get('#totalDisplay').invoke('text').then(text => {
          // cy.log(`valor Total`, format(text))
          let formattedTotalDisplay = format(text)
          let expectedTotal = incomes + expenses

          expect(formattedTotalDisplay).to.eq(expectedTotal)
        })
    });
});
