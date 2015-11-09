import React from "react";
import ReactDOM from "react-dom";
import geojson from "togeojson";
import { FileUploader } from "../forms";
import GoogleMap from 'google-map-react';

var d = React.DOM;

class GpxUploader extends FileUploader {
    static defaults = {
        center: { lat: -33.7865352, lng: 150.4087605 },
        zoom: 10
    }

    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    setFile(file) {
        let reader = new FileReader();

        reader.onload = (e) => {
            let gpx = e.target.result;
            let dom = (new DOMParser()).parseFromString(gpx, 'text/xml');
            let track = geojson.gpx(dom);

            this.state.map.data.forEach((feature) => {
                this.state.map.data.remove(feature);
            });

            this.state.map.data.addGeoJson(track);
        };

        reader.readAsText(file);
    }

    mapLoaded({map, maps}) {
        this.setState({map: map});

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
            let bounds = extendTo(feature.getGeometry(), new maps.LatLngBounds());
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
                onClick: this.browse.bind(this),
                type: "button",
                className: `gpx ${this.stateClasses()}`
            },

            d.input({type: "file", onChange: this.select.bind(this)}),

            React.createElement(GoogleMap, {
                onGoogleApiLoaded: this.mapLoaded.bind(this),
                yesIWantToUseGoogleMapApiInternals: true,

                defaultZoom: GpxUploader.defaults.zoom,
                defaultCenter: GpxUploader.defaults.center,

                options: (maps) => {
                    return {
                        mapTypeId: maps.MapTypeId.TERRAIN
                    };
                }
            })
        );
    }
}

export default () => {
    return React.createElement(GpxUploader, {});
}
