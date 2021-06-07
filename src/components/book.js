import React, { Component } from "react";
import { Fieldset } from 'primereact/fieldset';
import { InputSwitch } from 'primereact/inputswitch';
import { Redirect } from "react-router";
import axios from "axios";
import { backendUrlBooking } from '../BackendURL'
import { Link } from 'react-router-dom'
import { ProgressSpinner } from 'primereact/progressspinner';

class Book extends Component {

    constructor(props) {
        super(props);
        this.state = {
            bookingForm: {
                noOfPersons: Number(sessionStorage.getItem("noOfPersons")),
                checkInDate: sessionStorage.getItem("checkInDate"),
                flight: Boolean(sessionStorage.getItem("flight")),
            },
            dealId: sessionStorage.getItem("dealId"),
            deal: JSON.parse(sessionStorage.getItem("deal")),
            totalCharges: "",
            checkOutDate: "",
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: false,
                date: false,
                buttonActive: true
            },
            goBack: false,
            userId: sessionStorage.getItem("userId"),
            loginPage: false,
            bookingSuccess: false,
            errorMessage: "",
            show:true
        }
    }

    componentWillMount() {

        this.calculateCharges()
    }
    displayPackageInclusions = () => {
        const packageInclusions = this.state.deal.details.itinerary.packageInclusions;
        if (this.state.deal) {
            return packageInclusions.map((pack, index) => (<li key={index}>{pack}</li>))
        }
        else {
            return null;
        }
    }


    displayPackageHighlights = () => {
        let packageHighLightsArray = [];
        let firstElement = (
            <div key={0}>
                <h3>Day Wise itinerary</h3>
                <h5>Day 1</h5>
                {this.state.deal ? <div>{this.state.deal.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.deal) {
            this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight, index) => {
                let element = (
                    <div key={index + 1}>
                        <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                );
                packageHighLightsArray.push(element)
            });
            let lastElement = (
                <div key={666}>
                    <h5>Day {this.state.deal.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.deal.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement. <a
                            href="#contact-us">Contact us</a> for more details.
                    </div>
                </div>
            );
            packageHighLightsArray.push(lastElement);
            return packageHighLightsArray;
        } else {
            return null;
        }
    }
    handleChange = (event) => {

        const target = event.target;
        const name = target.name;
        if (target.checked) {
            var value = target.checked;
        } else {
            value = target.value;
        }
        const { bookingForm } = this.state;
        this.setState({
            bookingForm: { ...bookingForm, [name]: value }
        });

        this.validateField(name, value);
        this.calculateCharges()

    }
    calculateCharges = () => {

        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let startingDate = new Date(this.state.bookingForm.checkInDate)
        let checkOutDateinMs = Math.round(Math.abs((startingDate.getTime() + (this.state.deal.noOfNights) * oneDay)));
        // console.log(startingDate,checkOutDateinMs)
        let finalCheckOutDate = new Date(checkOutDateinMs);
        // console.log(finalCheckOutDate.toDateString())
        let month = finalCheckOutDate.getMonth()
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let str = ""
        str += months[month] + " " + finalCheckOutDate.getDate() + ", " + finalCheckOutDate.getFullYear()
        console.log(str)
        this.setState({ checkOutDate: str });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson + this.state.deal.flightCharges;
            this.setState({ totalCharges: totalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.deal.chargesPerPerson;
            this.setState({ totalCharges: totalCost });
        }
    }
    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.bookingFormErrorMessage;
        let formValid = this.state.bookingFormValid;
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    fieldValidationErrors.noOfPersons = "This field can't be empty!";
                 //   formValid.noOfPersons = false;
                    formValid.buttonActive=false
                } else if (value < 1) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                 //   formValid.noOfPersons = false;
                    formValid.buttonActive=false
                } else if (value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5.";
                   // formValid.noOfPersons = false;
                    formValid.buttonActive=false
                } else {
                    fieldValidationErrors.noOfPersons = "";
                    //formValid.noOfPersons = true;
                    formValid.buttonActive=true
                }
                break;
            case "checkInDate":
                if (value === "") {
                    fieldValidationErrors.date = "This field can't be empty!";
                  //  formValid.date = false;
                    formValid.buttonActive=false
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.date = "Check-in date cannot be a past date!";
                     //   formValid.date = false;
                        formValid.buttonActive=false
                    } else {
                        fieldValidationErrors.date = "";
                        //formValid.date = true;
                        formValid.buttonActive=true
                    }
                }
                break;
            default:
                break;
        }

     //   formValid.buttonActive = formValid.noOfPersons && formValid.date;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            formValid: formValid,
            successMessage: "",

        });

    }
    // goBack=()=>{
    //     this.setState({goBack:true})
    // }
    postData = () => {
        //console.log("blaaa")
        let postdata = {
            destinationName: this.state.deal.name,
            checkInDate: this.state.bookingForm.checkInDate,
            checkOutDate: this.state.checkOutDate,
            noOfPersons: this.state.bookingForm.noOfPersons,
            totalCharges: this.state.totalCharges
        }

        axios.post(backendUrlBooking + '/' + this.state.userId + '/' + this.state.dealId, postdata).then((response) => {
            this.setState({ bookingSuccess: true, errorMessage: "" ,show:false})
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message, bookingSuccess: false })
        })



    }
    handleSubmit = (event) => {
        event.preventDefault();
        // console.log(this.state.userId)
        if (!this.state.userId) {
            alert("Please login to continue")
            this.setState({ loginPage: true })
        }
        else {
            //console.log("kla")
            this.postData();
        }
    }

    render() {

        let checkInMonth = new Date(this.state.bookingForm.checkInDate).getMonth()
        let checkInDay = new Date(this.state.bookingForm.checkInDate).getDate()
        let checkInyear = new Date(this.state.bookingForm.checkInDate).getFullYear()
       // let checkOutMonth = new Date(this.state.bookingForm.checkOutDate)
        // let checkOutDay = new Date(this.state.bookingForm.checkOutDate).getDate()
        // let checkOutyear = new Date(this.state.bookingForm.checkOutDate).getFullYear()
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        


        if (this.state.bookingSuccess) {
            return (
                <div className="container">
                    <h2 className="text">Booking Confirmed!!!</h2>
                    <br />

                    <h3 className="text text-success">Congratulations Trip planned to {this.state.deal.name}</h3>
                    <h2 className="text">Trip starts on: {months[checkInMonth]} {checkInDay}, {checkInyear}</h2>
            <h2 className="text">Trip ends on: {this.state.checkOutDate}</h2>
                    <Link to="/viewBookings"><h2 className="text text-link">Click here you to view your bookings</h2></Link>
                </div>
            )
        }
        //if(this.state.goBack){return <Redirect to="" ></Redirect>}
        else if (this.state.loginPage) { return <Redirect to="/login"></Redirect> }
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
            <div className="container-fluid">
                <div className="row mt-5 mb-5">
                    <div className="col-md-6 offset-1 ">
                        <Fieldset legend='Overview' collapsed={true} toggleable={true} style={{ width: '90%', marginTop: '20px' }}>
                            {this.state.deal.details.about}
                        </Fieldset>
                        <Fieldset legend='Package Inclusions' collapsed={true} toggleable={true} style={{ width: '90%', marginTop: '20px' }}>

                            {this.displayPackageInclusions()}

                        </Fieldset>
                        <Fieldset legend='Itinerary' collapsed={true} toggleable={true} style={{ width: '90%', marginTop: '20px' }}>
                            {this.displayPackageHighlights()}
                        </Fieldset>
                        <br />
                    </div>
                    <div className="col-md-4 offset-.5">
                        <form className="form bg-light shadow p-4 mb-4 rounded-lg" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="noOfPersons">Number of Travelers</label>
                                <input type="number" name="noOfPersons" id="noOfPersons" onChange={this.handleChange} className="form-control" value={this.state.bookingForm.noOfPersons}></input>
                                {this.state.bookingFormErrorMessage.noOfPersons ?
                                    <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                    : null}
                            </div>
                            <div className="form-group">
                                <label htmlFor="checkInDate">Trip Start Date</label>
                                <input type="date" name="checkInDate" id="checkInDate" onChange={this.handleChange} value={this.state.bookingForm.checkInDate} className="form-control"></input>
                                {this.state.bookingFormErrorMessage.date ?
                                    <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                    : null}

                            </div>
                            <div className="form-group">
                                <label> Include Flights:</label>&nbsp;
                               <InputSwitch name="flight" id="flight"
                                    checked={this.state.bookingForm.flight}
                                    onChange={this.handleChange} />
                            </div>

                            <h4 className="text">
                                Your trip ends on {this.state.checkOutDate} and
                                        you will pay ₹{this.state.totalCharges}

                            </h4>
                            <br />

                            <button type="submit" className="btn btn-primary" disabled={!this.state.bookingFormValid.buttonActive}>CONFIRM BOOKING</button>&nbsp;
                                <h6 className="text text-danger">{this.state.errorMessage}</h6>
                            <button className="btn btn-primary">GO BACK</button>
                        </form>
                    </div>

                </div>
            </div >
            </div>
        )
    }



}






export default Book;