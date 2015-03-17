var canyons = require("../../src/models/canyon"),
    expect = require("chai").expect;

describe("Canyons", function() {
    describe("#validate", function() {
        ["notes", "directions", "name"].forEach(function(requiredField) {
            describe(requiredField, function() {
                it("should not be valid if empty", function() {
                    var model = {};
                    model[requiredField] = "";
                    var result = canyons.validate(model);
                    expect(result[requiredField]).to.exist;
                });

                it("should not be valid if not present", function() {
                    var result = canyons.validate({});
                    expect(result[requiredField]).to.exist;
                });

                it("should be valid if present", function() {
                    var model = {};
                    model[requiredField] = "value";
                    var result = canyons.validate(model);
                    expect(result[requiredField]).not.to.exist;
                });
            });
        });
    });
});
