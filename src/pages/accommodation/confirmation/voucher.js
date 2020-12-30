import React from 'react';
import { observer } from "mobx-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { API } from "core";
import { Loader, dateFormat } from "simple";
import Map from "components/map";

@observer
class AccommodationConfirmationVoucherPage extends React.Component {
    componentDidMount() {
        API.get({
            url: API.BOOKING_VOUCHER(this.props.match?.params?.id),
            success: voucher => this.setState({ voucher })
        });
    }

    render() {
        var { t } = useTranslation(),
            voucher = this?.state?.voucher;

        if (!voucher)
            return <Loader />;

        return (
            <div class="invoice">
                {voucher.logoUrl &&
                    <div class="personal-logo">
                        <img src={voucher.logoUrl} alt="" />
                    </div>
                }

                <h4>Booking reference code: {voucher.referenceCode}</h4>

                <div class="information">
                    <div>Thank you{voucher.agentName ? ", " + voucher.agentName : ""}!</div>
                    <div>
                        Waiting for you in{" "}
                        {voucher.accommodation.location.locality},{" "}
                        {voucher.accommodation.location.country}{" "}
                        {dateFormat.c(voucher.checkInDate)}{" "}
                    </div>
                    <div class="points">
                        <div>
                            <div class="item">
                                <span class="icon icon-white-check"/>
                            </div>
                            Accommodation: {voucher.accommodation.name}
                        </div>
                        <div>
                            <div class="item">
                                <span class="icon icon-white-check"/>
                            </div>
                            Phone Number: {voucher.accommodation.contactInfo.phones.join(", ")}
                        </div>
                        <div>
                            <div class="item">
                                <span class="icon icon-white-check"/>
                            </div>
                            Address: {voucher.accommodation.location.address}
                        </div>
                        <div class="no-print">
                            <div class="item">
                                <span class="icon icon-white-check"/>
                            </div>
                            <Link to={`/accommodation/confirmation/${voucher.bookingId}`}>
                                More information about booking
                            </Link>
                        </div>
                    </div>
                </div>

                <div class="box">
                    <div class="title">Information About Your Booking</div>
                    <div class="columns">
                        <div class="one">
                            <div class="text">{voucher.accommodation.name}</div>
                            <div>
                                {voucher.accommodation.location.address},{" "}
                                {voucher.accommodation.location.locality},{" "}
                                {voucher.accommodation.location.country},{" "}
                                {voucher.accommodation.contactInfo.phones.join(", ")}
                            </div>

                            <div class="text">Your Booking:</div>
                            <div>{
                                __plural(t, voucher.nightCount, "Night") + ", " +
                                __plural(t, voucher.roomDetails.length, "Room")
                            }</div>

                            <div class="text">Check In:</div>
                            <div>{dateFormat.c(voucher.checkInDate)}</div>

                            <div class="text">Check Out:</div>
                            <div>{dateFormat.c(voucher.checkOutDate)}</div>

                            <div class="text">Room Type:</div>
                            <div>Classic</div>
                        </div>
                        <div class="two">
                            <Map
                                marker={voucher.accommodation.location.coordinates}
                            />
                        </div>
                    </div>
                </div>

                {voucher.bannerUrl &&
                    <div class="personal-b">
                        <img src={voucher.bannerUrl} alt="" />
                    </div>
                }

                {!voucher.deadlineDate &&
                    <div class="deadline-notify">
                        <span class="icon icon-info-green"/>
                        FREE Cancellation
                    </div>
                }
                {moment().isBefore(voucher.deadlineDate) &&
                    <div class="deadline-notify">
                        <span class="icon icon-info-green"/>
                        FREE Cancellation until {dateFormat.c(voucher.deadlineDate)}
                    </div>
                }
            </div>
        )
    }
}

export default AccommodationConfirmationVoucherPage;