const Queuer = require('../');

const queue = new Queuer({
    upperLimit: 50, // maximum entries queue will return [default 50]
    maxTime: 5000 // maximum time in ms items can sit in queue [default 5000]
});

// create a random amount of items
const getList = () => {
    const itemCount = Math.round(Math.random() * 42);
    const itemArray = [];
    for (var i = 0; i < itemCount; ++i) {
        itemArray.push({ id: i });
    }
    return itemArray;
}

// use the addItems() method to add an array of items to the queue
// [] locally, you should be monitoring if your process fails and re-adding failed items to the queue
function doSomething() {
    queue.addItems(getList());
}

// can listen to status updates of the queueQty when items are added
queue.eventEmitter.on('status', data => {
    console.log(`Queue is now ${data.queueQty} items.`);
});

// [] listen for queued items to come back
queue.eventEmitter.on('splice', data => console.log(data));

// currentList - array of spliced items
// itemCount - qty items spliced
// remainingCount - qty left in queue

// { currentList:
//     [ { item: 2 },
//       { item: 3 },
//       { item: 4 },
//         ...
//       { item: 18 },
//       { item: 30 } ],
//    itemCount: 31,
//    remainingCount: 0 }

// run loop at random times
(function loop() {
    var rand = Math.round(Math.random() * (3000 - 500)) + 500;
    setTimeout(function () {
        doSomething();
        loop();
    }, rand);
}());