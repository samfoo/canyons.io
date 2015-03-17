var forms = require("../../client/forms"),
    React = require("react/addons"),
    jsdom = require("jsdom"),
    expect = require("chai").expect;

var TestUtils = React.addons.TestUtils;

global.document = jsdom.jsdom('<html><body></body></html>', {});
global.window = document.defaultView;

describe("A textarea that resizes to its content", function() {
    it("should have a label with the text of the 'label' prop", function() {
        var text = TestUtils.renderIntoDocument(
            forms.textarea("a-label", "field", {})
        );

        var node = React.findDOMNode(text),
            label = node.getElementsByTagName("label")[0];

        expect(label.innerHTML).to.equal("a-label");
    });

    describe("when the value of the textarea changes", function() {
        describe("when the value is empty", function() {
            describe("when there is a placeholder", function() {
                it("should resize its height to fit its placeholder", function() {
                    var text = TestUtils.renderIntoDocument(
                        forms.textarea("a-label", "field", {
                            placeholder: "placeholder-text"
                        })
                    );

                    var node = React.findDOMNode(text),
                        shadow = node.getElementsByClassName("shadow")[0],
                        textarea = node.getElementsByClassName("real")[0];

                    shadow.scrollHeight = 20;
                    TestUtils.Simulate.change(textarea, {});

                    expect(shadow.value).to.equal("placeholder-text");
                    expect(textarea.style.height).to.equal("20px");
                });
            });
        });

        it("should resize its height to fit its contents", function() {
            var text = TestUtils.renderIntoDocument(
                forms.textarea("a-label", "field", {})
            );

            var node = React.findDOMNode(text),
                shadow = node.getElementsByClassName("shadow")[0],
                textarea = node.getElementsByClassName("real")[0];

            textarea.value = "Old text";

            shadow.scrollHeight = 20;
            TestUtils.Simulate.change(textarea, {});

            expect(textarea.style.height).to.equal("20px");
        });
    });
});

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
