import React from "react";
import { useTranslation } from "react-i18next";

export default function () {
    const { t } = useTranslation();
    return (
        <div className="confirmation block document">
            <section>
                <h1>About Us</h1>
                <p><b>HappyTravelDotCom</b> is a new travel wholesaler based in Dubai servicing businesses such as travel agents and tour operators across the world.</p>

                <p>With our global database of contacts, we can offer a premium service with over 2000 properties, covering a range of international territories. You’ll find properties in different destinations such as Paris, Maldives, London and Dubai, all designed to offer an exquisite ground service from the moment you step off the plane.</p>

                <p><i>Wherever you want to travel, we have the solution.</i></p>

                <p>The robust online platform is run by a team of friendly experts, who have over 15 years’ experience in the travel and hospitality sector. Here at <b>HappyTravelDotCom</b>, we’re particularly passionate about what we do and it’s a pleasure to help you find the right service.</p>

                <p>We designed <b>HappyTravelDotCom</b> with you in mind. Constructed by top IT specialists, our algorithms are able to be tailored and filtered to fit your needs. <b>HappyTravelDotCom</b> are committed to offering you the best price possible.</p>
                <p>The <b>HappyTravelDotCom</b> website and mobile app are available in English, Arabic, and Russian.</p>

                <p>For a travel professional, <b>HappyTravelDotCom</b> is the answer.<br/>
                    If you’d like to reach the team at <b>HappyTravelDotCom</b>, you can call 24/7/366. We look forward to hearing from you!</p>
            </section>
        </div>
    );
};
