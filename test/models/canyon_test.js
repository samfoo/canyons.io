var canyons = require("../../models/canyon"),
    expect = require("chai").expect;

describe("Canyons", function() {
    describe("#validate", function() {
        describe("tracknotes", function() {
            it("should not be valid if not present", function() {
                var result = canyons.validate({});
                expect(result.tracknotes).to.exist;
            });

            it("should be valid if present", function() {
                var result = canyons.validate({
                    tracknotes: "Second left of Mt. Hay Rd..."
                });
                expect(result.tracknotes).not.to.exist;
            });
        });

        describe("directions", function() {
            it("should not be valid if not present", function() {
                var result = canyons.validate({});
                expect(result.directions).to.exist;
            });

            it("should be valid if present", function() {
                var result = canyons.validate({
                    directions: "Second left of Mt. Hay Rd..."
                });
                expect(result.directions).not.to.exist;
            });
        });

        describe("name", function() {
            it("should not be valid if not present", function() {
                var result = canyons.validate({});
                expect(result.name).to.exist;
            });

            it("should be valid if present", function() {
                var result = canyons.validate({
                    name: "Starlight"
                });
                expect(result.name).not.to.exist;
            });
        });
    });
});
