import React, { Component } from 'react';

import axios from 'axios';
import { backendUrlPackage } from '../BackendURL';
import { Sidebar } from 'primereact/sidebar';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputSwitch } from 'primereact/inputswitch';
import { Redirect } from 'react-router';
import { ProgressSpinner } from 'primereact/progressspinner';

//import { Link } from 'react-router-dom';



class StaticPackage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            errorMessage: "",
            successMessage: "",
            sidepanel: false,
            package: "",
            index: "",
            sidebarload: false,
            totalCharges: "",
            checkOutDate: new Date(),
            bookingForm: {
                noOfPersons: 1,
                date: "",
                flights: false
            },
            bookingFormErrorMessage: {
                noOfPersons: "",
                date: ""
            },
            bookingFormValid: {
                noOfPersons: false,
                date: false,
                buttonActive: false
            },
            dealId: "",
            bookingPage: false,
            show:true

        }
    }

    componentDidMount() {
        this.Hotdeals();
    }

    Hotdeals = () => {
        axios.get(backendUrlPackage + "/hotdeals").then((response) => {
            this.setState({ data: response.data, errorMessage: "" ,show:false})
            // console.log(this.state.data)
        }).catch((error) => {
            this.setState({ errorMessage: error.response.data.message, successMessage: "" })
        })
    }

    fun = () => {
        let arr = []

        for (let singlePackage of this.state.data) {
            arr.push(
                <div className="card bg-light text-dark package-card" key={singlePackage.destinationId}>
                    <div className="card-body row">
                        <div className="col-md-4">
                            <img className="package-image" src={singlePackage.imageUrl} alt="destination comes here" />
                        </div>
                        <div className="col-md-5">
                            <div className="featured-text text-center text-lg-left">
                                <h4>{singlePackage.name}</h4>
                                <div className="badge badge-info">{singlePackage.noOfNights}<em> Nights</em></div>
                                {singlePackage.discount ? <div className="discount text-danger">{singlePackage.discount}% Instant Discount</div> : null}
                                <p className="text-dark mb-0">{singlePackage.details.about}</p>
                            </div>
                            <br />

                        </div>
                        <div className="col-md-3">
                            <h4>Prices Starting From:</h4>
                            <div className="text-center text-success"><h6>₹ {singlePackage.chargesPerPerson}</h6></div><br /><br />
                            <div><button className="btn btn-primary book" onClick={() => this.getItinerary(singlePackage)}>View Details</button></div><br />
                            <div><button className="btn btn-primary book" onClick={() => this.openBooking(singlePackage)}>Book </button>  </div>
                        </div>
                    </div>
                </div>
            )
        }
        return arr

    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.calculateCharges();
    }
    displayPackageInclusions = () => {
        const packageInclusions = this.state.package.details.itinerary.packageInclusions;
        if (this.state.package) {
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
                {this.state.package ? <div>{this.state.package.details.itinerary.dayWiseDetails.firstDay}</div> : null}
            </div>
        );
        packageHighLightsArray.push(firstElement);
        if (this.state.package) {
            this.state.package.details.itinerary.dayWiseDetails.restDaysSightSeeing.map((packageHighlight, index) => {
                let element = (
                    <div key={index + 1}>
                        <h5>Day {this.state.package.details.itinerary.dayWiseDetails.restDaysSightSeeing.indexOf(packageHighlight) + 2}</h5>
                        <div>{packageHighlight}</div>
                    </div>
                );
                packageHighLightsArray.push(element)
            });
            let lastElement = (
                <div key={666}>
                    <h5>Day {this.state.package.details.itinerary.dayWiseDetails.restDaysSightSeeing.length + 2}</h5>
                    {this.state.package.details.itinerary.dayWiseDetails.lastDay}
                    <div className="text-danger">
                        **This itinerary is just a suggestion, itinerary can be modified as per requirement.
                           <a href="#contact-us">Contact us</a> for more details.
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

    }

    validateField = (fieldname, value) => {
        let fieldValidationErrors = this.state.bookingFormErrorMessage;
        let formValid = this.state.bookingFormValid;
        switch (fieldname) {
            case "noOfPersons":
                if (value === "") {
                    fieldValidationErrors.noOfPersons = "This field can't be empty!";
                    formValid.noOfPersons = false;
                } else if (value < 1) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be less than 1!";
                    formValid.noOfPersons = false;
                } else if (value > 5) {
                    fieldValidationErrors.noOfPersons = "No. of persons can't be more than 5.";
                    formValid.noOfPersons = false;
                } else {
                    fieldValidationErrors.noOfPersons = "";
                    formValid.noOfPersons = true;
                }
                break;
            case "date":
                if (value === "") {
                    fieldValidationErrors.date = "This field can't be empty!";
                    formValid.date = false;
                } else {
                    let checkInDate = new Date(value);
                    let today = new Date();
                    if (today.getTime() > checkInDate.getTime()) {
                        fieldValidationErrors.date = "Check-in date cannot be a past date!";
                        formValid.date = false;
                    } else {
                        fieldValidationErrors.date = "";
                        formValid.date = true;
                    }
                }
                break;
            default:
                break;
        }

        formValid.buttonActive = formValid.noOfPersons && formValid.date;
        this.setState({
            loginformErrorMessage: fieldValidationErrors,
            formValid: formValid,
            successMessage: ""
        });
    }

    calculateCharges = () => {
        this.setState({ totalCharges: 0 });
        let oneDay = 24 * 60 * 60 * 1000;
        let checkInDate = new Date(this.state.bookingForm.date);
        let checkOutDateinMs = Math.round(Math.abs((checkInDate.getTime() + (this.state.package.noOfNights) * oneDay)));
        let finalCheckOutDate = new Date(checkOutDateinMs);
        this.setState({ checkOutDate: finalCheckOutDate.toDateString() });
        if (this.state.bookingForm.flights) {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.package.chargesPerPerson + this.state.package.flightCharges;
            this.setState({ totalCharges: totalCost });
        } else {
            let totalCost = (-(-this.state.bookingForm.noOfPersons)) * this.state.package.chargesPerPerson;
            this.setState({ totalCharges: totalCost });
        }
    }


    getItinerary = (aPackage) => {
        // alert("The package details are shown as a side-bar from left side");
        // return <Packages></Packages>
        console.log(aPackage)
        this.setState({ index: 0, sidepanel: true, package: aPackage })


    };
    openBooking = (aPackage) => {
        this.setState({ index: 2, package: aPackage, sidepanel: true })
    };

    loadBookingPage = (dealId) => {
        //console.log(dealId)
        //  console.log(":here");

        sessionStorage.setItem('noOfPersons', this.state.bookingForm.noOfPersons);
        sessionStorage.setItem('checkInDate', this.state.bookingForm.date);
        sessionStorage.setItem('flight', this.state.bookingForm.flights);
        sessionStorage.setItem('dealId', dealId);
        sessionStorage.setItem('deal',JSON.stringify(this.state.package))
        this.setState({ show: false, bookingPage: true, sidebarload: true, dealId: dealId, sidepanel: false })
    }

    bookDefault = () => {
        let bookingForm = {
            noOfPersons: 1,
            date: "",
            flights: false
        }
        let bookingFormValid = {
            noOfPersons: false,
            date: false,
            buttonActive: false
        }
        this.setState({ sidepanel: false, bookingForm: bookingForm, totalCharges: "", bookingFormValid: bookingFormValid })

    }
    render() {
        //console.log(this.state.package)
        // if (this.state.package) {
            if (this.state.bookingPage === true) return <Redirect  to={'/book/' + this.state.dealId} />
        return (
            <div>
                {
                this.state.show ?
                    <div id="details" className="details-section">

                        <div className="text-center">
                            <ProgressSpinner></ProgressSpinner>
                        </div>
                    </div> : null
            }
                {
                    !this.state.sidebarload ?
                        (
                            <div>
                                {this.fun()}

                            </div>
                        ) : null
                }
                {/* {this.state.sidebarload ? */}
                <Sidebar visible={this.state.sidepanel} position="right" className="p-sidebar-lg" onHide={this.bookDefault}>
                    <h2>{this.state.package.name}</h2>
                    <TabView activeIndex={Number(this.state.index)} onTabChange={(e) => this.setState({ index: e.index })} >
                        <TabPanel header="Overview">
                            <div className="row">
                                {this.state.package ?
                                    <div className="col-md-6 text-center">
                                        <img className="package-image" src={this.state.package.imageUrl} alt="destination comes here" />
                                    </div> : null}

                                <div className="col-md-6">
                                    <h4>Package Includes:</h4>
                                    <ul>
                                        {this.state.sidepanel ? this.displayPackageInclusions() : null}
                                    </ul>
                                </div>
                            </div>
                            <div className="text-justify itineraryAbout">
                                <h4>Tour Overview:</h4>
                                {this.state.package ? this.state.package.details.about : null}
                            </div>

                        </TabPanel>
                        <TabPanel header="Itinerary">
                            {this.displayPackageHighlights()}
                        </TabPanel>
                        <TabPanel header="Book">
                            <h4 className="itenaryAbout text-success">**Charges per person: Rs. {this.state.package.chargesPerPerson}</h4>
                            <form onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="noOfPersons">Number of Travelers:</label>
                                    <input
                                        type="number"
                                        id="noOfPersons"
                                        className="form-control"
                                        name="noOfPersons"
                                        value={this.state.bookingForm.noOfPersons}
                                        onChange={this.handleChange}
                                    />
                                    {this.state.bookingFormErrorMessage.noOfPersons ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.noOfPersons}</span>
                                        : null}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="date">Trip start Date:</label>
                                    <input
                                        type="date"
                                        id="date"
                                        className="form-control"
                                        name="date"
                                        value={this.state.bookingForm.date}
                                        onChange={this.handleChange}
                                    />
                                    {this.state.bookingFormErrorMessage.date ?
                                        <span className="text-danger">{this.state.bookingFormErrorMessage.date}</span>
                                        : null}
                                </div>
                                <div className="form-group">
                                    <label> Include Flights:</label>&nbsp;
                                    <InputSwitch name="flights" id="flights"
                                        checked={this.state.bookingForm.flights}
                                        onChange={this.handleChange} />
                                </div>
                                <div className="form-group">
                                    <button id="buttonCalc" className="btn btn-primary" type="submit" disabled={!this.state.bookingFormValid.buttonActive}>Calculate Charges</button>&nbsp;
                                </div>
                            </form>
                            {!this.state.totalCharges ?
                                (
                                    <React.Fragment><span>**Charges Exclude flight charges.</span><br /></React.Fragment>
                                )
                                :
                                (
                                    <h4 className="text-success">
                                        Your trip ends on {this.state.checkOutDate} and
                                        you will pay ${this.state.totalCharges}
                                        }
                                    </h4>
                                )
                            }

                            <div className="text-center">
                                <button disabled={!this.state.bookingFormValid.buttonActive} className="btn btn-success" onClick={() => this.loadBookingPage(this.state.package.destinationId)}>Book</button>
                                &nbsp; &nbsp; &nbsp;
                                <button type="button" className="btn btn-link" onClick={this.bookDefault}>Cancel</button>
                            </div>
                        </TabPanel>


                    </TabView>

                </Sidebar>
                {/* : null} */}
                {/* {this.fun()} */}
            </div>
        )
    }









    //}

}



export default StaticPackage;