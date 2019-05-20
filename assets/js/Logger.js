class Logger
{
    get config() {
        return this._config;
    }

    set config(value) {
        this._config = value;
    }

    constructor(config)
    {
        this._config = config;
    }

    logFilterPositions(
        logPositionCollisionIndex,
        randomStartingPosition,
        filterPositions,
        filterSize,
        filterShipIndex,
        filterPositionIndex,
        filterX,
        filterY,
        filterDeg
    ) {
        if(this.config.debug.log.filterOutPositionCollisions) {
            let logCollisionWrapper = document.createElement('div');
            logCollisionWrapper.id =
                'log-collision-wrapper-'
                + randomStartingPosition.size + '-'
                + randomStartingPosition.shipIndex + '-'
                + randomStartingPosition.coordinates[0].x + '-'
                + randomStartingPosition.coordinates[0].y + '-'
                + randomStartingPosition.coordinates[0].deg + '-'
                + 'with-'
                + filterSize + '-'
                + filterShipIndex + '-'
                + filterPositionIndex
            ;
            logCollisionWrapper.className =
                'log-collision-wrapper clearfix'
                + ' log-random-size-' + randomStartingPosition.size
                + ' log-random-index-' + randomStartingPosition.shipIndex
                + ' log-random-x-' + randomStartingPosition.coordinates[0].x
                + ' log-random-y-' + randomStartingPosition.coordinates[0].y
                + ' log-random-deg-' + randomStartingPosition.coordinates[0].deg
                + ' log-filter-size-' + filterSize
                + ' log-filter-index-' + filterShipIndex
                + ' log-filter-index-' + filterPositionIndex
                + ' log-filter-x-' + filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates[0].x
                + ' log-filter-y-' + filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates[0].y
                + ' log-filter-deg-' + filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates[0].deg
            ;

            let logPositionCollisionIndexWrapper = document.createElement('div');
            logPositionCollisionIndexWrapper.className = 'log-position-collision-index-wrapper';
            logPositionCollisionIndexWrapper.innerHTML = String(logPositionCollisionIndex).padStart(4, '0');
            logCollisionWrapper.appendChild(logPositionCollisionIndexWrapper);

            let logRandomPositionWrapper = document.createElement('div');
            logRandomPositionWrapper.id =
                'log-random-position-'
                + randomStartingPosition.size + '-'
                + randomStartingPosition.shipIndex + '-'
                + randomStartingPosition.coordinates[0].x + '-'
                + randomStartingPosition.coordinates[0].y + '-'
                + randomStartingPosition.coordinates[0].deg + '-'
                + 'with-'
                + filterSize + '-'
                + filterShipIndex + '-'
                + filterPositionIndex
            ;
            logRandomPositionWrapper.className =
                'log-random-position'
                + ' log-size-' + randomStartingPosition.size
                + ' log-index-' + randomStartingPosition.index
                + ' log-x-' + randomStartingPosition.coordinates[0].x
                + ' log-y-' + randomStartingPosition.coordinates[0].y
                + ' log-deg-' + randomStartingPosition.coordinates[0].deg
            ;
            logRandomPositionWrapper.addEventListener(
                'mouseenter',
                togglePositionHighlight.bind(
                    logRandomPositionWrapper,
                    randomStartingPosition.coordinates,
                    'rp-highlit'
                )
            );
            logRandomPositionWrapper.addEventListener(
                'mouseleave',
                togglePositionHighlight.bind(
                    logRandomPositionWrapper,
                    randomStartingPosition.coordinates,
                    'rp-highlit'
                )
            );
            let logRandomPositionWrapperHtml = '';
            logRandomPositionWrapperHtml += 'Randpos:|';
            logRandomPositionWrapperHtml += 'Size:<span class="log-size">' + randomStartingPosition.size + '</span>,Index:<span class="log-index">' + randomStartingPosition.shipIndex + '</span>|';
            logRandomPositionWrapperHtml += 'x:<span class="log-x">' + String(randomStartingPosition.coordinates[0].x).padStart(2, '0') + '</span>,';
            logRandomPositionWrapperHtml += 'y:<span class="log-y">' + String(randomStartingPosition.coordinates[0].y).padStart(2, '0') + '</span>|';
            logRandomPositionWrapperHtml += 'deg:<span class="log-deg">' + String(randomStartingPosition.deg).padStart(3, '0') + '</span>|';
            logRandomPositionWrapperHtml += randomStartingPosition.coordinates.map((element, index) => {
                let logCoordinate = 
                    '<span class="log-axis-value">x</span><span class="log-axis-value-index">'
                    + index
                    + '</span>:<span class="log-axis-value-amount">'
                    + String(element.x).padStart(2, '0')
                    + '</span>,<span class="log-axis-value">y</span><span class="log-axis-value-index">'
                    + index + '</span>:<span class="log-axis-value-amount">'
                    + String(element.y).padStart(2, '0')
                    + '</span>';
                if(filterX === element.x && filterY === element.y) {
                    logCoordinate = '<div class="log-coordinate random-position display-inline-block color-red">' + logCoordinate + '</div>';
                } else {
                    logCoordinate = '<div class="log-coordinate random-position display-inline-block">' + logCoordinate + '</div>';
                }
                return logCoordinate;
            }).join('') + ' | ';
            logRandomPositionWrapper.innerHTML = logRandomPositionWrapperHtml;
            logCollisionWrapper.appendChild(logRandomPositionWrapper);

            let logFilterPositionWrapper = document.createElement('div');
            logFilterPositionWrapper.id =
                'log-filter-position-'
                + randomStartingPosition.size + '-'
                + randomStartingPosition.shipIndex + '-'
                + randomStartingPosition.coordinates[0].x + '-'
                + randomStartingPosition.coordinates[0].y + '-'
                + randomStartingPosition.coordinates[0].deg + '-'
                + 'with-'
                + filterSize + '-'
                + filterShipIndex + '-'
                + filterPositionIndex
            ;
            logFilterPositionWrapper.className =
                'log-filter-position'
                + ' log-size-' + filterSize
                + ' log-index-' + filterShipIndex
                + ' log-position-index-' + filterPositionIndex
                + ' log-x-' + filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates[0].x
                + ' log-y-' + filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates[0].y
                + ' log-deg-' + filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates[0].deg
            ;
            logFilterPositionWrapper.addEventListener(
                'mouseenter',
                togglePositionHighlight.bind(
                    logFilterPositionWrapper,
                    filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates,
                    'fp-highlit'
                )
            );
            logFilterPositionWrapper.addEventListener(
                'mouseleave',
                togglePositionHighlight.bind(
                    logFilterPositionWrapper,
                    filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates,
                    'fp-highlit'
                )
            );
            let logFilterPositionWrapperHtml = '';
            logFilterPositionWrapperHtml += 'Collides with:|';
            logFilterPositionWrapperHtml += 'Size:<span class="log-size">' + filterSize + '</span>,Index:<span class="log-index">' + filterShipIndex + '</span>|';
            logFilterPositionWrapperHtml += 'x:<span class="log-x">' + String(filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates[0].x).padStart(2, '0') + '</span>,';
            logFilterPositionWrapperHtml += 'y:<span class="log-y">' + String(filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates[0].y).padStart(2, '0') + '</span>|';
            logFilterPositionWrapperHtml += 'deg:<span class="log-deg">' + String(filterDeg).padStart(3, '0') + '</span>|';
            logFilterPositionWrapperHtml += 'Posindex:<span class="log-position-index">' + String(filterPositionIndex).padStart(4, '0') + '</span>|';
            logFilterPositionWrapperHtml += filterPositions[filterSize][filterShipIndex][filterPositionIndex].coordinates.map((element, index) => {
                let logCoordinate = 
                    '<span class="log-axis-value">x</span><span class="log-axis-value-index">'
                    + index + '</span>:<span class="log-axis-value-amount">'
                    + String(element.x).padStart(2, '0')
                    + '</span>,<span class="log-axis-value">y</span><span class="log-axis-value-index">'
                    + index
                    + '</span>:<span class="log-axis-value-amount">'
                    + String(element.y).padStart(2, '0') + '</span>'
                ;
                if(filterX === element.x && filterY === element.y) {
                    logCoordinate = '<div class="log-coordinate filter-position display-inline-block color-red">' + logCoordinate + '</div>';
                } else {
                    logCoordinate = '<div class="log-coordinate filter-position display-inline-block">' + logCoordinate + '</div>';
                }
                return logCoordinate;
            }).join('') + '<br>';
            logFilterPositionWrapper.innerHTML = logFilterPositionWrapperHtml;
            logCollisionWrapper.appendChild(logFilterPositionWrapper);

            document.getElementById('logs').appendChild(logCollisionWrapper);
        } // DEBUG
    }

    logRandomPositions(randomStartingPosition)
    {
        if(this.config.debug.log.getRandomPositions) {
            let logCurrentPosition = document.createElement('div');
            let logCurrentPositionHtml = '';
            logCurrentPositionHtml += '--------------<br>';
            logCurrentPositionHtml += 'Current position:<br>';
            logCurrentPositionHtml += 'Ship Size: ' + randomStartingPosition.size + ', Ship: ' + randomStartingPosition.shipIndex + '<br>';
            logCurrentPositionHtml += 'Angle: ' + randomStartingPosition.deg + '<br>';
            logCurrentPositionHtml += 'Coordinates: <br>';
            logCurrentPositionHtml += randomStartingPosition.coordinates.map(function (element, index) {
                return '    x' + index + ': ' + element.x + ', y' + index + ': ' + element.y
            }).join('<br>') + '<br>';
            logCurrentPosition.innerHTML = logCurrentPositionHtml;
            document.getElementById('logs').appendChild(logCurrentPosition);
        } // DEBUG
    }

    logFilterOutPositionCollisionsStart(
        sizes,
        filterPositions,
        countFilterPositionsElementsCallback,
        countFilterPositionsElementsBySizeAndIndexCallback
    ) {
        if(this.config.debug.console.filterOutPositionCollisions) {
            console.log('Starting with ' + countFilterPositionsElementsCallback(filterPositions) + ' ship positions...');
            sizes.map(
                (shipIndexes, size) => {
                    return shipIndexes.map(
                        (shipIndex, index) => {
                            console.log(' - Filter ship positions | Ship size:' + size + ', Ship index:' + shipIndex + ' | ' + countFilterPositionsElementsBySizeAndIndexCallback(sizes, filterPositions)[size][shipIndex]);
                        }
                    );
                }
            );
            console.log('==================================================');
            console.log('');
        } // DEBUG
    }

    logFilterOutPositionCollisions(
        sizes,
        randomStartingPosition,
        filterSize,
        filterShipIndex,
        filterPositions,
        countFilterPositionsElementsCallback,
        countFilterPositionsElementsBySizeAndIndexCallback,
        filteredPositions,
    ) {
        if (this.config.debug.console.filterOutPositionCollisions) {
            console.log('After rssp.size:' + randomStartingPosition.size + ', rssp.shipIndex:' + randomStartingPosition.shipIndex + ' | filterSize:' + filterSize + ', filterShipIndex:' + filterShipIndex);
            console.log('Total filtered positions: ' + countFilterPositionsElementsCallback(filterPositions));
            sizes.map(
                (shipIndexes, size) => {
                    return shipIndexes.map(
                        (shipIndex, index) => {
                            console.log(' - Filter ship positions | Ship size:' + size + ', Ship index:' + shipIndex + ' | ' + countFilterPositionsElementsBySizeAndIndexCallback(sizes, filterPositions)[size][shipIndex]);
                        }
                    );
                }
            );
            console.log('Total deleted: ' + filteredPositions);
            console.log('------------------------');
        } // DEBUG
    }

    logGetRandomPositionstart(size, shipIndex)
    {
        if(this.config.debug.log.place) {
            let logSizeIndex = document.createElement('div');
            let logSizeIndexHtml = '';
            logSizeIndexHtml += '==============<br>';
            logSizeIndexHtml += 'Ship Size: ' + size + '<br>';
            logSizeIndexHtml += 'Ship Index: ' + shipIndex + '<br>';
            logSizeIndex.innerHTML = logSizeIndexHtml;
            document.getElementById('logs').appendChild(logSizeIndex);
        } // DEBUG
    }

    logPlaceBefore(sizes, randomStartingPosition)
    {
        if(this.config.debug.log.place) {
            let logSizes = document.createElement('div');
            let logSizesHtml = '';
            logSizesHtml += 'Ships Were:<br>';
            for(let i = 0; i < sizes.length; i++) {
                if(sizes[i] && sizes[i].length) {
                    logSizesHtml += 'Size: ' + i + '<br>';
                    logSizesHtml += 'Indices: ';
                    for(let j = 0; j < sizes[i].length; j++) {
                        if(typeof sizes[i][j] === 'number') {
                            logSizesHtml += j + ' ';
                        }
                    }
                    logSizesHtml += '<br>';
                }
            }
            logSizesHtml += 'Splicing Array Hashes | Ship Size: ' + randomStartingPosition.size + ', Ship Index: ' + randomStartingPosition.shipIndex + '<br>';
            logSizes.innerHTML = logSizesHtml;
            document.getElementById('logs').appendChild(logSizes);
        } // DEBUG
    }

    logPlaceFilterSize(randomStartingPosition)
    {
        if(this.config.debug.log.place) {
            let logSizeArrayShift = document.createElement('div');
            let logSizeArrayShiftHtml = '';
            logSizeArrayShiftHtml += 'Splicing Array Hash | Ship Size: ' + randomStartingPosition.size + '<br>';
            logSizeArrayShift.innerHTML = logSizeArrayShiftHtml;
            document.getElementById('logs').appendChild(logSizeArrayShift);
        } // DEBUG
    }

    logPlaceAfter(sizes)
    {
        if(this.config.debug.log.place) {
            let logSizes = document.createElement('div');
            let logSizesHtml = '';
            logSizesHtml += 'Ships Are:<br>';
            for(let i = 0; i < sizes.length; i++) {
                if(sizes[i] && sizes[i].length) {
                    logSizesHtml += 'Size: ' + i + '<br>';
                    logSizesHtml += 'Indices: ';
                    for(let j = 0; j < sizes[i].length; j++) {
                        if(typeof sizes[i][j] === 'number') {
                            logSizesHtml += j + ' ';
                        }
                    }
                    logSizesHtml += '<br>';
                }
            }
            logSizes.innerHTML = logSizesHtml;
            document.getElementById('logs').appendChild(logSizes);
        } // DEBUG
    }

    logMessage(text)
    {
        const now = new Date();
        let logMessage = document.createElement('div');
        let logMessageHtml = '';
        logMessageHtml += '-------------- ' + now + ' --------------<br>';
        logMessageHtml += text + '<br>';
        logMessage.innerHTML = logMessageHtml;
        document.getElementById('logs').appendChild(logMessage);
    }

    logError(text)
    {
        this.logMessage('<div class="log-error">Error: ' + text + '</div>');
    }
}
