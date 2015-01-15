'use strict';

angular.module('connectIn.version', [
    'connectIn.version.interpolate-filter',
    'connectIn.version.version-directive'
])

    .value('version', '0.1');
