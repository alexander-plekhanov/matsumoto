import React from 'react';
import Tiles from 'components/tiles';
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import authStore from "stores/auth-store";
import { Loader } from "../../components/simple";

@observer
class AccommodationTitlePage extends React.Component {
render () {
    var { t } = useTranslation();
    if (!authStore.cachedUserRegistered)
        return <Loader white page />;

    return (
    <React.Fragment>
        <div class="tiles block">
            <section>
                <h1><span>{t("Country & Hotels")}</span></h1>
                <Tiles list={[
                    {
                        city: 'PARIS, FRANCE',
                        flag: 'fr',
                        propertiesCount: '161',
                        image: '/images/hotels/france.png'
                    },
                    {
                        city: 'LONDON, ENGLAND',
                        flag: 'gb',
                        propertiesCount: '334',
                        image: '/images/hotels/london.png'
                    }
                ]} />
                <Tiles list={[
                    {
                        city: 'ROME, ITALY',
                        flag: 'it',
                        propertiesCount: '65',
                        image: '/images/hotels/rome.png'
                    },
                    {
                        city: 'BARCELONA, SPAIN',
                        flag: 'es',
                        propertiesCount: '223',
                        image: '/images/hotels/barcelona.png'
                    },
                    {
                        city: 'DORTMUND, GERMANY',
                        flag: 'fr',
                        propertiesCount: '11',
                        image: '/images/hotels/dortmund.png'
                    }
                ]} />
                <h1><span>{t("Exclusive offers")}</span></h1>
                <Tiles list={[
                    {
                        title: 'EMERALD PALACE KEMPINSKI DUBAI, DUBAI',
                        flag: 'ae',
                        image: '/images/hotels/emeraldplace.png'
                    },
                    {
                        title: 'HILTON BAKU, BAKU',
                        flag: 'az',
                        image: '/images/hotels/hilton.png'
                    },
                    {
                        title: 'KEMPINSKI HOTEL MALL OF THE EMIRATES, DUBAI',
                        flag: 'ae',
                        image: '/images/hotels/kempinski.png'
                    },
                    {
                        title: 'PULLMAN DUBAI CREEK CITY CENTRE HOTEL, DUBAI',
                        flag: 'ae',
                        image: '/images/hotels/pullman.png'
                    }
                ]} />
            </section>
        </div>
    </React.Fragment>
);
}
}

export default AccommodationTitlePage;
