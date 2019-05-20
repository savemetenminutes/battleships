class Position {
    get size()
    {
        return this._size;
    }

    set size(value)
    {
        this._size = value;
    }

    get index()
    {
        return this._index;
    }

    set index(value)
    {
        this._index = value;
    }

    get x()
    {
        return this._x;
    }

    set x(value)
    {
        this._x = value;
    }

    get y()
    {
        return this._y;
    }

    set y(value)
    {
        this._y = value;
    }

    get deg()
    {
        return this._deg;
    }

    set deg(value)
    {
        this._deg = value;
    }

    get coordinates()
    {
        return this._coordinates;
    }

    set coordinates(value)
    {
        this._coordinates = value;
    }

    get perspective() {
        return this._perspective;
    }

    set perspective(value) {
        this._perspective = value;
    }

    get perspectiveLenX() {
        return this._perspectiveLenX;
    }

    set perspectiveLenX(value) {
        this._perspectiveLenX = value;
    }

    get perspectiveLenY() {
        return this._perspectiveLenY;
    }

    set perspectiveLenY(value) {
        this._perspectiveLenY = value;
    }

    constructor(size, index, x, y, deg, coordinates, perspective, perspectiveLenX, perspectiveLenY)
    {
        this._size = size;
        this._index = index;
        this._x = x;
        this._y = y;
        this._deg = deg;
        this._coordinates = coordinates;
        this._perspective = perspective;
        this._perspectiveLenX = perspectiveLenX;
        this._perspectiveLenY = perspectiveLenY;
    }
}
