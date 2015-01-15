'use strict';

describe('connectIn.version module', function () {
    beforeEach(module('connectIn.version'));

    describe('version service', function () {
        it('should return current version', inject(function (version) {
            expect(version).toEqual('0.1');
        }));
    });
});
