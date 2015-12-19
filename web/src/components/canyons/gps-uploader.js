import * as gps from "../../utils/gps";
import GoogleMap from "google-map-react";
import React from "react";
import geojson from "togeojson";
import spinner from "../spinner";
import { FileUploader } from "../forms";

var d = React.DOM;

class GpsUploader extends FileUploader {
    static defaults = {
        center: { lat: -33.7865352, lng: 150.4087605 },
        zoom: 10
    }

    constructor(props, context) {
        super(props, context);
    }

    setFile(file) {
        this.setState({
            loading: true,
            finished: false
        });

        let reader = new FileReader();

        reader.onload = (e) => {
            let xml = e.target.result;
            let dom = (new DOMParser()).parseFromString(xml, "text/xml");
            let track;

            if (dom.childNodes[0] &&
                dom.childNodes[0].tagName === "gpx") {
                track = geojson.gpx(dom);
            } else if (dom.childNodes[0] &&
                       dom.childNodes[0].tagName === "kml") {
                track = geojson.kml(dom);
            }

            // TODO: handle errors in XML parsing, or when not gpx or kml

            track = gps.compress(track);

            this.setState({ track: track });

            if (this.props.onChange) {
                this.props.onChange({
                    target: {
                        value: track
                    }
                });
            }

            this.state.map.data.forEach((feature) => {
                this.state.map.data.remove(feature);
            });

            this.state.map.data.addGeoJson(track);

            this.setState({
                loading: false,
                finished: true
            });
        };

        reader.readAsText(file);
    }

    mapLoaded({map, maps}) {
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
    }

    render() {
        return d.div(
            {
                onDragOver: this.dragging.bind(this),
                onDragStart: this.dragging.bind(this),
                onDragEnter: this.dragging.bind(this),
                onDragLeave: this.notDragging.bind(this),
                onDrop: this.drop.bind(this),
                onClick: this.state.finished ? null : this.browse.bind(this),
                type: "button",
                className: `gps ${this.stateClasses()}`
            },

            d.input({type: "file", onChange: this.select.bind(this)}),

            d.div(
                {
                    className: "map",
                    style: { height: "100%", width: "100%" }
                },
                React.createElement(GoogleMap, {
                    onGoogleApiLoaded: this.mapLoaded.bind(this),
                    yesIWantToUseGoogleMapApiInternals: true,

                    defaultZoom: GpsUploader.defaults.zoom,
                    defaultCenter: GpsUploader.defaults.center,

                    options: (maps) => {
                        return {
                            mapTypeId: maps.MapTypeId.TERRAIN
                        };
                    }
                }),
            ),

            d.h2(
                {className: "title"},
                d.div(
                    {className: "heading"},
                    d.i({className: "fa fa-map"}),
                    "Add GPS track"
                ),
                spinner({
                    style: {
                        display: this.state.loading ? "inline-block" : "none"
                    }
                }),
            ),

            d.a(
                {
                    href: "javascript:null",
                    onClick: this.state.finished ? this.browse.bind(this) : null,
                    className: "button change-gps"
                },
                "Change GPS track"
            )
        );
    }
}

export default (props) => {
    return React.createElement(GpsUploader, {...props});
};
