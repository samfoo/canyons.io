/* eslint-env node, jest */

module.exports = {};
module.exports.config = jest.genMockFn();
module.exports.uploader = {
    upload: jest.genMockFn()
};
