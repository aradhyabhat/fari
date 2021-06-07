import React, { Component } from "react";
import axios from "axios";
import { backendUrlBooking } from '../BackendURL'
import { Button } from "primereact/button";
import { Redirect } from 'react-router-dom'
//import Home from "./home";
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';

///////////


class Viewbookings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: sessionStorage.getItem("userId"),
            bookings: [],
            errorMessage: "",
            home: false,
            Refund: false,
            dialog_visible: false,
            deal: "",
            homepageload: false,
            show:true

        }
    }
    componentDidMount() {
        axios.get(backendUrlBooking + "/" + this.state.userId).then((res) => {
            this.setState({ bookings: res.data,show:false })
        }).catch(error => {
            this.setState({ errorMessage: "Sorry You have not planned any trips with us yet!", bookings: [] })
        })
    }
    confirm_cancel = (item) => {

        this.setState({ dialog_visible: true, deal: item });

    }

    displaybookings = () => {
        let arr = []

        for (let item of this.state.bookings) {
            let checkInMonth = new Date(item.checkInDate).getMonth()
            let checkInDay = new Date(item.checkInDate).getDate()
            let checkInyear = new Date(item.checkInDate).getFullYear()
            let checkOutMonth = new Date(item.checkOutDate).getMonth()
            let checkOutDay = new Date(item.checkOutDate).getDate()
            let checkOutyear = new Date(item.checkOutDate).getFullYear()
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            arr.push(
                <div className="col-md-8 offset-2 bg-light mt-4 mb-5 p-2 border border-secondary rounded" key={item.bookingId}>
                    <h5>Booking ID:{item.bookingId}</h5>
                    <div className="row bg-white ml-1 mr-1 border ">
                        <div className="p-2 col-md-5">
                            <h3 className="text text-bold">{item.name}</h3>

                            <h6>Trip starts on: {months[checkInMonth]} {checkInDay}, {checkInyear}</h6>
                            <h6>Trip ends on: {months[checkOutMonth]} {checkOutDay}, {checkOutyear}</h6>
                            <h6>Travelers:{item.noOfPersons}</h6>
                        </div>
                        <div className="col-md-3 offset-2 p-2">
                            <h6>Fare Deatils:</h6>
                            <h6>{item.totalCharges}</h6>
                            <button className="btn btn-link btn-light" onClick={() => this.confirm_cancel(item)}><span className="badge bg-white">Claim Refund</span></button>
                        </div>

                    </div>
                    <br />
                </div>

            )
        }
        console.log(arr)
        return arr
    }
    // view=()=>{
    //     this.setState({home:true})
    // }
    Refund = () => {
        console.log(this.state.dialog_visible);
        this.setState({ dialog_visible: false });
        console.log("blaa")
        //this.setState({ Refund: true });
        window.location.reload();
    }
    deletefun = () => {
        this.setState({ dialog_visible: false })
        axios.delete(backendUrlBooking + "/cancelBooking/" + this.state.deal.bookingId).then((res) => {
            this.setState({show:false})
            window.location.reload();
        }).catch((error) => {
            this.setState({ errorMessage: error.message })
        })
    }
    onHide = (event) => {
        this.setState({ dialog_visible: false });

    }
    render() {

        if (this.state.homepageload) { return <Redirect to={"/home/" + this.state.userId}></Redirect> }

        const footer = (
            <div>
                <Button label="Yes" icon="pi pi-check" onClick={this.deletefun} />
                <Button label="cancel" icon="pi pi-times" onClick={this.Refund} className="p-button-secondary" />
            </div>
        );
        if (this.state.bookings.length === 0) {
            return (
                <div className="container mt-5 mb-5">
                    <h2 className="text">{this.state.errorMessage}</h2>
                    <button className="btn btn-success" onClick={() => this.setState({ homepageload: true })}>CLICK HERE TO START BOOKING</button>
                </div>
            )
        }
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
                    !(this.state.bookings.length < 0) ?
                        (
                            <div>

                                {this.displaybookings()}

                            </div>
                        ) : null
                }

                <div className="content-section implementation">
                    <Dialog
                        header="Confirmation"
                        visible={this.state.dialog_visible}
                        style={{ width: '50vw' }}
                        footer={footer}
                        onHide={this.onHide}

                    >
                        Are you sure to cancel the booking?
            </Dialog>
                </div>
            </div>

        )





    }
}

export default Viewbookings;