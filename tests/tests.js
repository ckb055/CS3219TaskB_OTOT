// Import the dependencies for testing
let mongoose = require("mongoose");
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');

Contact = require('../contactModel');
// Configure chai
chai.use(chaiHttp);
chai.should();

describe('Contacts', () => {
    beforeEach((done) => {
        Contact.remove({}, (err) => {
           done();
        });
    });
    describe('GET /api/contacts', () => {
        // Test to get all contacts, but database is empty
        it("should get all contacts, but database is empty", (done) => {
             chai.request(app)
                 .get('/api/contacts')
                 .end((err, res) => {
                     res.should.have.status(200);
                     res.body.should.be.a('object');
                     res.should.have.a.property('status').eql('success');
                     res.should.have.a.property('message').eql('Contacts retrieved successfully');
                     done();
                  });
         });
        // Test to get single student record
        it("should get all contacts", (done) => {
            let firstContact = new Contact({name:"Ng Wee Ji" , gender:"male", email: "ngweeji@gmail.com", phone: "92345678"});
            let secondContact = new Contact({name:"Chen Kaibin" , gender:"male", email: "chenkaibin@gmail.com", phone: "92428282"});
            firstContact.save(() => {
                secondContact.save(() => {
                    chai.request(app)
                        .get(`/api/contacts`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            done();
                        });
                    });
                });
            });
        
         
        // Test to get single student record
        it("should not get a single student record", (done) => {
             const id = 5;
             chai.request(app)
                 .get(`/${id}`)
                 .end((err, res) => {
                     res.should.have.status(404);
                     done();
                  });
         });
    });
});