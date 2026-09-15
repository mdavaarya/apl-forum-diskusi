/**
 * SKENARIO PENGUJIAN END-TO-END (E2E): Alur Login Aplikasi
 *
 * Skenario Login Flow:
 *  - harus menampilkan formulir login secara lengkap (input email, password, tombol masuk)
 *  - harus menampilkan toast error ketika pengguna login dengan email / password yang salah
 *  - harus berhasil login dan mengarahkan ke halaman utama serta menampilkan profil pengguna saat kredensial benar
 */

describe('Login Flow E2E Test', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('harus menampilkan elemen formulir login secara lengkap', () => {
    cy.get('h1.form-title').should('contain', 'Masuk ke akunmu');
    cy.get('#login-email').should('be.visible');
    cy.get('#login-password').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'Masuk');
    cy.get('.form-footnote a').should('have.attr', 'href', '/register');
  });

  it('harus menampilkan notifikasi error ketika login dengan kredensial yang salah', () => {
    // Intercept API login dan kembalikan response gagal
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 400,
      body: {
        status: 'fail',
        message: 'email or password is wrong',
      },
    }).as('loginFail');

    cy.get('#login-email').type('wronguser@example.com');
    cy.get('#login-password').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');

    // Toast error harus muncul
    cy.get('.Toastify__toast--error', { timeout: 6000 }).should('be.visible');
    cy.url().should('include', '/login');
  });

  it('harus berhasil login dan dialihkan ke HomePage dengan menampilkan data pengguna', () => {
    const fakeUser = {
      id: 'user-e2e-123',
      name: 'E2E Tester',
      email: 'e2e@example.com',
      avatar: 'https://ui-avatars.com/api/?name=E2E+Tester',
    };

    // Intercept login
    cy.intercept('POST', 'https://forum-api.dicoding.dev/v1/login', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { token: 'mock-e2e-token' },
      },
    }).as('loginSuccess');

    // Intercept profile fetch
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { user: fakeUser },
      },
    }).as('getProfile');

    // Intercept threads on homepage
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/threads', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { threads: [] },
      },
    }).as('getThreads');

    // Intercept users on homepage
    cy.intercept('GET', 'https://forum-api.dicoding.dev/v1/users', {
      statusCode: 200,
      body: {
        status: 'success',
        data: { users: [fakeUser] },
      },
    }).as('getUsers');

    cy.get('#login-email').type('e2e@example.com');
    cy.get('#login-password').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.wait('@getProfile');

    // Memverifikasi navigasi kembali ke HomePage dan elemen user di navbar
    cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    cy.get('.masthead-user').should('contain', 'E2E Tester');
    cy.get('.masthead-nav button').should('contain', 'Keluar');
  });
});
