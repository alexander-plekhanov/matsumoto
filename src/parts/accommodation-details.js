import React from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { Stars } from "components/simple";
import Gallery from "components/gallery";

const Amenities = ({ hotel, fromPage, fromModal, t }) => {

    const Part = ({ t, list }) => (
        !!list.length &&
        <React.Fragment>
            <h2>{t("Accommodation Amenities")}</h2>
            <ul class="amenities">
                {list.map(item => (
                    (item == item.toLowerCase()) ? <li>{t("amenities_" + item)}{" "}</li> : <li>{item}</li>
                ))}
            </ul>
        </React.Fragment>
    );

    if (!hotel.accommodationAmenities?.length)
        return null;

    if (fromPage)
        return <Part t={t} list={hotel.accommodationAmenities} />;

    return <React.Fragment>
        <td>
            <Part t={t} list={hotel.accommodationAmenities.slice(0, Math.round(hotel.accommodationAmenities.length/2))} />
        </td>
        <td>
            <Part t={t} list={hotel.accommodationAmenities.slice(Math.round(hotel.accommodationAmenities.length/2))} />
        </td>
    </React.Fragment>;
};

const descriptionLength = 450,
    decodeHtml = html => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value.trim();
    };

@observer
class AccommodationCommonDetailsPart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullDescription: false
        }
    }

    render() {
        const { t } = useTranslation(),
              hotel = this.props.accommodation,
              { fromModal, fromPage } = this.props;

        const Text = () => {
            var description = hotel.textualDescriptions?.[0]?.description || hotel.textualDescriptions?.[1]?.description;
            if (!description)
                return null;

            description = decodeHtml(description);

            if (this.state.fullDescription || (description.length <= 0.9 * descriptionLength))
                return <div class="text">{description}</div>;

            description = description.substr(0, descriptionLength);
            description = description.substr(0,
                Math.min(description.length, Math.max(description.lastIndexOf(" "), description.lastIndexOf("."))));

            return <div class="text">
                {description} <span class="expand"
                      onClick={() => this.setState({ fullDescription: true })}>
                    {t("more...")}
                </span>
            </div>;
        };

        return (
            <div class={"details" + (fromModal ? " from-modal" : "") + (fromPage ? " from-page" : "")}>
                <div class="top">
                    {fromModal && hotel?.pictures?.[0]?.source && <div class="photo">
                        <img src={hotel.pictures[0].source} alt={hotel.pictures[0].caption} class="round" />
                    </div>}
                    <div class="info">
                        <div class="name">
                            {hotel.name} { fromPage && <Stars count={hotel.rating} /> }
                        </div>
                        { fromModal && <div>
                            <Stars count={hotel.rating} />
                        </div> }
                        <div class="line">
                            <span class="icon icon-small-pin" />
                            {hotel.location.address}, {hotel.location.locality}, {hotel.location.country}
                        </div>
                        {hotel.contacts?.phone && <div class="line">
                            <span class="icon icon-small-phone" />
                            {hotel.contacts.phone}
                        </div>}
                    </div>
                </div>

                { fromModal && <Text /> }

                <h2>{t("Accommodation Photos")}</h2>

                { hotel.pictures?.length && <Gallery>
                    {hotel.pictures.map(item => (
                        <div className="gallery__item">
                            <img src={item.source}/>
                            <p className="legend hide">{item.caption}</p>
                            <button></button>
                        </div>
                    ))}
                </Gallery> }

                { fromPage && <Text /> }

                { fromModal &&
                    <table><tbody>
                        <tr>
                            <td>
                                <h2>{t("Additional Information")}</h2>
                                <ul>
                                    <li>{t("Number of floors")}: 1</li>
                                    <li>{t("Number of rooms")}: 1</li>
                                </ul>
                            </td>
                            <Amenities t={t} hotel={hotel} fromModal />
                        </tr>
                        <tr>
                            <td>
                                <h2>{t("Business Features & Amenities")}</h2>
                                <ul>
                                    <li>{t("Conference Rooms")}</li>
                                    <li>{t("Meeting Rooms")}</li>
                                </ul>
                            </td>
                            <td>
                                <h2>{t("Transportation & Directions To The Hotel")}</h2>
                                <div>{t("No Information")}</div>
                            </td>
                            <td />
                        </tr>
                    </tbody></table>
                }

                { fromPage && <Amenities t={t} hotel={hotel} fromPage /> }
            </div>
        );
    }
}

export default AccommodationCommonDetailsPart;
