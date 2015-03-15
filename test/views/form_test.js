var forms = require("../../client/forms"),
    React = require("react/addons"),
    jsdom = require("jsdom"),
    expect = require("chai").expect;

var TestUtils = React.addons.TestUtils;

global.document = jsdom.jsdom('<html><body></body></html>', {});
global.window = document.defaultView;

describe("A text input component", function() {
    it("should have a label with the text of the 'label' prop", function() {
        var text = TestUtils.renderIntoDocument(
            forms.text("a-label", "field", {})
        );

        var node = React.findDOMNode(text),
            label = node.getElementsByTagName("label")[0];

        expect(label.innerHTML).to.equal("a-label");
    });

    describe("when the field in the 'model' prop is invalid", function() {
        it("should display the error message for that field", function() {
            var text = TestUtils.renderIntoDocument(
                forms.text("a-label", "field", {
                    model: {
                        errors: {
                            field: ["is not valid"]
                        }
                    }
                })
            );

            var node = React.findDOMNode(text),
                input = node.getElementsByTagName("input")[0],
                errorMsg = node.getElementsByClassName("error-message")[0];

            expect(input.className).to.equal("error");
            expect(errorMsg.style.display).to.equal("block");
        });
    });

    describe("when the field in the 'model' prop is valid", function() {
        it("should not display the error message for that field", function() {
            var text = TestUtils.renderIntoDocument(
                forms.text("a-label", "field", {
                    model: { errors: {} }
                })
            );

            var node = React.findDOMNode(text),
                input = node.getElementsByTagName("input")[0],
                errorMsg = node.getElementsByClassName("error-message")[0];

            expect(input.className).not.to.equal("error");
            expect(errorMsg.style.display).to.equal("none");
        });
    });
});
