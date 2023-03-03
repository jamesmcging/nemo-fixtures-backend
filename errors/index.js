class ItemNotFoundError extends Error {
    constructor (message) {
        super(message || 'Item not found');
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

class CompetitionNotFound extends Error {
    constructor (message) {
        super(message || 'Competition not found');
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = CompetitionNotFound
module.exports = ItemNotFoundError
