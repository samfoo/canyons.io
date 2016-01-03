import * as CanyonActions from "../../actions/canyon";
import * as links from "../../utils/links";
import GoogleMap from "google-map-react";
import React from "react";
import { Link } from "react-router";
import { User } from "models";
import { connect } from "react-redux";
import { fetch, resourceRequired } from "../../decorators";

var d = React.DOM;

const link = (props, ...children) => {
    return React.createElement(
        Link, props, ...children
    );
};

@resourceRequired((store, r) => {
    return store.loaded(`canyons.ids.${r.params.id}`) &&
        store.loaded(`canyons.images.ids.${r.params.id}`) &&
        store.loaded(`canyons.trip-reports.ids.${r.params.id}`);
})
@fetch((store, r) => {
    let resources = [];

    if (!store.loaded(`canyons.trip-reports.ids.${r.params.id}`)) {
        resources.push(store.dispatch(CanyonActions.getCanyonTripReports(r.params.id)));
    }

    if (!store.loaded(`canyons.images.ids.${r.params.id}`)) {
        resources.push(store.dispatch(CanyonActions.getCanyonImages(r.params.id)));
    }

    if (!store.loaded(`canyons.ids.${r.params.id}`)) {
        resources.push(store.dispatch(CanyonActions.getCanyon(r.params.id)));
    }

    if (resources.length > 0 ) {
        return Promise.all(resources);
    }
})
@connect(state => ({
    currentUser: state.users.get("current"),
    canyons: state.canyons
}))
export class ShowCanyon extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    canyon() {
        const { canyons } = this.props;
        return canyons.getIn(["ids", this.props.params.id]);
    }

    images() {
        const { canyons } = this.props;
        return canyons.getIn(["images", "ids", this.props.params.id]);
    }

    tripReports() {
        const { canyons } = this.props;
        return canyons.getIn(["trip-reports", "ids", this.props.params.id]);
    }

    mapLoaded({map, maps}) {
        if (this.state.map) {
            return;
        }

        this.setState({
            map: map,
            bounds: new maps.LatLngBounds()
        });

        let extendTo = (geometry, bounds) => {
            if (geometry instanceof maps.LatLng) {
                bounds.extend(geometry);
            } else if (geometry instanceof maps.Data.Point) {
                bounds.extend(geometry.get());
            } else {
                geometry.getArray().forEach((g) => {
                    extendTo(g, bounds);
                });
            }

            return bounds;
        };

        map.data.setStyle({
            strokeColor: "#ff5722",
            strokeOpacity: 0.75
        });

        map.data.addListener("addfeature", ({feature}) => {
            let bounds = extendTo(feature.getGeometry(), this.state.bounds);
            map.fitBounds(bounds);
        });

        map.data.addGeoJson(this.canyon().get("gps").toJS());
    }

    render() {
        const labelFor = {
            abseil: "Abseiling",
            cold: "Summer Only",
            swim: "Swimming",
            wetsuit: "Wetsuit Required"
        };

        let { currentUser } = this.props;

        return d.div(
            {id: "canyon-show", className: "canyon"},

            d.div(
                {
                    className: "cover",
                    style: { backgroundImage: `url(${this.images().first().get("secure_url")})` }
                }
            ),

            d.div(
                {className: "details"},

                d.h1({className: "name"}, this.canyon().get("name")),

                User.can(currentUser, "create-trip-report") ? 
                    d.div(
                        {className: "actions"},
                        link({
                            to: links.canyons.tripReports(this.canyon()).new(),
                            className: "button secondary left"
                        }, d.i({className: "fa fa-book"}), " Add trip report"),
                        link({
                            to: links.canyons.edit(this.canyon()),
                            className: "button tertiary right"
                        }, d.i({className: "fa fa-pencil"}), " Edit")
                    ) :
                    null,

                d.div(
                    { className: "map" },
                    React.createElement(GoogleMap, {
                        onGoogleApiLoaded: this.mapLoaded.bind(this),
                        yesIWantToUseGoogleMapApiInternals: true,

                        defaultZoom: 10,
                        defaultCenter: { lat: -33.7865352, lng: 150.4087605 },

                        options: (maps) => {
                            return {
                                mapTypeId: maps.MapTypeId.TERRAIN
                            };
                        }
                    })
                ),

                d.ul(
                    {className: "badges"},
                    (this.canyon().get("badges") || []).map(badge => {
                        return d.li(
                            {key: badge},
                            d.span({className: "badge"},
                                d.div(
                                    {className: `badge-inner badge-${badge}`}
                                )
                            ),
                            d.span({className: "label"},
                                   labelFor[badge])
                        );
                    })
                ),

                d.h2({}, "Access"),
                d.div({className: "access formatted", dangerouslySetInnerHTML: {__html: this.canyon().getIn(["formatted", "access"])}}),

                d.h2({}, "Track Notes"),
                d.div({className: "notes formatted", dangerouslySetInnerHTML: {__html: this.canyon().getIn(["formatted", "notes"])}}),

                d.h2({}, "Activity"),
                d.div({className: "activity"}, this.tripReports().map((tripReport, i) => {
                    let local = new Date(tripReport.get("date"));
                    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
                    let date = local.toJSON().slice(0, 10);

                    let stars = [];
                    for (let i=0; i < tripReport.get("rating"); i++) {
                        stars.push(d.i({className: "rating-star fa fa-star", key: `star-${i}`}));
                    }

                    let comments;
                    if (tripReport.get("comments")) {
                        comments = d.div(
                            {className: "comments"},
                            "\u201c",
                            tripReport.get("comments"),
                            "\u201d"
                        );
                    }

                    return d.li(
                        {className: "trip-report", key: i},
                        d.span({className: "date"}, date),
                        " ",
                        link({
                            to: links.users.show(tripReport.get("slug"))
                        }, tripReport.get("name")),
                        " descended. ",
                        stars,
                        comments
                    );
                }))
            )
        );
    }
}

