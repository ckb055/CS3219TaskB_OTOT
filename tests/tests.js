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
                     res.body.data.length.should.be.eql(0);
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
                            res.body.should.have.property('status').eql('success');
                            res.body.should.have.property('message').eql('Contacts retrieved successfully');
                            res.body.data.length.should.be.eql(2);
                            res.body.data[0].email.should.be.eql("ngweeji@gmail.com");
                            res.body.data[0].phone.should.be.eql("92345678");
                            res.body.data[1].email.should.be.eql("chenkaibin@gmail.com");
                            res.body.data[1].phone.should.be.eql("92428282");
                            done();
                        });
                    });
                });
            });
        
         
        // Test to fail to get single contact record as id out of bounds
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
    describe('POST /api/contacts', () => {
        it("should post the specified contact", (done) => {
            let expectedContact = new Contact({name:"Ng Wee Ji" , gender:"male", email: "ngweeji@gmail.com", phone: "92345678"});
            chai.request(app)
                .post('/api/contacts')
                .send(expectedContact)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('gender');
                    res.body.data.should.have.property('email');
                    res.body.data.should.have.property('phone');
                    res.body.data.name.should.be.eql("Ng Wee Ji");
                    res.body.data.email.should.be.eql("ngweeji@gmail.com");
                    res.body.data.phone.should.be.eql("92345678");
                    done();
                });
        });
    });
    describe('GET /api/contacts/:id', () => {
        it("should get the specified contact", (done) => {
            let expectedContact = new Contact({name:"Ng Wee Ji" , gender:"male", email: "ngweeji@gmail.com", phone: "92345678"});
            expectedContact.save(() => { 
               chai.request(app)
                .get('/api/contacts/' + expectedContact.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('gender');
                    res.body.data.should.have.property('email');
                    res.body.data.should.have.property('phone');
                    res.body.data.name.should.be.eql("Ng Wee Ji");
                    res.body.data.email.should.be.eql("ngweeji@gmail.com");
                    res.body.data.phone.should.be.eql("92345678");
                    done();
                });
            });
        });
    });
    describe('PUT /api/contacts/:id', () => {
        it("should update the specified contact", (done) => {
            let expectedContact = new Contact({name:"Ng Wee Ji" , gender:"male", email: "ngweeji@gmail.com", phone: "92345678"});
            let updatedContact = new Contact({name:"Ng Weyeah Ji" , gender:"male", email: "ngweyeahji@gmail.com", phone: "92345678"});
            expectedContact.save(() => { 
               chai.request(app)
                .put('/api/contacts/' + expectedContact.id)
                .send(updatedContact)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Contact Info updated');
                    res.body.data.should.have.property('name');
                    res.body.data.should.have.property('gender');
                    res.body.data.should.have.property('email');
                    res.body.data.should.have.property('phone');
                    res.body.data.name.should.be.eql("Ng Weyeah Ji");
                    res.body.data.email.should.be.eql("ngweyeahji@gmail.com");
                    res.body.data.phone.should.be.eql("92345678");
                    done();
                });
            });
        });
    });
    describe('DELETE /api/contacts/:id', () => {
        it("should delete the specified contact", (done) => {
            let expectedContact = new Contact({name:"Ng Wee Ji" , gender:"male", email: "ngweeji@gmail.com", phone: "92345678"});
            expectedContact.save(() => { 
               chai.request(app)
                .delete('/api/contacts/' + expectedContact.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql('Contact deleted');
                    done();
                });
            });
        });
    });

});