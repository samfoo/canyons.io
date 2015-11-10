import * as CanyonActions from "../../actions/canyon";
import GoogleMap from "google-map-react";
import React from "react";
import { connect } from "react-redux";
import { fetch, resourceRequired } from "../../decorators";
import { Link } from "react-router";

var d = React.DOM;

const link = (props, ...children) => {
    return React.createElement(
        Link, props, ...children
    );
};

@resourceRequired((store, r) => store.loaded(`canyons.ids.${r.params.id}`))
@fetch((store, r) => {
    let resources = [];

    if (!store.loaded(`canyons.images.ids.${r.params.id}`)) {
        // todo: resolve to default image when 404
        resources.push(store.dispatch(CanyonActions.getCanyonImages(r.params.id)));
    }

    if (!store.loaded(`canyons.ids.${r.params.id}`)) {
        resources.push(store.dispatch(CanyonActions.getCanyon(r.params.id)));
    }

    if (resources.length > 0 ) {
        return Promise.all(resources);
    }
})
@connect(state => ({canyons: state.canyons}))
export default class CanyonShow extends React.Component {
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

                d.div(
                    {className: "actions"},
                    link({
                        to: `/canyons/${this.canyon().get("id")}/trip-reports/new`,
                        className: "button secondary left"
                    }, d.i({className: "fa fa-book"}), " Add trip report"),
                    link({
                        to: `/canyons/${this.canyon().get("id")}/edit`,
                        className: "button tertiary right"
                    }, d.i({className: "fa fa-pencil"}), " Edit")
                ),

                d.h2({}, "Access"),

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

                d.div({className: "formatted", dangerouslySetInnerHTML: {__html: this.canyon().getIn(["formatted", "access"])}}),

                d.h2({}, "Track Notes"),
                d.div({className: "formatted", dangerouslySetInnerHTML: {__html: this.canyon().getIn(["formatted", "notes"])}}),
            )
        );
    }
}

