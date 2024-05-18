/// <reference types="Cypress" />

describe('Caso de teste para cadastro de cliente', () =>{

  const contentType = {
    "Content-Type": 'application/json'
  };

  /*
	 *	(GIVEN) DADO um cliente com nome e cpf válidos
	 *	(WHEN) QUANDO enviar os dados pro sistema (POST)
	 *	(THEN) ENTÃO o cadastro será realizado com sucesso
	 *	(AND) E retornar o codigo http 201
	 *	(AND) E com header localization com a url de consulta do cliente cadastrado.
	 *	(AND) E retorna o cliente criado no corpo da mensagem
	 */
  it('DEVE cadastrado o cliente QUANDO dados forem validos', () => {
    const customer =  {
                        "cpf": "999.999.999-31",
                        "nome": "Maria Joaquina de Amaral Pereira Goes"
                      };

    cy.request({
      method: 'POST',
      url: 'localhost:8080/customer',
      header: { contentType },
      body: customer
    }).then((resposta) => {
      expect(201).to.be.equal(resposta.status);
      expect(resposta.headers).to.have.property('location');
      expect(resposta.headers.location).contains('/customer/' + customer.cpf);
      expect(resposta.body).not.to.be.empty;
      expect(resposta.body.cpf).to.be.equal(customer.cpf);
      expect(resposta.body.nome).to.be.equal(customer.nome);
      expect(resposta.body.salvo).to.be.true;
    });
  });

  /*
	   * Validar falhar ao cadastrar cliente quando informar um cpf invalido
		 * (GIVEN) DADO que informe todas as informações obrigatórias
		 * (WHEN) QUANDO submeter minha solicitação via POST
		 * (BUT) MAS informar como cpf um valor com 13 caracteres
		 * (THEN) ENTÃO o cadastro deve falhar
		 * (AND) E retornar o codigo http 400 (BAD REQUEST)
	   * */
  it('DEVE retonar BAD Request (400) quando CPF for invalido', () => {
    const customer =  {
      "cpf": "333.123.123",
      "nome": "Maria Joaquina"
    };
    
    cy.request({
      method: 'POST',
      url: 'http://localhost:8080/customer',
      failOnStatusCode: false,
      header: { contentType },
      body: customer
    }).then((resp) => {
      expect(resp.status).to.be.equal(400);
      expect('CPF Invalido').to.be.equal(resp.body);
    });
  });
});