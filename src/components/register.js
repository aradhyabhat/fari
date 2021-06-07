import React, { Component } from "react";
import axios from "axios";
import {Link} from 'react-router-dom';
import { backendUrlUser } from '../BackendURL';
import 'bootstrap/dist/css/bootstrap.min.css'
import { ProgressSpinner } from 'primereact/progressspinner';


class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            registerform: {
                name: "",
                emailId: "",
                contactNo: "",
                password: ""
            },
            formvalid: {
                namevalid: false,
                emailIdvalid: false,
                contactNovalid: false,
                passwordvalid: false,
                buttonvalid: false,
                confirmvalid: false
            },
            formerror: {
                nameerror: "",
                emailIderror: "",
                contactNoerror: "",
                passworderror: "",
                confirmerror: ""
            },
            errorMessage: "",
            sucessMessage: "",
            loadLogin: false,
          show:true
        }
    }

    handleChange = (event) => {
        let { registerform } = this.state
        let name = event.target.name
        let value = event.target.value
        registerform[name] = value
        this.setState({ registerform: registerform })
        this.validateField(name, value)
    }
    validateField = (name, value) => {
        let { formvalid, formerror } = this.state;
        switch (name) {
            case "name":
                if (value === "") {
                    formerror.nameerror = "Please enter a your name"
                    formvalid.namevalid = false
                }
                else if (!value.match(/^[A-z]+(\s|[A-z])*$/)) {
                    formerror.nameerror = "Please enter a valid name"
                    formvalid.namevalid = false
                }
                else {
                    formerror.nameerror = ""
                    formvalid.namevalid = true
                }
                break
            case "emailId":
                if (value === "") {
                    formerror.emailIderror = "Please enter  your email Id"
                    formvalid.emailIdvalid = false
                }
                else if (!value.match(/^[a-z0-9]+@[a-z]{3,}\.com$/)) {
                    formerror.emailIderror = "Please enter a valid email Id"
                    formvalid.emailIdvalid = false
                }
                else {
                    formerror.emailIderror = ""
                    formvalid.emailIdvalid = true
                }
                break
            case "contactNo":
                if (value === "") {
                    formerror.contactNoerror = "Please enter a your contact number"
                    formvalid.contactNovalid = false
                }
                else if (!value.match(/^[1-9]{1}[0-9]{9}$/)) {
                    formerror.contactNoerror = "Please enter a valid number"
                    formvalid.contactNovalid = false
                }
                else {
                    formerror.contactNoerror = ""
                    formvalid.contactNovalid = true
                }
                break
            case "password":
                if (value === "") {
                    formerror.passworderror = "Please enter  your password"
                    formvalid.passwordvalid = false
                }
                else if (!((value.match(/[a-z]/) && value.match(/[0-9]/) && value.match(/\W/) && value.match(/[A-Z]/) && value.length >= 7 && value.length <= 20))) {
                    formerror.passworderror = "Please enter a valid password"
                    formvalid.passwordvalid = false
                }
                else {
                    formerror.passworderror = ""
                    formvalid.passwordvalid = true
                }
                break
            default:
                break
        }
        formvalid.buttonvalid = formvalid.namevalid && formvalid.emailIdvalid && formvalid.passwordvalid && formvalid.contactNovalid
        this.setState({ formerror: formerror, formvalid: formvalid })
    }
    confirmpass = (event) => {
        let value = event.target.value
        //console.log(this.state.registerform.password)
        //console.log(value)
        let { formerror, formvalid } = this.state
        if (value !== this.state.registerform.password) {

            formerror.confirmerror = "Your password don't match"
            formvalid.confirmvalid = false
        }
        else {
            formerror.confirmerror = ""
            formvalid.confirmvalid = true
        }
        this.setState({ formerror: formerror, formvalid: formvalid })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.register()
    }
    register = () => {
        axios.post(backendUrlUser + "/register", this.state.registerform).then((res) => {
            //  console.log(res)
            this.setState({ sucessMessage: res.data, loadLogin: true,show:false})
        }).catch(err => {
            this.setState({ errorMessage: err.response.data.message })
        })
    }
    render() {
        if (this.state.loadLogin) {
            return(
            <div className="container center">
               
                <h1 className="text text-success text-center"> {this.state.sucessMessage}</h1><br/>
                 <h2 className="text text-link text-center"><Link to="/login">Click here to login</Link> </h2>
                </div>
          
            )
        }
        else{
        return (
            <div>
                  {/* {
                this.state.show ?
                    <div id="details" className="details-section">

                        <div className="text-center">
                            <ProgressSpinner></ProgressSpinner>
                        </div>
                    </div> : null
            } */}
                <section id="registerpage" className="signup-section">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4 offset-7 ">

                                <form className="form bg-light shadow p-4 mb-4 bg-white rounded-lg" onSubmit={this.handleSubmit}>
                                    <h1 style={{ fontFamily: 'cursive' }}>Sign Up</h1>
                                    <div className="form-group ml-2 mr-2">
                                        <label htmlFor="name">Name<span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" name="name" id="name" onChange={this.handleChange}></input>
                                        <span className="text text-danger">{this.state.formerror.nameerror}</span>
                                    </div>
                                    <div className="form-group ml-2 mr-2">
                                        <label htmlFor="emailId" >Email Id<span className="text-danger">*</span></label>
                                        <input type="text" className="form-control" name="emailId" id="emailId" onChange={this.handleChange}></input>
                                        <span className="text text-danger">{this.state.formerror.emailIderror}</span>
                                    </div>
                                    <div className="form-group ml-2 mr-2">
                                        <label htmlFor="contactNo">Contact Number<span className="text-danger">*</span></label>
                                        <input type="number" className="form-control" name="contactNo" id="contactNo" onChange={this.handleChange}></input>
                                        <span className="text text-danger">{this.state.formerror.contactNoerror}</span>
                                    </div>
                                    <div className="form-group ml-2 mr-2">
                                        <label htmlFor="password">Password<span className="text-danger">*</span></label>
                                        <input type="password" className="form-control" name="password" id="password" onChange={this.handleChange}></input>
                                        <span className="text text-danger">{this.state.formerror.passworderror}</span>
                                    </div>
                                    <div className="form-group ml-2 mr-2">
                                        <label htmlFor="confirmpass">Confirm Password<span className="text-danger">*</span></label>
                                        <input type="password" className="form-control" name="confirmpass" id="confirmpass" onChange={this.confirmpass}></input>
                                        <span className="text text-danger">{this.state.formerror.confirmerror}</span>
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-block" disabled={!(this.state.formvalid.buttonvalid && this.state.formvalid.confirmvalid)} >Register</button>
                               
                                    <span className="text text-danger"> {this.state.errorMessage}</span>
                                </form>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}
}

















export default Register;