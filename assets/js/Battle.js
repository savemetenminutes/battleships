class Battle {
    get config() {
        return this._config;
    }

    set config(value) {
        this._config = value;
        return this;
    }

    get logger() {
        return this._logger;
    }

    get inProgress() {
        return this._inProgress;
    }

    set inProgress(value) {
        this._inProgress = value;
    }

    set logger(value) {
        this._logger = value;
        return this;
    }

    get sizes() {
        return this._sizes;
    }

    set sizes(value) {
        this._sizes = value;
    }

    get positions() {
        return this._positions;
    }

    set positions(value) {
        this._positions = value;
    }

    get filterPositions() {
        return this._filterPositions;
    }

    set filterPositions(value) {
        this._filterPositions = value;
    }

    get deletedPositions() {
        return this._deletedPositions;
    }

    set deletedPositions(value) {
        this._deletedPositions = value;
    }

    get finalPositions() {
        return this._finalPositions;
    }

    set finalPositions(value) {
        this._finalPositions = value;
    }

    constructor(config) {
        this.config = config;
        this.logger = new Logger(config);
        this._inProgress = false;
    }

    /**
     *  Places a number of ships on the battlefield at random
     *
     *  @returns (void)
     */
    place() {
        this.filterPositions = this.calculatePositions(this.config);
        this.positions = this.calculatePositions(this.config);
        this.filteredPositions = 0;
        this.logPositionCollisionIndex = 0;
        this.deletedPositions = [];

        this.finalPositions = [];
        let shipsLeft = 0;
        this.sizes = this.config.ships.map(
            function (element) {
                return Array(element).fill(null).map((u, i) => i);
            }
        );

        //let sizes = this.sizes.slice(0); // we need a deep copy by value here because we will be modifying the var and its array hashes so .slice() will not work
        let sizes = this.config.ships.map(
            function (element) {
                return Array(element).fill(null).map((u, i) => i);
            }
        );

        this.logger.logFilterOutPositionCollisionsStart(
            this.sizes,
            this.filterPositions,
            this.countFilterPositionsElements,
            this.countFilterPositionsElementsBySizeAndIndex
        ); // DEBUG

        do {
            let randomStartingPosition = this.getRandomPosition(this.config, sizes, this.filterPositions);
            this.finalPositions.push(randomStartingPosition);
            //let randomStartingPosition = presetPositions.shift();
            randomStartingPosition.coordinates.forEach(
                function (element) {
                    let dx = element['x'];
                    let dy = element['y'];
                    document.getElementById('cell-' + dx + '-' + dy).className = document.getElementById('cell-' + dx + '-' + dy).className.replace(new RegExp('\\s*ship' + this.size + this.index), '') + ' ship' + this.size + this.index;
                }.bind(randomStartingPosition)
            );

            this.logger.logRandomPositions(randomStartingPosition); // DEBUG

            for (let filterSize = 0; filterSize < this.filterPositions.length; filterSize++) {
                if (typeof this.filterPositions[filterSize] !== 'object' || !this.filterPositions[filterSize].length) {
                    continue;
                }

                for (let filterIndex = 0; filterIndex < this.filterPositions[filterSize].length; filterIndex++) {
                    if (typeof this.filterPositions[filterSize][filterIndex] !== 'object' || !this.filterPositions[filterSize][filterIndex].length) {
                        continue;
                    }

                    for (let filterPositionIndex = 0; filterPositionIndex < this.filterPositions[filterSize][filterIndex].length; filterPositionIndex++) {

                        if (!this.filterPositions[filterSize][filterIndex][filterPositionIndex]) {
                            continue;
                        }
                        if (
                            filterSize === randomStartingPosition.size
                            && filterIndex === randomStartingPosition.index
                            && this.filterPositions[filterSize][filterIndex][filterPositionIndex].coordinates[0].x === randomStartingPosition.coordinates[0].x
                            && this.filterPositions[filterSize][filterIndex][filterPositionIndex].coordinates[0].y === randomStartingPosition.coordinates[0].y
                            && this.filterPositions[filterSize][filterIndex][filterPositionIndex].deg === randomStartingPosition.deg
                        ) {
                            continue;
                        }

                        let collision = false;
                        let filterDeg = this.filterPositions[filterSize][filterIndex][filterPositionIndex].deg;
                        for (let filterCoordinateIndex = 0; filterCoordinateIndex < this.filterPositions[filterSize][filterIndex][filterPositionIndex].coordinates.length; filterCoordinateIndex++) {
                            const randomStartingPositionCoordinates = randomStartingPosition.coordinates.values();
                            let filterX = this.filterPositions[filterSize][filterIndex][filterPositionIndex].coordinates[filterCoordinateIndex].x;
                            let filterY = this.filterPositions[filterSize][filterIndex][filterPositionIndex].coordinates[filterCoordinateIndex].y;
                            for (const rsspCoordinate of randomStartingPositionCoordinates) {
                                if (
                                    rsspCoordinate.x === filterX
                                    && rsspCoordinate.y === filterY
                                ) {
                                    collision = true;
                                    break;
                                }
                            }

                            if (collision) {

                                this.logPositionCollisionIndex++;
                                this.logger.logFilterPositions(this.logPositionCollisionIndex, randomStartingPosition, this.filterPositions, filterSize, filterIndex, filterPositionIndex, filterX, filterY, filterDeg); // DEBUG

                                // here we delete the colliding position from the positionsIndex and filterPositions collections
                                //this.filterPositions[filterSize][filterIndex].splice(filterPositionIndex, 1);
                                this.filteredPositions++;
                                this.deletedPositions[filterSize] = this.deletedPositions[filterSize] || [];
                                this.deletedPositions[filterSize][filterIndex] = this.deletedPositions[filterSize][filterIndex] || [];
                                this.deletedPositions[filterSize][filterIndex][filterPositionIndex] = this.filterPositions[filterSize][filterIndex][filterPositionIndex];
                                delete this.filterPositions[filterSize][filterIndex][filterPositionIndex];
                                break;
                            }
                        }
                    }

                    this.logger.logFilterOutPositionCollisions(
                        this.sizes,
                        randomStartingPosition,
                        filterSize,
                        filterIndex,
                        this.filterPositions,
                        this.countFilterPositionsElements,
                        this.countFilterPositionsElementsBySizeAndIndex,
                        this.filteredPositions,
                    ); // DEBUG
                }
            }

            this.logger.logPlaceBefore(sizes, randomStartingPosition); // DEBUG

            // Here we shift out the processed ship size/index so we can move to the next one
            sizes[randomStartingPosition.size].splice(sizes[randomStartingPosition.size].indexOf(randomStartingPosition.index), 1);
            if (!sizes[randomStartingPosition.size].length) {
                delete sizes[randomStartingPosition.size];

                this.logger.logPlaceFilterSize(randomStartingPosition); // DEBUG
            }

            this.logger.logPlaceAfter(sizes); // DEBUG

            shipsLeft = sizes.reduce(
                function (carry, element) {
                    return carry + element.length;
                },
                0
            );
        } while (shipsLeft > 0);
    }

    /**
     * Calculates and returns an array of all possible ship positions for all ships
     *
     * @param config
     * @returns {Array}
     */
    calculatePositions(config) {
        let positions = [];
        for (let size = 0; size < config.ships.length; size++) {
            positions[size] = [];
            for (let index = 0; index < config.ships[size]; index++) {
                positions[size][index] = [];
                for (let x = 1; x <= config.x; x++) {
                    for (let y = 1; y <= config.y; y++) {
                        const rotationAngles = config.positioning.rotationAngles.values();
                        for (const deg of rotationAngles) {
                            let inBounds = 1;
                            let coordinates = [];
                            // This next constant improves the accuracy of a pivoted line on a cell/pixel grid: The closer it gets to 45 degree rotation the longer the hypotenuse is (len * lenStep)
                            const perspective = (size + ((Math.sqrt(2) * size - size) * (45 - Math.abs(deg % 90 - 45))) / 45) / size;
                            const perspectiveLenX = size * perspective * Math.cos(deg * Math.PI / 180);
                            const perspectiveLenY = size * perspective * Math.sin(deg * Math.PI / 180);
                            for (let len = 0; len < size; len++) {
                                const ddx = len * perspective * Math.cos(deg * Math.PI / 180);
                                const ddy = len * perspective * Math.sin(deg * Math.PI / 180);
                                let dx = x + Math.round(ddx);
                                let dy = y + Math.round(ddy);
                                if (dx > 0 && dx <= config.x && dy > 0 && dy <= config.y) {
                                    coordinates.push(
                                        {
                                            x: dx,
                                            y: dy,
                                            len: len,
                                            deg: deg,
                                            ddx: ddx,
                                            ddy: ddy,
                                        }
                                    );
                                } else {
                                    inBounds = 0;
                                    break;
                                }
                            }
                            // We use the equation of the lines to calculate whether two ships overlap
                            const slope = (coordinates[0].y - coordinates[coordinates.length-1].y) / (coordinates[0].x - coordinates[coordinates.length-1].x);
                            const intercept = coordinates[0].y - slope * coordinates[0].x;
                            if (inBounds) {
                                positions[size][index].push(new Position(size, index, x, y, deg, coordinates, perspective, perspectiveLenX, perspectiveLenY, slope, intercept));
                            }
                        }
                    }
                }
            }
        }

        return positions;
    }

    /**
     * Picks a random ship position
     *
     * @param config
     * @param sizes
     * @param filterPositions
     * @returns {Position}
     * @throws Error
     */
    getRandomPosition(config, sizes, filterPositions) {
        let sizeKeys = Object.keys(sizes);
        let sizeKey = Math.round(Math.random() * (sizeKeys.length - 1));
        let size = parseInt(sizeKeys[sizeKey]);

        let indexKeys = Object.keys(sizes[size]);
        let indexKey = Math.round(Math.random() * (indexKeys.length - 1));
        let index = sizes[size][parseInt(indexKeys[indexKey])];

        this.logger.logGetRandomPositionstart(size, index); // DEBUG

        let positionIndexes;
        let positionIndex;
        let position;

        positionIndexes = Object.keys(filterPositions[size][index]);
        positionIndex = Math.round(Math.random() * (positionIndexes.length - 1));
        position = positionIndexes[positionIndex];

        return filterPositions[size][index][position];
    }

    /**
     * Creates the battlefield grid and initializes the game
     *
     * @returns (void)
     */
    createBattlefield() {
        const main = document.createElement('div');
        main.className = 'main clearfix';

        const container = document.createElement('div');
        container.id = 'container';
        container.className = 'container';

        const wrapper = document.createElement('div');
        wrapper.id = 'wrapper';
        wrapper.className = 'wrapper';
        for (let y = 0; y <= this.config.y; y++) {
            const elm = document.createElement('div');
            elm.className = 'row';
            wrapper.appendChild(elm);
            for (let x = 0; x <= this.config.x; x++) {
                const child = document.createElement('a');
                child.className = 'cell';
                if (y !== 0 && x !== 0) {
                    child.id += 'cell-' + x + '-' + y;
                    child.className += ' cell-field cell-' + x + '-' + y;
                    child.href = 'javascript:void(0)';
                } else {
                    child.className += ' cell-coordinate';
                    if (y === 0 && x > 0) {
                        child.innerHTML = x;
                    } else {
                        if (x === 0 && y > 0) {
                            child.innerHTML = String.fromCharCode(64 + y);
                        }
                    }
                }
                elm.appendChild(child);
            }
        }

        const wrapperGrid = document.createElement('div');
        wrapperGrid.id = 'wrapper-grid';
        for (let y = 0; y <= this.config.y; y++) {
            const elm = document.createElement('div');
            elm.className = 'row';
            wrapperGrid.appendChild(elm);
            for (let x = 0; x <= this.config.x; x++) {
                const child = document.createElement('a');
                child.className = 'coordinate';
                if (y !== 0 && x !== 0) {
                    child.id = 'coordinate-' + x + '-' + y;
                    child.className += ' coordinate-field coordinate-' + x + '-' + y;
                    child.href = 'javascript:void(0)';
                    child.addEventListener('click', this.shoot.bind(this));
                } else {
                    child.className += ' cell-coordinate';
                    if (y === 0 && x > 0) {
                        child.innerHTML = x;
                    } else {
                        if (x === 0 && y > 0) {
                            child.innerHTML = String.fromCharCode(64 + y);
                        }
                    }
                }
                elm.appendChild(child);
            }
        }
        wrapperGrid.className = 'wrapper-grid';

        container.appendChild(wrapperGrid);
        container.appendChild(wrapper);

        main.appendChild(container);

        const wrapperPusher = wrapper.cloneNode(true);
        wrapperPusher.id = '';
        Object.values(wrapperPusher.getElementsByTagName('a')).forEach((element) => {
            element.removeAttribute('id');
        });
        wrapperPusher.className = 'wrapper-pusher';
        main.appendChild(wrapperPusher);

        const logs = document.createElement('div');
        logs.id = 'logs';
        logs.className = 'logs';
        main.appendChild(logs);

        document.body.appendChild(main);

        this.place();
    }

    shoot(event) {
        if(!this.inProgress) {
            return;
        }

        const target = event.target;
        let x;
        let y;
        if(target.tagName.toLowerCase() === 'input') {
            const form = target.form;
            const formData = getFormData(form);
            if(formData['input-y'].match(/^.$/)) {
                x = parseInt(formData['input-x']);
                y = formData['input-y'].charCodeAt(0) - 64;
            } else {
                this.logger.logError('Invalid coordinate for Y.');
                return;
            }
        } else {
            if(target.tagName.toLowerCase() === 'a' && target.id.match(/coordinate-\d+-\d+/)) {
                x = parseInt(target.id.match(/coordinate-([\d]+)-\d+/)[1]);
                y = parseInt(target.id.match(/coordinate-[\d]+-(\d+)/)[1]);
            }
        }

        if(!document.getElementById('coordinate-' + x + '-' + y)) {
            this.logger.logError('Invalid coordinates.');
            return;
        }

        if(
            this.shotsTaken.some(
                function(coordinates) {
                    return coordinates.x === x && coordinates.y === y;
                }
            )
        ) {
            this.logger.logError(`You have already fired a shot @ coordinates ${x}x${y}.`);
            return;
        }

        this.shotsTaken.push({x: x, y: y});
        document.getElementById('coordinate-' + x + '-' + y).className = document.getElementById('coordinate-' + x + '-' + y).className.replace(new RegExp('\\s*shot-at'), '') + ' shot-at';;

        if(
            this.finalPositions.some(
                function (position) {
                    return position.coordinates.some(
                        function(coordinates) {
                            return coordinates.x === x && coordinates.y === y;
                        }
                    );
                }
            )
        ) {
            document.getElementById('coordinate-' + x + '-' + y).className = document.getElementById('coordinate-' + x + '-' + y).className.replace(new RegExp('\\s*shot-hit'), '') + ' shot-hit';
            this.logger.logMessage(
`<div class="font-size-1vw line-height-1vw">
Your shot @ coordinates ${x}x${y} was a hit! o7<br>
</div>`
            );
            this.targetsLeft = this.targetsLeft.reduce(
                (carry, position) => {
                    if(
                        !position.coordinates.every(
                            (coordinates) => {
                                return this.shotsTaken.some(
                                    function(shot) {
                                        return shot.x === coordinates.x && shot.y === coordinates.y;
                                    }
                                );
                            }
                        )
                    ) {
                        carry.push(position);
                        return carry;
                    } else {
                        this.logger.logMessage(
`<div class="font-size-1vw line-height-1vw">
You sank a ship! Pew pew!
</div>`
                        );
                        return carry;
                    }
                },
                []
            );
            if(!Object.values(this.targetsLeft).length) {
                this.logger.logMessage(
`<div class="font-size-1vw line-height-1vw">
Congratulations! You have destroyed all of the enemy ships in ${this.round} rounds.
</div>`
                );
                this.inProgress = false;
                return;
            }
        } else {
            document.getElementById('coordinate-' + x + '-' + y).className = document.getElementById('coordinate-' + x + '-' + y).className.replace(new RegExp('\\s*shot-miss'), '') + ' shot-miss';
            this.logger.logMessage(
`<div class="font-size-1vw line-height-1vw">
Your shot @ coordinates ${x}x${y} was a miss. :(
</div>`
            );
        }

        this.logger.logMessage(
`<div class="font-size-1vw line-height-1vw">
Round #${++this.round} begins.
</div>`
        );
    }

    cheat(event) {
        if (document.getElementById('wrapper').className.match(new RegExp('\\s*cheat'))) {
            document.getElementById('wrapper').className = document.getElementById('wrapper').className.replace(new RegExp('\\s*cheat'), '');
        } else {
            document.getElementById('wrapper').className = document.getElementById('wrapper').className.replace(new RegExp('\\s*cheat'), '') + ' cheat';
        }
    }

    start() {
        this.inProgress = true;
        this.finalPositions.forEach(
            (element) => {
                const sprite = document.createElement('div');
                sprite.id = 'sprite-' + element.size + '-' + element.index;
                sprite.className = 'sprite sprite-' + element.size + '-' + element.index + ' size-' + element.size;
                sprite.style.width = String((100 * element.size * element.perspective / (this.config.x + 1))) + '%';
                sprite.style.height = String(100 / (this.config.y + 1)) + '%';
                sprite.style.left = String(100 * (element.x) / (this.config.x)) + '%';
                sprite.style.top = String(100 * (element.y) / (this.config.y)) + '%';
                document.getElementById('wrapper').appendChild(sprite);
                sprite.style.transform = 'rotate(' + element.deg + 'deg)';
            }
        );
        this.targetsLeft = Object.values(this.finalPositions);
        this.round = 1;
        this.shotsTaken = [];

        const toolbar = document.getElementById('toolbar');
        toolbar.innerHTML = '';

        const inputForm = document.createElement('form');

        const labelX = document.createElement('label');
        labelX.for = 'input-x';
        labelX.innerHTML = 'X:';
        const inputX = document.createElement('input');
        inputX.type = 'text';
        inputX.id = 'input-x';
        inputX.name = 'input-x';
        inputX.className = 'form-input input-coordinate';
        inputX.autocomplete = 'off';

        const labelY = document.createElement('label');
        labelY.for = 'input-y';
        labelY.innerHTML = 'Y:';
        const inputY = document.createElement('input');
        inputY.type = 'text';
        inputY.id = 'input-y';
        inputY.name = 'input-y';
        inputY.className = 'form-input input-coordinate';
        inputY.autocomplete = 'off';

        const inputButton = document.createElement('input');
        inputButton.type = 'button';
        inputButton.autocomplete = 'off';
        inputButton.value = 'Shoot!';
        inputButton.addEventListener(
            'click',
            this.shoot.bind(this)
        );

        inputForm.appendChild(labelX);
        inputForm.appendChild(inputX);
        inputForm.appendChild(labelY);
        inputForm.appendChild(inputY);
        inputForm.appendChild(inputButton);
        toolbar.appendChild(inputForm);
        toolbar.appendChild(document.createElement('br'));

        const buttonCheat = document.createElement('input');
        buttonCheat.type = 'button';
        buttonCheat.autocomplete = 'off';
        buttonCheat.value = 'Cheat...';
        buttonCheat.addEventListener(
            'click',
            this.cheat.bind(this)
        );
        toolbar.appendChild(buttonCheat);
        toolbar.appendChild(document.createElement('br'));

        const buttonRestart = document.createElement('input');
        buttonRestart.type = 'button';
        buttonRestart.autocomplete = 'off';
        buttonRestart.value = 'Restart game';
        buttonRestart.addEventListener(
            'click',
            this.restart.bind(this)
        );
        //toolbar.appendChild(buttonRestart);

        let startFightWrapper = document.createElement('div');
        startFightWrapper.className = 'start-fight-wrapper';
        let startFight = document.createElement('div');
        startFight.className = 'start-fight';
        startFight.style.fontSize = '45vw';
        startFight.innerHTML = 'Fight!!!';
        startFightWrapper.appendChild(startFight);
        document.body.appendChild(startFightWrapper);

        let fightIntervalFlickerState = true;
        let fightIntervalFlicker;
        fightIntervalFlicker = setInterval(
            () => {
                const startFightFontSizeUnits = parseInt(startFight.style.fontSize.replace(/[a-zA-Z%]+/, ''));
                if(fightIntervalFlickerState) {
                    startFight.style.color = '#FFF';
                    fightIntervalFlickerState = false;
                } else {
                    startFight.style.color = '';
                    fightIntervalFlickerState = true;
                }
            },
            100
        );
        let fightInterval;
        fightInterval = setInterval(
            () => {
                const startFightFontSizeUnits = parseInt(startFight.style.fontSize.replace(/[a-zA-Z%]+/, ''));
                if(startFightFontSizeUnits > 10) {
                    startFight.style.fontSize = (startFightFontSizeUnits - 5) + startFight.style.fontSize.match(/[a-zA-Z%]+/, '')[0];
                } else {
                    clearInterval(fightIntervalFlicker);
                    startFight.style.color = '#FF0000';
                    startFight.style.textShadow = '0vw 0vw 2vw #FFFF00';
                    clearInterval(fightInterval);
                    setTimeout(
                        () => {
                            document.body.removeChild(startFightWrapper);
                            this.logger.logMessage(
`<div class="font-size-1vw line-height-1vw">
The battle has begun! Grid size: ${this.config.x}x${this.config.y}
| Enemy battleships: <br>
| Pick your first target coordinates!<br>
Round #${this.round} begins.
</div>`
                            );
                        },
                        1000
                    );
                }
            },
            200
        );
    }

    createToolbar() {
        const toolbarWrapper = document.createElement('div');
        toolbarWrapper.className = 'toolbar-wrapper';

        const toolbar = document.createElement('div');
        toolbar.id = 'toolbar';
        toolbar.className = 'toolbar';

        const buttonStart = document.createElement('input');
        buttonStart.type = 'button';
        buttonStart.value = 'Start';
        buttonStart.addEventListener('click', function () {
        });

        //toolbar.appendChild(buttonHighlightPositionFilteringDifference);
        toolbarWrapper.appendChild(toolbar);

        document.body.appendChild(toolbarWrapper);
    }

    countFilterPositionsElements(filterPositions) {
        return filterPositions.reduce( // size
            function (carry, element) {
                if (Object.values(element).length) {
                    return carry + Object.values(element).reduce( // index
                        function (carry, element) {
                            if (Object.values(element).length) {
                                return carry + Object.values(element).length // ship positions
                            } else {
                                return carry;
                            }
                        },
                        0
                    );
                } else {
                    return carry;
                }
            },
            0
        );
    }

    countFilterPositionsElementsBySizeAndIndex(sizes, filterPositions) {
        return sizes.map(
            function (indexes, size) {
                return indexes.map(
                    function (index) {
                        return Object.values(filterPositions[size][index]).length;
                    }
                );
            }
        );
    }

    restart()
    {
        this.createToolbar();
        this.createBattlefield();
        this.start();
    }
}
