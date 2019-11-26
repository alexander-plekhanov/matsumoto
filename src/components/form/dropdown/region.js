import React from "react";
import { observer } from "mobx-react";
import UI from "stores/ui-store";
import store from "stores/accommodation-store";
import { decorate } from "core";
import { Highlighted } from "components/simple";
import { API } from "core";

export const regionInputChanged = event => {
    var query = event.target.value;
    if (!query)
        return UI.setCountries([]);

    API.get({
        url: API.COUNTRIES_PREDICTION,
        body: { query },
        after: (data) => {
            UI.setCountries(data || []);
        }
    });
};

const anotherField = {
    "residency": "nationality",
    "nationality": "residency"
};

/* Refactoring possibility: remove region sorter from render() */
@observer
class RegionDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.setValue = this.setValue.bind(this);
        this.generateSuggestion = this.generateSuggestion.bind(this);
    }

    setValue(city) {
        var {
            connected,
            formik
        } = this.props;

        formik.setFieldValue(connected, city.name);
        if ("country" != connected) //todo: repair this workaround
            store.setSearchRequestField(connected, city.code);
        else
            formik.setFieldValue("countryCode", city.code);
        UI.setCountries([]);

        if (anotherField[connected] && !store.search.request[anotherField[connected]]) {
            store.setSearchRequestField(anotherField[connected], city.code);
            formik.setFieldValue(anotherField[connected], city.name);
        }
    }

    generateSuggestion = () => {
        if (!UI.countries?.length || !UI.regionList?.length)
            return;

        var countries = [...UI.countries]; //todo: sort for regions

        for (var i = 0; i < countries.length; i++) {
            if (decorate.cutFirstPart(countries[i].name, this.props.value))
                return countries[i].name;
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.value != this.props.value)
            UI.setSuggestion(this.props.connected, this.props.value, this.generateSuggestion());
    }

    render() {
        if (!UI.countries?.length)
            return null; //todo: change to separated lists for different inputs

        return (
            <div class="cities dropdown">
                <div class="scroll">
                    {UI.regionList?.map?.(item => (
                        <React.Fragment>
                            {UI.countries?.some?.(city => item.id == city.regionId) && <div class="region">
                                {item.name}
                            </div>}
                            {UI.countries?.map?.(city => (
                                item.id == city.regionId ?
                                    <div class="city line" onClick={ () => this.setValue(city) }>
                                        <Highlighted str={city.name} highlight={this.props.value} /> {/* todo: pick culture normally */}
                                    </div> : null
                            ))}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        );
    }
}

export default RegionDropdown;
