import React from "react";

var d = React.DOM;

export class Beard extends React.Component {
    render() {
        return d.div(
            {id: "beard"},

            d.div(
                {id: "beard-lists"},
                d.ul(
                    {id: "legal"},
                    d.h3({}, "Legal"),
                    d.li({}, "Privacy policy"),
                    d.li({}, "Terms of service")
                ),

                d.ul(
                    {id: "about"},
                    d.h3({}, "About"),
                    d.li({}, "Contact"),
                    d.li({}, "Source Code")
                )
            ),

            d.h3(
                {id: "made-with-love"},
                "Made with ",
                d.i({className: "love fa fa-heart"}),
                " in Sydney, Australia"
            )
        );
    }
}
