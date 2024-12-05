import App from './App.vue';
import { usersAlla, usersAlla0128, usersAlla0110, usersAlla1120, usersAlla2128, adminUser, adminUserTom, usersTom } from "../cypress/fixtures/users.json";

describe("Test Webb-app, Digg-front", () => {
  it("Lägg till en ny kund", () => {
    cy.viewport(1100, 1400)
    cy.intercept("GET","**/digg/users**", 
      usersTom)
    cy.intercept("POST","**/digg/users**",
      {
        body: 
        [
          {
            "name": "Herr Olsson",
            "email": "herr@olsson",
            "phone": "12312312312",
            "address": "Street 123 Town",
          }
        ]
      }
    )
    cy.mount(App)
    cy.contains("label","Name").find("input").type("Herr Olsson")
    cy.contains("label","Address").find("input").type("Street 123 Town")
    cy.contains("label","Phone").find("input").type("12312312312")
    cy.contains("label","Email").find("input").type("herr@olsson")
    cy.contains("label","Name").find("input").should("have.value","Herr Olsson")
    cy.contains("label","Address").find("input").should("have.value","Street 123 Town")
    cy.contains("label","Phone").find("input").should("have.value","12312312312")
    cy.contains("label","Email").find("input").should("have.value","herr@olsson")
    cy.contains("label","Id").find("input").should("have.value","")
    cy.intercept("GET","**/digg/users**",
      [
        {
          "id": 1,
          "name": "Herr Olsson",
          "email": "herr@olsson",
          "phone": "12312312312",
          "address": "Street 123 Town",
          },
      ]
    )
    cy.contains("button","Create").click()
    cy.contains("label","Name").find("input").should("have.value","")
    cy.contains("label","Address").find("input").should("have.value","")
    cy.contains("label","Phone").find("input").should("have.value","")
    cy.contains("label","Email").find("input").should("have.value","")
    cy.contains("label","Id").find("input").should("have.value","")
    cy.get("#tabell p").should("have.length",1)
  }),
  it("Lägg till en ny kund utan obligatoriskt fält", () => {
    cy.viewport(1100, 1400)
    cy.intercept("GET","**/digg/users**", 
      usersTom)
    cy.intercept("POST","**/digg/users**",
      {
        body: 
        [
          {
            "name": "Herr Olsson",
            "email": "herr@olsson",
            "phone": "12312312312",
            "address": "Street 123 Town",
          }
        ]
      }
    )
    cy.mount(App)
    //cy.contains("label","Name").find("input").type("Herr Olsson")
    cy.contains("label","Address").find("input").type("Street 123 Town")
    cy.contains("label","Phone").find("input").type("12312312312")
    cy.contains("label","Email").find("input").type("herr@olsson")

    cy.contains("button","Create").click()
    cy.get("#felmeddelande").should("contain.text","Missing name")
    cy.contains("label","Name").find("input").should("have.value","")
    cy.contains("label","Address").find("input").should("have.value","Street 123 Town")
    cy.contains("label","Phone").find("input").should("have.value","12312312312")
    cy.contains("label","Email").find("input").should("have.value","herr@olsson")
    cy.get("#felmeddelande").should("contain.text","Missing name")
    cy.get("#tabell p").should("have.length",0)
  }),
  it("Uppdatera befintlig kund", () => {
    cy.viewport(1100, 1400)
    cy.intercept("GET","**/digg/users**", 
      [
        [
          {
            "name": "Herr Olsson",
            "email": "herr@olsson",
            "phone": "12312312312",
            "address": "Street 123 Town",
          }
        ],
      ]
    )
    cy.intercept("PATCH","**/digg/users**",
      {  body: 
        [
          {
            "name": "Herr Olsson",
            "email": "herr@olsson",
            "phone": "12312312312",
            "address": "Avenue 444 Town",
          }
        ],
      },
    )
    cy.mount(App)
    cy.intercept("GET","**/digg/users**", 
      [
        [
          {
            "name": "Herr Olsson",
            "email": "herr@olsson",
            "phone": "12312312312",
            "address": "Avenue 444 Town",
          }
        ],
      ]
    )
    cy.contains("button","Update").click()
    cy.contains("label","Name").find("input").should("have.value","")
    cy.contains("label","Address").find("input").should("have.value","")
    cy.contains("label","Phone").find("input").should("have.value","")
    cy.contains("label","Email").find("input").should("have.value","")
    cy.contains("label","Id").find("input").should("have.value","")
    cy.get("#tabell p").should("have.length",1)
  })
  it("Ta bort en befintlig kund", () => {
    cy.viewport(1100, 1400)
    cy.intercept("GET","**/digg/users**", 
      [
        {
          "name": "Herr Olsson",
          "email": "herr@olsson",
          "phone": "12312312312",
          "address": "Avenue 444 Town",
        }
      ],
    )
    cy.mount(App)
    cy.contains("button","Delete").click()
    cy.get("#felmeddelandedelete").should("contain.text","Missing Id")
    cy.intercept("GET","**/digg/users**", 
      [
        [
          {
            "name": "Herr Olsson",
            "email": "herr@olsson",
            "phone": "12312312312",
            "address": "Avenue 444 Town",
          }
        ],
      ]
    )
    cy.contains("label","Name").find("input").type("Herr Olsson")
    cy.contains("label","Address").find("input").type("Street 123 Town")
    cy.contains("label","Phone").find("input").type("12312312312")
    cy.contains("label","Email").find("input").type("herr@olsson")
    cy.contains("label","Id").find("input").type("1")
    cy.get("#deleteid").find("input").type("1")
    cy.contains("button","Delete").click()
    cy.contains("label","Name").find("input").should("have.value","")
    cy.contains("label","Address").find("input").should("have.value","")
    cy.contains("label","Phone").find("input").should("have.value","")
    cy.contains("label","Email").find("input").should("have.value","")
    cy.contains("label","Id").find("input").should("have.value","")
  })
  it('Växla språk mellan engelska och svenska', () => {
    cy.viewport(1100, 1400)
    cy.intercept("GET","**/digg/users**", usersAlla)
    cy.mount(App)
    cy.contains("button","English").click()
    cy.contains("button","Load users").should("contains.text","Load users")
    cy.contains("button","Svenska").click()
    cy.contains("button","Load users").should("contains.text","Ladda användare")
  })
  it('Hämta alla kunder och bläddra framåt och bakåt', () => {
    cy.viewport(1100, 1400)
    cy.intercept("GET","**/digg/users**", usersAlla0110)
    cy.mount(App)
    cy.get("#tabell p").should("have.length",10)
    cy.intercept("GET","**/digg/users?page=1", usersAlla1120)
    cy.contains("button","Next").click()
    cy.get("#tabell p").should("have.length",10)
    cy.get(".tabellrad").eq(0).should("contain.text","Monroe Stuchburie")
    cy.intercept("GET","**/digg/users?page=2", usersAlla2128)
    cy.contains("button","Next").click()
    cy.get("#tabell p").should("have.length",8)
    cy.get(".tabellrad").eq(0).should("contain.text","Norry Prozillo")
    cy.intercept("GET","**/digg/users?page=1", usersAlla1120)
    cy.contains("button","Prev").click()
    cy.get("#tabell p").should("have.length",10)
    cy.get(".tabellrad").eq(0).should("contain.text","Monroe Stuchburie")
    cy.intercept("GET","**/digg/users?page=0", usersAlla0110)
    cy.contains("button","Prev").click()
    cy.get("#tabell p").should("have.length",10)
    cy.get("#tabell p").should("contain.text","Shirleen Milillo")
    cy.get(".tabellrad").eq(0).should("contain.text","Shirleen Milillo")
  })
})