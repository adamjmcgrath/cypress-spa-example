const client_id = 'wLSIP47wM39wKdDmOj6Zb5eSEw3JVhVp';
const client_secret = '';
const audience = 'https://brucke.auth0.com/api/v2/';
const scope = 'openid profile email';
const username = '';
const password = '';

context('Example', () => {
  it('should be logged in', () => {
    cy.clearLocalStorage();

    cy.log('getting tokens');
    cy.request({
      method: 'POST',
      url: 'https://brucke.auth0.com/oauth/token',
      body: {
        grant_type: 'password',
        username,
        password,
        audience,
        scope,
        client_id,
        client_secret,
      },
    }).then(({ body: { access_token, expires_in, id_token, token_type } }) => {

      cy.visit('http://localhost:3000');
      cy.get('#btn').should('be.visible');
      cy.get('#hello').should('not.be.visible');

      cy.window().then((win) => {
        win.localStorage.setItem(
            `@@auth0spajs@@::${client_id}::${audience}::${scope}`,
            JSON.stringify({
              body: {
                client_id,
                access_token,
                id_token,
                scope,
                expires_in,
                token_type,
                decodedToken: { user: JSON.parse(Buffer.from(id_token.split('.')[1], 'base64').toString('ascii')) },
                audience
              },
              expiresAt: Math.floor(Date.now() / 1000) + expires_in
            })
        )
      })
      cy.visit('http://localhost:3000');

      cy.get('#btn').should('not.be.visible');
      cy.get('#hello').should('contain', `Hello ${username}`);
    });
  })
})

