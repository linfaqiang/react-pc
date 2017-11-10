'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import {
    Router,
    Route,
    Link,
    IndexRoute,
    hashHistory
} from 'react-router';
import routes from './src/route';

ReactDOM.render(
    routes,
    document.getElementById('app')
);