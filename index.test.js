const Queuer = require('./');

const queue = new Queuer({
    upperLimit: 50, // maximum entries queue will return [default 50]
    maxTime: 5000 // maximum time in ms items can sit in queue [default 5000]
});

const generator = qty => [...Array(qty || 10)].map(() => Math.round(Math.random() * Date.now() + Date.now()).toString(36));

it('adds and clear queue', async done => {
    jest.setTimeout(6000);
    const items = generator(15);
    expect(items.length).toBe(15);
    let resultCounter = 0;
    queue.eventEmitter.on('splice', data => {
        switch (resultCounter) {
            case 0:
                expect(data.itemCount).toBe(50);
                expect(data.remainingCount).toBe(11);
                break;
            case 1:
                expect(data.itemCount).toBe(11);
                expect(data.remainingCount).toBe(0);
                done();
        }
        resultCounter++;
    });
    queue.addItems(generator(61));
})