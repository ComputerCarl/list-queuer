var events = require('events');

function Queuer(params) {
    var { upperLimit, maxTime } = { upperLimit: 50, maxTime: 5000, ...params };
    var eventEmitter = new events.EventEmitter();
    var queue = [];
    var timer;

    const addItems = items => {
        queue = queue.concat(items);
        eventEmitter.emit('status', { queueQty: queue.length });
        manager();
    }

    const manager = () => {
        if (queue.length >= upperLimit) {
            timer = null;
            processQueue();
            manager();
        }
        if (queue.length > 0) {
            // [x] start timer if timer's not running
            if (!timer) timer = setTimeout(() => {
                // console.log('timeout')
                processQueue();
            }, maxTime);
        } else {
            // [x] stop timer
            timer = null;
        }
    }

    const processQueue = () => {
        currentList = queue.splice(0, upperLimit);
        eventEmitter.emit('splice', {
            currentList,
            itemCount: currentList.length,
            remainingCount: Math.max(queue.length, 0)
        });
        manager();
    }

    this.addItems = addItems;
    this.eventEmitter = eventEmitter;
}

module.exports = Queuer;